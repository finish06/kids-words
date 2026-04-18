# Session Handoff
**Written:** 2026-04-18 (cycle-16 agent-done; PAT pending)

## Completed this session (interactive, then half-day focused)

### Late additions after cycle-15 closed
- **Clue leak fix (c03a3e8):** PAT caught that "-ING/-ED/-ER" clues contained inflected forms revealing the answer. Switched to bare-base-verb wording ("jump right now", "did jump", "people who jump"). Seed-only patch; idempotent auto-update on staging.
- **New spec: `specs/home-games-practice.md`** — restructure Home into Games + Practice sections, relocate 5 category cards to new `/matching` route.
- **Cycle-16 planned + executed:** PR #22 → `783b08f` staging live.

### Cycle-16 shipped
- **New components:** MatchingScreen, WordMatchingCard, PracticeSection
- **Updated:** HomeScreen (Games + Practice layout), GamesSection (WB + WM), App.tsx routing (new `/matching`)
- **Removed:** WordMatchingSection + its test (replaced by MatchingScreen)
- **New tests:** MatchingScreen (7), WordMatchingCard (4), HomeScreen (6 rewrites)
- **E2E regression rewritten** — 9 scenarios covering home layout + back nav + WB unchanged + category-to-length flow
- **CSS:** Games grid, Practice grid, ghost card, MatchingScreen header
- **107/107 Vitest pass; lint + tsc clean; CI green first run**

### Staging verified at `783b08f`
- Backend healthy, DB 53.2ms
- JS bundle contains: Games + Practice headings, Word Matching card, Listening Practice placeholder, "More coming soon" ghost, "Pick a category" subtitle, `/matching` route, `game-card--ghost` class

## ➡ PAT CHECKLIST (for you on iPad at https://kids-words.staging.calebdunn.tech/)

1. [ ] Home shows **Games** + **Practice** as section headings
2. [ ] Games row: Word Builder card + Word Matching card (both clickable)
3. [ ] Practice row: Listening Practice "Coming soon" + dashed "More coming soon" ghost
4. [ ] **No** category cards (Animals/Colors/Food/Shapes) visible directly on Home
5. [ ] Tap **Word Matching** card → `/matching` screen with "Pick a category!" heading + 5 category cards
6. [ ] Tap **Animals** → Length Picker
7. [ ] Tap **5** → Match Round plays as before (including cycle-15's tap-to-hear audio)
8. [ ] Back from Length Picker → returns to `/matching` (not Home)
9. [ ] Back from `/matching` → returns to Home
10. [ ] Tap **Word Builder** card → clue-based round still works (cycle-15 state preserved)
11. [ ] Toggle dark mode → both sections + MatchingScreen render cleanly
12. [ ] iPad landscape layout looks good (Games grid side-by-side; Practice grid side-by-side)

**If PAT passes:** `/add:cycle --complete` writes learnings, updates M7 closure bookkeeping, appends to `cycle_history`, and sets `current_cycle` to null.

**If PAT reveals issues:** file them for cycle-17. Spec is versioned so iteration is cheap.

## Config state
- `planning.current_milestone`: `M7-word-builder`
- `planning.current_cycle`: `cycle-16` (stays IN_PROGRESS until PAT + `/add:cycle --complete`)
- `cycle_history`: 9, 11, 12, 13, 14, 15 — cycle-16 appends on formal close

## Milestones
- **M1-M6 + M3:** COMPLETE
- **M7 Word Builder:** IN_PROGRESS — all user-facing work shipped through cycle-16; awaits PAT + `/add:cycle --complete` to formally close. Successful PAT would close M7.
- **M8 Audio & Pronunciation:** Implemented via cycle-15; awaits PAT confirmation through cycle-16's Match Round path.

## Deferred (for later cycles)
- Listening Practice game (needs `/add:spec` + `/add:ux` first)
- L2 + L3 Word Builder seed expansion
- Full Word Builder E2E Playwright (happy path, wrong-tap, level-up)
- Level-up modal detection (backend flag is ready to consume)
- Configurable TTS rate / voice
- `.add/learnings.md` → JSON migration (4th retro action deferral)

## Branch state
- `main` at `783b08f` (PR #22 merged, cycle-16 feature branch deleted)
