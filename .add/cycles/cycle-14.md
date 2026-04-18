# Cycle 14 — Gate Word Builder behind "Coming soon"

**Milestone:** M7 — Word Builder
**Maturity:** Beta
**Status:** COMPLETE
**Started:** 2026-04-18
**Completed:** 2026-04-18
**Duration:** ~45 min (PAT-response patch)

## Goal

Response to cycle-13 PAT. PAT surfaced a design ambiguity in the challenge model: English morphology is generative, so many challenges have multiple valid English answers (e.g., PAINT + -S = PAINTS, PAINT + -ED = PAINTED — both real words) but the current single-correct-pattern model treats only one as correct. This creates false-negative feedback that violates AC-005's non-punitive UX promise.

Per product call: keep all cycle-12 + cycle-13 code shipped, but gate the Home entry point until the challenge model is re-designed.

## Work Items

| # | Feature | Current Pos | Target Pos | Validation |
|---|---------|-------------|-----------|------------|
| 1 | Gate Word Builder card on Home | VERIFIED (clickable) | VERIFIED (disabled) | Card renders as "Coming soon" twin of WordPhoneticsCard; `/build` routes preserved for internal access |

## Changes shipped (PR #20 → `4a5d1cd`)

- **`WordBuilderCard.tsx`** — disabled "Coming soon" card, twin of WordPhoneticsCard. No API call, no click handler.
- **`HomeScreen.test.tsx`** — no longer mocks `getWordBuilderProgress`; asserts both game cards read "Coming soon".
- **`home-restructure.spec.ts`** — HR-002 asserts disabled state; HR-005 (Word Builder → length picker) removed since the card is no longer clickable from Home.

## What stays intact

- `/build` + `/build/play` routes — allows internal test access + future re-enable without route re-architecture
- All cycle-12 backend endpoints + seed data
- All cycle-13 frontend components (BuildScreen, BuildPicker, PatternTile, LevelIndicator, LevelUpModal, BuildRoundComplete, useBuildRound)
- `specs/ux/word-builder-ux.md` — still APPROVED for the shipped design; cycle-15 will revise it

## Staging verification

- `/api/version` on 2026-04-18 ~18:58 UTC: `git_commit: 4a5d1cd`, version 0.2.0, Python 3.14.4, fresh uptime
- JS bundle (`index-ClRVGZEw.js`) inspection: `"Coming soon" × 2`, `"game-card--disabled" × 2`, aria-label `"Word Builder game — coming soon"` present
- `/api/health`: healthy, DB 1.9ms
- `/api/word-builder/progress`: still responds (routes preserved)

## Cycle validation

- [x] PR #20 opened, CI green first run (Backend 30s, Frontend 24s)
- [x] 89/89 Vitest pass, lint + types clean
- [x] Squash-merged to main
- [x] Staging auto-deployed to `4a5d1cd`
- [x] JS bundle confirmed gating live for both game cards
- [x] Word Matching flows unaffected

## Notes

Cycle-14 is intentionally tiny and surgical — a PAT-response patch, not a planning-driven cycle. Its purpose is to prevent user exposure to the ambiguity bug while the proper fix (cycle-15) lands. The underlying M7 feature is *shipped* — just not *exposed*.

Next: cycle-15 will redesign the challenge model using clue-based challenges ("a person who paints" → -ER) combined with M8 Phonetics (tap-to-hear) so pre-readers can also play. User approved this direction + the clue table in-session 2026-04-18. See `.add/cycle-15-direction.md` for the approved scope.
