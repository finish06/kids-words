# M3 — Infrastructure Hardening

**Goal:** Make deployments safe and repeatable. No more data loss on schema changes.
**Appetite:** 1 week
**Status:** IN_PROGRESS
**Started:** 2026-04-05
**Target Maturity:** Beta (promotion target after completion)

## Hill Chart

```
Alembic Migrations     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — spec ready
Idempotent Seed        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — spec ready
CI Coverage Fix        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
Frontend Test Coverage ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
v0.1.0 Release Tag     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
```

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Alembic Migrations | specs/database-migrations.md | SPECCED | Initial baseline + auto-run on container start |
| Idempotent Seed | specs/database-migrations.md | SPECCED | Upsert logic, no duplicates |
| CI Coverage Fix | — | NOT_STARTED | Fix session isolation in CI tests |
| Frontend Test Coverage | — | NOT_STARTED | Tests for ProfilePicker, PinGate, ColorCircle, WordList |
| v0.1.0 Release Tag | — | NOT_STARTED | First semver tag, triggers versioned image push |

## Success Criteria

- [ ] `alembic upgrade head` applies schema changes without data loss
- [ ] Seed script is idempotent (run multiple times, same result)
- [ ] Docker entrypoint auto-runs migrations on start
- [ ] CI backend coverage >= 80% (fix session isolation)
- [ ] Frontend coverage >= 80% (new component tests)
- [ ] v0.1.0 tag pushed, versioned images in registry
- [ ] Staging deploy works without manual DB reset

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
