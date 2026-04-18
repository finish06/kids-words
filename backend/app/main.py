import os
import platform
import sys
import time
from datetime import UTC, datetime
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import async_session
from app.routes.categories import router as categories_router
from app.routes.profiles import router as profiles_router
from app.routes.progress import router as progress_router
from app.routes.results import router as results_router
from app.routes.word_builder import router as word_builder_router

APP_VERSION = "0.2.0"
START_TIME = datetime.now(UTC)
START_MONO = time.monotonic()

app = FastAPI(
    title="Kids Words API",
    description="Word recognition learning app for ages 4-6",
    version=APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5178",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories_router)
app.include_router(results_router)
app.include_router(profiles_router)
app.include_router(progress_router)
app.include_router(word_builder_router)


@app.get("/api/health")
async def health() -> dict[str, Any]:
    uptime = time.monotonic() - START_MONO

    # Check database
    db_dep: dict[str, Any] = {
        "name": "database",
        "status": "healthy",
        "latency_ms": None,
    }
    try:
        t0 = time.monotonic()
        async with async_session() as session:
            await session.execute(text("SELECT 1"))
        db_dep["latency_ms"] = round((time.monotonic() - t0) * 1000, 1)
    except Exception as e:
        db_dep["status"] = "unhealthy"
        db_dep["error"] = str(e)[:200]

    deps = [db_dep]
    overall = "healthy" if all(d["status"] == "healthy" for d in deps) else "degraded"

    return {
        "status": overall,
        "version": APP_VERSION,
        "uptime_seconds": round(uptime, 1),
        "start_time": START_TIME.isoformat(),
        "dependencies": deps,
    }


@app.get("/api/version")
async def version() -> dict[str, Any]:
    return {
        "version": APP_VERSION,
        "git_commit": os.environ.get("GIT_COMMIT", "dev"),
        "git_branch": os.environ.get("GIT_BRANCH", "unknown"),
        "build_date": os.environ.get("BUILD_DATE", "unknown"),
        "architecture": platform.machine(),
        "python_version": platform.python_version(),
        "hostname": platform.node(),
        "os": sys.platform,
    }
