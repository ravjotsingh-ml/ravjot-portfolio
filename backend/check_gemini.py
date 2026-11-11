"""Quick check that the Gemini integration is configured and working.

Usage:
    cd backend
    python3 check_gemini.py

Reads GEMINI_API_KEY from the environment / .env. Never prints the key.
"""

import sys

from app.chatbot import ChatbotError, generate_reply
from app.core.config import settings
from app.database import SessionLocal


def main() -> int:
    if not settings.GEMINI_API_KEY:
        print("GEMINI_API_KEY is not set.")
        print("Add it to backend/.env or export it, then restart the server.")
        return 1

    db = SessionLocal()
    try:
        reply = generate_reply(
            "What are Ravjot's technical skills? Answer in two sentences.",
            [],
            db,
        )
    except ChatbotError as exc:
        print(f"Error {exc.status_code}: {exc.message}")
        return 1
    except Exception as exc:  # noqa: BLE001
        print(f"Unexpected error: {type(exc).__name__}")
        return 1
    finally:
        db.close()

    print("Gemini response:")
    print(reply)
    return 0


if __name__ == "__main__":
    sys.exit(main())
