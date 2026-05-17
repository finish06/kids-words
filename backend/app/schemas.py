import uuid
from datetime import datetime

from pydantic import BaseModel

# --- Words & Categories ---


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
    mastery_percentage: float = 0.0

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


# --- Match Results ---


class MatchResultCreate(BaseModel):
    word_id: uuid.UUID
    selected_word_id: uuid.UUID
    is_correct: bool
    attempt_number: int


class MatchResultResponse(BaseModel):
    id: uuid.UUID
    recorded: bool
    responded_at: datetime
    star_update: "StarUpdate | None" = None

    model_config = {"from_attributes": True}


class StarUpdate(BaseModel):
    word_id: uuid.UUID
    new_count: int
    new_star_level: int
    just_mastered: bool


# --- Profiles ---


class ProfileResponse(BaseModel):
    id: uuid.UUID
    name: str
    color: str
    is_guest: bool

    model_config = {"from_attributes": True}


class ProfileListResponse(BaseModel):
    profiles: list[ProfileResponse]
    pin_set: bool
    max_profiles: int = 3


class ProfileCreate(BaseModel):
    name: str
    color: str
    pin: str


class ProfileUpdate(BaseModel):
    name: str | None = None
    color: str | None = None
    pin: str


class PinSetup(BaseModel):
    pin: str


class PinVerify(BaseModel):
    pin: str


class PinVerifyResponse(BaseModel):
    verified: bool


class ProfileDelete(BaseModel):
    pin: str


# --- Progress ---


class WordProgressResponse(BaseModel):
    word_id: uuid.UUID
    word_text: str
    image_url: str
    category_slug: str
    first_attempt_correct_count: int
    star_level: int
    mastered_at: datetime | None


class ProgressSummary(BaseModel):
    total_words: int
    mastered: int
    mastery_percentage: float
    stars_earned: int = 0
    stars_possible: int = 0


class CategoryProgressResponse(BaseModel):
    category: CategoryDetail
    words: list[WordProgressResponse]
    summary: ProgressSummary


class AllProgressResponse(BaseModel):
    progress: list[WordProgressResponse]
    summary: ProgressSummary


# --- Word Builder (M7) ---


class PatternOption(BaseModel):
    id: uuid.UUID
    text: str
    type: str  # "prefix" | "suffix"


class Challenge(BaseModel):
    base_word: str
    correct_pattern: PatternOption
    options: list[PatternOption]
    result_word: str
    definition: str


class RoundResponse(BaseModel):
    level: int
    challenges: list[Challenge]


class WordBuilderAttempt(BaseModel):
    pattern_id: uuid.UUID
    is_correct: bool
    attempt_number: int


class PatternStarUpdate(BaseModel):
    pattern_id: uuid.UUID
    new_count: int
    new_star_level: int
    just_mastered: bool


class WordBuilderResultResponse(BaseModel):
    id: uuid.UUID
    recorded: bool
    responded_at: datetime
    star_update: PatternStarUpdate | None = None


class LevelPatternProgress(BaseModel):
    text: str
    star_level: int
    mastered: bool


class LevelProgress(BaseModel):
    level: int
    unlocked: bool
    patterns: list[LevelPatternProgress]
    mastery_percentage: float


class WordBuilderProgressResponse(BaseModel):
    levels: list[LevelProgress]
    stars_earned: int = 0
    stars_possible: int = 0
