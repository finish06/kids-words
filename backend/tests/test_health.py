from httpx import AsyncClient


async def test_health_endpoint(client: AsyncClient) -> None:
    response = await client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("healthy", "degraded")
    assert "version" in data
    assert "uptime_seconds" in data
    assert "start_time" in data
    assert "dependencies" in data
    assert isinstance(data["dependencies"], list)


async def test_health_has_database_dependency(client: AsyncClient) -> None:
    response = await client.get("/api/health")
    data = response.json()
    db_dep = next(
        (d for d in data["dependencies"] if d["name"] == "database"), None
    )
    assert db_dep is not None
    assert db_dep["status"] in ("healthy", "unhealthy")


async def test_version_endpoint(client: AsyncClient) -> None:
    response = await client.get("/api/version")
    assert response.status_code == 200
    data = response.json()
    assert "version" in data
    assert "git_commit" in data
    assert "git_branch" in data
    assert "build_date" in data
    assert "architecture" in data
    assert "python_version" in data
    assert "hostname" in data
    assert "os" in data
