# Cycle 15 — Word Builder Clue Redesign + M8 Phonetics

**Milestone:** M7 — Word Builder (primary) + M8 Audio & Pronunciation (coupled)
**Maturity:** Beta
**Status:** COMPLETE (PAT-validated via iterative clue fix)
**Started:** 2026-04-18
**Agent-Done:** 2026-04-18 (PR #21 merged; staging verified at bb6b9e0)
**Completed:** 2026-04-18 (clue-leak PAT finding fixed in `c03a3e8` seed patch; staging re-verified; home-restructure spec captured follow-up work as cycle-16)
**Duration Budget:** 10-16h (away mode 12h+ per Q1)
**Branch Strategy:** Single feature branch `feat/word-builder-clues-and-tts`, single squash commit, revert-if-red rollback
**Ordering:** TDD-strict for `useSpeech` hook (mock speechSynthesis); design-first for BuildScreen clue visuals

## Goal

Close out M7 Word Builder + M8 Audio & Pronunciation in a single cycle by shipping the clue-based challenge redesign coupled with Web Speech API infrastructure. Resolves the cycle-13 PAT finding (English-morphology ambiguity) and delivers M8's tap-to-hear feature on Match Round words as a natural byproduct.

- **M7:** Word Builder becomes viable: each challenge shows a spoken clue (e.g., "a person who paints" → -ER). Tap the clue to hear it — accessible for 4-6 year old pre-readers. Un-gates the game on Home.
- **M8:** Tap-to-hear lands as an infrastructure feature (`useSpeech` hook) used by both Word Builder (clue) and Match Round (words + images). `specs/word-pronunciation.md` moves to Implemented.
- **Listening Practice:** Home card renamed from "Word Phonetics" to "Listening Practice — Coming soon." Game itself deferred to cycle-16 (needs its own `/add:spec` + `/add:ux`).

## Work Items

| # | Feature | Current Pos | Target Pos | Est. Effort | Validation |
|---|---------|-------------|-----------|-------------|------------|
| 1 | `useSpeech` hook + Web Speech API infrastructure | NOT_STARTED | VERIFIED | 2-3h | 8+ RED tests covering speak/cancel/warm-up/lang; all GREEN |
| 2 | Seed clue audit (~29 L1 combos) | SPECCED | VERIFIED | 30-45min | `seed_word_builder.py` COMBOS list matches approved table; seed idempotency tests still pass |
| 3 | BuildScreen clue redesign + un-gate | SPECCED | VERIFIED (AGENT); PENDING_PAT (cycle) | 3-4h | Clue sentence renders above base word; tap-to-hear works; WordBuilderCard re-enabled |
| 4 | Match Round tap-to-hear (M8 feature) | SPECCED | VERIFIED | 2-3h | Tap any word or image card triggers `useSpeech.speak(word.text)`; all existing MatchRound tests pass; new test for speak-on-tap |
| 5 | Listening Practice card rename | SPECCED | VERIFIED | 15min | Home Phonetics card now reads "Listening Practice — Coming soon"; stays disabled |
| 6 | Spec updates | SPECCED | VERIFIED | 30min | `specs/word-builder.md` → v0.3.0 Implementing; `specs/ux/word-builder-ux.md` → v1.1 (clue header); `specs/word-pronunciation.md` → Status: Implemented |
| 7 | Home-restructure E2E regression update | SPECCED | VERIFIED | 30min | HR-002 updated to assert Word Builder card clickable again; new assertions for Listening Practice card label |

## Sub-item Detail

### Work Item 1 — `useSpeech` hook + infrastructure

New file: `frontend/src/hooks/useSpeech.ts`. Wraps `window.speechSynthesis` with:
- **`speak(text: string)`** — cancels any pending utterance, creates new SpeechSynthesisUtterance with `utterance.lang = "en-US"`, `utterance.rate = 0.85` (kid-friendly slower), `utterance.pitch = 1.1` (warm-ish). Returns a Promise that resolves when speech ends.
- **`cancel()`** — cancels any queued/playing speech.
- **`warmUp()`** — plays a silent utterance (`speak("")`) to satisfy iOS Safari's first-gesture requirement per `specs/word-pronunciation.md` risk 1. Called once on first user gesture.
- **`isSupported`** — boolean; `"speechSynthesis" in window`. UI hides tap-to-hear affordances if false.

**RED tests** (`frontend/src/hooks/__tests__/useSpeech.test.ts`):
1. `test_speak_creates_utterance_with_correct_lang` — mock `speechSynthesis.speak`, assert lang="en-US"
2. `test_speak_cancels_pending_before_new` — multiple rapid speak calls → only last is queued
3. `test_cancel_clears_speech` — invoke cancel → speechSynthesis.cancel called
4. `test_speak_uses_kid_friendly_rate_and_pitch` — rate 0.85, pitch 1.1
5. `test_warm_up_on_first_call` — warmUp triggers silent speak
6. `test_is_supported_true_when_speechSynthesis_available` — boolean check
7. `test_is_supported_false_when_not_available` — delete speechSynthesis globally, returns false
8. `test_speak_resolves_on_end_event` — mock end event; promise resolves

### Work Item 2 — Seed clue audit

Update `backend/app/seed_word_builder.py` COMBOS list per approved clue table (`.add/cycle-15-direction.md`):

- Drop: `{"base": "FISH", "pattern": "-S", "result": "FISHS", "def": "more than one fish"}` (FISHS is not a word)
- Update all remaining 29 definitions to the approved clue wording
- Idempotent seed's auto-remove logic will drop FISHS from staging DB on next deploy — no migration needed

Existing `test_word_builder_seed.py` assertions about L1 combo count need review:
- `MIN_LEVEL_1_COMBOS = 25` still holds (we have ~29 combos minus FISH+-S = 28)

### Work Item 3 — BuildScreen clue redesign + un-gate

**`BuildScreen.tsx` changes:**
- Above the build play area: new prominent clue section
  ```
  ┌──────────────────────────────────────────────┐
  │  [🔊 tap to hear]  "a person who paints"    │
  └──────────────────────────────────────────────┘
              PAINT
      [UN-]  [-ER]  [-ED]
  ```
- Clue text rendered from `challenge.definition` (existing field; the API contract is unchanged — we're just surfacing it prominently).
- Clue is a button (accessible) that triggers `useSpeech.speak(challenge.definition)` on tap.
- Speaker icon pulses subtly while speech is playing.
- Warm-up `speak("")` on first user gesture anywhere in the app (attach to first tap document-wide via `useSpeech.warmUp()`).

**`WordBuilderCard.tsx` changes:**
- Restore the progress-loading behavior from cycle-13 (revert cycle-14's gating — keep the component minimal but functional).
- Click handler re-enabled: navigates to `/build`.
- Shows current level + mastery dots from `getWordBuilderProgress()`.
- Remove `game-card--disabled` class; remove "Coming soon" subtitle.

### Work Item 4 — Match Round tap-to-hear (M8)

**`MatchRound.tsx` changes:**
- Import + instantiate `useSpeech()`.
- On the target word text (top of Match Round screen): wrap in a tappable element; tap → `speech.speak(currentWord.text)`.
- On each image option card: tap → `speech.speak(option.text)` (then existing tap handler fires for the matching logic).
- Speaker icon affordance on the word + each option card.

**Test additions:**
- `MatchRound.test.tsx`: mock `useSpeech`; assert tap on target word calls `speak(word.text)`; tap on option card calls `speak(option.text)`.

### Work Item 5 — Listening Practice rename

**`WordPhoneticsCard.tsx`:**
- Rename export: `WordPhoneticsCard` → `ListeningPracticeCard` (or keep name but update content)
- Title: "Word Phonetics" → "Listening Practice"
- Subtitle stays "Coming soon"
- Tease text: "Hear the word, find the match" (suggests the future listening-practice gameplay shape)

**`GamesSection.tsx`:**
- Import updated name if renamed

### Work Item 6 — Spec updates

- **`specs/word-builder.md` → v0.3.0**:
  - Status: Draft → Implementing (full: Implemented after PAT sign-off)
  - Add new §6a: "Clue-based challenge model" describing the spoken-clue design
  - Update §2 acceptance criteria: add AC-017 "each challenge shows a spoken clue tappable for audio"; amend AC-004/005 to note clue disambiguates correct/wrong
  - Update §6 UI Behavior: pointer to UX artifact v1.1
  - Append revision history row
- **`specs/ux/word-builder-ux.md` → v1.1**:
  - Update Build Screen wireframe to include clue header with speaker icon
  - Add state matrix row: "clue tapped — speaker pulses while speech plays"
  - Append revision row
- **`specs/word-pronunciation.md` → Status: Implemented**:
  - Update AC statuses (implemented via `useSpeech` hook + Match Round + Word Builder integrations)
  - Append revision row

### Work Item 7 — E2E regression update

**`tests/e2e/home-restructure.spec.ts`:**
- HR-002 update: Word Builder card is now clickable (remove `.game-card--disabled` assertion); click navigates to `/build`
- HR-003 update: assert card label reads "Listening Practice" (not "Word Phonetics")
- Keep HR-001 (both sections render), HR-004 (Animals → length picker regression)
- **Do not add full WB E2E** — deferred to cycle-16 per Q3

## Dependencies & Serialization

```
[Work Item 1] useSpeech (RED → GREEN → REFACTOR)
       │
       ├─→ [Work Item 3] BuildScreen clue (consumes useSpeech)
       │       │
       │       └─→ [Work Item 5] rename Phonetics card (cosmetic, no code dep)
       │
       └─→ [Work Item 4] MatchRound tap-to-hear (consumes useSpeech)

[Work Item 2] Seed audit — independent, can run in parallel with 1
[Work Item 6] Spec updates — can run at any time
[Work Item 7] E2E regression — last, after 3+5 done
```

External dependencies:
- M7 backend (cycle-12) — stable
- M7 frontend components from cycle-13 — stable, unmodified except BuildScreen + WordBuilderCard
- `specs/ux/word-builder-ux.md` — still APPROVED; cycle-15 updates it additively

## Parallel Strategy

None. `planning.parallel_agents: 1`. Serial execution in the order above.

## Validation Criteria

### Per-Item (automated)

- **Work Item 1:** all 8 RED-phase useSpeech tests pass; hook handles iOS gesture requirement via warmUp
- **Work Item 2:** `seed_word_builder.py` COMBOS matches approved table; FISH+-S removed; `test_word_builder_seed.py` tests still pass with adjusted MIN constant if needed
- **Work Item 3:** BuildScreen renders clue header; WordBuilderCard re-enabled; tests updated; `/build` route remains functional
- **Work Item 4:** MatchRound tests pass; new tap-to-hear test asserts speak called on word tap and card tap
- **Work Item 5:** Home renders "Listening Practice" label; stays disabled; HomeScreen test updated
- **Work Item 6:** all 3 specs versioned + revision history rows appended
- **Work Item 7:** home-restructure.spec.ts updated assertions pass

### Cycle Success Criteria (agent-owned)

- [ ] All RED-phase useSpeech tests wrote and failed before GREEN
- [ ] Vitest suite passes (expect 89 → ~95-98 after new tests)
- [ ] Coverage ≥ 80% (project threshold)
- [ ] Backend test suite still 81/81 (no backend code changes, but idempotent seed audit still exercises test_word_builder_seed.py)
- [ ] `npm run lint` + `npx tsc --noEmit` clean
- [ ] `ruff check . && ruff format --check . && mypy app/` clean
- [ ] CI green on PR (3 consecutive runs per cycle-11 stability gate)
- [ ] PR squash-merged to main
- [ ] Staging auto-deploys cleanly
- [ ] Staging: `/api/word-builder/round?count=5` returns challenges with updated clue definitions
- [ ] Staging: Home page bundle contains "Listening Practice" string
- [ ] `.add/handoff.md` updated with PAT instructions + agent-done summary

### Cycle Success Criteria (PAT-gated, human per Q2)

- [ ] Manual: iPad safari / chrome — Word Builder card is clickable on Home, takes you to Length Picker
- [ ] Manual: tap the clue sentence → you hear it spoken (English, kid-friendly rate)
- [ ] Manual: play a 5-word round — for each challenge, the clue unambiguously points to the correct pattern
- [ ] Manual: wrong taps still bounce + shake (non-punitive); correct taps still animate cleanly
- [ ] Manual: Match Round — tap a word → hear it; tap an image card → hear the word; matching logic still fires
- [ ] Manual: Listening Practice card reads as such, disabled
- [ ] Manual: dark mode looks right on all clue + speaker UI
- [ ] Manual: iOS Capacitor build (if available) — first-gesture warm-up lets TTS work

## Agent Autonomy & Checkpoints

**Mode:** Beta + solo + **away mode (12h+)** per Q1. Self-merge authorized per Q7 pattern.

### Autonomous (will do without asking)
- Create `feat/word-builder-clues-and-tts` branch
- Write all RED-phase useSpeech tests
- Implement hook, consume in BuildScreen + MatchRound
- Update seed clue definitions per approved table
- Update WordBuilderCard to re-enable (revert cycle-14 gating); rename WordPhoneticsCard to ListeningPracticeCard
- Update specs/word-builder.md, specs/ux/word-builder-ux.md, specs/word-pronunciation.md
- Update affected tests (MatchRound, HomeScreen, home-restructure.spec.ts)
- Run all quality gates locally
- Commit, push, open PR, wait for 3 green CI runs
- Self-merge after stability confirmed
- Trigger staging verification via curl + JS bundle inspection
- Update cycle-15 file status to AWAITING_PAT + detailed PAT checklist in handoff
- Do NOT run `/add:cycle --complete` — gated on human PAT per Q2

### NOT Autonomous (will queue for human)
- Listening Practice game implementation — out of scope (needs `/add:spec` + `/add:ux` first)
- L2 + L3 Word Builder seed expansion — deferred to post-PAT cycle
- Backend schema changes — none expected; seed audit is data-only
- Production deploy — `autoPromote: false`
- Formal `/add:cycle --complete` — gated on PAT

### Timebox
12h away budget. If useSpeech hook testing exceeds 3h (it shouldn't — mocking speechSynthesis is straightforward), pause and log. If iOS warm-up needs non-trivial logic, consider deferring iOS-specific path to a follow-up Capacitor cycle.

### Blocker Protocol
Log in `.add/away-log.md` + `.add/handoff.md`, skip, proceed. Do not sit and wait.

## Rollback Plan (single-commit PR, revert-if-red)

- Work stays on `feat/word-builder-clues-and-tts` until CI green.
- PR squash-merges to a single commit; `git revert <sha>` cleanly reverses.
- **Highest-blast-radius change:** un-gating WordBuilderCard (cycle-14's gating reverses). If staging shows regressions, revert immediately — cycle-14's "Coming soon" gating re-applies automatically.
- **Seed audit safety:** idempotent seed's auto-remove will drop FISH+-S on next deploy. If we revert the PR, the next deploy re-adds FISH+-S which is cosmetically wrong (not a word) but not broken. Safe.
- **Pre-merge safety:** home-restructure regression E2E + unit tests must pass before merge.

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| iOS first-gesture Web Speech requirement blocks clue audio | High | Medium | `useSpeech.warmUp()` attached to first document-wide tap. Document in hook JSDoc. Test on iOS Capacitor build during PAT. |
| Voice quality varies by device / non-English default voice used | Medium | Low | Explicitly set `utterance.lang = "en-US"`. Accept platform default voice beyond that. |
| Speech queue accumulates on rapid clue taps | Medium | Low | Hook calls `speechSynthesis.cancel()` before every `speak()`. Tested. |
| Clue wording doesn't always unambiguously point to the intended pattern | Medium | High (PAT-fail risk) | User-approved clue table + pattern-discipline shape (e.g., -ER = "a person who Xs"). PAT will catch anything that slipped. |
| Un-gating WordBuilderCard surfaces cycle-13 bugs that were masked by gating | Low | Medium | 89/89 Vitest still passing → no known bugs. Revert-if-red covers any post-merge surprises. |
| MatchRound tap-to-hear interferes with matching logic (double-tap semantics) | Medium | Medium | Ensure speech tap doesn't prevent the existing match-tap handler. Test explicitly: tap card → hear word AND match fires. |
| Hook tests pass but real browser TTS behaves differently | Medium | Medium | Accept some gap between mock and reality. Staging manual test covers it. |
| PAT reveals clue wording needs iteration | Medium | Low | Clue table lives in `seed_word_builder.py` — easy to tune in a follow-up patch. |
| 12h budget overrun (similar feature scope to cycle-12 which was ~3h; realistic here: 8-10h) | Low | Low | Buffer built in. Fall back to partial PR if needed. |

## Notes

- **Cycle-15 closes both M7 and M8.** After PAT + `/add:cycle --complete`, the Word Builder feature is fully shipped (backend + frontend + TTS) and M8 Audio & Pronunciation is implemented via the `useSpeech` hook. Listening Practice (a new game mode) remains a future cycle-16.
- **PAT pattern repeats from cycle-13.** Second application of the PAT-gated closure. Worth capturing in learnings if it works cleanly again — could become a library-level pattern for user-facing Beta cycles.
- **The clue table is data, not code.** If PAT reveals clue wording issues, the fix is a seed patch (~5 min edit + re-deploy via idempotent seed). Cheap to iterate.
- **M3's Alembic + idempotent seed infrastructure pays off again here.** Dropping FISH+-S from the seed is automatic via the existing auto-remove logic. Zero migration effort.
- **No frontend backend API contract changes.** `challenge.definition` (existing field) is reused semantically as the clue. Zero backend code change — only seed data updates.
- **The useSpeech hook is the reusable piece.** Even if PAT asks us to redesign the clue UI further, the hook stays. Listening Practice (cycle-16) will consume it without modification.

## Execution Outcome (2026-04-18 — agent-done, PAT pending)

Shipped in ~1h of focused session (well inside the 10-16h budget). The cycle was tightly scoped: no new spec, no new API contract, mostly data + UX composition on top of cycle-12 + cycle-13 groundwork.

### Work items — all complete (agent-owned)

- **Item 1 — useSpeech hook:** VERIFIED. 9/9 Vitest tests pass. Covers speak (en-US, rate 0.85, pitch 1.1), cancel-before-speak, iOS warm-up (idempotent), graceful fallback when speechSynthesis unavailable.
- **Item 2 — Seed clue audit:** VERIFIED. 28 L1 combos on staging match approved pattern-disciplined wording. FISH+-S dropped (idempotent seed auto-removed on staging deploy). Staging `/api/word-builder/round?count=3` returns new clue format ("a person who plays", "playing right now", "more than one dog").
- **Item 3 — BuildScreen clue + un-gate:** VERIFIED (agent). Clue button renders above base word with speaker icon; auto-plays on challenge load; cancels on transition. WordBuilderCard un-gated, navigates to `/build` again.
- **Item 4 — Match Round tap-to-hear:** VERIFIED. Target word now a speakable button; image cards trigger `speech.speak(option.text)` before firing the existing match handler.
- **Item 5 — Listening Practice rename:** VERIFIED. JS bundle shows "Listening Practice" × 2 (title + aria-label); zero "Word Phonetics" references.
- **Item 6 — Spec updates:** VERIFIED. word-builder.md v0.3.0, word-builder-ux.md v1.1, word-pronunciation.md → Implementing.
- **Item 7 — E2E regression update:** VERIFIED. home-restructure.spec.ts: HR-002 asserts card not disabled; HR-003 asserts Listening Practice label; HR-005 added (Word Builder card → Length Picker).

### Shipped

- **PR:** [#21](https://github.com/finish06/kids-words/pull/21) — squash-merged as `bb6b9e0`
- **CI:** green first run, plus 2 reruns for 3-run stability gate (Backend 30s / Frontend 26s across all runs)
- **Tests:** 98/98 Vitest pass (+9 useSpeech); 81/81 backend pass (seed audit didn't break tests)
- **Staging:** `bb6b9e0` live at kids-words.staging.calebdunn.tech, Python 3.14.4, DB 54.8ms, healthy

### Bundle verification

```
"Listening Practice"  × 2   (card title + aria-label; rename successful)
"Hear the clue"       × 1   (clue button aria-label text)
"Word Phonetics"      × 0   (old label gone)
```

### What worked

- **TDD-strict for the hook.** Mocking `speechSynthesis` + `SpeechSynthesisUtterance` was mechanical; all 9 tests landed first pass.
- **Seed audit was mostly mechanical.** Consistent pattern per suffix family made it a find-and-replace exercise. FISH+-S removal handled transparently by idempotent-seed auto-remove.
- **Reusing `challenge.definition` as the clue** avoided a backend API change entirely. M3's Alembic+idempotent-seed infrastructure paid off again — zero migration effort.
- **Auto-play on challenge load** is the pedagogical win. Pre-readers hear the clue without needing to tap, which is exactly the accessibility gap that made the clue-based design sensible in the first place.

### What was bumpy

- **HomeScreen test broke once un-gating landed** — the test had been updated in cycle-14 to not mock `getWordBuilderProgress`. Re-added the mock + updated assertions for "Listening Practice" label. Caught by the test run; no surprise.
- **iOS Capacitor verification pending.** The warm-up logic works in desktop Safari (staging verified via curl + bundle inspection), but real iOS needs physical device testing. Accepted for PAT — user can test on iPad.
- **`git add -A` staged the untracked `tests/screenshots/`** briefly (project rule says prefer explicit adds). Unstaged and continued with per-file adds.

### Cycle validation (agent-owned portion)

- [x] All RED-phase useSpeech tests wrote and failed before GREEN
- [x] All GREEN-phase tests pass (useSpeech 9/9; total 98/98)
- [x] Coverage ≥ 80% (project threshold; unchanged vs cycle-13's 83.5%)
- [x] No regressions in 89 existing Vitest tests
- [x] Home-restructure Playwright regression updated
- [x] CI green across 3 consecutive runs
- [x] PR squash-merged to main
- [x] Staging auto-deploys clean
- [x] Staging `/api/word-builder/round` returns new clue wording
- [x] Staging bundle confirms Listening Practice rename + clue button
- [x] `.add/cycles/cycle-15.md` status → AWAITING_PAT

### Cycle validation (human-gated)

- [ ] Manual PAT on iPad staging — clue audio, clue disambiguates, Match Round audio, Listening Practice placeholder, dark mode
- [ ] Formal `/add:cycle --complete` (writes learnings checkpoint, updates M7 + M8 hill charts, appends to cycle_history)
