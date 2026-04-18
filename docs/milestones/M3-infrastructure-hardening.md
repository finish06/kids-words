# M3 — Infrastructure Hardening

**Goal:** Make deployments safe and repeatable. No more data loss on schema changes.
**Appetite:** 1 week
**Status:** IN_PROGRESS
**Started:** 2026-04-05
**Target Maturity:** Beta (promotion target after completion)

## Hill Chart

```
Alembic Migrations     ████████████████████████████████  100% — merged + integration tests (cycle-9)
Idempotent Seed        ████████████████████████████████  100% — merged + integration tests (cycle-9)
Frontend Test Coverage ████████████████████████████████  100% — 75 tests, 86.2% coverage (cycle-8)
CI Coverage Fix        ████████████████████████████████  100% — root cause resolved, CI at 93.33% (cycle-11, PR #16)
Release Tag            ████████████████████████████████  100% — v0.2.0 tagged 2026-04-18 (v0.1.0 was the original MVP tag)
```

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Alembic Migrations | specs/database-migrations.md | VERIFIED | Merged via PR #7; integration tests added cycle-9 (PR #14) |
| Idempotent Seed | specs/database-migrations.md | VERIFIED | Merged via PR #7; 6 integration tests added cycle-9 (PR #14) |
| Frontend Test Coverage | — | COMPLETE | 75 tests, 86.2% line coverage (cycle-8, PR #13) |
| CI Coverage Fix | — | VERIFIED | Root cause: Python 3.13 + pytest-asyncio + httpx + FastAPI DI lost async trace context. Fix: aligned CI to Python 3.14 (matches local dev) + removed 75% CLI override. CI now at 93.33%, 3 consecutive green runs. cycle-11, PR #16. |
| Release Tag | — | COMPLETE | v0.1.0 tagged 2026-04-04 (MVP). v0.2.0 tagged 2026-04-18 covering M3-M6 + Alpha→Beta promotion. pyproject + CHANGELOG + main all at 0.2.0. |

## Success Criteria

- [x] `alembic upgrade head` applies schema changes without data loss (integration tests cycle-9)
- [x] Seed script is idempotent (6 integration tests cycle-9: AC-003, AC-004, AC-005, TC-001, TC-003, TC-004)
- [x] Docker entrypoint auto-runs migrations on start (backend/entrypoint.sh with smart stamping)
- [x] CI backend coverage >= 80% (93.33% at 80% threshold since cycle-11 / PR #16)
- [x] Frontend coverage >= 80% (86.2% — 75 tests)
- [x] Release tag pushed (v0.1.0 + v0.2.0); versioned images in registry via staging auto-deploy
- [ ] Staging deploy works without manual DB reset (untested, pending CI fix + v0.1.0)

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
| cycle-7 | Alembic + Seed + Docker entrypoint (code) | COMPLETE | Merged PR #7 — but no tests shipped |
| cycle-8 | Frontend Test Coverage | COMPLETE | 75 tests, 86.2% coverage — PR #13 merged |
| cycle-9 | Alembic + Seed integration tests + CI threshold lift | PARTIAL | 11 new tests, CI 68%→76%, threshold to 75%; root-cause fix + v0.1.0 deferred |
| cycle-11 | CI Coverage root-cause fix | COMPLETE | Python 3.13 → 3.14 alignment; CI now 93.33% across 3 consecutive runs at 80% threshold (PR #16) |
