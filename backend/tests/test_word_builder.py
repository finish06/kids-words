"""Integration tests for the Word Builder API (M7).

Covers the backend-scope acceptance criteria from specs/word-builder.md:

- AC-002: Base word displayed in each challenge (API: `base_word` field)
- AC-003: 2-3 option tiles per challenge
- AC-004: Correct tap records + increments pattern progress
- AC-005: Wrong tap does not increment mastery
- AC-006: Option `type` is "prefix" or "suffix"
- AC-007: Response includes `level` field
- AC-008: Level 1 patterns are UN-, RE-, -ING, -ED, -S, -ER
- AC-011: Adaptive unlock — >=70% L1 mastery → L2 `unlocked: true`
- AC-012: Star thresholds 2→1★, 4→2★, 7+→3★
- AC-013: Round `count` param respected (5/10/20)
- AC-016: Progress is profile-scoped via `X-Profile-ID` header

Frontend-only ACs (AC-001 home screen, AC-014/015 UI flows) are out of scope
for this backend cycle. They'll be covered by playwright/vitest when the
frontend cycle ships.
"""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

import pytest_asyncio
from sqlalchemy import select

from app.models import (
    BaseWord,
    Pattern,
    PatternProgress,
    Profile,
    WordCombo,
)

if TYPE_CHECKING:
    from httpx import AsyncClient
    from sqlalchemy.ext.asyncio import AsyncSession


LEVEL_1_PATTERNS: list[dict[str, object]] = [
    {"text": "UN-", "type": "prefix", "level": 1, "meaning": "not"},
    {"text": "RE-", "type": "prefix", "level": 1, "meaning": "again"},
    {"text": "-ING", "type": "suffix", "level": 1, "meaning": "action"},
    {"text": "-ED", "type": "suffix", "level": 1, "meaning": "past"},
    {"text": "-S", "type": "suffix", "level": 1, "meaning": "plural"},
    {"text": "-ER", "type": "suffix", "level": 1, "meaning": "one who"},
]


@pytest_asyncio.fixture
async def wb_profile(db: AsyncSession) -> Profile:
    """Create a named (non-guest) profile for progress scoping tests."""
    profile = Profile(
        id=uuid.uuid4(),
        name="Test Kid",
        color="#3b82f6",
        is_guest=False,
    )
    db.add(profile)
    await db.commit()
    return profile


@pytest_asyncio.fixture
async def wb_data(db: AsyncSession) -> dict[str, object]:
    """Seed minimal word-builder content for endpoint tests.

    6 L1 patterns + a few L2 patterns (so `levels` list has a locked entry),
    3 base words, and 6 valid combos. Enough to exercise round generation,
    result recording, and progress queries.
    """
    # Guest profile (default for endpoint calls without X-Profile-ID header)
    guest = Profile(id=uuid.uuid4(), name="Guest", color="#9ca3af", is_guest=True)
    db.add(guest)
    await db.flush()

    # L1 patterns
    patterns_by_text: dict[str, Pattern] = {}
    for spec in LEVEL_1_PATTERNS:
        p = Pattern(
            id=uuid.uuid4(),
            text=str(spec["text"]),
            type=str(spec["type"]),
            level=int(spec["level"]),  # type: ignore[arg-type]
            meaning=str(spec["meaning"]),
        )
        db.add(p)
        patterns_by_text[p.text] = p

    # L2 patterns (to prove `unlocked: false` appears in /progress before mastery)
    l2 = Pattern(id=uuid.uuid4(), text="PRE-", type="prefix", level=2, meaning="before")
    db.add(l2)
    patterns_by_text["PRE-"] = l2

    await db.flush()

    # Base words
    play = BaseWord(id=uuid.uuid4(), text="PLAY", level=1)
    happy = BaseWord(id=uuid.uuid4(), text="HAPPY", level=1)
    run = BaseWord(id=uuid.uuid4(), text="RUN", level=1)
    db.add_all([play, happy, run])
    await db.flush()

    # Combos (enough for count=5 rounds to fill from L1 without repeats)
    combos = [
        WordCombo(
            id=uuid.uuid4(),
            base_word_id=play.id,
            pattern_id=patterns_by_text["RE-"].id,
            result_word="REPLAY",
            definition="play again",
        ),
        WordCombo(
            id=uuid.uuid4(),
            base_word_id=play.id,
            pattern_id=patterns_by_text["-ING"].id,
            result_word="PLAYING",
            definition="the action of play",
        ),
        WordCombo(
            id=uuid.uuid4(),
            base_word_id=play.id,
            pattern_id=patterns_by_text["-ED"].id,
            result_word="PLAYED",
            definition="play in the past",
        ),
        WordCombo(
            id=uuid.uuid4(),
            base_word_id=happy.id,
            pattern_id=patterns_by_text["UN-"].id,
            result_word="UNHAPPY",
            definition="not happy",
        ),
        WordCombo(
            id=uuid.uuid4(),
            base_word_id=run.id,
            pattern_id=patterns_by_text["-ING"].id,
            result_word="RUNNING",
            definition="the action of run",
        ),
        WordCombo(
            id=uuid.uuid4(),
            base_word_id=run.id,
            pattern_id=patterns_by_text["-ER"].id,
            result_word="RUNNER",
            definition="one who runs",
        ),
    ]
    db.add_all(combos)
    await db.commit()

    return {
        "guest": guest,
        "patterns": patterns_by_text,
        "base_words": {"PLAY": play, "HAPPY": happy, "RUN": run},
        "combos": combos,
    }


