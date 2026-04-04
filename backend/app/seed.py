"""Seed the database with initial word categories and words."""

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.models import Base, Category, Word

SEED_DATA = [
    {
        "name": "Animals",
        "slug": "animals",
        "icon_url": "/images/categories/animals.png",
        "display_order": 1,
        "words": [
            {"text": "CAT", "image_url": "/images/words/cat.png"},
            {"text": "DOG", "image_url": "/images/words/dog.png"},
            {"text": "FISH", "image_url": "/images/words/fish.png"},
            {"text": "BIRD", "image_url": "/images/words/bird.png"},
            {"text": "FROG", "image_url": "/images/words/frog.png"},
            {"text": "BEAR", "image_url": "/images/words/bear.png"},
        ],
    },
    {
        "name": "Colors",
        "slug": "colors",
        "icon_url": "/images/categories/colors.png",
        "display_order": 2,
        "words": [
            {"text": "RED", "image_url": "/images/words/red.png"},
            {"text": "BLUE", "image_url": "/images/words/blue.png"},
            {"text": "GREEN", "image_url": "/images/words/green.png"},
            {"text": "YELLOW", "image_url": "/images/words/yellow.png"},
            {"text": "PINK", "image_url": "/images/words/pink.png"},
            {"text": "ORANGE", "image_url": "/images/words/orange.png"},
        ],
    },
    {
        "name": "Food",
        "slug": "food",
        "icon_url": "/images/categories/food.png",
        "display_order": 3,
        "words": [
            {"text": "APPLE", "image_url": "/images/words/apple.png"},
            {"text": "BANANA", "image_url": "/images/words/banana.png"},
            {"text": "BREAD", "image_url": "/images/words/bread.png"},
            {"text": "MILK", "image_url": "/images/words/milk.png"},
            {"text": "EGG", "image_url": "/images/words/egg.png"},
            {"text": "CAKE", "image_url": "/images/words/cake.png"},
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
        # Check if already seeded
        result = await session.execute(select(Category).limit(1))
        if result.scalar_one_or_none() is not None:
            print("Database already seeded, skipping.")
            return

        for cat_data in SEED_DATA:
            words_data = cat_data.pop("words")
            category = Category(**cat_data)
            session.add(category)
            await session.flush()

            for word_data in words_data:
                word = Word(**word_data, category_id=category.id)
                session.add(word)

        await session.commit()
        print(f"Seeded {len(SEED_DATA)} categories with words.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
