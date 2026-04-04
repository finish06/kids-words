from httpx import AsyncClient


async def test_list_categories_empty(client: AsyncClient) -> None:
    response = await client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert data["categories"] == []


async def test_list_categories_with_data(seeded_client: AsyncClient) -> None:
    response = await seeded_client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    categories = data["categories"]
    assert len(categories) == 2
    # Should be ordered by display_order
    assert categories[0]["name"] == "Animals"
    assert categories[0]["slug"] == "animals"
    assert categories[0]["word_count"] == 3
    assert categories[1]["name"] == "Colors"
    assert categories[1]["slug"] == "colors"
    assert categories[1]["word_count"] == 2


async def test_list_categories_has_required_fields(seeded_client: AsyncClient) -> None:
    response = await seeded_client.get("/api/categories")
    data = response.json()
    cat = data["categories"][0]
    assert "id" in cat
    assert "name" in cat
    assert "slug" in cat
    assert "icon_url" in cat
    assert "display_order" in cat
    assert "word_count" in cat


async def test_get_category_words(seeded_client: AsyncClient) -> None:
    response = await seeded_client.get("/api/categories/animals/words")
    assert response.status_code == 200
    data = response.json()
    assert data["category"]["name"] == "Animals"
    assert data["category"]["slug"] == "animals"
    assert len(data["words"]) == 3
    word_texts = {w["text"] for w in data["words"]}
    assert word_texts == {"CAT", "DOG", "FISH"}


async def test_get_category_words_has_required_fields(
    seeded_client: AsyncClient,
) -> None:
    response = await seeded_client.get("/api/categories/animals/words")
    data = response.json()
    word = data["words"][0]
    assert "id" in word
    assert "text" in word
    assert "image_url" in word


async def test_get_category_words_not_found(seeded_client: AsyncClient) -> None:
    response = await seeded_client.get("/api/categories/nonexistent/words")
    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found"


async def test_get_category_words_shuffled(seeded_client: AsyncClient) -> None:
    """Words should be returned in some order (randomized). Run multiple times to verify
    they're not always in the same order. Since there are 3 words, probability of same
    order twice is 1/6, so we try several times."""
    orders = set()
    for _ in range(10):
        response = await seeded_client.get("/api/categories/animals/words")
        data = response.json()
        order = tuple(w["text"] for w in data["words"])
        orders.add(order)
    # With 10 tries, extremely unlikely to get same order every time
    assert len(orders) > 1, "Words appear to not be shuffled"
