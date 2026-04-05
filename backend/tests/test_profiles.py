from httpx import AsyncClient


async def test_list_profiles_creates_guest(client: AsyncClient) -> None:
    response = await client.get("/api/profiles")
    assert response.status_code == 200
    data = response.json()
    assert len(data["profiles"]) == 1
    assert data["profiles"][0]["is_guest"] is True
    assert data["profiles"][0]["name"] == "Guest"
    assert data["pin_set"] is False
    assert data["max_profiles"] == 3


async def test_setup_pin(client: AsyncClient) -> None:
    response = await client.post("/api/profiles/setup", json={"pin": "1234"})
    assert response.status_code == 201
    assert response.json()["message"] == "PIN set successfully"


async def test_setup_pin_duplicate(client: AsyncClient) -> None:
    await client.post("/api/profiles/setup", json={"pin": "1234"})
    response = await client.post("/api/profiles/setup", json={"pin": "5678"})
    assert response.status_code == 409


async def test_verify_pin_correct(client: AsyncClient) -> None:
    await client.post("/api/profiles/setup", json={"pin": "1234"})
    response = await client.post("/api/profiles/verify-pin", json={"pin": "1234"})
    assert response.status_code == 200
    assert response.json()["verified"] is True


async def test_verify_pin_incorrect(client: AsyncClient) -> None:
    await client.post("/api/profiles/setup", json={"pin": "1234"})
    response = await client.post("/api/profiles/verify-pin", json={"pin": "9999"})
    assert response.status_code == 401


async def test_create_profile(client: AsyncClient) -> None:
    await client.post("/api/profiles/setup", json={"pin": "1234"})
    response = await client.post(
        "/api/profiles",
        json={"name": "Emma", "color": "#3b82f6", "pin": "1234"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Emma"
    assert data["color"] == "#3b82f6"
    assert data["is_guest"] is False


async def test_create_profile_wrong_pin(client: AsyncClient) -> None:
    await client.post("/api/profiles/setup", json={"pin": "1234"})
    response = await client.post(
        "/api/profiles",
        json={"name": "Emma", "color": "#3b82f6", "pin": "9999"},
    )
    assert response.status_code == 401


async def test_create_profile_max_limit(client: AsyncClient) -> None:
    await client.post("/api/profiles/setup", json={"pin": "1234"})
    for i in range(3):
        await client.post(
            "/api/profiles",
            json={
                "name": f"Child{i}",
                "color": "#3b82f6",
                "pin": "1234",
            },
        )
    response = await client.post(
        "/api/profiles",
        json={"name": "Extra", "color": "#3b82f6", "pin": "1234"},
    )
    assert response.status_code == 409
    assert "Maximum" in response.json()["detail"]


async def test_list_profiles_with_children(
    client: AsyncClient,
) -> None:
    await client.post("/api/profiles/setup", json={"pin": "1234"})
    await client.post(
        "/api/profiles",
        json={"name": "Emma", "color": "#3b82f6", "pin": "1234"},
    )
    response = await client.get("/api/profiles")
    data = response.json()
    # Guest + Emma
    assert len(data["profiles"]) == 2
    assert data["pin_set"] is True
    names = {p["name"] for p in data["profiles"]}
    assert names == {"Guest", "Emma"}


async def test_delete_profile(client: AsyncClient) -> None:
    await client.post("/api/profiles/setup", json={"pin": "1234"})
    create_resp = await client.post(
        "/api/profiles",
        json={"name": "Emma", "color": "#3b82f6", "pin": "1234"},
    )
    profile_id = create_resp.json()["id"]
    response = await client.request(
        "DELETE",
        f"/api/profiles/{profile_id}",
        json={"pin": "1234"},
    )
    assert response.status_code == 204
