# Kids Words

A word recognition learning app for children ages 4-6. Kids match words to images, earn stars, and build vocabulary through play.

**Live:** [kids-words.staging.calebdunn.tech](https://kids-words.staging.calebdunn.tech)

## Features

- **Word-Image Matching** — A word appears, child taps the matching image from a grid
- **Word Builder (M7)** — Prefix/suffix learning with adaptive level unlock (≥70% mastery)
- **Listening Practice (M8)** — Tap-to-hear pronunciation across rounds via Web Speech TTS
- **220 Words** — 100 animals, 63 foods, 22 shapes, 25 body parts, 10 colors (OpenMoji-based)
- **Quiz Length Picker** — Choose 5, 10, or 20 words per round
- **Star Mastery** — 2 correct = 1 star, 4 = 2 stars, 7+ = 3 stars (mastered)
- **Home Progress Bar** — Per-game `stars_earned` / `stars_possible` aggregate
- **Child Profiles** — Up to 3 named profiles with independent progress
- **PIN Protection** — Parent PIN required to switch profiles or manage settings
- **iPad Optimized** — Large touch targets (48px+), responsive layout, Capacitor-ready

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.14 + FastAPI |
| Frontend | React 19 + TypeScript + Vite |
| Database | PostgreSQL |
| Mobile | Capacitor (planned) |
| Containers | Docker Compose |
| CI/CD | GitHub Actions → dockerhub.calebdunn.tech |
| Staging | staging1 via Pangolin/Newt |

## Getting Started

### Local Development

```bash
# Start all services
docker compose up

# Seed the database (first time only)
docker compose exec backend python -m app.seed

# Frontend: http://localhost:5178
# Backend API: http://localhost:8000
```

### Run Tests

```bash
# Backend
cd backend && source .venv/bin/activate
pytest tests/ --cov=app

# Frontend
cd frontend
npx vitest run --coverage

# E2E (requires Docker Compose running)
npx playwright test
```

## API

### Health & Version

```
GET /api/health    → status, uptime, dependencies, version
GET /api/version   → git commit, build date, architecture
GET /health        → frontend status (nginx-served)
```

### Core Endpoints

```
GET  /api/categories              → list word categories
GET  /api/categories/{slug}/words → words with images for a category
POST /api/results                 → record a match attempt
GET  /api/profiles                → list child profiles
GET  /api/progress                → all-categories mastery + stars_earned/possible
GET  /api/progress/{slug}         → star progress per category
```

### Word Builder (M7)

```
GET  /api/word-builder/round      → round of challenges at the unlocked level
POST /api/word-builder/results    → record attempt + update pattern mastery
GET  /api/word-builder/progress   → per-level mastery + stars_earned/possible
```

See `docs/sequence-diagram.md` for full request flows.

## Deployment

### Staging (automatic)

Every merge to `main`:
1. CI runs (ruff, mypy, tsc, pytest, vitest)
2. Docker images built and pushed to private registry (`:beta` + `:beta-{sha}`)
3. Deploy-hook webhook triggers pull + restart on staging1
4. Health checks verify frontend, backend, and version endpoints

### Production (manual)

```bash
git tag v0.2.0
git push --tags
# Pushes :0.2.0 + :latest images
```

## Project Structure

```
kids_words/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + health/version
│   │   ├── models.py            # SQLAlchemy models (10 tables)
│   │   ├── routes/              # API endpoints (categories, profiles, progress, results, word_builder)
│   │   ├── schemas.py           # Pydantic DTOs
│   │   ├── star_math.py         # Shared stars_earned/possible aggregate
│   │   ├── seed.py              # Idempotent database seeder
│   │   ├── seed_animals.py      # 100 animal words + OpenMoji codes
│   │   ├── seed_foods.py        # 63 food words + OpenMoji codes
│   │   ├── seed_shapes.py       # 22 shape words
│   │   ├── seed_bodyparts.py    # 25 body-part words
│   │   └── seed_word_builder.py # M7 patterns/base words/combos
│   ├── alembic/                 # Database migrations
│   ├── tests/                   # 99 pytest tests
│   ├── Dockerfile.prod          # Production image
│   └── entrypoint.sh            # Auto-runs migrations on start
├── frontend/
│   ├── src/
│   │   ├── components/          # HomeScreen, MatchingScreen, MatchRound, BuildScreen, ...
│   │   ├── hooks/useRound.ts    # Round state management
│   │   ├── hooks/useBuildRound.ts # Word Builder round state
│   │   ├── hooks/useSpeech.ts   # TTS wrapper (M8)
│   │   ├── api/client.ts        # API client with profile headers
│   │   └── types/               # TypeScript interfaces
│   ├── public/                  # Static assets + health.json
│   ├── nginx.conf               # Production nginx config
│   ├── Dockerfile.prod          # Production image (nginx)
│   └── e2e/                     # Playwright tests (107 vitest tests)
├── specs/                       # 18 feature specifications
├── docs/
│   ├── prd.md                   # Product Requirements Document
│   ├── plans/                   # Implementation plans
│   ├── milestones/              # M1-M8
│   ├── sequence-diagram.md      # Mermaid request-flow diagrams
│   └── staging-deploy.md        # Staging deployment guide
├── .add/                        # ADD methodology config
├── .github/workflows/           # CI + deploy pipelines
├── docker-compose.yml           # Local development
└── docker-compose.staging.yml   # Staging (uses :beta tag)
```

## Methodology

This project follows [Agent Driven Development (ADD)](https://github.com/MountainUnicorn/add-marketplace).

- **Maturity:** Beta
- **Quality:** Standard (80% coverage target)
- **Specs:** 18 feature specifications in `specs/`
- **Milestones:** M1-M6 complete; M7 (Word Builder) + M8 (Audio & Pronunciation) implemented; M7 game-progress-bar in progress

## License

CC BY-SA 4.0 for OpenMoji images. Project code is private.
