# Implementation Plan: Word-Image Matching

**Spec Version:** 0.1.0
**Spec:** specs/word-image-matching.md
**Created:** 2026-04-04
**Team Size:** Solo
**Estimated Duration:** 5-6 days

## Overview

Build the core word-image matching activity: a FastAPI backend serving word/image data from a database, and a React frontend where children select categories, match words to images, and receive encouraging visual feedback. Results are recorded via API for future progress tracking.

## Objectives

- Deliver the M1 milestone (Word Recognition) core feature
- Establish the backend API pattern for future features
- Create a child-friendly, tablet-optimized UI
- Achieve 80% test coverage (Standard quality mode)

## Success Criteria

- All 13 acceptance criteria implemented and tested
- Code coverage >= 80% (backend and frontend)
- All quality gates passing (ruff, mypy, tsc, eslint)
- Works on tablet-sized screens (iPad)
- API endpoints documented and tested
- Docker Compose runs the full stack locally

## Acceptance Criteria Analysis

### AC-001: Category list on home screen
- **Complexity:** Simple
- **Tasks:** API endpoint + React component + routing
- **Dependencies:** Database schema, seed data

### AC-002: Selecting category starts a matching round
- **Complexity:** Simple
- **Tasks:** Frontend navigation, fetch words for category
- **Dependencies:** AC-001, GET /api/categories/{slug}/words endpoint

### AC-003: Word at top + 2-4 images in grid
- **Complexity:** Medium
- **Tasks:** Round state management, image grid component, distractor selection logic
- **Dependencies:** AC-002, word data with images

### AC-004: Correct match — animation + advance
- **Complexity:** Medium
- **Tasks:** Tap handler, correct/incorrect logic, CSS animation, auto-advance timer
- **Dependencies:** AC-003

### AC-005: Incorrect match — shake + retry
- **Complexity:** Simple
- **Tasks:** Shake animation, keep round state, allow re-tap
- **Dependencies:** AC-003

### AC-006: Touch targets >= 44px
- **Complexity:** Simple
- **Tasks:** CSS sizing, responsive layout
- **Dependencies:** AC-003

### AC-007: Tablet-optimized responsive UI
- **Complexity:** Medium
- **Tasks:** Responsive CSS, viewport testing, layout breakpoints
- **Dependencies:** All UI components

### AC-008: Backend API with database
- **Complexity:** Medium
- **Tasks:** FastAPI app, SQLAlchemy models, database setup, migrations, Docker service
- **Dependencies:** None (foundational)

### AC-009: POST results to backend
- **Complexity:** Simple
- **Tasks:** API endpoint, frontend fetch call after each answer
- **Dependencies:** AC-008, AC-004

### AC-010: Round completes after all words shown
- **Complexity:** Simple
- **Tasks:** Track answered words in round state, detect completion
- **Dependencies:** AC-003

### AC-011: Random distractor selection from same category
- **Complexity:** Simple
- **Tasks:** Shuffle logic — pick N-1 random other words from category
- **Dependencies:** AC-003

### AC-012: Randomize word order
- **Complexity:** Simple
- **Tasks:** Shuffle words array on round start
- **Dependencies:** AC-002

### AC-013: Completion celebration screen
- **Complexity:** Simple
- **Tasks:** Celebration component, trigger on round end
- **Dependencies:** AC-010

## Implementation Phases

### Phase 0: Project Setup (0.5 days)

Foundation: Docker, database, FastAPI scaffold, React scaffold, dev tooling.

| Task ID | Description | Effort | Dependencies | AC |
|---------|-------------|--------|--------------|-----|
| TASK-001 | Initialize Python backend (FastAPI, pyproject.toml, ruff, mypy config) | 1h | - | - |
| TASK-002 | Initialize React frontend (Vite, TypeScript, ESLint config) | 1h | - | - |
| TASK-003 | Create docker-compose.yml (backend, frontend, database) | 1h | TASK-001, TASK-002 | - |
| TASK-004 | Set up database (PostgreSQL in Docker, SQLAlchemy async, Alembic migrations) | 1.5h | TASK-001 | AC-008 |

**Phase Duration:** 0.5 days (4.5h)
**Blockers:** None

### Phase 1: Backend API (1.5 days)

Database models, API endpoints, seed data.

