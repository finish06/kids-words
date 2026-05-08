# Implementation Plan: Game Progress Bar

**Spec:** specs/game-progress-bar.md (v0.2.0, Approved)
**UX:** specs/ux/game-progress-bar-ux.md (v1.0, APPROVED 2026-05-07)
**Created:** 2026-05-07
**Team Size:** Solo (autonomous agent + human review per cycle)
**Maturity:** Beta — full TDD, all gates blocking, ≥80% coverage
**Recommended Cycle Scope:** **Phase 1 only** for the initial cycle. Phase 2 in a fast-follow cycle after the backend changes are PAT'd on staging.

## Overview

Adds a horizontal gold-gradient progress bar to every star-tracking Game card on Home. Replaces the existing dot row + `0/6 ★` on `WordBuilderCard.tsx` and adds new progress UI to `WordMatchingCard.tsx`. Backend extends `/api/progress` and `/api/word-builder/progress` with two new fields (`stars_earned`, `stars_possible`); frontend renders the bar with confetti at 100% and a level-unlock toast.

## Objectives

- Surface real progress to children through a visual bar that always feels positive.
- Replace the dot-row pattern on Word Builder with a unified Game-card pattern that reusable for CVC and future Games.
- Maintain Beta-level rigor: TDD-strict, full test coverage, no regressions on shipped Home/Match/Builder behavior.

## Success Criteria

- All 24 acceptance criteria implemented and tested
- Backend coverage ≥ 80% (currently 93.59% — must not regress)
- Frontend coverage ≥ 80% (currently 85.87% — must not regress)
- No regressions in cycle-16 Home Games/Practice layout, cycle-15 Word Builder clue model, or M8 Match Round tap-to-hear
- iPad landscape PAT verifies bar rendering, animation, and 100%/unlock states

## Recommended Sequencing

1. **Cycle-16 PAT closes first** (independent — already queued for human return).
2. **M7 closure decision made** (independent — `docs/cvc-builder-impact-analysis.md` is the input).
3. **Phase 1 cycle (backend)** — this plan's first half, ~1-2 days.
4. Backend deploys to staging, smoke-test the new `/progress` shape, then **Phase 2 cycle (frontend)** — ~2-3 days.

The split avoids a giant single-PR review and lets the frontend land on a known-good API shape.

## Acceptance Criteria → Phase Mapping

| Phase | ACs covered |
|-------|-------------|
| **Phase 1 (backend)** | AC-008, AC-009, AC-010 (forward-only — CVC scaffold), AC-011, AC-019, AC-022, AC-023 (persistence is implicit in the existing star tables, but worth a regression test) |
| **Phase 2 (frontend)** | AC-001, AC-002, AC-003, AC-004, AC-005, AC-006, AC-007, AC-012, AC-013, AC-014, AC-015, AC-016 (test by switching profiles), AC-017, AC-018, AC-020, AC-021, AC-024 |

24 ACs total. Phase 1 covers 7; Phase 2 covers 17.

---

## Phase 1: Backend (extends `/progress` endpoints)

### File changes

| File | Change | LOC estimate |
|------|--------|--------------|
| `backend/app/schemas.py` | Add `stars_earned: int`, `stars_possible: int` to `ProgressSummary`. Add the same two fields to `WordBuilderProgressResponse` (top-level). | +6 |
| `backend/app/routes/progress.py` | In `GET /api/progress`: compute `stars_earned = sum(p.star_level for p in items)`, `stars_possible = total_words * 3`. Plumb into `ProgressSummary`. Defensive cap: `stars_earned = min(stars_earned, stars_possible)` for AC-022. | +6 |
| `backend/app/routes/word_builder.py` | In `GET /api/word-builder/progress`: compute `stars_earned = sum of pattern.star_level across unlocked levels`, `stars_possible = unlocked_pattern_count * 3`. Plumb into response. Defensive cap. | +10 |
| `backend/tests/test_progress.py` | Add tests for new fields: empty profile (0/660), partial progress, capped overflow, body-parts inclusion question (see Open Questions below) | +60-80 |
| `backend/tests/test_word_builder.py` | Add tests for new fields: L1-only unlocked (0/18 → 18/18), level-unlock denominator growth, capped overflow. **Note:** This file currently has 8 mypy errors boundaried to M7. New tests should be in a separate `tests/test_word_builder_progress_summary.py` file to avoid touching the boundaried code. | +80-100 (new file) |

### Tasks

