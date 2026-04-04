# Staging Deployment Guide

## Infrastructure

| Item | Value |
|------|-------|
| Host | staging1 — 192.168.1.145 |
| User | finish06 |
| Work dir | /opt/kids-words/ |
| URL | https://kids-words.staging.calebdunn.tech |
| Network | External `internal` (Pangolin/Newt) |
| Registry | dockerhub.calebdunn.tech |
| Images | kids-words-backend, kids-words-frontend |

## First-Time Setup

```bash
# SSH into staging1
ssh finish06@192.168.1.145

# Create project directory
sudo mkdir -p /opt/kids-words
sudo chown finish06:finish06 /opt/kids-words
cd /opt/kids-words

# Login to private registry
docker login dockerhub.calebdunn.tech -u finish06

# Copy compose and env files
# (scp from dev machine, or clone repo)
scp docker-compose.staging.yml finish06@192.168.1.145:/opt/kids-words/docker-compose.yml
scp .env.staging.example finish06@192.168.1.145:/opt/kids-words/.env

# Edit .env on staging1 — set real passwords
nano /opt/kids-words/.env

# Set IMAGE_TAG to latest beta
# Find latest tag: check GitHub Actions or registry
IMAGE_TAG=beta-8b28892  # replace with actual sha

# Start services
docker compose up -d

# Seed the database
docker compose exec backend python -m app.seed

# Configure Pangolin/Newt route
# Add kids-words.staging.calebdunn.tech → frontend:80
```

## Updating (Deploy Hook)

The deploy-hook compose on staging1 handles automated pulls. On new beta push:

```bash
# Manual update (if needed)
cd /opt/kids-words
docker compose pull
docker compose up -d
```

## Verify

```bash
# Check containers are running
docker compose ps

# Check backend health
curl -s http://localhost:8000/api/health

# Check from outside
curl -s https://kids-words.staging.calebdunn.tech/api/health
```

## Database

```bash
# Reseed (destructive — drops and recreates data)
docker compose exec backend python -c "
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.models import Base
from app.config import settings
async def reset():
    engine = create_async_engine(settings.database_url)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
asyncio.run(reset())
"
docker compose exec backend python -m app.seed
```
