import uuid
from datetime import datetime

from pydantic import BaseModel


class WordResponse(BaseModel):
    id: uuid.UUID
    text: str
    image_url: str

    model_config = {"from_attributes": True}


class CategorySummary(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    icon_url: str | None
    display_order: int
    word_count: int

    model_config = {"from_attributes": True}


class CategoryListResponse(BaseModel):
    categories: list[CategorySummary]


class CategoryDetail(BaseModel):
    id: uuid.UUID
    name: str
    slug: str

    model_config = {"from_attributes": True}


class CategoryWordsResponse(BaseModel):
    category: CategoryDetail
    words: list[WordResponse]


class MatchResultCreate(BaseModel):
    word_id: uuid.UUID
    selected_word_id: uuid.UUID
    is_correct: bool
    attempt_number: int


class MatchResultResponse(BaseModel):
    id: uuid.UUID
    recorded: bool
    responded_at: datetime

    model_config = {"from_attributes": True}
