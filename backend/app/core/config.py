"""Application configuration loaded from environment variables.

Never hard-code credentials here. Values are read from .env files:
  1. <project root>/.env
  2. <backend>/.env   (takes precedence)
"""

import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = Path(__file__).resolve().parents[2]

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
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in {"1", "true", "yes"}

    # Gemini / Google AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite").strip()

    # CORS — comma separated list of allowed origins
    BACKEND_CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "BACKEND_CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