| Task | AC | Effort | Dependencies |
|------|----|--------|--------------|
| TASK-101 — RED: Write failing tests for `stars_earned`/`stars_possible` on `/api/progress` | AC-008, AC-011, AC-019, AC-022 | 1.5h | spec, fixtures (existing) |
| TASK-102 — RED: Write failing tests for `/api/word-builder/progress` (new test file) | AC-009, AC-019, AC-022 | 1.5h | TASK-101 (pattern reuse) |
| TASK-103 — GREEN: Add fields to `ProgressSummary` and `WordBuilderProgressResponse` schemas | AC-019 | 30min | TASK-101, TASK-102 |
| TASK-104 — GREEN: Implement `stars_earned`/`stars_possible` computation in `/api/progress` | AC-008, AC-011, AC-022 | 1h | TASK-103 |
| TASK-105 — GREEN: Implement same in `/api/word-builder/progress`, scoped to unlocked levels | AC-009, AC-011, AC-022 | 1.5h | TASK-103 |
| TASK-106 — REFACTOR: Extract a small helper (e.g., `compute_star_summary(items, max_stars=3)`) so the two routes don't duplicate the math | — | 30min | TASK-104, TASK-105 |
| TASK-107 — VERIFY: Run `/add:verify --level deploy` (ruff, mypy app/, pytest, coverage ≥ 80%) | — | 30min | TASK-106 |
| TASK-108 — Manual smoke: `curl` the two endpoints against the local stack to confirm shape | — | 15min | TASK-107 |

**Phase 1 total: ~7h. Realistic for one focused session.**

### Test strategy (Phase 1)

- **Unit tests** (pytest): each new field on each endpoint; defensive cap; level-locked vs unlocked behavior for Word Builder.
- **Integration tests:** at least one test seeds a profile with mid-range progress and asserts the full response shape including the new fields.
- **No frontend changes in Phase 1** — clients ignore unknown fields, so the existing `WordBuilderCard` continues to work unchanged. The new fields are additive.

### Phase 1 risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Existing `mastery_percentage` semantics get confused with new `stars_earned/stars_possible` | Medium | Low | Distinct field names; add docstring on `ProgressSummary` clarifying the two metrics |
| Body-parts category inclusion (see Open Questions) blocks merge | Low | Medium | Default to including all categories in DB (matches AC-008 wording); flag as Open Question for post-Phase-1 review |
| `test_word_builder.py` mypy boundary forces tests into a new file | Low | Low | Create `tests/test_word_builder_progress_summary.py` (clean file, no boundaried code) |
| Capping logic introduces a 1-off bug at exactly 100% (e.g., off-by-one with float division) | Low | Low | Backend stays integer math (`min(earned, possible)`); display-side capping is Phase 2 concern |

---

## Phase 2: Frontend (bar component + card edits + confetti)

### File changes

| File | Change | LOC estimate |
|------|--------|--------------|
| `frontend/src/components/GameProgressBar.tsx` | **NEW** — reusable component: `<GameProgressBar starsEarned={N} starsPossible={M} />`. Renders bar + label + 100% badge + glow. Animation, reduced-motion, aria-label. | +120 |
| `frontend/src/components/__tests__/GameProgressBar.test.tsx` | **NEW** — unit tests for empty, partial, 100%, threshold-cross, reduced-motion, aria | +180 |
| `frontend/src/components/WordBuilderCard.tsx` | Replace dot-row + `{masteredCount}/{patternCount} ★` with `<GameProgressBar />`. Remove dropped subtitle copy. Keep level indicator. | -25 / +12 |
| `frontend/src/components/WordMatchingCard.tsx` | Add `<GameProgressBar />` driven by new `getMatchingProgressSummary()` API client function. Keep "Pick a category!" subtitle (per UX). | +25 |
| `frontend/src/api/client.ts` | Add `getMatchingProgressSummary()` (calls existing `/api/progress`, returns the `summary` block). Existing `getWordBuilderProgress()` already returns the new top-level fields once Phase 1 ships. | +10 |
| `frontend/src/types/index.ts` | Add `stars_earned`, `stars_possible` to `ProgressSummary` and `WordBuilderProgressResponse` TypeScript interfaces. | +4 |
| `frontend/src/index.css` | Bar fill/empty gradients, animation transition, glow keyframe, badge pill styling, toast pill styling, level-transition copy fade | +120 |
| `frontend/src/components/LevelUnlockToast.tsx` | **NEW** — small component for the `✨ New level unlocked! ✨` pill. Auto-dismiss 2.5s. | +40 |
| `frontend/src/components/__tests__/LevelUnlockToast.test.tsx` | **NEW** | +50 |
| `frontend/src/components/__tests__/WordBuilderCard.test.tsx` | **NEW** — verify dot row removed, bar rendered, level indicator preserved, subtitle dropped | +90 |
| `frontend/src/components/__tests__/WordMatchingCard.test.tsx` | Update existing test to assert bar renders + label increments | +30 |
| `frontend/src/components/__tests__/HomeScreen.test.tsx` | Update mocks: now also mocks `getMatchingProgressSummary`. Update assertions (no dot row on WB card). | +20 |
| `frontend/package.json` + `frontend/package-lock.json` | Add `canvas-confetti` (^1.9.x) + `@types/canvas-confetti` | dep |
| `frontend/src/lib/confetti.ts` | **NEW** — thin wrapper around canvas-confetti with reduced-motion check + once-per-session-per-card gating | +60 |
| `frontend/src/lib/__tests__/confetti.test.ts` | **NEW** — mock `canvas-confetti`, verify trigger gating | +60 |
| `tests/e2e/game-progress-bar.spec.ts` | **NEW** — Playwright E2E covering TC-001..TC-004 | +200 |

