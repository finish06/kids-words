"""Seed the database with initial word categories and words.

Idempotent: safe to run multiple times.
- Adds missing categories and words
- Updates image_url if changed
- Never duplicates or deletes existing data
"""

import asyncio
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import settings
from app.models import Category, Word
from app.seed_animals import ANIMALS_UNIQUE, get_image_url
from app.seed_bodyparts import BODY_PARTS_UNIQUE
from app.seed_foods import FOODS_UNIQUE
from app.seed_shapes import SHAPES_UNIQUE

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
    {
        "name": "Shapes",
        "slug": "shapes",
        "icon_url": get_image_url("2B50"),
        "display_order": 4,
        "words": [{"text": word, "image_url": url} for word, url in SHAPES_UNIQUE],
    },
    {
        "name": "Body Parts",
        "slug": "body-parts",
        "icon_url": get_image_url("1F9B4"),
        "display_order": 5,
        "words": [{"text": word, "image_url": url} for word, url in BODY_PARTS_UNIQUE],
    },
]


async def seed(db_url: str | None = None) -> None:
    url = db_url or settings.database_url
    engine = create_async_engine(url)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with session_factory() as session:
        added_cats = 0
        added_words = 0
        updated_words = 0

        for cat_data in SEED_DATA:
            words_data: list[dict[str, str]] = cat_data["words"]

            # Upsert category
            result = await session.execute(
                select(Category).where(Category.slug == cat_data["slug"])
            )
            category = result.scalar_one_or_none()

            if category is None:
                category = Category(
                    name=cat_data["name"],
                    slug=cat_data["slug"],
                    icon_url=cat_data["icon_url"],
                    display_order=cat_data["display_order"],
                )
                session.add(category)
                await session.flush()
                added_cats += 1
            else:
                # Update icon_url if changed
                if category.icon_url != cat_data["icon_url"]:
                    category.icon_url = cat_data["icon_url"]

            # Upsert words
            for word_data in words_data:
                word_result = await session.execute(
                    select(Word).where(
                        Word.text == word_data["text"],
                        Word.category_id == category.id,
                    )
                )
                existing = word_result.scalar_one_or_none()

                if existing is None:
                    word = Word(
                        text=word_data["text"],
                        image_url=word_data["image_url"],
                        category_id=category.id,
                    )
                    session.add(word)
                    added_words += 1
                elif existing.image_url != word_data["image_url"]:
                    existing.image_url = word_data["image_url"]
                    updated_words += 1

        # Remove words that are no longer in seed data
        removed_words = 0
        for cat_data in SEED_DATA:
            result = await session.execute(
                select(Category).where(Category.slug == cat_data["slug"])
            )
            category = result.scalar_one_or_none()
            if category is None:
                continue
            seed_texts = {w["text"] for w in cat_data["words"]}
            db_words_result = await session.execute(
                select(Word).where(Word.category_id == category.id)
            )
            for word in db_words_result.scalars().all():
                if word.text not in seed_texts:
                    await session.delete(word)
                    removed_words += 1

        await session.commit()

        no_changes = (
            added_cats == 0
            and added_words == 0
            and updated_words == 0
            and removed_words == 0
        )
        if no_changes:
            print("Database already up to date.")
        else:
            parts = []
            if added_cats:
                parts.append(f"{added_cats} categories")
            if added_words:
                parts.append(f"{added_words} words")
            if updated_words:
                parts.append(f"{updated_words} words updated")
            if removed_words:
                parts.append(f"{removed_words} words removed")
            print(f"Seed complete: {', '.join(parts)}.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
