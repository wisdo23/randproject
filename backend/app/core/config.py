from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    app_name: str = "Rand Lottery API"
    app_env: str = "development"
    app_debug: bool = True

    database_url: str
    cors_origins: str = "http://localhost:5173,http://localhost:8080,http://localhost:4173"
    jwt_secret: str = "change-me-in-prod"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # one week
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True
    smtp_use_ssl: bool = False
    smtp_from_address: str = ""
    help_portal_url: str = "http://localhost:5173/login"
    email_host: str = ""
    email_port: int = 587
    email_username: str = ""
    email_password: str = ""
    email_sender: str = ""
    email_use_tls: bool = True
    help_portal_url: str = ""
    google_client_id: str = ""

    def get_cors_origins(self) -> list[str]:
        """Returns parsed CORS origins as a list"""
        origins = self.cors_origins.strip()
        if origins.startswith("[") and origins.endswith("]"):
            # JSON list format: ["http://...", "http://..."]
            import json
            return json.loads(origins)
        # Comma-separated format
        return [x.strip() for x in origins.split(",") if x.strip()]


settings = Settings()