"""Application configuration loaded from environment variables.

Never hard-code credentials here. Values are read from .env files:
  1. <project root>/.env
  2. <backend>/.env   (takes precedence)
"""

import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_ROOT = Path(__file__).resolve().parents[3]

# Environment variables always win over .env files. When a key exists in both
# files, backend/.env takes precedence over the project-root .env.
load_dotenv(BACKEND_DIR / ".env", override=False)
load_dotenv(PROJECT_ROOT / ".env", override=False)


class Settings:
    """Strongly-typed settings resolved from the environment."""

    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres@127.0.0.1:5433/portfolio",
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-change-me")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "ravjot2026").strip()
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in {"1", "true", "yes"}

    # Gemini / Google AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite").strip()

    # CORS — comma separated list of allowed origins
    BACKEND_CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "BACKEND_CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,https://ravjotsingh-ml.github.io",
        ).split(",")
        if origin.strip()
    ]

    # Lead capture / chat access
    CHAT_SESSION_HOURS: int = int(os.getenv("CHAT_SESSION_HOURS", "168"))
    # Submissions allowed per window for the same email address.
    CONTACT_RATE_LIMIT: int = int(os.getenv("CONTACT_RATE_LIMIT", "5"))
    # Submissions allowed per window for the same IP. Higher than the email
    # limit because many visitors share one address (offices, campuses, mobile
    # carriers) and none of them should be blocked by someone else.
    CONTACT_IP_RATE_LIMIT: int = int(os.getenv("CONTACT_IP_RATE_LIMIT", "15"))
    CONTACT_RATE_WINDOW_SECONDS: int = int(os.getenv("CONTACT_RATE_WINDOW_SECONDS", "900"))
    CONVERSATION_RATE_LIMIT: int = int(os.getenv("CONVERSATION_RATE_LIMIT", "20"))
    CONVERSATION_RATE_WINDOW_SECONDS: int = int(
        os.getenv("CONVERSATION_RATE_WINDOW_SECONDS", "300")
    )
    DUPLICATE_LEAD_WINDOW_HOURS: int = int(os.getenv("DUPLICATE_LEAD_WINDOW_HOURS", "24"))

    # Celery — background processing for captured leads.
    # The default broker is a local SQLite file so no extra service is needed
    # in development. Use redis:// in production (Railway, Render, ...).
    CELERY_BROKER_URL: str = os.getenv(
        "CELERY_BROKER_URL",
        f"sqla+sqlite:///{BACKEND_DIR / 'celerybroker.sqlite3'}",
    )
    CELERY_RESULT_BACKEND: str = os.getenv(
        "CELERY_RESULT_BACKEND",
        f"db+sqlite:///{BACKEND_DIR / 'celeryresults.sqlite3'}",
    )
    CELERY_TASK_ALWAYS_EAGER: bool = os.getenv(
        "CELERY_TASK_ALWAYS_EAGER", "False"
    ).lower() in {"1", "true", "yes"}

    # Outbound email for lead notifications (optional).
    LEAD_NOTIFICATION_EMAIL: str = os.getenv("LEAD_NOTIFICATION_EMAIL", "").strip()
    SMTP_HOST: str = os.getenv("SMTP_HOST", "").strip()
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "").strip()
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "").strip()
    SMTP_FROM: str = os.getenv("SMTP_FROM", "").strip()


settings = Settings()
