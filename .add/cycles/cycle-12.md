# Cycle 12 — M7 Word Builder Backend

**Milestone:** M7 — Word Builder
**Maturity:** Beta
**Status:** PLANNED
**Started:** TBD (planned 2026-04-18)
**Completed:** TBD
**Duration Budget:** Half-day focused session (~4-8h effort)
**Branch Strategy:** Single feature branch `feat/word-builder-backend`, single squash commit, revert-if-red rollback
**Ordering:** TDD-strict (RED → GREEN → REFACTOR → VERIFY) per `.claude/rules/tdd-enforcement.md`

## Goal

Ship the Word Builder backend — Alembic migration for 4 new tables, 3 REST endpoints, minimal Level-1 seed — with tests-first discipline. Delivers a fully-tested API contract ready for Frontend to consume in a subsequent cycle. **Also closes M3's last success criterion** ("Staging deploy works without manual DB reset") via the auto-deploy of this migration.

Frontend is intentionally out of scope: it has UI components with no signed-off UX artifact (`specs/ux/word-builder-ux.md` doesn't exist). Run `/add:ux specs/word-builder.md` before including it in a future cycle.

## Work Items

| # | Feature | Current Pos | Target Pos | Est. Effort | Validation |
|---|---------|-------------|-----------|-------------|------------|
| 1 | Word Builder Backend (migration + 3 endpoints + L1 seed) | SPECCED | VERIFIED | 4-8h | All 16 backend-scope ACs covered by integration tests (AC-002 through AC-014 minus UI-only items); staging end-to-end check green |

### Scope inclusions
- Alembic migration `002_word_builder.py`: 4 tables (Pattern, BaseWord, WordCombo, PatternProgress) with FKs, proper indexes, **full downgrade()** supporting upgrade→downgrade→upgrade roundtrip
- SQLAlchemy models for all 4 tables in `backend/app/models.py`
- Pydantic schemas in `backend/app/schemas.py` for the 3 endpoint response shapes from spec §5
- Route module `backend/app/routes/word_builder.py` with 3 endpoints:
  - `GET /api/word-builder/round?level={int}&count={5|10|20}` — returns challenges with distractor options
  - `POST /api/word-builder/results` — records attempt, updates PatternProgress stars (same thresholds: 2/4/7)
  - `GET /api/word-builder/progress` — returns per-level mastery + `unlocked` flag (AC-011 adaptive logic lives here)
- Wire router into `backend/app/main.py`
- Level-1 seed module `backend/app/seed_word_builder.py`:
  - 6 patterns: UN-, RE-, -ING, -ED, -S, -ER
  - ~15-20 base words
  - ~30 valid combos with definitions
  - Integrated into `seed.py` following the existing idempotent pattern
- Integration test files:
  - `backend/tests/test_word_builder_migration.py` — upgrade/downgrade/upgrade roundtrip + data preservation (cycle-9 test shape)
  - `backend/tests/test_word_builder.py` — endpoint tests (AC-002 through AC-014 in scope; AC-011 adaptive unlock)
  - `backend/tests/test_word_builder_seed.py` — idempotent seed, L1 combo count, FK integrity

### Scope exclusions
- Frontend UI (build screen, tiles, animations) — UI-gated, awaits `/add:ux`
- Level 2 and Level 3 seed content — deferred to later cycles alongside Frontend
- `result_word` value caching / materialized view — on-demand computation is fine at this scale

## TDD Phase Breakdown

### RED Phase — Write failing tests (target: ~60-90 min)

1. Write `test_word_builder_migration.py`:
   - `test_ac_migration_upgrade_creates_tables` — assert all 4 tables exist post-upgrade
   - `test_ac_migration_downgrade_removes_tables` — assert upgrade→downgrade→upgrade is clean
   - `test_ac_migration_preserves_existing_data` — pre-populate Profile/Category/Word, run upgrade, assert preserved
2. Write `test_word_builder_seed.py`:
   - `test_seed_idempotent_l1` — running seed twice yields same counts
   - `test_seed_l1_pattern_count` — 6 patterns at level=1
   - `test_seed_l1_combo_count_minimum` — ≥ 25 combos at level=1
3. Write `test_word_builder.py` endpoint tests (one per AC):
   - `test_ac002_get_round_returns_challenges_shape` — schema compliance with spec §5
   - `test_ac003_get_round_returns_2_or_3_options` — distractor count
   - `test_ac004_post_results_correct_attempt_records_star` — attempt → PatternProgress star increment
   - `test_ac005_post_results_wrong_attempt_no_star` — wrong doesn't increment
   - `test_ac006_prefix_vs_suffix_type_field` — `type: "prefix"|"suffix"` present on all options
   - `test_ac007_level_field_present` — `level` integer in response
   - `test_ac008_level1_patterns_are_the_expected_six` — UN/RE/-ING/-ED/-S/-ER
   - `test_ac011_adaptive_unlock_threshold` — when >= 70% of L1 patterns at 3 stars, L2 `unlocked: true`
   - `test_ac012_star_thresholds` — 2→1★, 4→2★, 7+→3★ same as WordProgress
   - `test_ac013_round_count_param` — `count=5|10|20` respected
   - `test_ac016_profile_scoped_progress` — different `X-Profile-ID` headers get distinct PatternProgress
4. Run `pytest tests/test_word_builder*` — **all must fail** (code doesn't exist yet). If anything passes, the test is wrong.
5. **Commit checkpoint** (optional, local only): "test: add failing tests for word-builder backend (RED)" — can squash at end.

### GREEN Phase — Minimal implementation (target: ~2-3h)

1. Draft `backend/alembic/versions/002_word_builder.py`:
   - `upgrade()`: CREATE patterns, base_words, word_combos, pattern_progress (with FKs + unique constraints)
   - `downgrade()`: drop in reverse FK order
2. Add SQLAlchemy models to `backend/app/models.py` mirroring the migration schema.
3. Add Pydantic schemas to `backend/app/schemas.py`:
   - `PatternOption`, `Challenge`, `RoundResponse`, `AttemptRequest`, `AttemptResponse`, `LevelProgress`, `ProgressResponse`
4. Create `backend/app/routes/word_builder.py` with the 3 endpoints.
5. Wire `word_builder_router` into `backend/app/main.py` `include_router`.
6. Create `backend/app/seed_word_builder.py` with L1 data; add to `seed.py` `SEED_DATA` list.
7. Run `pytest tests/test_word_builder*` — iterate until all green.

### REFACTOR Phase — Cleanup (target: ~30-45 min)

1. Extract shared distractor-selection helper if `GET /round` logic grows ungainly.
2. Align naming with existing conventions in `routes/progress.py` (e.g., `DB = Annotated[...]` pattern).
3. Add docstrings to public functions in `word_builder.py` per Beta docstring-on-exports guideline.
4. Run full suite (`pytest tests/ --cov=app`) — **no regressions** in the 48 existing tests; new tests all green.

### VERIFY Phase — Quality gates (target: ~15 min)

1. `ruff check . && ruff format --check .` — clean
2. `PYTHONPATH=. mypy app/ --ignore-missing-imports` — clean
3. `pytest tests/ --cov=app` — all pass, coverage ≥ 80% on `app/routes/word_builder.py`
4. Local `docker compose down -v && docker compose up` — backend starts clean, migration runs, seed applies
5. Hit endpoints via curl or httpie to spot-check:
   - `GET /api/word-builder/round?count=5` → valid JSON, 5 challenges
   - `GET /api/word-builder/progress` → valid JSON, L1 unlocked, L2 locked
6. Commit "feat: Word Builder backend (M7)" — single squash commit targeting `main`.

## Dependencies & Serialization

Single-item cycle, single-agent serial execution. Internal serialization:

```
RED (tests) → GREEN (migration → models → schemas → endpoints → seed) → REFACTOR → VERIFY → PR → merge → staging verify
```

External dependencies:
- M3 infrastructure — Alembic + idempotent seed + auto-deploy webhook are already in place (cycles 7-11). This cycle validates them on a real schema change.

## Parallel Strategy

None. `planning.parallel_agents: 1`. One branch, one agent, one PR.

## Validation Criteria

### Per-Item (Work Item 1)

**Tests (before implementation):**
- All new test files exist and **fail** on first run (RED phase proof)

**Tests (after implementation):**
- AC-002 through AC-014 + AC-016 each covered by a dedicated `test_acNNN_*` test; all passing
- Migration upgrade/downgrade/upgrade roundtrip passes
- Seed idempotency: running seed twice yields no new rows, same L1 pattern/combo counts
- AC-011 adaptive unlock: mocked PatternProgress at 70%+ mastery yields `unlocked: true` on L2
- No regressions in the 48 existing backend tests (total becomes ~60+)
- Coverage on `app/routes/word_builder.py` ≥ 80% (project threshold)

**Quality gates:**
- ruff check + format clean
- mypy clean
- Local `docker compose up` smoke: backend healthy, new endpoints respond 200/valid JSON
- CI green at 80% threshold

**Staging verification (closes M3 last criterion):**
- Auto-deploy webhook fires on merge to main
- `alembic upgrade head` runs automatically via Docker entrypoint (**no manual DB reset**)
- `GET /api/health` stays healthy
- `GET /api/word-builder/progress` with a test profile header returns valid JSON
- `GET /api/word-builder/round?count=5` returns 5 valid challenges

### Cycle Success Criteria

- [ ] All RED-phase tests wrote and failed before implementation
- [ ] All GREEN-phase tests pass after implementation
- [ ] Migration roundtrip test passes (upgrade → downgrade → upgrade)
- [ ] No regressions in 48 existing backend tests (total ≥ 60 tests)
- [ ] `app/routes/word_builder.py` coverage ≥ 80%
- [ ] CI green on PR
- [ ] PR squash-merged to main (self-authorized per Q7)
- [ ] Staging auto-deploy runs migration + auto-seed cleanly
- [ ] Staging `/api/word-builder/round` + `/progress` verified
- [ ] **M3 success criterion "Staging deploy works without manual DB reset" — ticked**
- [ ] M7 hill chart updated (Backend 0% → 100%)
- [ ] `.add/learnings.md` post-verify checkpoint written
- [ ] `.add/handoff.md` updated with outcome

## Agent Autonomy & Checkpoints

**Mode:** Beta + solo + half-day focused (user present for quick check-ins). Self-merge authorized per Q7.

### Autonomous (will do without asking)
- Create feature branch `feat/word-builder-backend`
- Write all RED-phase tests from the spec's ACs
- Draft migration, models, schemas, routes, seed
- Iterate until GREEN
- Run all quality gates locally
- Commit, push, open PR, wait for CI
- **Self-merge** after CI is green (per Q7; test-harness + backend-only, revert-if-red in place)
- Trigger staging verification via curl against `kids-words.staging.calebdunn.tech`
- Update M7 hill chart, cycle file, learnings, handoff
- Close M3's last success criterion when staging check is green

### NOT Autonomous (will queue for human)
- Any frontend work (UI-gated)
- Deploy to production
- Schema changes beyond the 4 tables in this spec
- Modifications to route files outside of `word_builder.py`
- Major FastAPI / SQLAlchemy / Alembic version bumps
- Changes to shared/production data

### Timebox
No strict hard timebox this cycle (unlike cycle-11's 30-min investigation cap). Budget is 4-8h total; if RED phase alone exceeds 90 min, pause and re-scope — likely a spec ambiguity that needs confirmation.

### Blocker Protocol
Log in `.add/handoff.md`, skip to the next substep, do not sit and wait. If the spec's API contract conflicts with the acceptance criteria in an unresolvable way, pause and ask.

## Rollback Plan (per Q7: single-commit PR, revert-if-red)

- All work stays on `feat/word-builder-backend` until CI green.
- PR squash-merges to a single commit on main — `git revert <sha>` cleanly reverses the entire migration + endpoints + seed if regressions surface post-merge.
- **Migration-specific rollback:** if staging auto-deploy applies `002_word_builder.py` but the new endpoints 500, the `revert` commit's auto-generated migration-revert step (or a hand-written `003_revert_word_builder.py`) undoes the schema change. Staging's auto-deploy then re-applies the new HEAD which no longer includes the new tables. `downgrade()` discipline is the safety net here.
- If PR CI never goes green, close the PR and iterate — no merge means no rollback needed.

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Migration downgrade() misses a FK drop order, roundtrip test fails | Medium | Low (test catches locally before PR) | Strict RED phase on roundtrip; iterate |
| Distractor-option logic for `GET /round` returns invalid tiles (e.g., grammar-nonsense combos) | Medium | Medium | Tests assert *valid* combos only appear as `correct_pattern`; distractors can be any other pattern — acceptable at this stage |
| Spec AC-015 ("show definition after correct tap") has no backend equivalent — definition stored in DB but not surfaced to UI | High | Low | Definition lives on WordCombo; endpoint returns it. Frontend's problem to display. |
| Auto-seed on Docker entrypoint fails due to new seed module import path | Low | High (staging broken) | Test `docker compose up` locally before merging; revert if staging 500s |
| Coverage on new route file < 80% | Low | Medium | TDD-strict already targets AC-coverage; all route branches should be hit by the AC tests |
| M3 last criterion doesn't close because staging has a stale volume | Low | Low | Staging deploy webhook redeploys containers, not volumes — schema migration on existing Postgres is the actual test |
| AC-015 definitions require manual authoring for 30 combos | Certain | Low | ~30 short strings — budget ~15 min during GREEN phase |

## Notes

- **This cycle's migration closes M3's last criterion.** Not cycle-specific success; ecosystem success. Explicitly verify it and tick the box on M3 at the same time cycle-12 completes.
- Cycle-11's pattern (tight scope + self-merge + revert-if-red) worked well. Applying the same shape here, just with real application code rather than config.
- TDD-strict is the first time it's being applied at this project's Beta scale on new backend code. Treat the RED phase as a correctness gate: if it's tempting to skip writing a test for an AC, that's a signal the AC is unclear, not that the test is unnecessary.
- Frontend cycle (M7 remaining: Build Screen, tiles, animations, round-complete integration, level indicator) is blocked on `/add:ux specs/word-builder.md`. Queue that as a precondition before cycle-13.
- Level 2 and Level 3 seed expansions (~40 + ~30 combos with definitions) deferred to a post-frontend cycle — they benefit from UI feedback on content tuning.
