"""Seed the database with initial word categories and words."""

import asyncio
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import settings
from app.models import Base, Category, Word
from app.seed_animals import ANIMALS_UNIQUE, get_image_url
from app.seed_foods import FOODS_UNIQUE

SEED_DATA: list[dict[str, Any]] = [
    {
        "name": "Animals",
        "slug": "animals",
        "icon_url": get_image_url("1F43B"),
        "display_order": 1,
        "words": [
            {"text": word, "image_url": get_image_url(code)}
            for word, code in ANIMALS_UNIQUE
        ],
    },
    {
        "name": "Colors",
        "slug": "colors",
        "icon_url": get_image_url("1F308"),
        "display_order": 2,
        "words": [
            {"text": "RED", "image_url": "color://#ef4444"},
            {"text": "BLUE", "image_url": "color://#3b82f6"},
            {"text": "GREEN", "image_url": "color://#22c55e"},
            {"text": "YELLOW", "image_url": "color://#eab308"},
            {"text": "PINK", "image_url": "color://#ec4899"},
            {"text": "ORANGE", "image_url": "color://#f97316"},
            {"text": "PURPLE", "image_url": "color://#8b5cf6"},
            {"text": "BROWN", "image_url": "color://#92400e"},
            {"text": "BLACK", "image_url": "color://#1e293b"},
            {"text": "WHITE", "image_url": "color://#f8fafc"},
        ],
    },
    {
        "name": "Food",
        "slug": "food",
        "icon_url": get_image_url("1F34E"),
        "display_order": 3,
        "words": [
            {"text": word, "image_url": get_image_url(code)}
            for word, code in FOODS_UNIQUE
        ],
    },
]


async def seed(db_url: str | None = None) -> None:
    url = db_url or settings.database_url
    engine = create_async_engine(url)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with session_factory() as session:
        result = await session.execute(select(Category).limit(1))
        if result.scalar_one_or_none() is not None:
            print("Database already seeded, skipping.")
            return

        total_words = 0
        for cat_data in SEED_DATA:
            words_data = cat_data.pop("words")
            category = Category(**cat_data)
            session.add(category)
            await session.flush()

            for word_data in words_data:
                word = Word(**word_data, category_id=category.id)
                session.add(word)
                total_words += 1

        await session.commit()
        print(f"Seeded {len(SEED_DATA)} categories with {total_words} words.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
