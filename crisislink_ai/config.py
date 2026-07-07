"""Central configuration for CrisisLink AI."""

from __future__ import annotations

import os
from dotenv import load_dotenv

load_dotenv(override=True)


class Settings:
    """Runtime settings."""

    # Primary model
    MODEL_NAME: str = os.getenv("ADK_MODEL", "gemini-2.5-flash")

    # Gemini API Keys
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
    GOOGLE_API_KEY_2 = os.getenv("GOOGLE_API_KEY_2", "")
    GOOGLE_API_KEY_3 = os.getenv("GOOGLE_API_KEY_3", "")

    # OpenRouter
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL = os.getenv(
        "OPENROUTER_BASE_URL",
        "https://openrouter.ai/api/v1",
    )
    OPENROUTER_MODEL = os.getenv(
        "OPENROUTER_MODEL",
        "google/gemini-2.5-flash",
    )

    # External APIs
    GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")
    WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")

    # Security
    PII_MASKING_ENABLED = (
        os.getenv("PII_MASKING_ENABLED", "true").lower() == "true"
    )

    PROMPT_INJECTION_DETECTION_ENABLED = (
        os.getenv("PROMPT_INJECTION_DETECTION_ENABLED", "true").lower() == "true"
    )

    HUMAN_APPROVAL_REQUIRED_FOR_CRITICAL = (
        os.getenv("HUMAN_APPROVAL_REQUIRED_FOR_CRITICAL", "true").lower() == "true"
    )

    PORT = int(os.getenv("PORT", "8080"))

    CRITICAL_PRIORITY_THRESHOLD = 80

    DB_PATH = os.getenv("DB_PATH", "crisislink.db")


settings = Settings()