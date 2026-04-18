#!/bin/sh
set -e

echo "Running database migrations..."
# Stamp current revision if alembic_version table doesn't exist
# but data tables do (handles adoption of migrations on existing DB)
python -c "
import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings

async def check():
    engine = create_async_engine(settings.database_url)
    async with engine.connect() as conn:
        # Check if alembic_version exists
        result = await conn.execute(text(
            \"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alembic_version')\"
        ))
        has_alembic = result.scalar()

        # Check if data tables exist
        result = await conn.execute(text(
            \"SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories')\"
        ))
        has_data = result.scalar()

        if has_data and not has_alembic:
            print('STAMP_NEEDED')
        else:
            print('OK')
    await engine.dispose()

print(asyncio.run(check()))
" 2>&1 | grep -q "STAMP_NEEDED" && {
    echo "Existing database detected without migration history. Stamping..."
    alembic stamp head
}

alembic upgrade head
echo "Migrations complete."

echo "Running seed (idempotent — adds missing categories/words only)..."
python -m app.seed
echo "Seed complete."

echo "Running word-builder seed (idempotent — L1 patterns/combos)..."
python -m app.seed_word_builder
echo "Word-builder seed complete."

echo "Starting server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
