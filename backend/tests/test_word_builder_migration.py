"""Integration tests for the word-builder migration (002).

Covers spec/word-builder.md §8 Dependencies — "Alembic migration for new
tables (Pattern, BaseWord, WordCombo, PatternProgress)" — and the M3
success criterion that staging deploys must apply schema changes
automatically without manual DB reset.

These tests drive Alembic programmatically against a temp SQLite DB and
focus specifically on the four tables introduced by migration 002. The
existing test_migrations.py asserts the full HEAD-revision table set; this
file asserts the *shape* of the word-builder-specific additions — columns,
FKs, and unique constraints — that HEAD gives us.
"""

from __future__ import annotations

import uuid
from pathlib import Path

import pytest
import sqlalchemy as sa
from alembic.config import Config
from sqlalchemy import create_engine, inspect

from alembic import command
from app.config import settings

BACKEND_DIR = Path(__file__).resolve().parent.parent

WORD_BUILDER_TABLES = {"patterns", "base_words", "word_combos", "pattern_progress"}


@pytest.fixture
def alembic_cfg(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> tuple[Config, str, str]:
    """Yield (Config, sync_url, async_url) pointing at a temp SQLite DB."""
    db_path = tmp_path / "word_builder_migration.db"
    async_url = f"sqlite+aiosqlite:///{db_path}"
    sync_url = f"sqlite:///{db_path}"

    monkeypatch.setattr(settings, "database_url", async_url)

    cfg = Config(str(BACKEND_DIR / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    cfg.set_main_option("sqlalchemy.url", async_url)

    return cfg, sync_url, async_url


def _inspector(sync_url: str) -> sa.Inspector:
    engine = create_engine(sync_url)
    return inspect(engine)


def test_wb_migration_creates_four_word_builder_tables(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """Migration HEAD must include all four word-builder tables."""
    cfg, sync_url, _ = alembic_cfg

    command.upgrade(cfg, "head")

    existing = set(_inspector(sync_url).get_table_names())
    missing = WORD_BUILDER_TABLES - existing
    assert not missing, f"word-builder tables missing after upgrade head: {missing}"


def test_wb_patterns_schema(alembic_cfg: tuple[Config, str, str]) -> None:
    """`patterns` must have id (uuid PK), text, type, level, meaning."""
    cfg, sync_url, _ = alembic_cfg
    command.upgrade(cfg, "head")

    cols = {c["name"] for c in _inspector(sync_url).get_columns("patterns")}
    assert cols >= {"id", "text", "type", "level", "meaning"}


def test_wb_base_words_schema(alembic_cfg: tuple[Config, str, str]) -> None:
    """`base_words` must have id (uuid PK), text, level."""
    cfg, sync_url, _ = alembic_cfg
    command.upgrade(cfg, "head")

    cols = {c["name"] for c in _inspector(sync_url).get_columns("base_words")}
    assert cols >= {"id", "text", "level"}


def test_wb_word_combos_schema_and_fks(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """`word_combos` must have FKs to both base_words and patterns."""
    cfg, sync_url, _ = alembic_cfg
    command.upgrade(cfg, "head")

    insp = _inspector(sync_url)
    cols = {c["name"] for c in insp.get_columns("word_combos")}
    assert cols >= {"id", "base_word_id", "pattern_id", "result_word", "definition"}

    fk_referred_tables = {
        fk["referred_table"] for fk in insp.get_foreign_keys("word_combos")
    }
    assert "base_words" in fk_referred_tables
    assert "patterns" in fk_referred_tables


def test_wb_pattern_progress_schema_and_fks(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """pattern_progress has FKs to patterns+profiles and unique (pattern, profile)."""
    cfg, sync_url, _ = alembic_cfg
    command.upgrade(cfg, "head")

    insp = _inspector(sync_url)
    cols = {c["name"] for c in insp.get_columns("pattern_progress")}
    assert cols >= {
        "id",
        "pattern_id",
        "profile_id",
        "first_attempt_correct_count",
        "star_level",
        "mastered_at",
    }

    fk_referred_tables = {
        fk["referred_table"] for fk in insp.get_foreign_keys("pattern_progress")
    }
    assert "patterns" in fk_referred_tables
    assert "profiles" in fk_referred_tables

    unique_cols = {
        tuple(uc["column_names"])
        for uc in insp.get_unique_constraints("pattern_progress")
    }
    # Composite unique on (pattern_id, profile_id) prevents duplicate progress rows.
    assert any(
        set(cols_tuple) == {"pattern_id", "profile_id"} for cols_tuple in unique_cols
    )


def test_wb_upgrade_downgrade_upgrade_roundtrip(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """Strict rollback: upgrade → downgrade → upgrade produces the same schema.

    This is the cycle-12 Q4 answer ("Full roundtrip tested"). Catches
    downgrade() bugs (wrong drop order, missing drops) at CI time rather
    than in a real rollback emergency.
    """
    cfg, sync_url, _ = alembic_cfg

    command.upgrade(cfg, "head")
    after_first = set(_inspector(sync_url).get_table_names())

    command.downgrade(cfg, "base")
    after_downgrade = set(_inspector(sync_url).get_table_names())
    # After downgrade to base, no word-builder tables should remain.
    assert not (WORD_BUILDER_TABLES & after_downgrade), (
        f"downgrade to base left word-builder tables behind: "
        f"{WORD_BUILDER_TABLES & after_downgrade}"
    )

    command.upgrade(cfg, "head")
    after_second = set(_inspector(sync_url).get_table_names())

    assert after_first == after_second


def test_wb_downgrade_one_step_removes_word_builder_only(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """Downgrading one step from HEAD drops only the word-builder tables.

    Profiles, categories, etc. from migration 001 must survive.
    """
    cfg, sync_url, _ = alembic_cfg

    command.upgrade(cfg, "head")
    command.downgrade(cfg, "-1")

    remaining = set(_inspector(sync_url).get_table_names())
    # Word-builder tables are gone
    assert not (WORD_BUILDER_TABLES & remaining)
    # Migration-001 tables still there
    assert {"profiles", "categories", "words", "word_progress"} <= remaining


def test_wb_existing_data_survives_wb_migration(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """Pre-existing profile + category data must not be disturbed by 002."""
    cfg, sync_url, _ = alembic_cfg

    # Apply only migration 001 first (one step up from base).
    command.upgrade(cfg, "001")

    engine = create_engine(sync_url)
    try:
        profile_id = str(uuid.uuid4())
        with engine.begin() as conn:
            metadata = sa.MetaData()
            metadata.reflect(bind=conn)
            conn.execute(
                metadata.tables["profiles"]
                .insert()
                .values(
                    id=profile_id,
                    name="Pre-WB Kid",
                    color="#abcdef",
                    is_guest=False,
                )
            )

        # Now apply 002 (and anything after). Existing row must survive.
        command.upgrade(cfg, "head")

        with engine.connect() as conn:
            metadata = sa.MetaData()
            metadata.reflect(bind=conn)
            profiles = metadata.tables["profiles"]
            rows = conn.execute(
                sa.select(profiles).where(profiles.c.id == profile_id)
            ).fetchall()

            assert len(rows) == 1
            assert rows[0].name == "Pre-WB Kid"
    finally:
        engine.dispose()
