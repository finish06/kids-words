# M1 — Word Recognition

**Goal:** Build the core word-image matching activity that kids can use on a tablet.
**Appetite:** 2-3 weeks
**Status:** IN_PROGRESS
**Started:** 2026-04-04
**Target Maturity:** Alpha

## Hill Chart

```
Word-Image Matching  ██████████████████████████████████  100% — implemented + tested
Quiz Length Picker   ██████████████████████████████████  100% — implemented + specced + tested
Word Sets (OpenMoji)  ██████████████████████████████████  100% — 122 words seeded, images working
Frontend Tests       ██████████████████████████████████  100% — 27 tests, 84% coverage
E2E Tests            ██████████████████████████████████  100% — 6 Playwright tests passing
CI/CD Pipeline       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started (cycle-2)
```

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Word-Image Matching | specs/word-image-matching.md | VERIFIED | Backend + frontend + tests |
| Quiz Length Picker | specs/quiz-length-picker.md | COMPLETE | Implemented + spec + tested |
| Word Sets (OpenMoji) | — | COMPLETE | 100 animals + 10 colors + 12 food |
| Frontend Tests | — | COMPLETE | 27 Vitest tests, 84% line coverage |
| E2E Tests | — | COMPLETE | 6 Playwright tests |
| CI/CD Pipeline | — | NOT_STARTED | GitHub Actions (cycle-2) |

## Success Criteria

- [x] Child can complete a word matching round (5/10/20 words)
- [x] At least 3 word categories available (Animals, Colors, Food)
- [x] Visual feedback is encouraging and age-appropriate
- [x] Works on tablet-sized screens
- [x] Backend test coverage >= 80% (90%)
- [x] Frontend test coverage >= 80% (84%)
- [ ] CI/CD pipeline runs tests on push
- [x] All quality gates passing (ruff, tsc, vitest, playwright)

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
| pre-cycle | Backend API, Frontend Core, Word Sets, Quiz Picker | COMPLETE | Built during away mode |
| cycle-1 | Frontend unit tests, E2E tests | COMPLETE | 27 unit + 6 E2E, all quality gates pass |
| cycle-2 | CI/CD Pipeline | PLANNED | GitHub Actions |

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Python 3.14 compat | Medium | Medium | Fall back to 3.13 if needed |
| Frontend test setup complexity | Low | Medium | Resolved — Vitest + Playwright working |
