from httpx import AsyncClient

from app.models import Category, Word


async def test_progress_empty(
    seeded_client: AsyncClient,
) -> None:
    # Get guest profile first
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    response = await seeded_client.get(
        "/api/progress",
        headers={"X-Profile-ID": guest_id},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["summary"]["mastered"] == 0
    assert len(data["progress"]) > 0
    assert all(p["star_level"] == 0 for p in data["progress"])


async def test_progress_after_correct_answer(
    seeded_client: AsyncClient,
    seeded_db: dict[str, Category | list[Word]],
) -> None:
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    cat_word: Word = seeded_db["cat"]  # type: ignore[assignment]

    # Record 2 first-attempt correct answers → should earn 1 star
    for _ in range(2):
        await seeded_client.post(
            "/api/results",
            json={
                "word_id": str(cat_word.id),
                "selected_word_id": str(cat_word.id),
                "is_correct": True,
                "attempt_number": 1,
            },
            headers={"X-Profile-ID": guest_id},
        )

    response = await seeded_client.get(
        "/api/progress/animals",
        headers={"X-Profile-ID": guest_id},
    )
    assert response.status_code == 200
    data = response.json()
    cat_progress = next(p for p in data["words"] if p["word_text"] == "CAT")
    assert cat_progress["first_attempt_correct_count"] == 2
    assert cat_progress["star_level"] == 1


async def test_star_update_in_result_response(
    seeded_client: AsyncClient,
    seeded_db: dict[str, Category | list[Word]],
) -> None:
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    cat_word: Word = seeded_db["cat"]  # type: ignore[assignment]

    # First correct answer
    response = await seeded_client.post(
        "/api/results",
        json={
            "word_id": str(cat_word.id),
            "selected_word_id": str(cat_word.id),
            "is_correct": True,
            "attempt_number": 1,
        },
        headers={"X-Profile-ID": guest_id},
    )
    data = response.json()
    assert data["star_update"] is not None
    assert data["star_update"]["new_count"] == 1
    assert data["star_update"]["new_star_level"] == 0


async def test_retry_does_not_count(
    seeded_client: AsyncClient,
    seeded_db: dict[str, Category | list[Word]],
) -> None:
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    cat_word: Word = seeded_db["cat"]  # type: ignore[assignment]
    dog_word: Word = seeded_db["dog"]  # type: ignore[assignment]

    # Incorrect, then correct on attempt 2
    await seeded_client.post(
        "/api/results",
        json={
            "word_id": str(cat_word.id),
            "selected_word_id": str(dog_word.id),
            "is_correct": False,
            "attempt_number": 1,
        },
        headers={"X-Profile-ID": guest_id},
    )
    response = await seeded_client.post(
        "/api/results",
        json={
            "word_id": str(cat_word.id),
            "selected_word_id": str(cat_word.id),
            "is_correct": True,
            "attempt_number": 2,
        },
        headers={"X-Profile-ID": guest_id},
    )
    # Attempt 2 should not have star_update
    assert response.json()["star_update"] is None


async def test_mastery_at_seven(
    seeded_client: AsyncClient,
    seeded_db: dict[str, Category | list[Word]],
) -> None:
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    cat_word: Word = seeded_db["cat"]  # type: ignore[assignment]

    last_response = None
    for _ in range(7):
        last_response = await seeded_client.post(
            "/api/results",
            json={
                "word_id": str(cat_word.id),
                "selected_word_id": str(cat_word.id),
                "is_correct": True,
                "attempt_number": 1,
            },
            headers={"X-Profile-ID": guest_id},
        )

    assert last_response is not None
    data = last_response.json()
    assert data["star_update"]["new_star_level"] == 3
    assert data["star_update"]["just_mastered"] is True


async def test_category_progress_not_found(
    seeded_client: AsyncClient,
) -> None:
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    response = await seeded_client.get(
        "/api/progress/nonexistent",
        headers={"X-Profile-ID": guest_id},
    )
    assert response.status_code == 404
