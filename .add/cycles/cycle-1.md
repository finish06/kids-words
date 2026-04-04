# Cycle 1 — Frontend Tests & E2E

**Milestone:** M1 — Word Recognition
**Maturity:** Alpha
**Status:** COMPLETE
**Started:** 2026-04-04
**Completed:** 2026-04-04
**Duration Budget:** 1 session (~3-4 hours)
**Actual Duration:** ~2 hours

## Work Items

| Feature | Current Pos | Target Pos | Result | Validation |
|---------|-------------|-----------|--------|------------|
| Commit current work | IMPLEMENTING | IMPLEMENTING | DONE | All changes committed |
| Frontend unit tests | NOT_STARTED | COMPLETE | DONE | 27 tests, 84% coverage |
| E2E tests (Playwright) | NOT_STARTED | COMPLETE | DONE | 6 tests, all passing |
| Spec status updates | Draft | Implementing | DONE | Milestone updated |

## Results

### Tests Written
- **Frontend unit:** 27 tests across 5 files (CategoryList, MatchRound, RoundComplete, useRound, API client)
- **E2E:** 6 Playwright tests (TC-001 through TC-005 + TC-004b)

### Coverage
- Backend: 90% (no change — no regressions)
- Frontend: 84% line coverage

### Quality Gates
- Ruff: clean
- TypeScript: clean
- All tests passing

## Cycle Success Criteria
- [x] All uncommitted work committed to feat/word-image-matching
- [x] Frontend unit tests pass with 80%+ coverage (84%)
- [x] E2E tests pass for both spec test cases (6/6)
- [x] Backend tests still pass (19/19, no regressions)
- [x] Ruff + TypeScript checks clean
- [x] Milestone hill chart updated

## Learnings
- Vitest + React Testing Library + jsdom works well for component testing
- Playwright E2E must live outside the frontend package to avoid Vitest globals conflict
- Ruff formatting drift happens — run `ruff format` before every commit
