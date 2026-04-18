"""Word Builder API (M7).

Three endpoints backing the prefix/suffix learning mode:

- `GET /api/word-builder/round` — build a round of challenges from seeded combos
- `POST /api/word-builder/results` — record an attempt + update pattern mastery
- `GET /api/word-builder/progress` — per-level mastery with adaptive unlock

Profile scoping uses the same `X-Profile-ID` header convention as
`/api/results` and `/api/progress`. Star thresholds match `WordProgress`
(2→1★, 4→2★, 7+→3★) per spec AC-012.

Adaptive unlock (AC-011): level N+1 unlocks when >= 70% of level N's
patterns are mastered (3 stars). This lives in GET /progress so the
frontend only has to read the `unlocked` flag.
"""

import random
import uuid as uuid_mod
from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import (
    BaseWord,
    Pattern,
    PatternProgress,
    Profile,
    WordCombo,
)
from app.schemas import (
    Challenge,
    LevelPatternProgress,
    LevelProgress,
    PatternOption,
    PatternStarUpdate,
    RoundResponse,
    WordBuilderAttempt,
    WordBuilderProgressResponse,
    WordBuilderResultResponse,
)

router = APIRouter(prefix="/api/word-builder", tags=["word-builder"])

DB = Annotated[AsyncSession, Depends(get_db)]

UNLOCK_THRESHOLD_PERCENT = 70.0


async def resolve_profile_id(
    db: AsyncSession, x_profile_id: str | None
) -> uuid_mod.UUID:
    """Resolve profile ID, defaulting to guest (per project convention)."""
    if x_profile_id:
        return uuid_mod.UUID(x_profile_id)
    result = await db.execute(select(Profile).where(Profile.is_guest.is_(True)))
    guest = result.scalar_one_or_none()
    if guest:
        return guest.id
    raise HTTPException(status_code=400, detail="No guest profile found")


async def _max_unlocked_level(db: AsyncSession, profile_id: uuid_mod.UUID) -> int:
    """Highest level unlocked for this profile. Level 1 is always unlocked."""
    # Gather patterns by level
    patterns_by_level: dict[int, list[uuid_mod.UUID]] = {}
    pat_result = await db.execute(select(Pattern))
    for p in pat_result.scalars().all():
        patterns_by_level.setdefault(p.level, []).append(p.id)

    if not patterns_by_level:
        return 1

    # Gather progress
    prog_result = await db.execute(
        select(PatternProgress).where(PatternProgress.profile_id == profile_id)
    )
    progress_by_pattern = {pp.pattern_id: pp for pp in prog_result.scalars().all()}

    # Walk levels in order, unlocking the next when prev >= threshold
    max_unlocked = 1
    for level in sorted(patterns_by_level.keys()):
        pattern_ids = patterns_by_level[level]
        total = len(pattern_ids)
        if total == 0:
            continue
        mastered = sum(
            1
            for pid in pattern_ids
            if (pp := progress_by_pattern.get(pid)) and pp.star_level >= 3
        )
        pct = (mastered / total) * 100.0
        if pct >= UNLOCK_THRESHOLD_PERCENT and level + 1 in patterns_by_level:
            max_unlocked = level + 1
        else:
            break
    return max_unlocked


@router.get("/round", response_model=RoundResponse)
async def get_round(
    db: DB,
    x_profile_id: str | None = Header(default=None),
    level: int | None = None,
    count: int = 5,
) -> RoundResponse:
    """Build a round of `count` challenges at the given (or auto-detected) level.

    If `level` is omitted, uses the highest level currently unlocked for this
    profile. Each challenge bundles a base word, the correct pattern, and 2-3
    options drawn from the same level as distractors.
    """
    profile_id = await resolve_profile_id(db, x_profile_id)

    resolved_level = (
        level if level is not None else await _max_unlocked_level(db, profile_id)
    )

    # Pull all patterns at this level (for distractor sampling)
    level_patterns_result = await db.execute(
        select(Pattern).where(Pattern.level == resolved_level)
    )
    level_patterns: list[Pattern] = list(level_patterns_result.scalars().all())
    if not level_patterns:
        return RoundResponse(level=resolved_level, challenges=[])

    pattern_by_id = {p.id: p for p in level_patterns}

    # Pull combos whose pattern is at this level, eagerly fetching the base_word
    combos_result = await db.execute(
        select(WordCombo, BaseWord, Pattern)
        .join(BaseWord, WordCombo.base_word_id == BaseWord.id)
        .join(Pattern, WordCombo.pattern_id == Pattern.id)
        .where(Pattern.level == resolved_level)
    )
    combo_rows = list(combos_result.all())
    if not combo_rows:
        return RoundResponse(level=resolved_level, challenges=[])

    # Sample `count` combos (with replacement when pool < count, per spec §7 note
    # "Child picks 20 but level has fewer combos" — we cap at available but allow
    # the larger counts to repeat combos rather than shrink the round).
    chosen_rows = random.choices(combo_rows, k=count)

    challenges: list[Challenge] = []
    for combo, base_word, correct_pattern in chosen_rows:
        # Options: correct + 1-2 distractors from same-level patterns (!= correct)
        distractor_pool = [p for p in level_patterns if p.id != correct_pattern.id]
        distractor_count = min(2, len(distractor_pool))
        distractors = random.sample(distractor_pool, k=distractor_count)

        option_patterns = [correct_pattern, *distractors]
        random.shuffle(option_patterns)

        challenges.append(
            Challenge(
                base_word=base_word.text,
                correct_pattern=PatternOption(
                    id=correct_pattern.id,
                    text=correct_pattern.text,
                    type=correct_pattern.type,
                ),
                options=[
                    PatternOption(id=p.id, text=p.text, type=p.type)
                    for p in option_patterns
                ],
                result_word=combo.result_word,
                definition=combo.definition or "",
            )
        )

    # Silence unused-warning on lookup dict (kept for future per-combo metadata)
    _ = pattern_by_id

    return RoundResponse(level=resolved_level, challenges=challenges)


