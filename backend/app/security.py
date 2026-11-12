"""Server-side chat sessions and lightweight abuse protection.

A visitor only gets a chat session after the contact form has been validated and
saved. The browser receives an opaque bearer token; the database stores only its
SHA-256 hash. Every chat and history request is checked against that token, so
clearing or editing localStorage cannot unlock the assistant.
"""

from __future__ import annotations

import hashlib
import secrets
import threading
import time
from collections import deque
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from .core.config import settings
from .database import get_db
from .models import Lead, LeadSession

TOKEN_MIN_LENGTH = 24


# --- Tokens -------------------------------------------------------------


def generate_token() -> str:
    """Return a cryptographically secure, URL-safe session token."""
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_lead_session(db: Session, lead: Lead, commit: bool = True) -> tuple[str, LeadSession]:
    """Issue a fresh session token for a lead and persist its hash.

    ``commit=False`` lets the caller store the lead and the session in a single
    transaction, which keeps the contact request fast.
    """
    token = generate_token()
    session = LeadSession(
        lead_id=lead.id,
        token_hash=hash_token(token),
        expires_at=datetime.utcnow()
        + timedelta(hours=max(1, settings.CHAT_SESSION_HOURS)),
    )
    db.add(session)
    if commit:
        db.commit()
        db.refresh(session)
    else:
        db.flush()
    return token, session


def resolve_token(db: Session, token: Optional[str]) -> Optional[LeadSession]:
    """Return a valid, non-expired session for a raw bearer token."""
    if not token:
        return None
    cleaned = token.strip()
    if len(cleaned) < TOKEN_MIN_LENGTH:
        return None

    session = (
        db.query(LeadSession)
        .filter(LeadSession.token_hash == hash_token(cleaned))
        .first()
    )
    if not session or session.revoked:
        return None
    if session.expires_at and session.expires_at < datetime.utcnow():
        return None

    # Track activity without writing on every single poll.
    now = datetime.utcnow()
    if not session.last_seen_at or (now - session.last_seen_at).total_seconds() > 60:
        session.last_seen_at = now
        db.commit()

    return session


def _extract_token(x_chat_token: Optional[str], authorization: Optional[str]) -> Optional[str]:
    if x_chat_token:
        return x_chat_token
    if authorization:
        value = authorization.strip()
        if value.lower().startswith("bearer "):
            return value[7:].strip()
    return None


def require_chat_session(
    x_chat_token: Optional[str] = Header(default=None, alias="X-Chat-Token"),
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
) -> tuple[LeadSession, Lead]:
    """FastAPI dependency: the request must carry a valid chat session token."""
    session = resolve_token(db, _extract_token(x_chat_token, authorization))
    if not session:
        raise HTTPException(
            status_code=403,
            detail="The assistant is locked. Submit the contact form to start chatting.",
        )

    lead = db.get(Lead, session.lead_id)
    if not lead:
        raise HTTPException(
            status_code=403,
            detail="The assistant is locked. Submit the contact form to start chatting.",
        )

    return session, lead


# --- Rate limiting ------------------------------------------------------


class SlidingWindowLimiter:
    """Thread-safe in-memory sliding-window rate limiter.

    This is intentionally dependency-free. It protects a single process, which
    is the deployment model used here. Limits are configurable per key so the
    same instance can police IPs, emails and chat sessions independently.
    """

    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = {}
        self._lock = threading.Lock()

    def check(self, key: str, limit: int, window_seconds: int) -> tuple[bool, int]:
        """Register a hit and return ``(allowed, retry_after_seconds)``."""
        if limit <= 0 or window_seconds <= 0:
            return True, 0

        now = time.monotonic()
        cutoff = now - window_seconds

        with self._lock:
            bucket = self._hits.setdefault(key, deque())
            while bucket and bucket[0] < cutoff:
                bucket.popleft()

            if len(bucket) >= limit:
                retry_after = max(1, int(window_seconds - (now - bucket[0])) + 1)
                return False, retry_after

            bucket.append(now)

            # Opportunistic cleanup so the dict cannot grow without bound.
            if len(self._hits) > 5000:
                for stale_key in [k for k, v in self._hits.items() if not v]:
                    del self._hits[stale_key]

        return True, 0

    def reset(self, key: str) -> None:
        with self._lock:
            self._hits.pop(key, None)


limiter = SlidingWindowLimiter()


def client_ip(request) -> str:
    """Best-effort client IP that respects common reverse-proxy headers."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else "unknown"
