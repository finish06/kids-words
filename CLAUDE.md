# Kids Words

A kids word recognition learning app for ages 4-6. Children learn words by identifying and matching images to words.

## Methodology

This project follows **Agent Driven Development (ADD)** — specs drive agents, humans architect and decide, trust-but-verify ensures quality.

- **PRD:** docs/prd.md
- **Specs:** specs/
- **Plans:** docs/plans/
- **Config:** .add/config.json

Document hierarchy: PRD → Spec → Plan → User Test Cases → Automated Tests → Implementation

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Python + FastAPI | 3.14 |
| Frontend | React + TypeScript | React 19, TS 5.x |
| Bundler | Vite | latest |
| Mobile | Capacitor | latest (iOS) |
| Containers | Docker Compose | all environments |
| Cloud | GCP Cloud Run | production |

## Commands

### Development
```
docker-compose up                    # Start local dev
pytest                               # Run unit tests
pytest tests/e2e/                    # Run E2E tests
ruff check . && ruff format .        # Lint + format (backend)
npm run lint                         # Lint (frontend)
mypy .                               # Type check (backend)
npx tsc --noEmit                     # Type check (frontend)
```

### ADD Workflow
```
/add:init                            # Initialize ADD (already done)
/add:spec {feature}                  # Create feature specification
/add:plan specs/{feature}.md         # Create implementation plan
/add:tdd-cycle specs/{feature}.md    # Execute TDD cycle
/add:verify                          # Run quality gates
/add:deploy                          # Commit and deploy
/add:away {duration}                 # Human stepping away
```

## Architecture

### Key Directories
```
kids_words/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, health/version endpoints
│   │   ├── models.py            # SQLAlchemy models (6 tables)
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── database.py          # Async session factory
│   │   ├── config.py            # Pydantic settings
│   │   ├── seed.py              # Idempotent seed script
│   │   └── routes/
│   │       ├── categories.py    # GET /api/categories, GET /api/categories/{slug}/words
│   │       ├── profiles.py      # CRUD + PIN setup/verify
│   │       ├── progress.py      # GET /api/progress, GET /api/progress/{slug}
│   │       └── results.py       # POST /api/results (match recording + star tracking)
│   ├── alembic/                 # Database migrations
│   ├── tests/                   # 48 pytest tests (93% coverage)
│   ├── entrypoint.sh            # Docker: auto-migrate + start uvicorn
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Router + profile state
│   │   ├── components/          # CategoryList, MatchRound, ProfilePicker, etc.
│   │   ├── hooks/useRound.ts    # Quiz round state machine
│   │   ├── api/client.ts        # API client functions
│   │   └── types/               # TypeScript interfaces
│   └── package.json             # 75 vitest tests (87% coverage)
├── .add/                        # ADD methodology (config, learnings, retros)
├── .claude/                     # Claude Code config (rules, settings)
├── docs/
│   ├── prd.md                   # Product Requirements Document
│   ├── plans/                   # Implementation plans
│   ├── milestones/              # Milestone tracking (M1-M8)
│   └── sequence-diagram.md      # Mermaid request flow diagrams
├── specs/                       # Feature specifications (15 specs)
├── tests/screenshots/           # Visual verification
├── CLAUDE.md                    # This file
└── CHANGELOG.md
```

### API Routes (13 endpoints)

| Method | Path | Handler | Purpose |
|--------|------|---------|---------|
| GET | /api/health | main.py | Health check with DB latency |
| GET | /api/version | main.py | Build info + git commit |
| GET | /api/categories | categories.py | List all categories with word counts |
| GET | /api/categories/{slug}/words | categories.py | Get words for a category (shuffled) |
| GET | /api/profiles | profiles.py | List profiles + PIN status |
| POST | /api/profiles | profiles.py | Create child profile (PIN required) |
| POST | /api/profiles/setup | profiles.py | Set parent PIN (first time) |
| POST | /api/profiles/verify-pin | profiles.py | Verify parent PIN |
| PUT | /api/profiles/{id} | profiles.py | Update profile name/color |
| DELETE | /api/profiles/{id} | profiles.py | Delete profile + progress |
| GET | /api/progress | progress.py | All categories mastery % |
| GET | /api/progress/{slug} | progress.py | Per-word star levels for category |
| POST | /api/results | results.py | Record match result + update stars |

### Database Models (6 tables)

Profile, ParentSettings, Category, Word, MatchResult, WordProgress

### Environments

- **Local:** Docker Compose, http://localhost:8000
- **Staging:** https://kids-words.staging.calebdunn.tech (staging1 / 192.168.1.145)
- **Production:** GCP Cloud Run, TBD

## Quality Gates

- **Mode:** Standard
- **Coverage threshold:** 80%
- **Type checking:** Blocking
- **E2E required:** Yes

All gates defined in `.add/config.json`. Run `/add:verify` to check.

## Source Control

- **Git host:** GitHub
- **Branching:** Feature branches off `main`
- **Commits:** Conventional commits (feat:, fix:, test:, refactor:, docs:)
- **CI/CD:** GitHub Actions

## Collaboration

- **Autonomy level:** Autonomous
- **Review gates:** Deploy approval required for production
- **Deploy approval:** Required for production
