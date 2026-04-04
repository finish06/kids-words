import random
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Category
from app.schemas import (
    CategoryDetail,
    CategoryListResponse,
    CategorySummary,
    CategoryWordsResponse,
    WordResponse,
)

router = APIRouter(prefix="/api/categories", tags=["categories"])

DB = Annotated[AsyncSession, Depends(get_db)]


@router.get("", response_model=CategoryListResponse)
async def list_categories(db: DB) -> CategoryListResponse:
    result = await db.execute(
        select(Category)
        .options(selectinload(Category.words))
        .order_by(Category.display_order)
    )
    categories = result.scalars().all()

    return CategoryListResponse(
        categories=[
            CategorySummary(
                id=cat.id,
                name=cat.name,
                slug=cat.slug,
                icon_url=cat.icon_url,
                display_order=cat.display_order,
                word_count=len(cat.words),
            )
            for cat in categories
        ]
    )


@router.get("/{slug}/words", response_model=CategoryWordsResponse)
async def get_category_words(slug: str, db: DB) -> CategoryWordsResponse:
    result = await db.execute(
        select(Category)
        .options(selectinload(Category.words))
        .where(Category.slug == slug)
    )
    category = result.scalar_one_or_none()

    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    words = [
        WordResponse(id=w.id, text=w.text, image_url=w.image_url)
        for w in category.words
    ]
    random.shuffle(words)

    return CategoryWordsResponse(
        category=CategoryDetail(
            id=category.id,
            name=category.name,
            slug=category.slug,
        ),
        words=words,
    )