| Task ID | Description | Effort | Dependencies | AC |
|---------|-------------|--------|--------------|-----|
| TASK-005 | Create SQLAlchemy models (Category, Word, MatchResult) | 1h | TASK-004 | AC-008 |
| TASK-006 | Create Alembic migration for initial schema | 0.5h | TASK-005 | AC-008 |
| TASK-007 | Implement GET /api/categories endpoint | 1h | TASK-005 | AC-001 |
| TASK-008 | Implement GET /api/categories/{slug}/words endpoint (with shuffle) | 1.5h | TASK-005 | AC-002, AC-012 |
| TASK-009 | Implement POST /api/results endpoint | 1h | TASK-005 | AC-009 |
| TASK-010 | Create seed data script (3+ categories, 6-10 words each with images) | 2h | TASK-006 | AC-001 |
| TASK-011 | Write backend unit tests (models, endpoints) | 2.5h | TASK-007, TASK-008, TASK-009 | All backend |
| TASK-012 | Write backend integration tests (DB + API) | 1.5h | TASK-011 | All backend |

**Phase Duration:** 1.5 days (11h)
**Blockers:** Phase 0 complete

### Phase 2: Frontend Core (2 days)

React components, state management, API integration.

| Task ID | Description | Effort | Dependencies | AC |
|---------|-------------|--------|--------------|-----|
| TASK-013 | Create API client module (fetch wrapper, types) | 1h | TASK-007, TASK-008, TASK-009 | AC-008 |
| TASK-014 | Build CategoryList component (home screen) | 1.5h | TASK-013 | AC-001 |
| TASK-015 | Build MatchRound component (word display + image grid) | 2.5h | TASK-013 | AC-003 |
| TASK-016 | Implement round state management (current word, options, progress) | 2h | TASK-015 | AC-003, AC-010, AC-011, AC-012 |
| TASK-017 | Implement correct answer handler (animation + advance) | 1.5h | TASK-016 | AC-004 |
| TASK-018 | Implement incorrect answer handler (shake + retry) | 1h | TASK-016 | AC-005 |
| TASK-019 | Build RoundComplete celebration component | 1h | TASK-016 | AC-013 |
| TASK-020 | Implement result posting (fire POST /api/results on each answer) | 1h | TASK-017, TASK-018 | AC-009 |
| TASK-021 | App routing (home → category → round → complete → home) | 1h | TASK-014, TASK-019 | AC-002 |

**Phase Duration:** 2 days (12.5h)
**Blockers:** Backend API endpoints available (Phase 1 TASK-007 through TASK-009)

### Phase 3: UI Polish & Responsiveness (1 day)

Child-friendly design, tablet optimization, accessibility.

| Task ID | Description | Effort | Dependencies | AC |
|---------|-------------|--------|--------------|-----|
| TASK-022 | Child-friendly styling (large fonts, bright colors, rounded elements) | 2h | Phase 2 | AC-006, AC-007 |
| TASK-023 | Responsive layout for tablet screens (CSS Grid/Flexbox breakpoints) | 1.5h | TASK-022 | AC-007 |
| TASK-024 | Touch target sizing (min 44px all interactive elements) | 0.5h | TASK-022 | AC-006 |
| TASK-025 | Loading skeletons and error states | 1h | Phase 2 | AC-007 |
| TASK-026 | Tap debouncing (300ms) | 0.5h | TASK-017, TASK-018 | Edge case |
| TASK-027 | Image load failure fallback | 0.5h | TASK-015 | Edge case |

**Phase Duration:** 1 day (6h)
**Blockers:** Phase 2 complete

### Phase 4: Testing & Quality Gates (1 day)

Frontend tests, E2E tests, quality gate compliance.

| Task ID | Description | Effort | Dependencies | AC |
|---------|-------------|--------|--------------|-----|
| TASK-028 | Frontend unit tests (components, state logic) | 2.5h | Phase 3 | All frontend |
| TASK-029 | Frontend integration tests (API mocking, full flows) | 2h | TASK-028 | All frontend |
| TASK-030 | E2E tests (Playwright: happy path, incorrect answer, round complete) | 2h | Phase 3 | TC-001 to TC-005 |
| TASK-031 | Run quality gates (ruff, mypy, tsc, eslint, coverage report) | 1h | TASK-028, TASK-029, TASK-030 | - |
| TASK-032 | Fix any quality gate failures | 1h | TASK-031 | - |

**Phase Duration:** 1 day (8.5h)
**Blockers:** Phase 3 complete

## Effort Summary

| Phase | Estimated Hours | Days (solo) |
|-------|-----------------|-------------|
| Phase 0: Project Setup | 4.5h | 0.5 |
| Phase 1: Backend API | 11h | 1.5 |
| Phase 2: Frontend Core | 12.5h | 2 |
| Phase 3: UI Polish | 6h | 1 |
| Phase 4: Testing & QA | 8.5h | 1 |
| **Total** | **42.5h** | **6 days** |
| **With 15% contingency** | **~49h** | **~7 days** |

