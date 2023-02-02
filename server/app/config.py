from pydantic import BaseSettings


class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASSWORD: str
    DB_DATABASE: str | None
    SECRET_KEY: str
    DEBUG: bool = False
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_PORT: int = 465
    MAIL_USE_SSL: bool = True
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_DEFAULT_SENDER: str

    class Config:
        case_sensitive = True
        env_file = "../.env"
        env_file_encoding = "utf-8"


config = Settings()


def build_database_uri() -> str:
    return f"postgresql://{config.DB_USER}:{config.DB_PASSWORD}@{config.DB_HOST}:{config.DB_PORT}/{config.DB_DATABASE}"


DATABASE_URI = build_database_uri()
