import uuid

from httpx import AsyncClient

from app.models import Category, Word


async def test_create_result_correct(
    seeded_client: AsyncClient, seeded_db: dict[str, Category | Word]
) -> None:
    cat_word: Word = seeded_db["cat"]  # type: ignore[assignment]
    response = await seeded_client.post(
        "/api/results",
        json={
            "word_id": str(cat_word.id),
            "selected_word_id": str(cat_word.id),
            "is_correct": True,
            "attempt_number": 1,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["recorded"] is True
    assert "id" in data
    assert "responded_at" in data


async def test_create_result_incorrect(
    seeded_client: AsyncClient, seeded_db: dict[str, Category | Word]
) -> None:
    cat_word: Word = seeded_db["cat"]  # type: ignore[assignment]
    dog_word: Word = seeded_db["dog"]  # type: ignore[assignment]
    response = await seeded_client.post(
        "/api/results",
        json={
            "word_id": str(cat_word.id),
            "selected_word_id": str(dog_word.id),
            "is_correct": False,
            "attempt_number": 1,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["recorded"] is True


async def test_create_result_word_not_found(seeded_client: AsyncClient) -> None:
    fake_id = str(uuid.uuid4())
    response = await seeded_client.post(
        "/api/results",
        json={
            "word_id": fake_id,
            "selected_word_id": fake_id,
            "is_correct": True,
            "attempt_number": 1,
        },
    )
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


async def test_create_result_invalid_body(seeded_client: AsyncClient) -> None:
    response = await seeded_client.post(
        "/api/results",
        json={"word_id": "not-a-uuid"},
    )
    assert response.status_code == 422


async def test_create_result_multiple_attempts(
    seeded_client: AsyncClient, seeded_db: dict[str, Category | Word]
) -> None:
    cat_word: Word = seeded_db["cat"]  # type: ignore[assignment]
    dog_word: Word = seeded_db["dog"]  # type: ignore[assignment]

    # First attempt: incorrect
    resp1 = await seeded_client.post(
        "/api/results",
        json={
            "word_id": str(cat_word.id),
            "selected_word_id": str(dog_word.id),
            "is_correct": False,
            "attempt_number": 1,
        },
    )
    assert resp1.status_code == 201

    # Second attempt: correct
    resp2 = await seeded_client.post(
        "/api/results",
        json={
            "word_id": str(cat_word.id),
            "selected_word_id": str(cat_word.id),
            "is_correct": True,
            "attempt_number": 2,
        },
    )
    assert resp2.status_code == 201
