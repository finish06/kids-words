# Cycle 9 — M3 Infrastructure Hardening: Migrations, Seed, CI

**Milestone:** M3 — Infrastructure Hardening
**Maturity:** Beta
**Status:** IN_PROGRESS (partial — 4h away session, items 1+2 only)
**Started:** 2026-04-11
**Completed:** TBD
**Duration Budget:** 1 day autonomous (human away ~24h)
**Branch Strategy:** One feature branch per work item, PRs left open for human review on return

## Goal

Finish the 3 remaining M3 infrastructure items (with v0.1.0 tag as stretch) so that deploys become safe/repeatable and the maturity-promotion milestone is ready to close.

## Work Items

| # | Feature | Current Pos | Target Pos | Est. Effort | Validation |
|---|---------|-------------|-----------|-------------|------------|
| 1 | Alembic Migrations (finish + verify) | PARTIAL (001 baseline exists) | VERIFIED | ~2-3 hrs | AC-001, AC-002, AC-006, AC-008, AC-009 pass; upgrade + downgrade both tested |
| 2 | Idempotent Seed (audit + finish) | PARTIAL (seed.py exists) | VERIFIED | ~1-2 hrs | AC-003, AC-004, AC-005, AC-007 pass; TC-003 and TC-004 pass |
| 3 | CI Coverage Fix (investigate + fix) | NOT_STARTED | VERIFIED | ~1-3 hrs | Root cause documented; backend CI coverage >= 80% in CI run |
| 4 | v0.1.0 Release Tag *(stretch)* | NOT_STARTED | VERIFIED | ~30 min | Annotated tag pushed, CHANGELOG.md entry, versioned image in registry |

### Work Item Detail

#### Item 1 — Alembic Migrations

**Spec reference:** `specs/database-migrations.md` (note: spec header says M2, will fix to M3 in cycle)

Subtasks:
1. Audit `001_initial_schema.py` — does `alembic revision --autogenerate` produce an empty diff against current models? If not, either regenerate the baseline or create a `002_*` migration to close the gap.
2. Write a `downgrade()` for 001 if missing (strict rollback requirement).
3. Write a test that performs `upgrade head → downgrade base → upgrade head` on an ephemeral SQLite (or test DB container) and asserts schema parity.
4. Write a test that pre-populates a DB, runs `upgrade head`, and asserts user data is preserved (AC-008).
5. Update Docker entrypoint to run `alembic upgrade head` before `uvicorn` (AC-009). Preserve existing startup; add as prestep.
6. Document in README or CLAUDE.md how to create new migrations.
7. Local verify: `docker compose down -v && docker compose up` — backend starts clean.

**Files expected to change:**
- `backend/alembic/versions/*.py` (possibly new migration, possibly downgrade filled)
- `backend/tests/integration/test_migrations.py` (new)
- `backend/Dockerfile` or `backend/entrypoint.sh` (migration on start)
- `backend/app/main.py` — remove any legacy `create_all` calls if present
- `specs/database-migrations.md` (fix M2 → M3 metadata)

#### Item 2 — Idempotent Seed

**Spec reference:** `specs/database-migrations.md` (shared)

Subtasks:
1. Audit `app/seed.py` + `seed_animals.py` + `seed_foods.py` against AC-003 through AC-007. Does current seed use upsert logic (select-then-insert, or ON CONFLICT)?
2. Fill any gaps — specifically AC-005 (image_url update on source change) is the most likely missing piece.
3. Write integration test TC-003 (seed twice, assert word count stable).
4. Write integration test TC-004 (add word to source, run seed, assert only new word inserted).
5. Local verify: run against fresh DB, then run again, then add a fake word and run again. Check counts.

**Files expected to change:**
- `backend/app/seed.py` (upsert logic if missing)
- `backend/tests/integration/test_seed_idempotency.py` (new)

#### Item 3 — CI Coverage Fix

**Investigation first.** Root cause is unknown. Suspected candidates based on a Python/FastAPI/pytest stack: shared async session state between tests, parallel xdist workers stepping on each other, test DB not reset between modules, `conftest.py` fixtures leaking.

Subtasks:
1. Fetch latest CI run output (gh run list / view) and record the actual coverage drop and any test failures.
2. Reproduce locally by running `pytest` in the same way CI does (check `.github/workflows/ci.yml`).
3. Diff local coverage vs CI coverage per-file. Files missing coverage in CI but present locally → the affected tests likely aren't running or are failing silently.
4. Likely fix: test isolation fixture (fresh async session per test, transaction rollback, or database recreation per test class).
5. Write the fix, push to the cycle branch, trigger CI, verify coverage >= 80%.
6. Document root cause and fix in `.add/learnings.md` (post-verify checkpoint).

**Files expected to change:**
- `backend/tests/conftest.py` (likely)
- `backend/tests/unit/*` or `tests/integration/*` (individual test tweaks if needed)
- `.github/workflows/ci.yml` (only if worker/parallel config is wrong)

#### Item 4 — v0.1.0 Release Tag *(stretch, skip if items 1-3 not fully green)*

Subtasks:
1. Only start if items 1-3 are merged-ready AND docker compose stack runs end-to-end locally.
2. Create/update `CHANGELOG.md` with v0.1.0 entry (Keep a Changelog format).
3. Bump version in `backend/pyproject.toml` + `frontend/package.json` if version fields exist.
4. **Do not push the tag autonomously.** Leave a draft PR with the version bump + CHANGELOG and a note on exactly which `git tag` command to run after merge. Tag push is a human action.

