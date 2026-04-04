"""Seed the database with initial word categories and words."""

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import settings
from app.models import Base, Category, Word
from app.seed_animals import ANIMALS_UNIQUE, get_image_url

SEED_DATA = [
    {
        "name": "Animals",
        "slug": "animals",
        "icon_url": get_image_url("1F43B"),  # bear emoji
        "display_order": 1,
        "words": [
            {"text": word, "image_url": get_image_url(code)}
            for word, code in ANIMALS_UNIQUE
        ],
    },
    {
        "name": "Colors",
        "slug": "colors",
        "icon_url": get_image_url("1F308"),  # rainbow
        "display_order": 2,
        "words": [
            {"text": "RED", "image_url": get_image_url("1F534")},
            {"text": "BLUE", "image_url": get_image_url("1F535")},
            {"text": "GREEN", "image_url": get_image_url("1F7E2")},
            {"text": "YELLOW", "image_url": get_image_url("1F7E1")},
            {"text": "PINK", "image_url": get_image_url("1F338")},
            {"text": "ORANGE", "image_url": get_image_url("1F7E0")},
            {"text": "PURPLE", "image_url": get_image_url("1F7E3")},
            {"text": "BROWN", "image_url": get_image_url("1F7EB")},
            {"text": "BLACK", "image_url": get_image_url("26AB")},
            {"text": "WHITE", "image_url": get_image_url("26AA")},
        ],
    },
    {
        "name": "Food",
        "slug": "food",
        "icon_url": get_image_url("1F34E"),  # apple
        "display_order": 3,
        "words": [
            {"text": "APPLE", "image_url": get_image_url("1F34E")},
            {"text": "BANANA", "image_url": get_image_url("1F34C")},
            {"text": "BREAD", "image_url": get_image_url("1F35E")},
            {"text": "MILK", "image_url": get_image_url("1F95B")},
            {"text": "EGG", "image_url": get_image_url("1F95A")},
            {"text": "CAKE", "image_url": get_image_url("1F370")},
            {"text": "PIZZA", "image_url": get_image_url("1F355")},
            {"text": "COOKIE", "image_url": get_image_url("1F36A")},
            {"text": "GRAPE", "image_url": get_image_url("1F347")},
            {"text": "CORN", "image_url": get_image_url("1F33D")},
            {"text": "CARROT", "image_url": get_image_url("1F955")},
            {"text": "CHEESE", "image_url": get_image_url("1F9C0")},
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
