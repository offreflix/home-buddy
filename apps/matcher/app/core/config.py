from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações globais do serviço."""

    openai_api_key: str
    backend_base_url: str = "http://backend:3000"
    internal_token: str = "dev-token"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings() 