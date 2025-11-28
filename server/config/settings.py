"""Configuration management for voice dictation server using Pydantic Settings."""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # API Keys - Required
    cartesia_api_key: str = Field(..., description="Cartesia API key for STT service")
    cerebras_api_key: str = Field(..., description="Cerebras API key for LLM service")

    # Logging
    log_level: str = Field("INFO", description="Logging level")

    # Dictation Server Configuration
    dictation_server_host: str = Field(
        "127.0.0.1", description="Host for the dictation WebSocket server"
    )
    dictation_server_port: int = Field(8765, description="Port for the dictation WebSocket server")
