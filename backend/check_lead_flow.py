"""End-to-end check for the lead capture + gated chatbot flow.

Usage (with the backend running on :8000):

    cd backend
    python3 check_lead_flow.py

The script exercises the real HTTP API against the configured database. It
creates test leads, so use a scratch email address.
"""

from __future__ import annotations

import os
import sys
import time
import uuid

import requests

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000").rstrip("/")
EMAIL = os.getenv("LEAD_TEST_EMAIL", f"lead-check-{uuid.uuid4().hex[:8]}@example.com")
PHONE = os.getenv("LEAD_TEST_PHONE", "+919876543210")

results: list[tuple[bool, str, str]] = []


def check(name: str, passed: bool, detail: str = "") -> None:
    results.append((passed, name, detail))
    print(f"{'PASS' if passed else 'FAIL'}  {name}{f' ({detail})' if detail else ''}")


def wait_for_reply(response, attempts: int = 40, delay: float = 1.5) -> str:
    """Poll a chat response until the assistant replies."""
    for _ in range(attempts):
        try:
            history = requests.get(
                f"{BASE_URL}/api/chat/history/{response['conversation_id']}",
                headers={"X-Chat-Token": response["session_token"]},
                timeout=15,
            )
            if history.ok:
                messages = history.json().get("messages", [])
                if any(m["role"] == "assistant" for m in messages):
                    return next(m["content"] for m in messages if m["role"] == "assistant")
        except requests.RequestException:
            pass
        time.sleep(delay)
    return ""


