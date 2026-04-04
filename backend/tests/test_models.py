import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Category, MatchResult, Word


async def test_create_category(db: AsyncSession) -> None:
    category = Category(name="Animals", slug="animals", display_order=1)
    db.add(category)
    await db.commit()

    result = await db.execute(select(Category).where(Category.slug == "animals"))
    saved = result.scalar_one()
    assert saved.name == "Animals"
    assert saved.slug == "animals"
    assert saved.id is not None


async def test_create_word_with_category(db: AsyncSession) -> None:
    category = Category(name="Animals", slug="animals", display_order=1)
    db.add(category)
    await db.flush()

    word = Word(text="CAT", image_url="/images/cat.png", category_id=category.id)
    db.add(word)
    await db.commit()

    result = await db.execute(select(Word).where(Word.text == "CAT"))
    saved = result.scalar_one()
    assert saved.text == "CAT"
    assert saved.image_url == "/images/cat.png"
    assert saved.category_id == category.id


async def test_category_word_relationship(db: AsyncSession) -> None:
    category = Category(name="Animals", slug="animals", display_order=1)
    db.add(category)
    await db.flush()

    word1 = Word(text="CAT", image_url="/images/cat.png", category_id=category.id)
    word2 = Word(text="DOG", image_url="/images/dog.png", category_id=category.id)
    db.add_all([word1, word2])
    await db.commit()

    result = await db.execute(select(Category).where(Category.slug == "animals"))
    saved_cat = result.scalar_one()
    assert len(saved_cat.words) == 2
    word_texts = {w.text for w in saved_cat.words}
    assert word_texts == {"CAT", "DOG"}


async def test_create_match_result(db: AsyncSession) -> None:
    category = Category(name="Animals", slug="animals", display_order=1)
    db.add(category)
    await db.flush()

    cat_word = Word(text="CAT", image_url="/images/cat.png", category_id=category.id)
    dog_word = Word(text="DOG", image_url="/images/dog.png", category_id=category.id)
    db.add_all([cat_word, dog_word])
    await db.flush()

    result = MatchResult(
        word_id=cat_word.id,
        selected_word_id=dog_word.id,
        is_correct=False,
        attempt_number=1,
    )
    db.add(result)
    await db.commit()

    saved = await db.execute(
        select(MatchResult).where(MatchResult.word_id == cat_word.id)
    )
    match = saved.scalar_one()
    assert match.is_correct is False
    assert match.attempt_number == 1
    assert match.selected_word_id == dog_word.id


async def test_match_result_relationships(db: AsyncSession) -> None:
    category = Category(name="Animals", slug="animals", display_order=1)
    db.add(category)
    await db.flush()

    cat_word = Word(text="CAT", image_url="/images/cat.png", category_id=category.id)
    db.add(cat_word)
    await db.flush()

    result = MatchResult(
        word_id=cat_word.id,
        selected_word_id=cat_word.id,
        is_correct=True,
        attempt_number=1,
    )
    db.add(result)
    await db.commit()

    # Word should have results
    word_result = await db.execute(select(Word).where(Word.id == cat_word.id))
    saved_word = word_result.scalar_one()
    assert len(saved_word.results) == 1
    assert saved_word.results[0].is_correct is True


async def test_category_uuid_generation(db: AsyncSession) -> None:
    cat1 = Category(name="A", slug="a", display_order=1)
    cat2 = Category(name="B", slug="b", display_order=2)
    db.add_all([cat1, cat2])
    await db.commit()
    assert isinstance(cat1.id, uuid.UUID)
    assert isinstance(cat2.id, uuid.UUID)
    assert cat1.id != cat2.id