### Tasks

| Task | AC | Effort | Dependencies |
|------|----|--------|--------------|
| TASK-201 — Add `canvas-confetti` dependency, types | — | 15min | Phase 1 deployed |
| TASK-202 — RED: `GameProgressBar` test file (empty, partial, 100%, threshold-cross, reduced-motion, aria) | AC-001..007, AC-013, AC-014, AC-017, AC-021, AC-024 | 2h | TASK-201 |
| TASK-203 — GREEN: Build `GameProgressBar` component | AC-001..007, AC-013, AC-014, AC-017, AC-021, AC-024 | 2h | TASK-202 |
| TASK-204 — RED: `confetti.ts` test (gating, reduced-motion bypass) | AC-013 | 45min | TASK-201 |
| TASK-205 — GREEN: `confetti.ts` wrapper | AC-013 | 30min | TASK-204 |
| TASK-206 — RED: `LevelUnlockToast` test | AC-015 | 45min | TASK-203 |
| TASK-207 — GREEN: `LevelUnlockToast` component | AC-015 | 45min | TASK-206 |
| TASK-208 — Frontend types + API client additions | AC-019 (consumer side) | 30min | Phase 1 deployed |
| TASK-209 — RED: `WordBuilderCard` test rewrite (no dot row; renders `<GameProgressBar />`) | AC-018 | 1h | TASK-203 |
| TASK-210 — GREEN: Refactor `WordBuilderCard` to use `<GameProgressBar />` | AC-018 | 1h | TASK-209 |
| TASK-211 — RED: `WordMatchingCard` test additions (renders `<GameProgressBar />`, label increments) | AC-001 (Word Matching side) | 45min | TASK-203 |
| TASK-212 — GREEN: Wire `WordMatchingCard` to `getMatchingProgressSummary()` + `<GameProgressBar />` | AC-001 (Word Matching side) | 45min | TASK-211 |
| TASK-213 — Update `HomeScreen.test.tsx` mocks and assertions | AC-016 (profile-switch behavior) | 30min | TASK-210, TASK-212 |
| TASK-214 — CSS: bar fill, animations, glow, badge, toast, level-transition copy fade | AC-002..004, AC-012, AC-014, AC-015, AC-024 | 1.5h | TASK-203, TASK-207 |
| TASK-215 — Wire `LevelUnlockToast` into `WordBuilderCard` (and forward into CVC card pattern) | AC-015 | 45min | TASK-207, TASK-210 |
| TASK-216 — RED: E2E `tests/e2e/game-progress-bar.spec.ts` covering TC-001..TC-004 | TC-001..004 | 2h | TASK-210, TASK-212 |
| TASK-217 — GREEN: Stabilize E2E (selectors, animation timing) | TC-001..004 | 1h | TASK-216 |
| TASK-218 — REFACTOR: dedupe duplication between WB and WM card progress wiring (probably a tiny `useGameProgress(slug)` hook) | — | 1h | TASK-210, TASK-212 |
| TASK-219 — VERIFY: full quality gates + visual regression on cycle-16 Home layout | — | 1h | TASK-218 |
| TASK-220 — Manual iPad PAT (landscape + portrait + dark mode) | TC-001..004 | 30min | TASK-219 deploy |

**Phase 2 total: ~17h. Realistic 2-3 days.**

### Test strategy (Phase 2)