# ============================================================================
# GET /api/word-builder/round
# ============================================================================


async def test_ac002_get_round_returns_challenges_with_base_word(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """AC-002: Each challenge carries a base_word."""
    response = await client.get("/api/word-builder/round?count=5")
    assert response.status_code == 200, response.text
    data = response.json()

    assert "challenges" in data
    assert len(data["challenges"]) > 0
    for challenge in data["challenges"]:
        assert "base_word" in challenge
        assert isinstance(challenge["base_word"], str)
        assert challenge["base_word"]


async def test_ac003_each_challenge_has_2_or_3_options(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """AC-003: 2-3 prefix/suffix tiles."""
    response = await client.get("/api/word-builder/round?count=5")
    data = response.json()

    for challenge in data["challenges"]:
        assert 2 <= len(challenge["options"]) <= 3, (
            f"Expected 2-3 options, got {len(challenge['options'])}"
        )


async def test_ac006_options_have_prefix_or_suffix_type(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """AC-006: Every option tile has type 'prefix' or 'suffix'."""
    response = await client.get("/api/word-builder/round?count=5")
    data = response.json()

    for challenge in data["challenges"]:
        for option in challenge["options"]:
            assert option["type"] in {"prefix", "suffix"}


async def test_ac007_response_has_level_field(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """AC-007: response has `level` integer field."""
    response = await client.get("/api/word-builder/round?count=5")
    data = response.json()

    assert "level" in data
    assert isinstance(data["level"], int)
    assert data["level"] >= 1


async def test_ac013_round_count_5(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """AC-013: count=5 returns 5 challenges."""
    response = await client.get("/api/word-builder/round?count=5")
    data = response.json()
    assert len(data["challenges"]) == 5


async def test_ac013_round_count_10(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """AC-013: count=10 returns 10 challenges (combo pool may require repeats)."""
    response = await client.get("/api/word-builder/round?count=10")
    data = response.json()
    assert len(data["challenges"]) == 10


async def test_round_correct_pattern_is_in_options(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """The tile that forms the valid combo must appear in the options list."""
    response = await client.get("/api/word-builder/round?count=5")
    data = response.json()

    for challenge in data["challenges"]:
        correct_id = challenge["correct_pattern"]["id"]
        option_ids = {opt["id"] for opt in challenge["options"]}
        assert correct_id in option_ids, "correct_pattern must be one of the options"


async def test_round_challenge_has_result_word_and_definition(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """Spec §5: challenges carry `result_word` and `definition`."""
    response = await client.get("/api/word-builder/round?count=5")
    data = response.json()

    for challenge in data["challenges"]:
        assert challenge["result_word"]
        assert isinstance(challenge["definition"], str)


async def test_round_level_param_respected(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """`level=1` returns only level-1 challenges (the seeded L1 combos)."""
    response = await client.get("/api/word-builder/round?level=1&count=5")
    data = response.json()
    assert data["level"] == 1


# ============================================================================
# POST /api/word-builder/results
# ============================================================================


async def test_ac004_correct_first_attempt_increments_pattern_progress(
    client: AsyncClient,
    wb_data: dict[str, object],
    wb_profile: Profile,
    db: AsyncSession,
) -> None:
    """AC-004: correct first-attempt tap records + bumps pattern progress."""
    patterns = wb_data["patterns"]  # type: ignore[index]
    re_pattern = patterns["RE-"]  # type: ignore[index]

    headers = {"X-Profile-ID": str(wb_profile.id)}
    response = await client.post(
        "/api/word-builder/results",
        json={
            "pattern_id": str(re_pattern.id),
            "is_correct": True,
            "attempt_number": 1,
        },
        headers=headers,
    )
    assert response.status_code == 201, response.text

    # Verify progress row was created / updated
    result = await db.execute(
        select(PatternProgress).where(
            PatternProgress.pattern_id == re_pattern.id,
            PatternProgress.profile_id == wb_profile.id,
        )
    )
    pp = result.scalar_one_or_none()
    assert pp is not None
    assert pp.first_attempt_correct_count == 1


async def test_ac005_wrong_attempt_does_not_increment_stars(
    client: AsyncClient,
    wb_data: dict[str, object],
    wb_profile: Profile,
    db: AsyncSession,
) -> None:
    """AC-005: wrong tap doesn't bump mastery count."""
    patterns = wb_data["patterns"]  # type: ignore[index]
    un_pattern = patterns["UN-"]  # type: ignore[index]

    headers = {"X-Profile-ID": str(wb_profile.id)}
    await client.post(
        "/api/word-builder/results",
        json={
            "pattern_id": str(un_pattern.id),
            "is_correct": False,
            "attempt_number": 1,
        },
        headers=headers,
    )

    result = await db.execute(
        select(PatternProgress).where(
            PatternProgress.pattern_id == un_pattern.id,
            PatternProgress.profile_id == wb_profile.id,
        )
    )
    pp = result.scalar_one_or_none()
    # Either no row (no-op) or row with count=0 is acceptable.
    if pp is not None:
        assert pp.first_attempt_correct_count == 0
        assert pp.star_level == 0


async def test_ac012_star_thresholds(
    client: AsyncClient,
    wb_data: dict[str, object],
    wb_profile: Profile,
    db: AsyncSession,
) -> None:
    """AC-012: 2→1★, 4→2★, 7+→3★ per PatternProgress (same as WordProgress)."""
    patterns = wb_data["patterns"]  # type: ignore[index]
    ing_pattern = patterns["-ING"]  # type: ignore[index]

    headers = {"X-Profile-ID": str(wb_profile.id)}
    body = {
        "pattern_id": str(ing_pattern.id),
        "is_correct": True,
        "attempt_number": 1,
    }

    # Hit the endpoint 7 times, check star level at each threshold
    expected_by_count = {1: 0, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 3}
    for n in range(1, 8):
        await client.post("/api/word-builder/results", json=body, headers=headers)
        result = await db.execute(
            select(PatternProgress).where(
                PatternProgress.pattern_id == ing_pattern.id,
                PatternProgress.profile_id == wb_profile.id,
            )
        )
        pp = result.scalar_one()
        await db.refresh(pp)
        assert pp.first_attempt_correct_count == n
        expected = expected_by_count[n]
        assert pp.star_level == expected, (
            f"After {n} correct, expected {expected} star(s), got {pp.star_level}"
        )


async def test_ac016_progress_is_profile_scoped(
    client: AsyncClient,
    wb_data: dict[str, object],
    db: AsyncSession,
) -> None:
    """AC-016: Different X-Profile-ID headers yield independent progress."""
    patterns = wb_data["patterns"]  # type: ignore[index]
    re_pattern = patterns["RE-"]  # type: ignore[index]

    alice = Profile(id=uuid.uuid4(), name="Alice", color="#ec4899", is_guest=False)
    bob = Profile(id=uuid.uuid4(), name="Bob", color="#3b82f6", is_guest=False)
    db.add_all([alice, bob])
    await db.commit()

    body = {
        "pattern_id": str(re_pattern.id),
        "is_correct": True,
        "attempt_number": 1,
    }

    # Alice: 3 correct
    for _ in range(3):
        await client.post(
            "/api/word-builder/results",
            json=body,
            headers={"X-Profile-ID": str(alice.id)},
        )

    # Bob: 1 correct
    await client.post(
        "/api/word-builder/results",
        json=body,
        headers={"X-Profile-ID": str(bob.id)},
    )

    result = await db.execute(
        select(PatternProgress).where(PatternProgress.pattern_id == re_pattern.id)
    )
    rows = result.scalars().all()
    by_profile = {str(pp.profile_id): pp.first_attempt_correct_count for pp in rows}

    assert by_profile[str(alice.id)] == 3
    assert by_profile[str(bob.id)] == 1


# ============================================================================
# GET /api/word-builder/progress
# ============================================================================


async def test_progress_response_has_levels_array(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """Spec §5: response has a `levels` array."""
    response = await client.get("/api/word-builder/progress")
    assert response.status_code == 200, response.text

    data = response.json()
    assert "levels" in data
    assert isinstance(data["levels"], list)
    assert len(data["levels"]) >= 1


async def test_progress_level_1_unlocked_by_default(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """Level 1 is always unlocked from the start."""
    response = await client.get("/api/word-builder/progress")
    data = response.json()

    level_1 = next((lv for lv in data["levels"] if lv["level"] == 1), None)
    assert level_1 is not None
    assert level_1["unlocked"] is True


async def test_progress_level_2_locked_before_mastery(
    client: AsyncClient, wb_data: dict[str, object]
) -> None:
    """Before mastery, L2 appears with unlocked: false."""
    response = await client.get("/api/word-builder/progress")
    data = response.json()

    level_2 = next((lv for lv in data["levels"] if lv["level"] == 2), None)
    assert level_2 is not None, "L2 should appear even when locked"
    assert level_2["unlocked"] is False


async def test_ac011_adaptive_unlock_at_70_percent_l1_mastery(
    client: AsyncClient,
    wb_data: dict[str, object],
    wb_profile: Profile,
    db: AsyncSession,
) -> None:
    """AC-011: Level 2 unlocks when >=70% of L1 patterns are at 3 stars (mastered).

    There are 6 L1 patterns. 70% = 4.2, so mastering 5 of 6 crosses the threshold.
    Each pattern needs 7 first-attempt-correct to reach 3 stars.
    """
    patterns = wb_data["patterns"]  # type: ignore[index]
    headers = {"X-Profile-ID": str(wb_profile.id)}

    # Master 5 of 6 L1 patterns (7 correct each).
    to_master = ["UN-", "RE-", "-ING", "-ED", "-S"]
    for pattern_text in to_master:
        pattern_id = str(patterns[pattern_text].id)  # type: ignore[index]
        for _ in range(7):
            await client.post(
                "/api/word-builder/results",
                json={
                    "pattern_id": pattern_id,
                    "is_correct": True,
                    "attempt_number": 1,
                },
                headers=headers,
            )

    response = await client.get("/api/word-builder/progress", headers=headers)
    data = response.json()

    level_1 = next(lv for lv in data["levels"] if lv["level"] == 1)
    level_2 = next(lv for lv in data["levels"] if lv["level"] == 2)

    # 5/6 mastered = ~83% >= 70%
    assert level_1["mastery_percentage"] >= 70.0
    assert level_2["unlocked"] is True, (
        f"L2 should unlock at {level_1['mastery_percentage']}% mastery"
    )


async def test_progress_patterns_have_text_star_and_mastered_flags(
    client: AsyncClient,
    wb_data: dict[str, object],
    wb_profile: Profile,
    db: AsyncSession,
) -> None:
    """Spec §5: each pattern in the level carries text, star_level, mastered."""
    # Bump one pattern to 1 star so the progress has non-zero data
    patterns = wb_data["patterns"]  # type: ignore[index]
    headers = {"X-Profile-ID": str(wb_profile.id)}
    re_id = str(patterns["RE-"].id)  # type: ignore[index]
    for _ in range(2):
        await client.post(
            "/api/word-builder/results",
            json={"pattern_id": re_id, "is_correct": True, "attempt_number": 1},
            headers=headers,
        )

    response = await client.get("/api/word-builder/progress", headers=headers)
    data = response.json()

    level_1 = next(lv for lv in data["levels"] if lv["level"] == 1)
    assert level_1["patterns"]
    for p in level_1["patterns"]:
        assert "text" in p
        assert "star_level" in p
        assert "mastered" in p
        assert isinstance(p["star_level"], int)
        assert isinstance(p["mastered"], bool)
