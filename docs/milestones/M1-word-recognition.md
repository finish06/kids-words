# M1 — Word Recognition

**Goal:** Build the core word-image matching activity that kids can use on a tablet.
**Appetite:** 2-3 weeks
**Status:** IN_PROGRESS
**Started:** 2026-04-04
**Target Maturity:** Alpha

## Hill Chart

```
Word-Image Matching  ████████████████████████████░░░░░░  85% — implemented, needs frontend tests + commit
Quiz Length Picker    ████████████████████████████████░░  95% — implemented + specced, needs commit
Word Sets (OpenMoji)  ██████████████████████████████████  100% — 122 words seeded, images working
Frontend Tests       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
E2E Tests            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
CI/CD Pipeline       ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
```

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Word-Image Matching | specs/word-image-matching.md | IMPLEMENTING | Backend + frontend done, needs tests |
| Quiz Length Picker | specs/quiz-length-picker.md | COMPLETE | Implemented + spec written |
| Word Sets (OpenMoji) | — | COMPLETE | 100 animals + 10 colors + 12 food |
| Frontend Tests | — | NOT_STARTED | Vitest + React Testing Library |
| E2E Tests | — | NOT_STARTED | Playwright |
| CI/CD Pipeline | — | NOT_STARTED | GitHub Actions |

## Success Criteria

- [ ] Child can complete a word matching round (5/10/20 words)
- [x] At least 3 word categories available (Animals, Colors, Food)
- [x] Visual feedback is encouraging and age-appropriate
- [x] Works on tablet-sized screens
- [ ] Backend test coverage >= 80% (currently 90%)
- [ ] Frontend test coverage >= 80% (currently 0%)
- [ ] CI/CD pipeline runs tests on push
- [ ] All quality gates passing

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
| pre-cycle | Backend API, Frontend Core, Word Sets, Quiz Picker | COMPLETE | Built during away mode |
| cycle-1 | TBD | PLANNED | Next cycle |

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Python 3.14 compat | Medium | Medium | Fall back to 3.13 if needed |
| Frontend test setup complexity | Low | Medium | Use Vitest (already in Vite ecosystem) |
