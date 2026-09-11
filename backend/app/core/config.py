"""
JanSetu AI - Core Application Settings
"""

import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# Ensure .env is discovered across different working directories (root, backend, tests)
backend_dir = Path(__file__).resolve().parent.parent.parent
for env_path in [backend_dir / ".env", backend_dir.parent / ".env", Path(".env")]:
    if env_path.is_file():
        load_dotenv(dotenv_path=env_path, override=False)
        break


class Settings(BaseSettings):
    PROJECT_NAME: str = "JanSetu AI"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # CORS settings - parsed as comma-separated strings or defaults
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Database Configuration (PostgreSQL / Supabase)
    DATABASE_URL: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""

    # Authentication & JWT
    JWT_SECRET: str = "jansetu_super_secret_jwt_key_for_dev_32chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Google Gemini API
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()

