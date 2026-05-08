import uuid

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Category, Word, WordProgress


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


# --- specs/game-progress-bar.md AC-008, AC-011, AC-019, AC-022 ---


async def test_ac019_progress_summary_exposes_stars_earned_and_possible(
    seeded_client: AsyncClient,
) -> None:
    """AC-019: ProgressSummary gains stars_earned + stars_possible fields."""
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    response = await seeded_client.get(
        "/api/progress",
        headers={"X-Profile-ID": guest_id},
    )
    assert response.status_code == 200
    summary = response.json()["summary"]
    assert "stars_earned" in summary
    assert "stars_possible" in summary
    # Empty profile across 5 visible words (3 animals + 2 colors): 5 × 3 = 15
    assert summary["stars_earned"] == 0
    assert summary["stars_possible"] == 15


async def test_ac008_stars_possible_excludes_hidden_body_parts_category(
    seeded_client: AsyncClient,
    db: AsyncSession,
) -> None:
    """AC-008: Word Matching denominator excludes hidden categories.

    `body-parts` is hidden from `WordMatchingCard.tsx` (cycle-13 hide
    decision). Its words must NOT contribute to `stars_possible`.
    """
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])

    # Add hidden category alongside the existing visible seeded data
    body_parts = Category(
        id=uuid.uuid4(),
        name="Body Parts",
        slug="body-parts",
        icon_url="/images/categories/body-parts.png",
        display_order=99,
    )
    db.add(body_parts)
    await db.flush()
    db.add_all(
        [
            Word(
                id=uuid.uuid4(),
                text="HAND",
                image_url="bodypart://hand",
                category_id=body_parts.id,
            ),
            Word(
                id=uuid.uuid4(),
                text="FOOT",
                image_url="bodypart://foot",
                category_id=body_parts.id,
            ),
        ]
    )
    await db.commit()

    response = await seeded_client.get(
        "/api/progress",
        headers={"X-Profile-ID": guest_id},
    )
    assert response.status_code == 200
    summary = response.json()["summary"]
    # Visible words = 5 (3 animals + 2 colors). Body-parts (2 words) excluded.
    assert summary["stars_possible"] == 15, (
        "body-parts must not contribute to stars_possible"
    )


async def test_ac011_stars_earned_excludes_hidden_body_parts_progress(
    seeded_client: AsyncClient,
    seeded_db: dict[str, Category | Word],
    db: AsyncSession,
) -> None:
    """AC-011 + AC-008: stars_earned matches the same exclusion rule.

    A child who somehow has stars on a body-parts word (legacy data,
    backend admin tool, etc.) must not see those stars on the Word
    Matching bar — the bar shows what the kid can see.
    """
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])
    guest_uuid = uuid.UUID(guest_id)

    # Seed a body-parts category + word + 3-star progress
    body_parts = Category(
        id=uuid.uuid4(),
        name="Body Parts",
        slug="body-parts",
        icon_url="/images/categories/body-parts.png",
        display_order=99,
    )
    db.add(body_parts)
    await db.flush()
    hand = Word(
        id=uuid.uuid4(),
        text="HAND",
        image_url="bodypart://hand",
        category_id=body_parts.id,
    )
    db.add(hand)
    await db.flush()
    db.add(
        WordProgress(
            id=uuid.uuid4(),
            word_id=hand.id,
            profile_id=guest_uuid,
            first_attempt_correct_count=7,
            star_level=3,
        )
    )
    # Also earn 1 star on a visible word (cat → 2 first-attempt-correct = 1 star)
    cat_word = seeded_db["cat"]
    assert isinstance(cat_word, Word)
    db.add(
        WordProgress(
            id=uuid.uuid4(),
            word_id=cat_word.id,
            profile_id=guest_uuid,
            first_attempt_correct_count=2,
            star_level=1,
        )
    )
    await db.commit()

    response = await seeded_client.get(
        "/api/progress",
        headers={"X-Profile-ID": guest_id},
    )
    summary = response.json()["summary"]
    # Should reflect ONLY the visible-category cat star (1), not the hidden hand stars (3)
    assert summary["stars_earned"] == 1, (
        "stars_earned must exclude hidden-category progress"
    )
    assert summary["stars_possible"] == 15


async def test_ac022_stars_capped_at_possible(
    seeded_client: AsyncClient,
    seeded_db: dict[str, Category | Word],
    db: AsyncSession,
) -> None:
    """AC-022: defensive cap — even if data is anomalous, displayed
    stars_earned never exceeds stars_possible (no >100% bar)."""
    profiles = await seeded_client.get("/api/profiles")
    guest_id = next(p["id"] for p in profiles.json()["profiles"] if p["is_guest"])
    guest_uuid = uuid.UUID(guest_id)

    # Seed 5 WordProgress rows at star_level=3 (all visible words mastered)
    # then add an anomalous row with star_level=99 (data corruption simulation)
    cat_word = seeded_db["cat"]
    assert isinstance(cat_word, Word)
    db.add(
        WordProgress(
            id=uuid.uuid4(),
            word_id=cat_word.id,
            profile_id=guest_uuid,
            first_attempt_correct_count=7,
            star_level=99,  # anomaly
        )
    )
    await db.commit()

    response = await seeded_client.get(
        "/api/progress",
        headers={"X-Profile-ID": guest_id},
    )
    summary = response.json()["summary"]
    assert summary["stars_earned"] <= summary["stars_possible"], (
        "stars_earned must be capped at stars_possible (AC-022)"
    )