@router.post("/results", response_model=WordBuilderResultResponse, status_code=201)
async def record_result(
    body: WordBuilderAttempt,
    db: DB,
    x_profile_id: str | None = Header(default=None),
) -> WordBuilderResultResponse:
    """Record a word-building attempt + update pattern mastery.

    Star level updates only on first-attempt-correct (AC-004 spec parity with
    the word-matching flow). Retry attempts (attempt_number > 1) don't count
    toward mastery even when correct.
    """
    # Validate pattern exists
    pat_result = await db.execute(select(Pattern).where(Pattern.id == body.pattern_id))
    pattern = pat_result.scalar_one_or_none()
    if pattern is None:
        raise HTTPException(status_code=404, detail="Pattern not found")

    profile_id = await resolve_profile_id(db, x_profile_id)

    star_update: PatternStarUpdate | None = None
    if body.is_correct and body.attempt_number == 1:
        pp_result = await db.execute(
            select(PatternProgress).where(
                PatternProgress.pattern_id == body.pattern_id,
                PatternProgress.profile_id == profile_id,
            )
        )
        pp = pp_result.scalar_one_or_none()

        if pp is None:
            pp = PatternProgress(
                pattern_id=body.pattern_id,
                profile_id=profile_id,
                first_attempt_correct_count=0,
            )
            db.add(pp)

        pp.first_attempt_correct_count += 1
        new_level = PatternProgress.compute_star_level(pp.first_attempt_correct_count)
        just_mastered = new_level == 3 and pp.star_level < 3
        pp.star_level = new_level

        if just_mastered and pp.mastered_at is None:
            pp.mastered_at = datetime.now(UTC)

        star_update = PatternStarUpdate(
            pattern_id=body.pattern_id,
            new_count=pp.first_attempt_correct_count,
            new_star_level=new_level,
            just_mastered=just_mastered,
        )

    await db.commit()

    return WordBuilderResultResponse(
        id=uuid_mod.uuid4(),
        recorded=True,
        responded_at=datetime.now(UTC),
        star_update=star_update,
    )


@router.get("/progress", response_model=WordBuilderProgressResponse)
async def get_progress(
    db: DB,
    x_profile_id: str | None = Header(default=None),
) -> WordBuilderProgressResponse:
    """Return per-level mastery with adaptive unlock flags.

    Level 1 is always unlocked. Level N+1 unlocks when level N's
    `mastery_percentage >= 70%` (AC-011).
    """
    profile_id = await resolve_profile_id(db, x_profile_id)

    # All patterns grouped by level
    all_patterns_result = await db.execute(select(Pattern).order_by(Pattern.level))
    all_patterns: list[Pattern] = list(all_patterns_result.scalars().all())

    patterns_by_level: dict[int, list[Pattern]] = {}
    for p in all_patterns:
        patterns_by_level.setdefault(p.level, []).append(p)

    # Progress for this profile
    prog_result = await db.execute(
        select(PatternProgress).where(PatternProgress.profile_id == profile_id)
    )
    progress_by_pattern = {pp.pattern_id: pp for pp in prog_result.scalars().all()}

    levels_out: list[LevelProgress] = []
    prev_level_pct = 100.0  # L1 is always unlocked → treat prior as met
    for level in sorted(patterns_by_level.keys()):
        patterns = patterns_by_level[level]
        total = len(patterns)
        mastered = sum(
            1
            for p in patterns
            if (pp := progress_by_pattern.get(p.id)) and pp.star_level >= 3
        )
        pct = (mastered / total * 100.0) if total > 0 else 0.0

        unlocked = (level == 1) or (prev_level_pct >= UNLOCK_THRESHOLD_PERCENT)
        prev_level_pct = pct

        level_patterns_out = [
            LevelPatternProgress(
                text=p.text,
                star_level=(
                    progress_by_pattern[p.id].star_level
                    if p.id in progress_by_pattern
                    else 0
                ),
                mastered=(
                    p.id in progress_by_pattern
                    and progress_by_pattern[p.id].star_level >= 3
                ),
            )
            for p in patterns
        ]

        levels_out.append(
            LevelProgress(
                level=level,
                unlocked=unlocked,
                patterns=level_patterns_out,
                mastery_percentage=round(pct, 1),
            )
        )

    return WordBuilderProgressResponse(levels=levels_out)
