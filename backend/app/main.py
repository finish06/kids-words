from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.categories import router as categories_router
from app.routes.results import router as results_router

app = FastAPI(
    title="Kids Words API",
    description="Word recognition learning app for ages 4-6",
    version="0.1.0",
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


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
