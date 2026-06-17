from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cassandra GridOS"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecret_cassandra_gridos_jwt_key_991823"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "gridos"
    SQLALCHEMY_DATABASE_URI: Optional[str] = "postgresql://postgres:postgres@localhost:5432/gridos"

    # Redis/Celery
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # Gemini API Key
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
