# Spec: Database Migrations & Idempotent Seeding

**Version:** 0.1.0
**Created:** 2026-04-05
**PRD Reference:** docs/prd.md — Infrastructure
**Milestone:** M2
**Status:** Draft

## 1. Overview

Replace the destructive `drop_all/create_all` pattern with proper Alembic migrations and an idempotent seed script. Schema changes apply incrementally without data loss. Seed script adds missing data without duplicating or resetting existing records.

### User Story

As a developer, I want database schema changes to apply non-destructively, so that user progress and profiles are preserved across deployments.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Alembic migration generated for current schema (initial baseline) | Must |
| AC-002 | `alembic upgrade head` applies schema changes without dropping existing data | Must |
| AC-003 | Seed script is idempotent — running it multiple times produces the same result | Must |
| AC-004 | Seed script adds missing categories/words but does not duplicate existing ones | Must |
| AC-005 | Seed script updates image_url for existing words if the source data changes | Should |
| AC-006 | Deploy workflow runs `alembic upgrade head` before starting the backend | Must |
| AC-007 | Seed script can be run independently via `python -m app.seed` | Must |
| AC-008 | WordProgress, MatchResult, Profile data survives schema migrations | Must |
| AC-009 | Docker entrypoint runs migrations automatically on container start | Should |

## 3. User Test Cases

### TC-001: Fresh Database — Migration + Seed

**Precondition:** Empty database, no tables
**Steps:**
1. Run `alembic upgrade head`
2. All tables created (categories, words, profiles, etc.)
3. Run `python -m app.seed`
4. 173 words seeded across 3 categories
**Expected Result:** Clean database with all tables and seed data
**Screenshot Checkpoint:** N/A
**Maps to:** TBD

### TC-002: Schema Change — Data Preserved

**Precondition:** Database has existing data (profiles, progress, results)
**Steps:**
1. Create a new migration (e.g., add a column)
2. Run `alembic upgrade head`
3. New column exists
4. All existing data (profiles, progress, match results) is intact
**Expected Result:** Schema updated, zero data loss
**Screenshot Checkpoint:** N/A
**Maps to:** TBD

### TC-003: Seed Idempotency

**Precondition:** Database already seeded with 173 words
**Steps:**
1. Run `python -m app.seed` again
2. No duplicate categories or words created
3. Word count remains 173
**Expected Result:** Seed is no-op when data already exists
**Screenshot Checkpoint:** N/A
**Maps to:** TBD

### TC-004: Seed Adds Missing Words

**Precondition:** Database seeded, then new words added to seed data
**Steps:**
1. Add 5 new words to seed_foods.py
2. Run `python -m app.seed`
3. Only 5 new words added, existing 173 unchanged
**Expected Result:** Incremental seed — adds missing, skips existing
**Screenshot Checkpoint:** N/A
**Maps to:** TBD

## 4. Data Model

No new tables. Changes to seed script logic and Alembic configuration.

## 5. API Contract

No API changes.

## 6. Implementation Notes

### Alembic Setup
- Generate initial migration from current models: `alembic revision --autogenerate -m "initial schema"`
- Migration covers: categories, words, match_results, profiles, parent_settings, word_progress
- `alembic/env.py` already configured for async

### Idempotent Seed Logic
```python
# For each category in SEED_DATA:
#   1. SELECT category by slug
#   2. If not exists → INSERT category
#   3. For each word in category:
#      a. SELECT word by (text, category_id)
#      b. If not exists → INSERT word
#      c. If exists and image_url changed → UPDATE image_url
```

### Docker Entrypoint
```bash
#!/bin/sh
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Deploy Flow (staging)
```
docker compose pull
docker compose up -d
# Backend container auto-runs migrations on start
# Seed is manual: docker compose exec backend python -m app.seed
```

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Migration on empty DB | Creates all tables from scratch |
| Migration on populated DB | Applies only new changes |
| Seed on empty DB | Inserts all categories + words |
| Seed on fully seeded DB | No-op, no duplicates |
| Seed with new words added to source | Only new words inserted |
| Seed with changed image_url | Existing word's URL updated |
| Concurrent seed runs | Second run is no-op (no race conditions with upsert) |

## 8. Dependencies

- Alembic already installed and configured (alembic.ini, alembic/env.py exist)
- No new dependencies needed

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-05 | 0.1.0 | calebdunn | Initial spec |
