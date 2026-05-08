import uuid
from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.database import get_db
from app.main import app
from app.models import Base, Category, Profile, Word

TEST_DB_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(TEST_DB_URL, echo=False)
test_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(autouse=True)
async def setup_db() -> AsyncGenerator[None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def db() -> AsyncGenerator[AsyncSession]:
    async with test_session() as session:
        yield session


@pytest.fixture
async def client(
    db: AsyncSession,
) -> AsyncGenerator[AsyncClient]:
    async def override_get_db() -> AsyncGenerator[AsyncSession]:
        async with test_session() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
async def seeded_db(
    db: AsyncSession,
) -> dict[str, Category | Word | Profile]:
    """Seed test database with sample categories and words."""
    guest = Profile(
        id=uuid.uuid4(),
        name="Guest",
        color="#9ca3af",
        is_guest=True,
    )
    db.add(guest)
    await db.flush()

    animals = Category(
        id=uuid.uuid4(),
        name="Animals",
        slug="animals",
        icon_url="/images/categories/animals.png",
        display_order=1,
    )
    colors = Category(
        id=uuid.uuid4(),
        name="Colors",
        slug="colors",
        icon_url="/images/categories/colors.png",
        display_order=2,
    )
    db.add_all([animals, colors])
    await db.flush()

    cat_word = Word(
        id=uuid.uuid4(),
        text="CAT",
        image_url="/images/words/cat.png",
        category_id=animals.id,
    )
    dog_word = Word(
        id=uuid.uuid4(),
        text="DOG",
        image_url="/images/words/dog.png",
        category_id=animals.id,
    )
    fish_word = Word(
        id=uuid.uuid4(),
        text="FISH",
        image_url="/images/words/fish.png",
        category_id=animals.id,
    )
    red_word = Word(
        id=uuid.uuid4(),
        text="RED",
        image_url="/images/words/red.png",
        category_id=colors.id,
    )
    blue_word = Word(
        id=uuid.uuid4(),
        text="BLUE",
        image_url="/images/words/blue.png",
        category_id=colors.id,
    )

    all_words = [cat_word, dog_word, fish_word, red_word, blue_word]
    db.add_all(all_words)
    await db.commit()

    return {
        "animals": animals,
        "colors": colors,
        "cat": cat_word,
        "dog": dog_word,
        "fish": fish_word,
        "red": red_word,
        "blue": blue_word,
        "guest": guest,
    }


@pytest.fixture
async def seeded_client(
    seeded_db: dict[str, Category | Word | Profile],
) -> AsyncGenerator[AsyncClient]:
    async def override_get_db() -> AsyncGenerator[AsyncSession]:
        async with test_session() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()
