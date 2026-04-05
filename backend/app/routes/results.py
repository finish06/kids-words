import uuid as uuid_mod
from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import MatchResult, Profile, Word, WordProgress
from app.schemas import (
    MatchResultCreate,
    MatchResultResponse,
    StarUpdate,
)

router = APIRouter(prefix="/api/results", tags=["results"])

DB = Annotated[AsyncSession, Depends(get_db)]


async def resolve_profile_id(
    db: AsyncSession, x_profile_id: str | None
) -> uuid_mod.UUID | None:
    if x_profile_id:
        return uuid_mod.UUID(x_profile_id)
    result = await db.execute(select(Profile).where(Profile.is_guest.is_(True)))
    guest = result.scalar_one_or_none()
    return guest.id if guest else None


@router.post("", response_model=MatchResultResponse, status_code=201)
async def create_result(
    body: MatchResultCreate,
    db: DB,
    x_profile_id: str | None = Header(default=None),
) -> MatchResultResponse:
    word_result = await db.execute(select(Word).where(Word.id == body.word_id))
    if word_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Target word not found")

    selected_result = await db.execute(
        select(Word).where(Word.id == body.selected_word_id)
    )
    if selected_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Selected word not found")

    profile_id = await resolve_profile_id(db, x_profile_id)

    match_result = MatchResult(
        word_id=body.word_id,
        selected_word_id=body.selected_word_id,
        profile_id=profile_id,
        is_correct=body.is_correct,
        attempt_number=body.attempt_number,
    )
    db.add(match_result)

    # Update WordProgress on first-attempt correct
    star_update = None
    if body.is_correct and body.attempt_number == 1 and profile_id:
        wp_result = await db.execute(
            select(WordProgress).where(
                WordProgress.word_id == body.word_id,
                WordProgress.profile_id == profile_id,
            )
        )
        wp = wp_result.scalar_one_or_none()

        if wp is None:
            wp = WordProgress(
                word_id=body.word_id,
                profile_id=profile_id,
                first_attempt_correct_count=0,
            )
            db.add(wp)

        wp.first_attempt_correct_count += 1
        new_level = WordProgress.compute_star_level(wp.first_attempt_correct_count)
        just_mastered = new_level == 3 and wp.star_level < 3
        wp.star_level = new_level

        if just_mastered and wp.mastered_at is None:
            wp.mastered_at = datetime.now(UTC)

        star_update = StarUpdate(
            word_id=body.word_id,
            new_count=wp.first_attempt_correct_count,
            new_star_level=new_level,
            just_mastered=just_mastered,
        )

    await db.commit()
    await db.refresh(match_result)

    return MatchResultResponse(
        id=match_result.id,
        recorded=True,
        responded_at=match_result.responded_at,
        star_update=star_update,
    )
