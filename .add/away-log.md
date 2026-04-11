# Away Mode Log

**Started:** 2026-04-11
**Expected Return:** ~4 hours from start
**Duration:** 4 hours
**Cycle:** cycle-9 (partial — items 1 + 2 core, items 3 + 4 deferred)

## Work Plan

Subset of cycle-9 (`.add/cycles/cycle-9.md`):

1. **Item 1 — Alembic Migrations** (~2-3h)
   - Audit `001_initial_schema.py` against current models
   - Strict `downgrade()` tested
   - Integration test: upgrade ↔ downgrade parity
   - Integration test: data preservation
   - Docker entrypoint runs migration on start
   - Fix spec header `Milestone: M2` → `M3`
   - Branch: `feat/alembic-migrations` → PR ready for review

2. **Item 2 — Idempotent Seed** (~1-1.5h)
   - Audit `seed.py` for upsert logic
   - Fill AC-005 gap (`image_url` update on source change) if missing
   - Integration tests TC-003 + TC-004
   - Branch: `feat/idempotent-seed` → PR ready for review

**Deferred to next session:** CI Coverage Fix, v0.1.0 Release Tag.

## Boundaries

- No merge to main
- No deploy beyond local docker-compose
- No tag push
- No modifications to production-like data
- No irreversible changes to shared infra

## Progress Log

| Time | Task | Status | Notes |
|------|------|--------|-------|
| T+0 | Away mode started | STARTED | Switching to main, branching `feat/alembic-migrations` |
