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
├── .add/                    # ADD methodology (config, learnings, retros)
├── .claude/                 # Claude Code config (rules, settings)
├── docs/
│   ├── prd.md              # Product Requirements Document
│   ├── plans/              # Implementation plans
│   └── milestones/         # Milestone tracking
├── specs/                   # Feature specifications
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   ├── e2e/                # End-to-end tests
│   └── screenshots/        # Visual verification
├── CLAUDE.md               # This file
└── CHANGELOG.md            # Keep a Changelog format
```

### Environments

- **Local:** Docker Compose, http://localhost:8000
- **QA/Staging:** Docker-based, TBD
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
