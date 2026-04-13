from enum import StrEnum
from functools import lru_cache

from pydantic import Field, PostgresDsn, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class LLMProvider(StrEnum):
    openai = "openai"
    gemini = "gemini"


class EmbeddingProvider(StrEnum):
    openai = "openai"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:3000"

    database_url: PostgresDsn = Field(
        default="postgresql+asyncpg://abstract_party:abstract_party@localhost:5432/abstract_party"
    )

    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    qdrant_url: str = "http://localhost:6333"
    qdrant_collection_name: str = "legal_chunks"

    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "abstract_party_neo4j"

    minio_endpoint: str = "localhost:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "abstract-party-documents"
    minio_use_ssl: bool = False

    llm_provider: LLMProvider = LLMProvider.openai
    openai_api_key: str = ""
    openai_chat_model: str = "gpt-4o"
    google_api_key: str = ""
    gemini_chat_model: str = "gemini-1.5-pro"

    embedding_provider: EmbeddingProvider = EmbeddingProvider.openai
    openai_embedding_model: str = "text-embedding-3-large"
    embedding_dimensions: int = 3072

    @field_validator("cors_origins")
    @classmethod
    def split_origins(cls, v: str) -> str:
        return v

    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