## Dependencies

### External Dependencies
- PostgreSQL Docker image
- Word/image assets (need illustrated or placeholder images for 3+ categories)
- No third-party API dependencies

### Internal Dependencies
- Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 (sequential for solo dev)
- Backend API must be functional before frontend integration (can mock during early frontend work)

### Critical Path
```
TASK-001 → TASK-004 → TASK-005 → TASK-006 → TASK-007/008/009 → TASK-010
                                                    ↓
TASK-002 ──────────────────────────→ TASK-013 → TASK-015 → TASK-016 → TASK-017/018 → TASK-020
                                                    ↓                       ↓
                                              TASK-014 → TASK-021    TASK-019 → TASK-021
                                                                            ↓
                                                                    TASK-022 → TASK-028 → TASK-031
```

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Image assets not ready | High | Medium | Use placeholder/emoji images initially, swap later |
| Python 3.14 compatibility issues | Medium | Medium | Check FastAPI/SQLAlchemy support for 3.14, fall back to 3.13 if needed |
| Database schema changes during dev | Low | Low | Alembic migrations handle schema evolution |
| CSS animation performance on iPad | Low | Medium | Use CSS transforms (GPU-accelerated), test on device early |
| Seed data takes longer than expected | Medium | Low | Start with minimal seed (3 categories, 5 words each) |

## Testing Strategy

### Backend (Phase 1)
- **Unit tests:** Model validation, endpoint response shapes, error cases
- **Integration tests:** Full request cycle with test database
- **Coverage target:** 80%+
- **Tools:** pytest, httpx (AsyncClient), factory_boy or fixtures

### Frontend (Phase 4)
- **Unit tests:** Component rendering, state transitions, event handlers
- **Integration tests:** API mock tests, full user flows
- **Coverage target:** 80%+
- **Tools:** Vitest, React Testing Library

### E2E (Phase 4)
- **Happy path:** Category select → match words → round complete
- **Error paths:** Wrong answer retry, API failure
- **Tools:** Playwright
- **Screenshot checkpoints:** Per spec Section 6

## Deliverables

### Backend
- `backend/app/main.py` — FastAPI application
- `backend/app/models.py` — SQLAlchemy models (Category, Word, MatchResult)
- `backend/app/routes/categories.py` — Category endpoints
- `backend/app/routes/results.py` — Results endpoint
- `backend/app/database.py` — Database connection and session
- `backend/alembic/` — Database migrations
- `backend/seed.py` — Seed data script

### Frontend
- `frontend/src/App.tsx` — Root with routing
- `frontend/src/components/CategoryList.tsx` — Home screen
- `frontend/src/components/MatchRound.tsx` — Core matching activity
- `frontend/src/components/RoundComplete.tsx` — Celebration screen
- `frontend/src/api/client.ts` — API client
- `frontend/src/hooks/useRound.ts` — Round state management

### Infrastructure
- `docker-compose.yml` — Full stack (backend, frontend, postgres)
- `backend/Dockerfile` — Backend container
- `frontend/Dockerfile` — Frontend container

### Tests
- `tests/unit/` — Backend unit tests
- `tests/integration/` — Backend integration tests
- `frontend/src/__tests__/` — Frontend tests
- `tests/e2e/` — Playwright E2E tests

## Task-to-AC Traceability

| AC | Tasks | Phase |
|----|-------|-------|
| AC-001 | TASK-007, TASK-010, TASK-014 | 1, 2 |
| AC-002 | TASK-008, TASK-021 | 1, 2 |
| AC-003 | TASK-015, TASK-016 | 2 |
| AC-004 | TASK-017 | 2 |
| AC-005 | TASK-018 | 2 |
| AC-006 | TASK-024 | 3 |
| AC-007 | TASK-022, TASK-023 | 3 |
| AC-008 | TASK-004, TASK-005, TASK-006, TASK-013 | 0, 1, 2 |
| AC-009 | TASK-009, TASK-020 | 1, 2 |
| AC-010 | TASK-016 | 2 |
| AC-011 | TASK-016 | 2 |
| AC-012 | TASK-008, TASK-016 | 1, 2 |
| AC-013 | TASK-019 | 2 |

## Next Steps

1. Review and approve this plan
2. Begin Phase 0: Project Setup
3. Run `/add:tdd-cycle specs/word-image-matching.md` to execute with TDD
4. Track progress in `/add:cycle`

## Plan History

| Date | Version | Changes |
|------|---------|---------|
| 2026-04-04 | 0.1.0 | Initial plan from /add:plan |
