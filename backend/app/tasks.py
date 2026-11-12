"""Celery tasks for background work.

Lead submissions are written to PostgreSQL synchronously because the visitor
needs their chat token straight away. Everything that can happen afterwards —
owner notifications, CRM hand-off, analytics — runs in a Celery worker so the
HTTP response stays fast.

Run a worker with:

    cd backend
    celery -A app.tasks.celery_app worker --loglevel=info

If no broker or worker is available the API still works: tasks are executed
inline as a fallback.
"""

from __future__ import annotations

import logging
import smtplib
import ssl
from email.message import EmailMessage
from typing import Any, Optional

from celery import Celery

from .core.config import settings

logger = logging.getLogger(__name__)

celery_app = Celery(
    "portfolio",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_track_started=True,
    broker_connection_retry_on_startup=False,
    broker_connection_max_retries=0,
    task_always_eager=settings.CELERY_TASK_ALWAYS_EAGER,
    task_eager_propagates=True,
)


# --- Tasks --------------------------------------------------------------


@celery_app.task(name="portfolio.process_lead", bind=True, max_retries=3)
def process_lead(self, lead_id: int) -> dict[str, Any]:
    """Notify the site owner about a new lead and write an audit trail."""
    from .database import SessionLocal
    from .models import Lead

    db = SessionLocal()
    try:
        lead = db.get(Lead, lead_id)
        if not lead:
            logger.warning("Lead %s disappeared before it could be processed", lead_id)
            return {"lead_id": lead_id, "status": "missing"}

        delivered = _send_owner_notification(lead)
        logger.info(
            "Processed lead %s (%s) — notification %s",
            lead.id,
            lead.email,
            "sent" if delivered else "logged",
        )
        return {"lead_id": lead.id, "status": "processed", "notified": delivered}
    except Exception as exc:  # noqa: BLE001 - retries are handled by Celery
        logger.error("process_lead failed for %s: %s", lead_id, type(exc).__name__)
        raise self.retry(exc=exc, countdown=10)
    finally:
        db.close()


@celery_app.task(name="portfolio.healthcheck")
def healthcheck() -> dict[str, Any]:
    """Simple task used to verify that a worker is actually consuming."""
    return {"status": "ok"}


# --- Helpers ------------------------------------------------------------


def _build_notification(lead) -> str:
    return (
        f"New portfolio enquiry from {lead.full_name}\n\n"
        f"Email:     {lead.email}\n"
        f"Phone:     {lead.phone_number}\n"
        f"Message:   {lead.message or '(no message)'}\n"
        f"Received:  {lead.created_at}\n"
        f"Lead ID:   {lead.id}\n"
    )


def _send_owner_notification(lead) -> bool:
    """Send the owner an email. Returns True when it was actually delivered."""
    recipient = settings.LEAD_NOTIFICATION_EMAIL
    if not recipient or not settings.SMTP_HOST:
        logger.info("Lead notification (no SMTP configured):\n%s", _build_notification(lead))
        return False

    message = EmailMessage()
    message["Subject"] = f"New portfolio enquiry — {lead.full_name}"
    message["From"] = settings.SMTP_FROM or settings.SMTP_USER or "portfolio@localhost"
    message["To"] = recipient
    message.set_content(_build_notification(lead))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.starttls(context=context)
            if settings.SMTP_USER:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)
        return True
    except Exception as exc:  # noqa: BLE001 - never break the worker
        logger.error("Could not send lead notification email: %s", type(exc).__name__)
        return False


def dispatch(task, *args, **kwargs) -> bool:
    """Queue a task, falling back to running it inline.

    Returns True when the task was handed to a worker, False when it ran
    synchronously (no broker or no worker available).
    """
    try:
        task.apply_async(args=args, kwargs=kwargs)
        return True
    except Exception as exc:  # noqa: BLE001 - broker problems must not break the API
        logger.warning("Celery unavailable (%s) — running task inline", type(exc).__name__)
        try:
            task.apply(args=args, kwargs=kwargs)
        except Exception:  # noqa: BLE001
            logger.exception("Inline task execution failed")
        return False


def dispatch_lead_notification(lead_id: int) -> bool:
    """Queue the lead notification for a freshly captured lead."""
    return dispatch(process_lead, lead_id)
