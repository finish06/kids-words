from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/kids_words"
    )
    test_database_url: str = "sqlite+aiosqlite:///./test.db"
    debug: bool = False

    model_config = {"env_prefix": "KIDS_WORDS_"}


settings = Settings()