def main() -> int:
    health = requests.get(f"{BASE_URL}/api/health", timeout=10).json()
    check("Backend healthy", health.get("status") == "ok", str(health))
    check(
        "Gemini configured",
        bool(health.get("gemini_configured")),
        "GEMINI_API_KEY is set",
    )

    # 1. The chatbot is locked before any submission.
    locked = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": "hello"},
        timeout=10,
    )
    check(
        "Chat is locked without a lead session",
        locked.status_code == 403,
        f"HTTP {locked.status_code}",
    )

    # 2. Invalid payloads are rejected by the server.
    invalid_email = requests.post(
        f"{BASE_URL}/api/contact",
        json={"full_name": "Test Visitor", "email": "not-an-email", "phone_number": PHONE},
        timeout=10,
    )
    check(
        "Invalid email rejected",
        invalid_email.status_code == 422,
        f"HTTP {invalid_email.status_code}",
    )

    invalid_phone = requests.post(
        f"{BASE_URL}/api/contact",
        json={"full_name": "Test Visitor", "email": EMAIL, "phone_number": "12345"},
        timeout=10,
    )
    check(
        "Invalid phone rejected",
        invalid_phone.status_code == 422,
        f"HTTP {invalid_phone.status_code}",
    )

    empty = requests.post(
        f"{BASE_URL}/api/contact",
        json={"full_name": "", "email": "", "phone_number": ""},
        timeout=10,
    )
    check("Empty payload rejected", empty.status_code == 422, f"HTTP {empty.status_code}")

    # 3. Honeypot submissions are blocked.
    bot = requests.post(
        f"{BASE_URL}/api/contact",
        json={
            "full_name": "Spam Bot",
            "email": f"bot-{uuid.uuid4().hex[:6]}@example.com",
            "phone_number": PHONE,
            "website": "http://spam.example",
        },
        timeout=10,
    )
    check("Honeypot submission blocked", bot.status_code == 400, f"HTTP {bot.status_code}")

    # 4. A valid submission creates a lead and unlocks the assistant.
    created = requests.post(
        f"{BASE_URL}/api/contact",
        json={
            "full_name": "Rahul Sharma",
            "email": EMAIL,
            "phone_number": PHONE,
            "message": "I would like to discuss an AI engineering role.",
        },
        timeout=15,
    )
    check("Valid submission accepted", created.status_code == 201, f"HTTP {created.status_code}")
    lead = created.json()
    token = lead["session_token"]
    check("Session token issued", bool(token), f"lead_id={lead.get('lead_id')}")
    check("Response does not leak email or phone", "email" not in lead and "phone" not in lead)

    # 5. A duplicate submission reuses the same lead.
    duplicate = requests.post(
        f"{BASE_URL}/api/contact",
        json={"full_name": "Rahul Sharma", "email": EMAIL, "phone_number": PHONE},
        timeout=15,
    )
    duplicate_body = duplicate.json()
    check(
        "Duplicate submission does not create a second lead",
        duplicate_body.get("duplicate") is True
        and duplicate_body.get("lead_id") == lead["lead_id"],
        f"lead_id={duplicate_body.get('lead_id')}",
    )

    # 6. Session validation.
    session = requests.get(
        f"{BASE_URL}/api/lead/session", headers={"X-Chat-Token": token}, timeout=10
    ).json()
    check(
        "Valid session is accepted",
        session.get("valid") is True and session.get("full_name") == "Rahul Sharma",
        str(session.get("full_name")),
    )

    forged = requests.get(
        f"{BASE_URL}/api/lead/session",
        headers={"X-Chat-Token": "forged-token-aaaaaaaaaaaaaaaaaaaaaaaa"},
        timeout=10,
    ).json()
    check("Forged token rejected", forged.get("valid") is False)

    # 7. The assistant answers and the conversation is stored.
    chat = requests.post(
        f"{BASE_URL}/api/chat",
        headers={"X-Chat-Token": token},
        json={"message": "What are Ravjot's strongest technical skills?"},
        timeout=60,
    )
    check("Chat accepted with a session", chat.status_code == 200, f"HTTP {chat.status_code}")
    reply = chat.json()["message"]["content"] if chat.ok else ""
    check("Gemini returned a real answer", len(reply) > 40, f"{len(reply)} chars")
    check(
        "Answer mentions portfolio skills",
        any(word in reply.lower() for word in ("langchain", "fastapi", "react", "agentic", "sql")),
        reply[:80].replace("\n", " "),
    )

    conversation_id = chat.json()["conversation_id"]
    history = requests.get(
        f"{BASE_URL}/api/chat/history/{conversation_id}",
        headers={"X-Chat-Token": token},
        timeout=10,
    )
    check("History readable by the owner", history.status_code == 200, f"HTTP {history.status_code}")
    check(
        "History contains both messages",
        len(history.json().get("messages", [])) >= 2,
        str(len(history.json().get("messages", []))),
    )

    # 8. A second visitor cannot read the first visitor's conversation.
    other = requests.post(
        f"{BASE_URL}/api/contact",
        json={
            "full_name": "Priya Verma",
            "email": f"other-{uuid.uuid4().hex[:8]}@example.com",
            "phone_number": "+14155552671",
        },
        timeout=15,
    ).json()
    cross = requests.get(
        f"{BASE_URL}/api/chat/history/{conversation_id}",
        headers={"X-Chat-Token": other["session_token"]},
        timeout=10,
    )
    check(
        "Another visitor cannot read the conversation",
        cross.status_code == 404,
        f"HTTP {cross.status_code}",
    )

    cross_chat = requests.post(
        f"{BASE_URL}/api/chat",
        headers={"X-Chat-Token": other["session_token"]},
        json={"message": "hi", "conversation_id": conversation_id},
        timeout=10,
    )
    check(
        "Another visitor cannot continue the conversation",
        cross_chat.status_code == 404,
        f"HTTP {cross_chat.status_code}",
    )

    # 9. The lead is stored in PostgreSQL.
    try:
        from app.database import SessionLocal
        from app.models import Lead, LeadSession

        db = SessionLocal()
        try:
            stored = db.query(Lead).filter(Lead.email == EMAIL).first()
            check("Lead row stored in PostgreSQL", stored is not None)
            if stored:
                check(
                    "Lead row stores name, email, phone and message",
                    bool(stored.full_name)
                    and bool(stored.email)
                    and bool(stored.phone_number)
                    and bool(stored.message)
                    and stored.created_at is not None,
                    f"{stored.full_name} / {stored.phone_number}",
                )
            session_row = (
                db.query(LeadSession).filter(LeadSession.lead_id == lead["lead_id"]).first()
            )
            check(
                "Only a token hash is stored, never the token",
                session_row is not None and token not in (session_row.token_hash or ""),
            )
        finally:
            db.close()
    except Exception as exc:  # noqa: BLE001 - the database check is optional
        check("Database verification", False, f"{type(exc).__name__}: {exc}")

    failed = [r for r in results if not r[0]]
    print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
    if failed:
        print("\nFailures:")
        for _, name, detail in failed:
            print(f"  - {name} {detail}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
