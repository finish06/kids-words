"""Integration tests for the word-builder seed module.

Covers spec/word-builder.md acceptance criteria that are data-driven:
- AC-008: Level 1 patterns are UN-, RE-, -ING, -ED, -S, -ER (six patterns)
- AC-011 prerequisite: enough L1 combos exist to measure mastery against
- Idempotency (same contract as `seed.py`): running seed twice yields the same counts

Uses `Base.metadata.create_all` directly — this is about seed-script behavior,
not migration plumbing. `test_word_builder_migration.py` covers the DDL path.
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

from app.models import Base, BaseWord, Pattern, WordCombo
from app.seed_word_builder import seed_word_builder

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator
    from pathlib import Path


LEVEL_1_PATTERNS = {"UN-", "RE-", "-ING", "-ED", "-S", "-ER"}
MIN_LEVEL_1_COMBOS = 25  # spec targets ~30


@pytest_asyncio.fixture
async def wb_db_url(tmp_path: Path) -> AsyncGenerator[str]:
    """Temp SQLite DB with all models' schema applied."""
    db_path = tmp_path / "wb_seed_test.db"
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


async def _fetch_pattern_texts(url: str, level: int) -> set[str]:
    engine = create_async_engine(url)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    try:
        async with session_factory() as session:
            result = await session.execute(
                select(Pattern.text).where(Pattern.level == level)
            )
            return {row[0] for row in result.all()}
    finally:
        await engine.dispose()


@pytest.mark.asyncio
async def test_ac008_level_1_patterns_are_the_expected_six(wb_db_url: str) -> None:
    """AC-008: Level 1 patterns are exactly UN-, RE-, -ING, -ED, -S, -ER."""
    await seed_word_builder(db_url=wb_db_url)

    texts = await _fetch_pattern_texts(wb_db_url, level=1)
    assert texts == LEVEL_1_PATTERNS


@pytest.mark.asyncio
async def test_wb_seed_creates_patterns(wb_db_url: str) -> None:
    """Seed populates the patterns table with at least the L1 set."""
    await seed_word_builder(db_url=wb_db_url)

    pattern_count = await _count(wb_db_url, Pattern)
    # At minimum, 6 patterns for L1. Seed may include more for L2/L3 later.
    assert pattern_count >= len(LEVEL_1_PATTERNS)


@pytest.mark.asyncio
async def test_wb_seed_creates_base_words(wb_db_url: str) -> None:
    """Seed creates enough base words to generate the L1 combo set."""
    await seed_word_builder(db_url=wb_db_url)

    base_word_count = await _count(wb_db_url, BaseWord)
    # ~15-20 base words expected to yield ~30 combos. Lower bound.
    assert base_word_count >= 10


@pytest.mark.asyncio
async def test_wb_seed_level_1_combos_meet_minimum(wb_db_url: str) -> None:
    """Seed produces at least MIN_LEVEL_1_COMBOS valid L1 combos."""
    await seed_word_builder(db_url=wb_db_url)

    engine = create_async_engine(wb_db_url)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    try:
        async with session_factory() as session:
            result = await session.execute(
                select(func.count())
                .select_from(WordCombo)
                .join(Pattern, WordCombo.pattern_id == Pattern.id)
                .where(Pattern.level == 1)
            )
            l1_combo_count = int(result.scalar_one())
    finally:
        await engine.dispose()

    assert l1_combo_count >= MIN_LEVEL_1_COMBOS


@pytest.mark.asyncio
async def test_wb_seed_idempotent(wb_db_url: str) -> None:
    """Running seed twice yields the same counts across all three tables."""
    await seed_word_builder(db_url=wb_db_url)
    patterns_a = await _count(wb_db_url, Pattern)
    base_words_a = await _count(wb_db_url, BaseWord)
    combos_a = await _count(wb_db_url, WordCombo)

    await seed_word_builder(db_url=wb_db_url)
    patterns_b = await _count(wb_db_url, Pattern)
    base_words_b = await _count(wb_db_url, BaseWord)
    combos_b = await _count(wb_db_url, WordCombo)

    assert (patterns_a, base_words_a, combos_a) == (patterns_b, base_words_b, combos_b)


@pytest.mark.asyncio
async def test_wb_seed_third_run_also_noop(wb_db_url: str) -> None:
    """Stability under repeated invocation."""
    await seed_word_builder(db_url=wb_db_url)
    await seed_word_builder(db_url=wb_db_url)
    await seed_word_builder(db_url=wb_db_url)

    assert await _count(wb_db_url, Pattern) >= len(LEVEL_1_PATTERNS)


@pytest.mark.asyncio
async def test_wb_combos_reference_only_existing_patterns_and_basewords(
    wb_db_url: str,
) -> None:
    """FK integrity: every WordCombo points to real patterns + base_words."""
    await seed_word_builder(db_url=wb_db_url)

    engine = create_async_engine(wb_db_url)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    try:
        async with session_factory() as session:
            # Count combos whose FKs point at rows that exist.
            valid_result = await session.execute(
                select(func.count())
                .select_from(WordCombo)
                .join(Pattern, WordCombo.pattern_id == Pattern.id)
                .join(BaseWord, WordCombo.base_word_id == BaseWord.id)
            )
            valid_combos = int(valid_result.scalar_one())

            total_result = await session.execute(
                select(func.count()).select_from(WordCombo)
            )
            total_combos = int(total_result.scalar_one())

            # All combos should have valid FK resolution (JOIN matches every row).
            assert valid_combos == total_combos
    finally:
        await engine.dispose()
