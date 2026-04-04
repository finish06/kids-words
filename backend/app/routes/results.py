from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import MatchResult, Word
from app.schemas import MatchResultCreate, MatchResultResponse

router = APIRouter(prefix="/api/results", tags=["results"])

DB = Annotated[AsyncSession, Depends(get_db)]


@router.post("", response_model=MatchResultResponse, status_code=201)
async def create_result(body: MatchResultCreate, db: DB) -> MatchResultResponse:
    word_result = await db.execute(select(Word).where(Word.id == body.word_id))
    if word_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Target word not found")

    selected_result = await db.execute(
        select(Word).where(Word.id == body.selected_word_id)
    )
    if selected_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=404, detail="Selected word not found")

    match_result = MatchResult(
        word_id=body.word_id,
        selected_word_id=body.selected_word_id,
        is_correct=body.is_correct,
        attempt_number=body.attempt_number,
    )
    db.add(match_result)
    await db.commit()
    await db.refresh(match_result)

    return MatchResultResponse(
        id=match_result.id,
        recorded=True,
        responded_at=match_result.responded_at,
    )
