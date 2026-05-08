import uuid as uuid_mod
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Category, Profile, Word, WordProgress
from app.schemas import (
    AllProgressResponse,
    CategoryDetail,
    CategoryProgressResponse,
    ProgressSummary,
    WordProgressResponse,
)

router = APIRouter(prefix="/api/progress", tags=["progress"])

DB = Annotated[AsyncSession, Depends(get_db)]

# Categories that exist in the database but are hidden from the Word Matching
# Home card (cycle-13 hide decision in `WordMatchingCard.tsx`). Their words must
# not contribute to the Word Matching progress bar (`stars_earned` /
# `stars_possible`) because the bar reflects what the kid can see.
# Promoting this to an `is_hidden` flag on `Category` is a separate cycle.
HIDDEN_CATEGORY_SLUGS: frozenset[str] = frozenset({"body-parts"})

# Per spec/word-image-matching.md the star ladder caps at 3 stars per word.
MAX_STARS_PER_WORD = 3


async def resolve_profile_id(
    db: AsyncSession, x_profile_id: str | None
) -> uuid_mod.UUID:
    """Resolve profile ID, defaulting to guest."""
    if x_profile_id:
        return uuid_mod.UUID(x_profile_id)
    result = await db.execute(select(Profile).where(Profile.is_guest.is_(True)))
    guest = result.scalar_one_or_none()
    if guest:
        return guest.id
    raise HTTPException(status_code=400, detail="No guest profile found")


def build_word_progress_response(
    word: Word, wp: WordProgress | None
) -> WordProgressResponse:
    return WordProgressResponse(
        word_id=word.id,
        word_text=word.text,
        image_url=word.image_url,
        category_slug=word.category.slug,
        first_attempt_correct_count=(wp.first_attempt_correct_count if wp else 0),
        star_level=wp.star_level if wp else 0,
        mastered_at=wp.mastered_at if wp else None,
    )


@router.get("", response_model=AllProgressResponse)
async def get_all_progress(
    db: DB,
    x_profile_id: str | None = Header(default=None),
) -> AllProgressResponse:
    profile_id = await resolve_profile_id(db, x_profile_id)

    words_result = await db.execute(select(Word).options(selectinload(Word.category)))
    all_words = words_result.scalars().all()

    progress_result = await db.execute(
        select(WordProgress).where(WordProgress.profile_id == profile_id)
    )
    progress_map = {str(wp.word_id): wp for wp in progress_result.scalars().all()}

    items = [
        build_word_progress_response(w, progress_map.get(str(w.id))) for w in all_words
    ]

    mastered = sum(1 for i in items if i.star_level >= 3)
    total = len(items)

    # Word Matching aggregate: scope to visible (non-hidden) categories so the
    # Home progress bar reflects what the kid can actually see and play.
    visible_items = [i for i in items if i.category_slug not in HIDDEN_CATEGORY_SLUGS]
    stars_possible = len(visible_items) * MAX_STARS_PER_WORD
    stars_earned = sum(min(i.star_level, MAX_STARS_PER_WORD) for i in visible_items)
    stars_earned = min(stars_earned, stars_possible)  # AC-022 defensive cap

    return AllProgressResponse(
        progress=items,
        summary=ProgressSummary(
            total_words=total,
            mastered=mastered,
            mastery_percentage=(round(mastered / total * 100, 1) if total > 0 else 0.0),
            stars_earned=stars_earned,
            stars_possible=stars_possible,
        ),
    )


@router.get("/{category_slug}", response_model=CategoryProgressResponse)
async def get_category_progress(
    category_slug: str,
    db: DB,
    x_profile_id: str | None = Header(default=None),
) -> CategoryProgressResponse:
    profile_id = await resolve_profile_id(db, x_profile_id)

    cat_result = await db.execute(
        select(Category)
        .options(selectinload(Category.words))
        .where(Category.slug == category_slug)
    )
    category = cat_result.scalar_one_or_none()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    word_ids = [w.id for w in category.words]
    progress_result = await db.execute(
        select(WordProgress).where(
            WordProgress.profile_id == profile_id,
            WordProgress.word_id.in_(word_ids),
        )
    )
    progress_map = {str(wp.word_id): wp for wp in progress_result.scalars().all()}

    items = [
        build_word_progress_response(w, progress_map.get(str(w.id)))
        for w in category.words
    ]

    mastered = sum(1 for i in items if i.star_level >= 3)
    total = len(items)

    return CategoryProgressResponse(
        category=CategoryDetail(id=category.id, name=category.name, slug=category.slug),
        words=items,
        summary=ProgressSummary(
            total_words=total,
            mastered=mastered,
            mastery_percentage=(round(mastered / total * 100, 1) if total > 0 else 0.0),
        ),
    )
