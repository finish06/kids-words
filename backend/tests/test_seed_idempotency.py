"""Integration tests for idempotent seeding.

Covers AC-003, AC-004, AC-005, AC-007 and TC-001, TC-003, TC-004 from
specs/database-migrations.md:
- Seeding a fresh DB inserts all categories/words
- Running seed twice is a no-op (no duplicates)
- Adding a word to the source inserts only the new word
- Changing an image_url in the source updates the existing row
- Seed is invokable with a custom DB URL (AC-007 in spirit; the CLI entry
  path `python -m app.seed` is exercised indirectly via importing and calling
  the same function object.)

These tests run against a temp SQLite DB and bypass Alembic — they're
specifically about seed-script behavior, not migration plumbing. Schema is
created via `Base.metadata.create_all`, which matches the shape of what
migration 001 produces (the migration tests cover the migration path itself).
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import pytest
import pytest_asyncio
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app import seed as seed_module
from app.models import Base, Category, Word
from app.seed import seed

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator
    from pathlib import Path


@pytest_asyncio.fixture
async def seeded_db_url(tmp_path: Path) -> AsyncGenerator[str]:
    """Create a temp SQLite DB with schema applied, yield its URL."""
    db_path = tmp_path / "seed_test.db"
    url = f"sqlite+aiosqlite:///{db_path}"

    engine = create_async_engine(url)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()

    yield url


async def _count(url: str, model: type) -> int:
    engine = create_async_engine(url)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    try:
        async with session_factory() as session:
            result = await session.execute(select(func.count()).select_from(model))
            return int(result.scalar_one())
    finally:
        await engine.dispose()


async def _fetch_word_image(url: str, text: str) -> str | None:
    engine = create_async_engine(url)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    try:
        async with session_factory() as session:
            result = await session.execute(select(Word).where(Word.text == text))
            word = result.scalar_one_or_none()
            return word.image_url if word else None
    finally:
        await engine.dispose()


@pytest.mark.asyncio
async def test_tc001_seed_fresh_db_inserts_all(seeded_db_url: str) -> None:
    """TC-001: running seed against an empty schema inserts every category + word."""
    await seed(db_url=seeded_db_url)

    category_count = await _count(seeded_db_url, Category)
    word_count = await _count(seeded_db_url, Word)

    # The seed data has Animals, Colors, Food categories.
    assert category_count == 3

    # Word count should equal the sum of SEED_DATA word lists.
    expected = sum(len(cat["words"]) for cat in seed_module.SEED_DATA)
    assert word_count == expected
    assert word_count > 0


@pytest.mark.asyncio
async def test_tc003_ac003_second_run_is_noop(seeded_db_url: str) -> None:
    """TC-003 / AC-003: running seed twice produces the same counts."""
    await seed(db_url=seeded_db_url)
    cat_after_first = await _count(seeded_db_url, Category)
    word_after_first = await _count(seeded_db_url, Word)

    await seed(db_url=seeded_db_url)
    cat_after_second = await _count(seeded_db_url, Category)
    word_after_second = await _count(seeded_db_url, Word)

    assert cat_after_first == cat_after_second
    assert word_after_first == word_after_second


@pytest.mark.asyncio
async def test_third_run_still_noop(seeded_db_url: str) -> None:
    """AC-003: stability under repeated invocation — a third run also no-ops."""
    await seed(db_url=seeded_db_url)
    await seed(db_url=seeded_db_url)
    await seed(db_url=seeded_db_url)

    assert await _count(seeded_db_url, Category) == 3


@pytest.mark.asyncio
async def test_tc004_ac004_new_word_inserts_incrementally(
    seeded_db_url: str, monkeypatch: pytest.MonkeyPatch
) -> None:
    """TC-004 / AC-004: adding a word to source data inserts only that word."""
    await seed(db_url=seeded_db_url)
    baseline_words = await _count(seeded_db_url, Word)

    # Mutate the Colors category's words in place to add a new color.
    new_seed_data = [{**cat, "words": [*cat["words"]]} for cat in seed_module.SEED_DATA]
    colors_entry = next(cat for cat in new_seed_data if cat["slug"] == "colors")
    colors_entry["words"].append({"text": "TEAL", "image_url": "color://#14b8a6"})

    monkeypatch.setattr(seed_module, "SEED_DATA", new_seed_data)

    await seed(db_url=seeded_db_url)

    new_total = await _count(seeded_db_url, Word)
    assert new_total == baseline_words + 1

    # The new word must be present with the expected URL.
    teal_url = await _fetch_word_image(seeded_db_url, "TEAL")
    assert teal_url == "color://#14b8a6"


@pytest.mark.asyncio
async def test_ac005_changed_image_url_is_updated(
    seeded_db_url: str, monkeypatch: pytest.MonkeyPatch
) -> None:
    """AC-005: when a word's image_url changes in source, seed updates the row."""
    await seed(db_url=seeded_db_url)
    original = await _fetch_word_image(seeded_db_url, "RED")
    assert original is not None

    new_seed_data = [
        {**cat, "words": [dict(w) for w in cat["words"]]}
        for cat in seed_module.SEED_DATA
    ]
    colors_entry = next(cat for cat in new_seed_data if cat["slug"] == "colors")
    for word in colors_entry["words"]:
        if word["text"] == "RED":
            word["image_url"] = "color://#dc2626"  # Different shade of red

    monkeypatch.setattr(seed_module, "SEED_DATA", new_seed_data)

    await seed(db_url=seeded_db_url)

    updated = await _fetch_word_image(seeded_db_url, "RED")
    assert updated == "color://#dc2626"
    assert updated != original


@pytest.mark.asyncio
async def test_seed_does_not_delete_words_removed_from_source(
    seeded_db_url: str, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Edge-case guard: seed is additive, never destructive. If a word is
    removed from the source data, the existing row is preserved (deletions are
    a human decision, not an automated one).
    """
    await seed(db_url=seeded_db_url)
    baseline_words = await _count(seeded_db_url, Word)

    # Remove RED from source
    new_seed_data = [
        {**cat, "words": [dict(w) for w in cat["words"]]}
        for cat in seed_module.SEED_DATA
    ]
    colors_entry = next(cat for cat in new_seed_data if cat["slug"] == "colors")
    colors_entry["words"] = [w for w in colors_entry["words"] if w["text"] != "RED"]

    monkeypatch.setattr(seed_module, "SEED_DATA", new_seed_data)

    await seed(db_url=seeded_db_url)

    # RED should still be in the DB — additive semantics
    assert await _count(seeded_db_url, Word) == baseline_words
    assert await _fetch_word_image(seeded_db_url, "RED") is not None
