# Cycle-15 Direction (approved 2026-04-18)

Captures the product decisions made in-session on 2026-04-18 after cycle-13's PAT exposed the Word Builder challenge ambiguity and cycle-14 gated the game behind "Coming soon." This file exists so the next session can run `/add:cycle --plan` with full context without re-deriving the design.

## Product framing

The Word Builder redesign centers the **spoken clue**: each challenge shows a sentence (e.g., "a person who paints") above the base word. Tapping the sentence triggers TTS playback so pre-readers can hear it. The suffix the clue points to is unambiguous — "a person who paints" ⇒ -ER (PAINTER), distinct from "painted yesterday" (-ED) or "more than one paint" (-S).

This design **couples M7 Word Builder with M8 Phonetics** — the clue-as-instruction model is only accessible to 4-6 year olds because of tap-to-hear. They ship together in cycle-15.

## Cycle-15 scope (approved)

**In scope:**
- **`useSpeech` hook** — shared Web Speech API wrapper. iOS Capacitor safe (silent warm-up on first gesture per spec `specs/word-pronunciation.md` risk table).
- **Word Builder challenge redesign:**
  - `BuildScreen` adds a prominent clue sentence above the base word
  - Tap the clue → TTS reads it aloud
  - Clue comes from `WordCombo.definition` (existing field; re-used semantically as the clue)
  - Word Builder card un-gated from Home
  - Update `specs/word-builder.md` → v0.3.0 (Status: Implemented post-cycle), updated §2 acceptance criteria for clue-based model
  - Update `specs/ux/word-builder-ux.md` → new Build Screen wireframe with clue header