- **Unit tests** (vitest): Bar rendering states; confetti gating; toast lifecycle; card refactors.
- **Integration tests** (vitest with React Testing Library): Card → API → bar value flows.
- **E2E** (Playwright): full TC-001..TC-004 (fresh profile empty bars; bar growth after a round; 100% celebration; level unlock).
- **Visual regression** on cycle-16 Home grid (existing screenshots in `tests/screenshots/home-restructure/` should be re-baselined to include the new bars).
- **Reduced-motion test:** explicitly mock `prefers-reduced-motion: reduce` and assert confetti suppressed, animations snap.

### Phase 2 risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| `canvas-confetti` interacts badly with iOS Capacitor (canvas overlay z-index, performance) | Medium | Medium | Test on Capacitor build before merge; CSS-only fallback already discussed if blockers surface |
| Confetti fires on every Home open at 100% (gating bug) | Medium | Low | Once-per-session-per-card gate via React state + `sessionStorage` key per profile+game |
| Level-unlock toast fires for stale unlock state (kid unlocked L2 long ago, sees toast every visit) | Medium | Medium | `level_unlocked` field on POST `/results` response (already in `cvc-builder.md`) — toast only fires when this field is set on the most recent result. For Word Builder, may need a similar field on `POST /api/word-builder/results`. **Flagged as Phase 2 spec extension below.** |
| Bar adds vertical height to cards, breaking iPad landscape grid | Low | Medium | Visual regression test on cycle-16 baseline; existing 2-card grid has slack |
| `canvas-confetti` adds bundle weight (>3KB) | Low | Low | Bundle size check in CI; CSS-only fallback if it grows |
| Word Matching denominator semantics: include/exclude hidden body-parts category? | Medium | Low | **Open Question** — see below. Default: include all DB categories per AC-008 wording. |

---

## Conditional dependencies

### M7 closure decision (queued for human)

| If you choose | Effect on this plan |
|---------------|---------------------|
| **Option A** (parallel CVC implementation) | Plan is unchanged. Backend Phase 1 ships, frontend Phase 2 ships, both work for current Word Builder. Future CVC card adopts the same `<GameProgressBar />` from day one. |
| **Option B** (rescope M7 in place — mode-aware refactor) | Phase 2 should fold into the rescope cycle. Touching `WordBuilderCard.tsx` twice (once to add bar, once to make mode-aware) is wasted work. Delay Phase 2 until M7 rescope cycle starts. |
| **Option C** (shared primitives) | Phase 2 ships, but the rescope cycle that follows will ALSO touch `WordBuilderCard.tsx`. Acceptable since both touches are additive (bar then mode-awareness). |

**Recommendation:** make the M7 decision before Phase 2 starts. Phase 1 (backend) is safe under all three options.

### Cycle-16 PAT (queued for human)

The cycle-17 memo recommends landing this **after** cycle-16 closes via the iPad PAT. The Home layout should be PAT-stable before adding visible UI elements.

### CVC builder forward-compat