**Files expected to change:**
- `CHANGELOG.md` (new or updated)
- `backend/pyproject.toml`, `frontend/package.json` (version bumps)

## Dependencies & Serialization

```
Item 1 (Alembic)
    │
    ▼  (seed depends on stable schema; share integration test DB setup)
Item 2 (Seed)
    │
    ▼  (item 3 can technically parallel, but Beta config parallel_agents=1 → serial)
Item 3 (CI Fix)
    │
    ▼  (stretch; only if all above are green)
Item 4 (v0.1.0 tag) — stretch
```

Rationale for full serialization:
- Items 1 + 2 share a spec and integration test infrastructure. Building 2 on top of 1's test harness avoids rework.
- Item 3 touches `conftest.py` which items 1 + 2 will likely also touch (new fixtures for migration/seed tests). Serializing avoids merge conflicts.
- Item 4 is a gate, not work.

## Parallel Strategy

**Parallelism:** None this cycle (config `planning.parallel_agents: 1`, Beta WIP limit respected).

Single-agent serial execution. Each work item gets its own feature branch and PR:
- `feat/alembic-migrations`
- `feat/idempotent-seed`
- `fix/ci-coverage-isolation`
- `chore/v0.1.0-release` (stretch)

No file reservations needed — one agent, one branch at a time.

## Validation Criteria

### Per-Item

- **Item 1:** AC-001, AC-002, AC-006, AC-008, AC-009 covered by tests. `alembic upgrade head && alembic downgrade base && alembic upgrade head` clean. `docker compose up` succeeds on fresh volume. Backend tests pass locally.
- **Item 2:** AC-003, AC-004, AC-005, AC-007 covered. TC-003 and TC-004 pass. Running seed 3 times in a row produces stable word count. Changing a word's `image_url` in source and re-running seed updates the DB.
- **Item 3:** CI coverage >= 80% in an actual green CI run. Root cause one-liner in `.add/learnings.md`. `.github/workflows/ci.yml` job summary shows no flakiness across 3 consecutive runs.
- **Item 4 (stretch):** `CHANGELOG.md` has v0.1.0 section. Version strings aligned across backend + frontend. PR description includes the exact tag command for the human.

### Cycle Success Criteria

- [ ] Items 1-3 reach VERIFIED
- [ ] All acceptance criteria per item covered by tests
- [ ] 3 PRs open, CI green, awaiting human review on return
- [ ] M3 hill chart + success criteria updated to reflect progress
- [ ] No regressions in backend or frontend test suites
- [ ] `.add/learnings.md` has one post-verify checkpoint per item
- [ ] `.add/handoff.md` written with status + blockers + decisions made
- [ ] Item 4 complete-or-deferred explicitly (not forgotten)

## Agent Autonomy & Checkpoints

**Mode:** Beta + solo + away → **autonomous within the safety boundary below.**

### Autonomous (will do without asking)
- Create feature branches, commit, push, open PRs
- Run all tests (backend pytest, frontend vitest), lint, typecheck
- Fix backend lint errors introduced by this cycle's changes
- Investigate CI failures and iterate on fixes
- Decide between equivalent technical approaches (e.g., which session isolation strategy)
- Update the cycle file, milestone file, learnings file, handoff file
- `docker compose down -v` on local env (ephemeral local data only)
- Leave TODO comments in code with cycle + AC references if an edge case is out of scope

### NOT Autonomous (will queue for human)
- Merge any PR to main
- Push git tags (v0.1.0 tag is a human action even if the PR is ready)
- Deploy to staging, dev, or production
- Modify or nuke shared/production data
- Upgrade dependency major versions
- Modify `.add/config.json` maturity or collaboration fields
- Make architectural decisions with multiple valid approaches — will pick one, document rationale, and flag for review instead

### Blocker Protocol
If any item is blocked for > 30 minutes of agent time by a decision I can't make autonomously:
1. Log blocker in `.add/handoff.md`
2. Skip to next item
3. Return to blocked item only if time permits
4. Do NOT sit and wait — productive use of remaining away budget is the priority

### Handoff Protocol
Agent will write/update `.add/handoff.md` after each work item completes (or is blocked), so on return you see a clean state.

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Initial Alembic migration drifts from current models | High | Medium | Autogenerate diff first, add delta migration if needed |
| Seed rewrite causes duplicate inserts during test | Medium | Low | Use separate test DB, ephemeral SQLite preferred |
| CI coverage root cause requires deep infra change | Medium | High | If > 2 hours of investigation with no root cause, stop and queue for human (don't burn the whole day) |
| Docker entrypoint change breaks local dev hot reload | Low | Medium | Test compose up after change before committing |
| Strict downgrade() on autogenerated migration fails | Medium | Low | Hand-edit downgrade; SQLAlchemy autogen is flaky for drops |

## Notes

- Recon (already done): `backend/alembic/versions/001_initial_schema.py` exists; seed.py + seed_animals.py + seed_foods.py exist. Work is finish/verify, not build.
- Spec header metadata bug: `specs/database-migrations.md` says `Milestone: M2` but M3 tracks it. Fixing as part of item 1.
- 6 milestones are currently marked IN_PROGRESS. Out of scope for this cycle but flagged for next retro — most of M1, M4, M5 look effectively done and should be closed.
- Pre-existing frontend lint errors in `useRound.ts` (Math.random purity) are still not fixed — also out of scope for this cycle.
- Previous cycle (cycle-8) proved that mid-flight pause + audit-on-resume is a working recovery strategy. If this cycle is interrupted, do the same: audit before re-running.