- **Seed clue audit** — update all WordCombo definitions to disambiguating clues (see approved table below). Drop FISH+-S (FISHS isn't a word). Net ~29 combos.
- **Match Round tap-to-hear** (M8 feature proper) — child taps any word or image card in Match Round; hears the word spoken.
  - Update `specs/word-pronunciation.md` → Status: Implemented post-cycle
- **Home card rename:** Word Phonetics card → "Listening Practice — Coming soon" (stays placeholder; actual game deferred to cycle-16).

**Out of scope (deferred to cycle-16 post `/add:spec` + `/add:ux`):**
- **Listening Practice** — the new game mode where child sees image → hears word → taps matching written word. Requires its own spec + UX artifact before Beta UI gate opens. Home card for it ships as a placeholder.
- **L2 + L3 Word Builder seed content** — same deferral logic from cycle-12 (benefits from UX feedback; cycle-15 only touches L1 clues).
- **Configurable TTS rate / voice selection** — future parent-settings polish.

## Approved L1 clue table

| Base | Pattern | Result | Clue (approved) |
|---|---|---|---|
| HAPPY | UN- | UNHAPPY | "not happy" |
| KIND | UN- | UNKIND | "not kind" |
| PLAY | RE- | REPLAY | "play it again" |
| READ | RE- | REREAD | "read it again" |
| WRITE | RE- | REWRITE | "write it again" |
| PAINT | RE- | REPAINT | "paint it again" |
| PLAY | -ING | PLAYING | "playing right now" |
| RUN | -ING | RUNNING | "running right now" |
| JUMP | -ING | JUMPING | "jumping right now" |
| SING | -ING | SINGING | "singing right now" |
| DANCE | -ING | DANCING | "dancing right now" |
| READ | -ING | READING | "reading right now" |
| PAINT | -ING | PAINTING | "painting right now" |
| PLAY | -ED | PLAYED | "played yesterday" |
| JUMP | -ED | JUMPED | "jumped yesterday" |
| PAINT | -ED | PAINTED | "painted yesterday" |
| DANCE | -ED | DANCED | "danced yesterday" |
| DOG | -S | DOGS | "more than one dog" |
| CAT | -S | CATS | "more than one cat" |
| BOOK | -S | BOOKS | "more than one book" |
| PLAY | -ER | PLAYER | "a person who plays" |
| RUN | -ER | RUNNER | "a person who runs" |
| JUMP | -ER | JUMPER | "a person who jumps" |
| READ | -ER | READER | "a person who reads" |
| WRITE | -ER | WRITER | "a person who writes" |
| TEACH | -ER | TEACHER | "a person who teaches" |
| SING | -ER | SINGER | "a person who sings" |
| DANCE | -ER | DANCER | "a person who dances" |
| PAINT | -ER | PAINTER | "a person who paints" |

**Pattern discipline:** each pattern has a consistent clue shape (UN- "not X"; RE- "X it again"; -ING "Xing right now"; -ED "Xed yesterday"; -S "more than one X"; -ER "a person who Xs"). Repetition teaches the pattern, not just the combo.

**Dropped from seed:** FISH+-S=FISHS (not a valid English word; the real plural is FISHES and -ES isn't in L1).

## Risks to track in cycle-15 planning

1. **iOS Web Speech first-gesture requirement.** Per `specs/word-pronunciation.md`: iOS Safari requires a user gesture before `speechSynthesis.speak()` works. Mitigation: silent warm-up `speak("")` on first tap anywhere, documented in the `useSpeech` hook.
2. **Voice quality variance across devices.** Accept platform defaults per spec; document the variance.
3. **Speech queue accumulation on rapid taps.** `useSpeech` should `cancel()` pending speech before queueing a new utterance.
4. **Clue TTS latency.** If TTS takes >200ms to start on first invocation, kid may tap before audio plays. Consider visual feedback (speaker icon pulse) while speech initializes.
5. **Non-English browsers.** TTS may use a non-English voice if the user's device is set to another language. Explicitly set `utterance.lang = "en-US"`.
6. **Clue sentence rendering in dark mode.** Ensure the tappable clue affords "tap me to hear" (speaker icon + subtle interaction state).

## Cycle-15 interview shortcuts (when `/add:cycle --plan` is invoked)

Pre-answered from in-session decisions:
- **Q1 (features):** single combined scope — useSpeech hook + Word Builder redesign + Match Round tap-to-hear + Listening Practice placeholder
- **Q2 (availability):** TBD (user will declare at plan time)
- **Q3 (ordering):** TDD-strict for useSpeech hook (mock `window.speechSynthesis`); design-first for visuals
- **Q5 (home restructure):** no major restructure; just rename Phonetics → Listening Practice card
- **Q7 (review + rollback):** same as cycles 11-14 — self-merge after green CI, single-commit PR, revert-if-red
- **Q8 (PAT criteria):** staging smoke green + clue tap reads aloud on staging (automated curl can't verify TTS; user does a manual tap check)

UX gate for Word Builder: already APPROVED per `specs/ux/word-builder-ux.md`. The cycle-15 updates are additive (clue header); do not require a fresh `/add:ux` interview. UX artifact will be versioned to v1.1 as part of the cycle.

UX gate for Listening Practice: BLOCKED — card ships as placeholder only in cycle-15; actual game needs `/add:spec` + `/add:ux` before cycle-16.

## Files that will change in cycle-15

- `backend/app/seed_word_builder.py` — definition edits per approved clue table; drop FISH+-S
- `specs/word-builder.md` → v0.3.0 (clue-based challenge model; status Implemented after ship)
- `specs/ux/word-builder-ux.md` → v1.1 (clue header on Build Screen; tap-to-hear interaction)
- `specs/word-pronunciation.md` → Status: Implemented after ship (M8 lands)
- `frontend/src/hooks/useSpeech.ts` — new
- `frontend/src/hooks/__tests__/useSpeech.test.ts` — new (mock speechSynthesis)
- `frontend/src/components/BuildScreen.tsx` — clue header + tap-to-hear
- `frontend/src/components/WordBuilderCard.tsx` — ungate (restore progress-loading behavior from cycle-13)
- `frontend/src/components/WordPhoneticsCard.tsx` — rename label to "Listening Practice"; stays disabled
- `frontend/src/components/MatchRound.tsx` — tap word/image to hear
- `frontend/src/components/__tests__/*.test.tsx` — update affected tests
- `frontend/src/index.css` — clue-header styles; speaker icon; tap-affordance
- `tests/e2e/home-restructure.spec.ts` — restore HR-005 (Word Builder card clickable again); new assertions for Listening Practice card label

Estimated effort: ~10-16h. Away mode is appropriate.
