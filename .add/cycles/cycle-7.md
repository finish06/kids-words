# Cycle 7 — Alembic Migrations + Idempotent Seed

**Milestone:** M3 — Infrastructure Hardening
**Maturity:** Alpha
**Status:** IN_PROGRESS
**Started:** 2026-04-05
**Completed:** TBD
**Duration Budget:** 1 session (~2 hours, autonomous)

## Work Items

| Feature | Current Pos | Target Pos | Assigned | Est. Effort | Validation |
|---------|-------------|-----------|----------|-------------|------------|
| Alembic initial migration | SPECCED | COMPLETE | Agent-1 | ~45 min | alembic upgrade head creates all tables |
| Idempotent seed script | SPECCED | COMPLETE | Agent-1 | ~30 min | Multiple runs produce same result |
| Docker entrypoint | NOT_STARTED | COMPLETE | Agent-1 | ~15 min | Container auto-runs migrations on start |
| Tests | NOT_STARTED | COMPLETE | Agent-1 | ~20 min | Migration + seed tests pass |
| PR + merge + staging | NOT_STARTED | COMPLETE | Agent-1 | ~15 min | Staging deploys without manual DB reset |

## Dependencies & Serialization

```
Alembic initial migration (baseline schema)
    ↓
Idempotent seed script (depends on tables existing)
    ↓
Docker entrypoint (wraps migration + uvicorn)
    ↓
Tests + PR + merge + staging deploy
```

Sequential. Single agent.

## Validation Criteria

- [ ] `alembic upgrade head` creates all 6 tables on empty DB
- [ ] `alembic upgrade head` is no-op on up-to-date DB
- [ ] `python -m app.seed` adds 173 words on empty DB
- [ ] `python -m app.seed` is no-op on seeded DB (no duplicates)
- [ ] `python -m app.seed` adds new words if seed data expanded
- [ ] Docker container auto-runs migrations on start
- [ ] Existing data (profiles, progress) survives migration
- [ ] CI passes
- [ ] Staging deploy works without manual DB reset