When `specs/cvc-builder.md` ships, its `/api/cvc-builder/progress` endpoint must include `stars_earned` and `stars_possible` (per cvc-builder.md AC-016 + this spec's AC-010). The CVC builder's home card adopts `<GameProgressBar />` from day one. **Out of scope for this cycle.**

---

## Effort summary

| Phase | Hours (TDD-strict) | Days (1 dev) |
|-------|-------------------:|-------------:|
| Phase 1 (backend) | 7h | 1 day |
| Phase 2 (frontend) | 17h | 2-3 days |
| **Total** | **24h** | **3-4 days** |

Solo agent + human review per cycle. WIP limit per `.add/config.json` is 3, parallel_agents is 1, so phases are serialized.

---

## Open Questions (flagged for human review)

1. ~~**Body-parts category inclusion in Word Matching denominator.**~~ **RESOLVED 2026-05-07: exclude body-parts.** Word Matching denominator counts only visible categories (`animals`, `colors`, `food`, `shapes`). Today's value: (100+10+63+22) × 3 = **585**. Hidden categories don't contribute to the bar because kids don't see them from the Word Matching card. Spec AC-008 updated to v0.2.1. Backend implementation must hardcode the same exclusion list as `WordMatchingCard.tsx` (currently just `body-parts`); a future enhancement would promote this to an `is_hidden` flag on the `Category` model.

2. **Word Builder `level_unlocked` field on POST `/results`.**
   - `specs/cvc-builder.md` includes `level_unlocked: int | null` on the POST `/results` response so the frontend knows when to fire the toast exactly once.
   - `specs/word-builder.md` does NOT have this field — its existing `POST /api/word-builder/results` returns just `{updated_progress, mastered_now}`.
   - For Phase 2 to fire the toast correctly without duplicate firings, Word Builder's results endpoint should add the same field. **This is a Phase 2 spec extension.** Recommend pinning in `specs/word-builder.md` (or its successor under M7 closure) before Phase 2 starts.

3. **CSS-only confetti fallback.**
   - UX picked `canvas-confetti`. If iOS Capacitor surfaces issues, the fallback is a CSS-keyframe burst. Worth pre-prototyping during TASK-201 to avoid mid-Phase-2 thrash.

4. **Phase 2 sequencing on M7 closure.**
   - If M7 Option B is chosen, Phase 2 may be delayed by 1-2 cycles. Confirm Phase 1 stability on staging during that wait so the API contract doesn't drift.

---

## Deliverables

### Phase 1
- `backend/app/schemas.py` extended (2 fields × 2 response types)
- `backend/app/routes/progress.py` updated (compute + plumb)
- `backend/app/routes/word_builder.py` updated (compute + plumb, scoped to unlocked)
- `backend/tests/test_progress.py` extended
- `backend/tests/test_word_builder_progress_summary.py` (new file, avoids M7-boundaried existing test file)

### Phase 2
- `frontend/src/components/GameProgressBar.tsx` (new)
- `frontend/src/components/LevelUnlockToast.tsx` (new)
- `frontend/src/lib/confetti.ts` (new wrapper)
- `frontend/src/components/WordBuilderCard.tsx` (refactored)
- `frontend/src/components/WordMatchingCard.tsx` (extended)
- `frontend/src/api/client.ts` + `frontend/src/types/index.ts` (extended)
- `frontend/src/index.css` (new bar/toast/badge styles)
- 5 new test files + 2 updated test files
- `tests/e2e/game-progress-bar.spec.ts` (Playwright)
- `frontend/package.json` + `package-lock.json` (canvas-confetti added)

### Documentation
- This plan
- Spec stays as-is (already at v0.2.0 Approved)
- Update `specs/word-builder.md` with `level_unlocked` field IF Open Question 2 is resolved in Phase 2's favor

---

## Spec Traceability

| AC | Phase | Tests |
|----|-------|-------|
| AC-001 | 2 | `WordBuilderCard.test.tsx`, `WordMatchingCard.test.tsx`, `GameProgressBar.test.tsx` |
| AC-002, AC-003, AC-004 | 2 | `GameProgressBar.test.tsx` (style assertions on filled/empty regions) |
| AC-005 | 2 | `GameProgressBar.test.tsx` (width assertion at 0%, 25%, 50%, 100%) |
| AC-006, AC-007 | 2 | `GameProgressBar.test.tsx` (label text matches `{N} ★`, no `/` or `%`) |
| AC-008 | 1 | `test_progress.py::test_stars_possible_aggregates_all_categories` |
| AC-009 | 1 | `test_word_builder_progress_summary.py::test_stars_possible_scopes_to_unlocked_levels` |
| AC-010 | future (CVC cycle) | tracked in `specs/cvc-builder.md` |
| AC-011 | 1 | `test_progress.py::test_stars_earned_sums_word_progress`, WB equivalent |
| AC-012 | 2 | `GameProgressBar.test.tsx::test_bar_animates_on_mount` |
| AC-013, AC-014 | 2 | `confetti.test.ts` (gating), `GameProgressBar.test.tsx` (badge appears at 100%) |
| AC-015 | 2 | `LevelUnlockToast.test.tsx`, `WordBuilderCard.test.tsx` (toast fires on unlock) |
| AC-016 | 2 | E2E TC-001 (profile switch refetches) |
| AC-017 | 2 | `GameProgressBar.test.tsx::test_renders_empty_state_with_zero_label` |
| AC-018 | 2 | `WordBuilderCard.test.tsx::test_no_dot_row_present` |
| AC-019 | 1 | both backend test files |
| AC-020 | 2 | E2E + visual regression on cycle-16 baseline |
| AC-021 | 2 | `GameProgressBar.test.tsx::test_aria_label_announces_progress` |
| AC-022 | 1 | `test_progress.py::test_stars_capped_at_possible`, WB equivalent |
| AC-023 | 1 | implicit — existing star tables persist; integration test on round-trip |
| AC-024 | 2 | `GameProgressBar.test.tsx::test_glow_at_100_percent_subsequent_visits` |
| TC-001..004 | 2 | `tests/e2e/game-progress-bar.spec.ts` |

---

## Plan History

| Date | Version | Notes |
|------|---------|-------|
| 2026-05-07 | 1.0 | Initial plan from `/add:plan`. Recommends Phase-1-only as initial cycle scope. |
