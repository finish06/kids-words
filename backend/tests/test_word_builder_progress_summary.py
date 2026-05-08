"""Tests for the progress-bar summary fields on /api/word-builder/progress.

Specs: specs/game-progress-bar.md AC-009, AC-011, AC-019, AC-022.

This file is intentionally separate from `tests/test_word_builder.py` to keep
the M7 prefix/suffix mypy-debt blast radius contained — see
`docs/cvc-builder-impact-analysis.md`. New tests target only the new
top-level `stars_earned` and `stars_possible` fields on the existing
`/api/word-builder/progress` response.
"""

import uuid

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Pattern, PatternProgress


async def _seed_patterns_l1_only(db: AsyncSession) -> list[Pattern]:
    """Seed 6 L1 patterns. Returns the inserted Pattern rows."""
    patterns = [
        Pattern(id=uuid.uuid4(), text="UN-", type="prefix", level=1, meaning="not"),
        Pattern(id=uuid.uuid4(), text="RE-", type="prefix", level=1, meaning="again"),
        Pattern(id=uuid.uuid4(), text="-ING", type="suffix", level=1, meaning="ongoing"),
        Pattern(id=uuid.uuid4(), text="-ED", type="suffix", level=1, meaning="past"),
        Pattern(id=uuid.uuid4(), text="-S", type="suffix", level=1, meaning="plural"),
        Pattern(id=uuid.uuid4(), text="-ER", type="suffix", level=1, meaning="agent"),
    ]
    db.add_all(patterns)
    await db.commit()
    return patterns


async def _seed_patterns_l1_and_l2(db: AsyncSession) -> tuple[list[Pattern], list[Pattern]]:
    """Seed 6 L1 + 3 L2 patterns. Returns (l1, l2) tuple."""
    l1 = [
        Pattern(id=uuid.uuid4(), text="UN-", type="prefix", level=1, meaning="not"),
        Pattern(id=uuid.uuid4(), text="RE-", type="prefix", level=1, meaning="again"),
        Pattern(id=uuid.uuid4(), text="-ING", type="suffix", level=1, meaning="ongoing"),
        Pattern(id=uuid.uuid4(), text="-ED", type="suffix", level=1, meaning="past"),
        Pattern(id=uuid.uuid4(), text="-S", type="suffix", level=1, meaning="plural"),
        Pattern(id=uuid.uuid4(), text="-ER", type="suffix", level=1, meaning="agent"),
    ]
    l2 = [
        Pattern(id=uuid.uuid4(), text="PRE-", type="prefix", level=2, meaning="before"),
        Pattern(id=uuid.uuid4(), text="MIS-", type="prefix", level=2, meaning="wrong"),
        Pattern(id=uuid.uuid4(), text="-NESS", type="suffix", level=2, meaning="state"),
    ]
    db.add_all(l1 + l2)
    await db.commit()
    return l1, l2


# --- AC-019: schema test ---


async def test_ac019_word_builder_progress_exposes_stars_earned_and_possible(
    seeded_client: AsyncClient,
    db: AsyncSession,
) -> None:
    """AC-019: /api/word-builder/progress gains stars_earned + stars_possible
    as top-level fields."""
    await _seed_patterns_l1_only(db)

    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    response = await seeded_client.get(
        "/api/word-builder/progress",
        headers={"X-Profile-ID": guest_id},
    )
    assert response.status_code == 200
    data = response.json()
    assert "stars_earned" in data
    assert "stars_possible" in data


# --- AC-009: scope to unlocked levels only ---


async def test_ac009_stars_possible_scopes_to_unlocked_levels_only(
    seeded_client: AsyncClient,
    db: AsyncSession,
) -> None:
    """AC-009: With L1 unlocked and L2 locked, stars_possible counts only
    L1 patterns × 3 — locked levels never inflate the denominator."""
    await _seed_patterns_l1_and_l2(db)

    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    response = await seeded_client.get(
        "/api/word-builder/progress",
        headers={"X-Profile-ID": guest_id},
    )
    data = response.json()
    # Fresh profile: L1 unlocked, L2 locked. Only L1 (6 patterns) × 3 = 18.
    assert data["stars_possible"] == 18
    assert data["stars_earned"] == 0


# --- AC-011: stars_earned sums pattern progress at unlocked levels ---


