# Cycle 16 — Home Games/Practice Structure

**Milestone:** M7 (closure polish) — no new milestone; home restructure sits in M7's tail
**Maturity:** Beta
**Status:** COMPLETE (human PAT passed on iPad)
**Started:** 2026-04-18
**Agent-Done:** 2026-04-18 (PR #22 merged; staging verified at 783b08f)
**Completed:** 2026-05-16 (iPad PAT play-through passed all 12 checklist items)
**Duration Budget:** 3-5h half-day focused session
**Branch Strategy:** Single feature branch `feat/home-games-practice`, single squash commit, revert-if-red
**Ordering:** Design-first (no new state logic; pure structural restructure with existing components reused)

## Goal

Ship `specs/home-games-practice.md`. Restructures Home into two top-level sections — **Games** (Word Builder + consolidated Word Matching card) and **Practice** (Listening Practice + future-mode placeholder) — and relocates the 5 category cards to a new `/matching` route. Zero backend changes. No gameplay changes to Word Builder or Match Round.

## Work Items

| # | Feature | Current | Target | Est. | Validation |
|---|---------|---------|--------|------|------------|
| 1 | `MatchingScreen` component (new route `/matching`) | SPECCED | VERIFIED | ~1h | Renders 5 categories; handles loading/error/empty; back navigates Home |
| 2 | `WordMatchingCard` component (new, consolidated for Games section) | SPECCED | VERIFIED | 30min | Shows "5 categories" hint; tap navigates to `/matching` |
| 3 | `PracticeSection` component + ghost placeholder | SPECCED | VERIFIED | 45min | Listening Practice card + dashed-outline "More coming soon" card |
| 4 | `HomeScreen` re-layout | SPECCED | VERIFIED | 45min | GamesSection (WB + WM card) + PracticeSection; no inline WordMatchingSection |
| 5 | Routing in `App.tsx` | SPECCED | VERIFIED | 10min | `/matching` → MatchingScreen added |
| 6 | Tests (unit) | SPECCED | VERIFIED | 45min | MatchingScreen, WordMatchingCard, PracticeSection, HomeScreen updated |
| 7 | E2E regression rewrite per Q3 | SPECCED | VERIFIED | 30min | `tests/e2e/home-restructure.spec.ts` updated for new shape |
| 8 | CSS for Games grid / Practice grid / ghost slot | SPECCED | VERIFIED | 30min | iPad landscape primary; dark-mode safe |

## Pre-cycle housekeeping (part of this cycle's opening commit)

- **Close cycle-15** formally (M7 + M8 → Implemented). PAT-validated via clue-leak catch + seed patch iteration (`c03a3e8`). Append cycle-15 to `cycle_history` with outcome "success-with-pat-iteration".
- Update `planning.current_milestone` to reflect M7 closure posture (optionally stay at M7 for this cycle's work, then promote).

## Dependencies & Serialization

```
Work items 1+2+3 in parallel (pure component work)
    ↓
Work item 4 (composes them into HomeScreen)
    ↓
Work item 5 (routing)
    ↓
Work items 6+7 (tests against new structure)
    ↓
Work item 8 (visual polish iteratively during 4-7)
```

Single-threaded execution; no agent parallelism.

External dependencies:
- None — reuses existing `CategoryList` / `WordMatchingSection` rendering logic, moves it to MatchingScreen

## Parallel Strategy

None. Solo agent, single branch.

## Validation Criteria

### Per-Item (agent-owned)

**Automated:**
- All 15 ACs from spec have corresponding behavior in code
- MatchingScreen renders loading / ready / error / empty states
- Back button hierarchical (AC-008, AC-009)
- WB and MatchRound gameplay unchanged (AC-013, AC-014)
- 98+ Vitest tests pass; new tests cover MatchingScreen + WordMatchingCard + PracticeSection
- Lint + types clean
- Updated `home-restructure.spec.ts` passes locally (5-8 scenarios covering TC-001 through TC-004)

**Staging smoke:**
- `/api/health` healthy
- Home page loads with Games + Practice visible; JS bundle contains section headings
- `/matching` route returns the category grid
- `/play/:slug`, `/build`, `/build/play` still work

### Cycle Success Criteria (agent-owned)

- [ ] cycle-15 formally closed (M7 + M8 → Implemented; cycle_history appended)
- [ ] New spec's 15 ACs implemented (Must-level)
- [ ] Vitest 98+ pass; +3-5 new component tests; 0 regressions
- [ ] Lint + tsc clean
- [ ] E2E regression rewritten + passes
- [ ] CI green on PR (single run sufficient; 3-run gate is overkill for this scope)
- [ ] PR squash-merged
- [ ] Staging smoke green
- [ ] `.add/handoff.md` updated with PAT instructions

### PAT-gated (human per Q2)

- [ ] Manual: Home shows Games + Practice sections on iPad landscape
- [ ] Manual: Word Builder still works (Home → Length Picker → clue-based round)
- [ ] Manual: Word Matching card → `/matching` → category → Length Picker → round (new 4-tap flow)
- [ ] Manual: back navigation hierarchical
- [ ] Manual: dark mode clean on all new UI
- [ ] `/add:cycle --complete` after PAT passes

## Agent Autonomy

**Mode:** Beta + solo + half-day focused (Q1). Self-merge authorized after green CI (Q2 PAT-gate means cycle stays IN_PROGRESS post-merge until human PAT).

### Autonomous
- Close cycle-15 inline
- Create `feat/home-games-practice` branch
- Build components (1-4), routing (5), tests (6-7), CSS (8)
- Run quality gates
- Commit, push, PR, self-merge after 1 green CI run (smaller-scope cycle; stability gate from cycle-11 is overkill)
- Update handoff with PAT instructions; cycle stays AWAITING_PAT

### NOT Autonomous
- Word Builder / Match Round gameplay changes — explicitly out of scope
- Listening Practice game implementation — still cycle-17+ material
- `/add:cycle --complete` — PAT-gated

## Rollback Plan

Single-commit PR; `git revert <sha>` cleanly reverses the restructure. Home returns to the pre-cycle-16 Games + inline-WordMatchingSection layout. Low blast radius — no data, no API, no state.

## Risks

| Risk | Prob | Impact | Mitigation |
|------|------|--------|------------|
| Home restructure breaks an existing E2E flow | Med | Med | Rewrite home-restructure.spec.ts in same cycle (Q3) |
| Word Builder card regression (cycle-15 state drift) | Low | Med | AC-013 asserts no WB behavior change; component file untouched |
| Match Round audio regression | Low | Med | AC-014 asserts no MR change; only navigation path shifts |
| Ghost placeholder styling feels too rough on iPad | Med | Low | Iterate visual during DESIGN phase; fallback to plain "More coming soon" text |
| 4-taps-to-play feels slow vs current 3-tap | Med | Low | Accepted tradeoff per product direction; monitored in PAT |

## Notes

- **Existing `WordMatchingSection.tsx` should be renamed** to something that fits the new role, OR its logic extracted into MatchingScreen. Cleanest: delete WordMatchingSection.tsx (only consumer was HomeScreen which no longer needs inline), create MatchingScreen.tsx with the same logic plus a header + back button.
- **`CategoryList.tsx` was already removed in cycle-13.** No conflict.
- **Ghost slot design:** dashed 1px outline, muted fill, 80% the footprint of a real card, centered "More coming soon" text. Non-interactive (no hover, no pointer cursor).
- **Backward compat:** if users bookmark the old home URL `/`, they still get Home (just the new layout). If someone bookmarks a route like `/animals` (direct category), that never existed — WordMatching was always a path through Home. No breakage.
- **Spec ACs → test mapping:** TC-001 → e2e home-layout; TC-002 → e2e WM-to-round happy path; TC-003 → e2e back-nav; TC-004 → e2e WB-unchanged; TC-005/6/7 → Vitest component tests (error, empty, dark mode).
