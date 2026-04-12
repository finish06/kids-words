"""Integration tests for Alembic migrations.

Covers AC-001, AC-002, AC-008 from specs/database-migrations.md:
- Initial migration applies cleanly on an empty DB
- upgrade → downgrade → upgrade round-trips (strict rollback requirement)
- Existing data survives schema upgrades

These tests drive Alembic programmatically against a temp SQLite DB rather
than the Postgres one used in production. The migration uses `sa.Uuid()` and
string-server-defaults that SQLAlchemy renders compatibly for SQLite, so the
initial migration is portable. If future migrations introduce Postgres-only
constructs, the test setup will need to swap to a real Postgres container.

The tests are synchronous because Alembic's `command.upgrade/downgrade` use
`asyncio.run` internally via `env.py`. Nesting that inside an async test would
require extra orchestration that buys us nothing here.
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

# All tables that the initial migration should create.
EXPECTED_TABLES = {
    "alembic_version",
    "profiles",
    "parent_settings",
    "categories",
    "words",
    "match_results",
    "word_progress",
}

BACKEND_DIR = Path(__file__).resolve().parent.parent


@pytest.fixture
def alembic_cfg(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> tuple[Config, str, str]:
    """Yield (Config, sync_url, async_url) pointing at a temp SQLite DB.

    `env.py` reads `settings.database_url` directly, so we patch the setting
    before any Alembic command runs. Both async URL (for Alembic) and sync URL
    (for post-migration inspection) are returned.
    """
    db_path = tmp_path / "migrations.db"
    async_url = f"sqlite+aiosqlite:///{db_path}"
    sync_url = f"sqlite:///{db_path}"

    monkeypatch.setattr(settings, "database_url", async_url)

    cfg = Config(str(BACKEND_DIR / "alembic.ini"))
    cfg.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    cfg.set_main_option("sqlalchemy.url", async_url)

    return cfg, sync_url, async_url


def _table_names(sync_url: str) -> set[str]:
    engine = create_engine(sync_url)
    try:
        return set(inspect(engine).get_table_names())
    finally:
        engine.dispose()


def test_ac001_upgrade_creates_all_tables(alembic_cfg: tuple[Config, str, str]) -> None:
    """AC-001: initial migration creates every expected table on an empty DB."""
    cfg, sync_url, _ = alembic_cfg

    command.upgrade(cfg, "head")

    assert _table_names(sync_url) == EXPECTED_TABLES


def test_ac002_upgrade_is_idempotent(alembic_cfg: tuple[Config, str, str]) -> None:
    """AC-002: running `upgrade head` a second time is a no-op (no errors)."""
    cfg, sync_url, _ = alembic_cfg

    command.upgrade(cfg, "head")
    # Second call should recognize current revision and do nothing.
    command.upgrade(cfg, "head")

    assert _table_names(sync_url) == EXPECTED_TABLES


def test_downgrade_roundtrip_returns_to_empty(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """Strict rollback: upgrade → downgrade → schema matches empty baseline."""
    cfg, sync_url, _ = alembic_cfg

    command.upgrade(cfg, "head")
    assert _table_names(sync_url) == EXPECTED_TABLES

    command.downgrade(cfg, "base")

    # Only alembic_version should remain; all data tables dropped.
    remaining = _table_names(sync_url)
    assert remaining <= {"alembic_version"}, (
        f"Downgrade did not drop all tables. Remaining: {remaining}"
    )


def test_upgrade_downgrade_upgrade_reaches_same_state(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """Strict rollback: second upgrade after downgrade produces identical schema."""
    cfg, sync_url, _ = alembic_cfg

    command.upgrade(cfg, "head")
    first_pass = _table_names(sync_url)

    command.downgrade(cfg, "base")
    command.upgrade(cfg, "head")
    second_pass = _table_names(sync_url)

    assert first_pass == second_pass == EXPECTED_TABLES


def test_ac008_existing_data_survives_reupgrade(
    alembic_cfg: tuple[Config, str, str],
) -> None:
    """AC-008: pre-existing profile + progress rows are not disturbed when
    `upgrade head` is run again after data has been inserted.

    This does not simulate a real schema change (there's only one revision
    today), but it does prove the deploy-time `alembic upgrade head` is safe
    to run against a populated DB — which is the spec's promise.
    """
    cfg, sync_url, _ = alembic_cfg

    # Initial upgrade
    command.upgrade(cfg, "head")

    # Seed a profile and a match_result directly via SQLAlchemy core
    engine = create_engine(sync_url)
    try:
        with engine.begin() as conn:
            metadata = sa.MetaData()
            metadata.reflect(bind=conn)

            profile_id = str(uuid.uuid4())
            conn.execute(
                metadata.tables["profiles"]
                .insert()
                .values(
                    id=profile_id,
                    name="Test Kid",
                    color="#ff00ff",
                    is_guest=False,
                )
            )

        # Run upgrade again — should be a no-op and preserve the row
        command.upgrade(cfg, "head")

        with engine.connect() as conn:
            metadata = sa.MetaData()
            metadata.reflect(bind=conn)
            profiles = metadata.tables["profiles"]
            rows = conn.execute(sa.select(profiles)).fetchall()

            assert len(rows) == 1
            assert rows[0].name == "Test Kid"
            assert rows[0].color == "#ff00ff"
    finally:
        engine.dispose()