async def test_ac011_stars_earned_sums_pattern_progress(
    seeded_client: AsyncClient,
    db: AsyncSession,
) -> None:
    """AC-011: stars_earned = sum of star_level across patterns at unlocked
    levels. Mixed star levels add up correctly."""
    patterns = await _seed_patterns_l1_only(db)

    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])
    guest_uuid = uuid.UUID(guest_id)

    # 3 stars on UN-, 2 stars on RE-, 1 star on -ING, 0 on rest → expected sum = 6
    db.add_all(
        [
            PatternProgress(
                id=uuid.uuid4(),
                pattern_id=patterns[0].id,
                profile_id=guest_uuid,
                first_attempt_correct_count=7,
                star_level=3,
            ),
            PatternProgress(
                id=uuid.uuid4(),
                pattern_id=patterns[1].id,
                profile_id=guest_uuid,
                first_attempt_correct_count=4,
                star_level=2,
            ),
            PatternProgress(
                id=uuid.uuid4(),
                pattern_id=patterns[2].id,
                profile_id=guest_uuid,
                first_attempt_correct_count=2,
                star_level=1,
            ),
        ]
    )
    await db.commit()

    response = await seeded_client.get(
        "/api/word-builder/progress",
        headers={"X-Profile-ID": guest_id},
    )
    data = response.json()
    assert data["stars_earned"] == 6
    assert data["stars_possible"] == 18  # all L1 unlocked, no L2 seeded


# --- AC-009 / AC-015: denominator grows when level unlocks ---


async def test_level_unlock_grows_denominator(
    seeded_client: AsyncClient,
    db: AsyncSession,
) -> None:
    """AC-009 + AC-015: when L2 unlocks (≥70% of L1 mastered), L2 patterns
    contribute to stars_possible."""
    l1, l2 = await _seed_patterns_l1_and_l2(db)

    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])
    guest_uuid = uuid.UUID(guest_id)

    # Master 5 of 6 L1 patterns at 3 stars (83% > 70% unlock threshold)
    db.add_all(
        [
            PatternProgress(
                id=uuid.uuid4(),
                pattern_id=p.id,
                profile_id=guest_uuid,
                first_attempt_correct_count=7,
                star_level=3,
            )
            for p in l1[:5]
        ]
    )
    await db.commit()

    response = await seeded_client.get(
        "/api/word-builder/progress",
        headers={"X-Profile-ID": guest_id},
    )
    data = response.json()
    # L2 should now be unlocked: (6 L1 + 3 L2) × 3 = 27
    assert data["stars_possible"] == 27
    # 5 L1 patterns at 3 stars = 15 earned
    assert data["stars_earned"] == 15
    # Forward-compat with cvc-builder.md and game-progress-bar.md AC-005:
    # earned/possible reflects the kid's actual ratio (15/27 ≈ 55%)
    assert data["stars_earned"] < data["stars_possible"]


# --- AC-022: defensive cap on overflow ---


async def test_ac022_stars_capped_at_possible_word_builder(
    seeded_client: AsyncClient,
    db: AsyncSession,
) -> None:
    """AC-022: even with anomalous data (star_level > 3), the displayed
    stars_earned never exceeds stars_possible."""
    patterns = await _seed_patterns_l1_only(db)

    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])
    guest_uuid = uuid.UUID(guest_id)

    # Single anomalous row at star_level=99
    db.add(
        PatternProgress(
            id=uuid.uuid4(),
            pattern_id=patterns[0].id,
            profile_id=guest_uuid,
            first_attempt_correct_count=99,
            star_level=99,
        )
    )
    await db.commit()

    response = await seeded_client.get(
        "/api/word-builder/progress",
        headers={"X-Profile-ID": guest_id},
    )
    data = response.json()
    assert data["stars_earned"] <= data["stars_possible"], (
        "stars_earned must be capped at stars_possible (AC-022)"
    )


# --- AC-022: empty profile, no patterns seeded ---


async def test_no_divide_by_zero_when_no_patterns_seeded(
    seeded_client: AsyncClient,
) -> None:
    """AC-022: if no patterns exist (corrupt seed, fresh DB), the response
    must return cleanly with zeros, not crash."""
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    response = await seeded_client.get(
        "/api/word-builder/progress",
        headers={"X-Profile-ID": guest_id},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["stars_earned"] == 0
    assert data["stars_possible"] == 0
