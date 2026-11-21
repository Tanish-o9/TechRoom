from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Central application configuration with validation."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "TechRoom"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    # Databases & Queues
    DATABASE_URL: str = "sqlite+aiosqlite:///./techroom.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    QDRANT_URL: str = "http://localhost:6333"

    # Security
    SECRET_KEY: str = "insecure-dev-secret-key-change-in-production-123456"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Video & AI Gateway Defaults
    VIDEO_PROVIDER: str = "mock"  # mock | cloudflare
    CLOUDFLARE_STREAM_ACCOUNT_ID: str = ""
    CLOUDFLARE_STREAM_API_TOKEN: str = ""
    LLM_GATEWAY_DEFAULT_MODEL: str = "gemini-1.5-pro"
    LLM_GATEWAY_FAST_MODEL: str = "gemini-1.5-flash"
    AI_DAILY_TOKEN_BUDGET_USER: int = 50_000
    AI_DAILY_COST_CAP_GLOBAL: float = 100.0

settings = Settings()
