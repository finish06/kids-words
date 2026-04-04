# Cycle 1 — Frontend Tests & E2E

**Milestone:** M1 — Word Recognition
**Maturity:** Alpha
**Status:** PLANNED
**Started:** 2026-04-04
**Completed:** TBD
**Duration Budget:** 1 session (~3-4 hours)

## Work Items

| Feature | Current Pos | Target Pos | Assigned | Est. Effort | Validation |
|---------|-------------|-----------|----------|-------------|------------|
| Commit current work | IMPLEMENTING | IMPLEMENTING | Agent-1 | ~15 min | All uncommitted changes committed to feat branch |
| Frontend unit tests | NOT_STARTED | COMPLETE | Agent-1 | ~2 hours | 80%+ frontend coverage, all tests passing |
| E2E tests (Playwright) | NOT_STARTED | COMPLETE | Agent-1 | ~1.5 hours | Happy path + error path E2E, screenshots captured |
| Spec status updates | Draft | Implementing | Agent-1 | ~10 min | word-image-matching spec updated to Implementing |

## Dependencies & Serialization

```
Commit current work (must be first — clean baseline)
    ↓
Frontend unit tests (Vitest + React Testing Library)
    ↓
E2E tests (Playwright — requires Docker Compose running)
    ↓
Spec status updates + quality gate check
```

Single-threaded execution. Features advance sequentially.

## Validation Criteria

### Per-Item Validation

**Frontend unit tests:**
- CategoryList component: renders categories, handles loading/error states
- MatchRound component: renders word + image grid, handles correct/incorrect taps
- QuizLengthPicker component: renders 5/10/20 buttons, disables when count > words
- RoundComplete component: renders celebration, play again and home buttons
- useRound hook: state management, debouncing, auto-advance, round completion
- API client: fetch wrapper, typed responses

**E2E tests (Playwright):**
- TC-001: Happy path — select category → pick quiz length → match words → round complete
- TC-002: Incorrect match — wrong tap shakes, retry succeeds
- TC-003: Category selection — home screen shows categories
- TC-004: Quiz picker — 5/10/20 options, disabled for small categories
- TC-005: Back navigation from quiz picker and round

### Cycle Success Criteria
- [ ] All uncommitted work committed to feat/word-image-matching
- [ ] Frontend unit tests pass with 80%+ coverage
- [ ] E2E tests pass for both spec test cases
- [ ] Backend tests still pass (no regressions)
- [ ] Ruff + TypeScript checks clean
- [ ] word-image-matching spec status updated to Implementing

## Agent Autonomy & Checkpoints

Alpha maturity, human available now: High autonomy. Agent executes sequentially, reports results after each phase. Human reviews in real-time.

## Notes

- Vitest is the natural choice (already in Vite ecosystem)
- React Testing Library for component tests
- Playwright for E2E (need to install)
- Docker Compose must be running for E2E tests (API calls)
- Focus on both specs' test cases (word-image-matching TC-001 to TC-005, quiz-length-picker TC-001 to TC-004)
