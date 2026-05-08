# Spec: CVC Word Builder — Phonics Blending Game

**Version:** 0.1.0
**Created:** 2026-05-07
**PRD Reference:** docs/prd.md
**Milestone:** M9 (proposed) — supersedes M7 Word Builder content layer
**Status:** Draft
**Replaces:** specs/word-builder.md (prefix/suffix model — to be marked Deprecated post-approval)
**Coupled with:** specs/word-pronunciation.md (M8) — uses `useSpeech` hook

## 1. Overview

A word-building game where a child sees a picture, hears the word, and drags letter tiles into slots to spell it. Correct letters snap into place, the completed word speaks aloud, and a star flies into the round counter. The game replaces the prior prefix/suffix Word Builder content layer with developmentally appropriate CVC (consonant-vowel-consonant) blending — the actual K-aligned phonics skill for ages 4-6 per Science-of-Reading scope-and-sequence guidance.

The mechanic, snap animation, mastery system, useSpeech hook, Home card slot, length picker, and round-complete celebration all carry forward from M7. Only the content layer changes: pictures replace base words, letter tiles replace prefix/suffix tiles, slots replace the prefix-left/suffix-right zones.

### User Story

As a child (4-6) learning to read, I want to drag letters into a picture's word so that I learn how letter-sounds blend to make whole words.

### Why this replaces the prefix/suffix Word Builder

- Prefix/suffix work is upper-K through 2nd-3rd grade content per Reading Rockets, Dr. Karen Speech, and standard SoR scope-and-sequences.
- The prerequisite is fluent decoding of base words, which the audience does not yet have.
- Cycle-13 PAT exposed the morphological ambiguity; cycle-15 patched it with spoken clues; the patch propped up an audience mismatch that should be addressed at the content layer instead.
- CVC blending is the explicit kindergarten skill: map `c-a-t` → "cat".

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | "Word Builder" card on Home Games section opens the CVC Build screen (replaces prefix/suffix content) | Must |
| AC-002 | Build screen shows the target word's picture prominently at the top | Must |
| AC-003 | Tapping the picture speaks the target word aloud via `useSpeech` (`utterance.lang = "en-US"`) | Must |
| AC-004 | Three empty slots are displayed in left-to-right order below the picture | Must |
| AC-005 | Letter tiles are displayed below the slots in randomized order | Must |
| AC-006 | Tapping a tile speaks its phoneme aloud (e.g., `c` → `/k/`); rapid taps cancel prior utterance via `useSpeech.cancel()` | Must |
| AC-007 | Dragging a tile onto the correct slot snaps it in place with bounce animation and chime | Must |
| AC-008 | Dragging a tile onto a wrong slot causes a gentle shake and the tile returns to its source position | Must |
| AC-009 | When all three slots are filled correctly, the completed word speaks aloud, the picture pulses, and a star animates into the round counter | Must |
| AC-010 | Quiz length picker (5 / 10 / 20) is shown before the round starts (reuses existing component) | Must |
| AC-011 | The game has 3 difficulty levels with adaptive progression | Must |
| AC-012 | Level 1 (short-a family) ships with at least 10 words: cat, bat, hat, mat, sat, rat, can, fan, man, pan; tiles are the 3 correct letters scrambled (zero distractors) | Must |
| AC-013 | Level 2 (short i/o/u) ships with at least 15 words spanning short-i, short-o, and short-u CVC patterns; tiles include 1 distractor letter | Should |
| AC-014 | Level 3 (digraph endings) ships with at least 10 words using `sh`, `ch`, `ck` as fused tiles (e.g., fish, ship, chip, duck, sock, cash, dash, lock, sick, pick); tiles include 2 distractors | Should |
| AC-015 | Adaptive unlock: 70%+ of current-level words at 3 stars unlocks the next level; subsequent rounds mix unlocked levels | Must |
| AC-016 | Star mastery is tracked per word using existing thresholds: 2 first-attempt-correct → 1 star, 4 → 2 stars, 7+ → 3 stars | Must |
| AC-017 | Round-complete screen lists words practiced with their star counts (reuses existing celebration component) | Must |
| AC-018 | Only first-attempt-correct outcomes count toward star progress; wrong drops do not penalize but do not count as the first attempt | Must |
| AC-019 | Progress is scoped per profile via the existing `X-Profile-ID` request header | Must |
| AC-020 | Words with repeated letters (e.g., "pop") render two visually identical, fully interchangeable tiles | Must |
| AC-021 | If a picture asset is missing, the screen falls back to spoken-only mode (TTS announces the word; no broken image) | Should |
| AC-022 | iOS Capacitor build: first-gesture TTS warm-up handled by the shared `useSpeech` hook | Must |
| AC-023 | Level indicator badge ("Level 1", "Level 2", etc.) and per-level mastery percentage shown during a round, but only after L2 has unlocked | Must |

## 3. User Test Cases

Human-readable test scenarios. Each maps to an automated E2E test.

### TC-001: Happy Path — Build CAT

**Precondition:** New profile, fresh install, on Home screen, Word Builder card visible in Games section.
**Steps:**
1. Tap the **Word Builder** card.
2. On the length picker, tap **5**.
3. The Build screen loads with a picture of a cat at the top.
4. Tap the picture — TTS speaks "cat".
5. Tap each tile in turn — each speaks its phoneme.
6. Drag the `c` tile to the leftmost slot.
7. Drag the `a` tile to the middle slot.
8. Drag the `t` tile to the rightmost slot.
9. Observe the completion: word speaks aloud, picture pulses, star animates into the round counter.
10. Auto-advance to the next word.

**Expected Result:** All three letters snap correctly, completion celebration fires, the next word loads.
**Screenshot Checkpoint:** `tests/screenshots/cvc-builder/step-03-build-screen-initial.png`, `step-05-correct-snap.png`, `step-07-word-complete.png`
**Maps to:** TBD

### TC-002: Wrong Drop — Shake and Recover

**Precondition:** A round is in progress; the word "BAT" is displayed.
**Steps:**
1. Drag the `b` tile onto the **middle** slot (wrong position).
2. Observe shake animation; tile returns to source.
3. Confirm no error sound, no progress penalty, no attempt counter advancement.
4. Drag `b` to the leftmost slot — it snaps in.
5. Complete the word with `a` and `t`.
6. Confirm this word's mastery counter does **not** increment first-attempt-correct (because of the wrong drop).

**Expected Result:** Wrong drop shakes and returns; the correction succeeds; star progress for this word does not credit a first-attempt-correct.
**Screenshot Checkpoint:** `tests/screenshots/cvc-builder/step-06-wrong-shake.png`
**Maps to:** TBD

### TC-003: Adaptive Level Unlock

**Precondition:** Profile has 3 stars on 7+ Level 1 words (≥70% of the 10 L1 words mastered).
**Steps:**
1. Start a new round.
2. Observe level indicator badge appears for the first time, reading "Level 2".
3. Round mixes L1 + L2 words.
4. Round-complete screen shows "Level 2 Unlocked!" toast.

**Expected Result:** L2 patterns appear automatically once threshold is met; the toast fires once and only on the round where unlock crosses threshold.
**Screenshot Checkpoint:** `tests/screenshots/cvc-builder/step-09-level-up-unlock.png`
**Maps to:** TBD

### TC-004: Per-Word Star Progress

**Precondition:** Fresh profile.
**Steps:**
1. Complete the word "MAT" with no wrong drops on 2 separate rounds → confirm MAT shows **1 star** on the progress screen.
2. Continue to 4 first-attempt-correct completions of MAT → confirm MAT shows **2 stars**.
3. Continue to 7+ first-attempt-correct completions of MAT → confirm MAT shows **3 stars** and `mastered_at` is set.

**Expected Result:** Star thresholds match the existing convention (2 / 4 / 7+) and tracking is per word, per profile.
**Screenshot Checkpoint:** `tests/screenshots/cvc-builder/step-10-progress-stars.png`
**Maps to:** TBD

## 4. Data Model

### CVCWord

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| text | string (3-5 chars) | Yes | Lowercase target word (e.g., `"cat"`, `"fish"`) |
| image_path | string | Yes | Relative path to picture, e.g., `/assets/cvc/cat.png` |
| level | integer (1-3) | Yes | Difficulty level |
| audio_hint | string | No | Optional override for TTS pronunciation when the default voice mispronounces (rare) |
| tile_segments | string[] | Yes | The tile set the child must place. Usually one char per tile (`["c","a","t"]`); for L3 includes fused digraphs (`["f","i","sh"]`, `["d","u","ck"]`) |
| created_at | datetime | Yes | Row creation timestamp |

### CVCWordProgress

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| profile_id | UUID (FK Profile) | Yes | Owning profile |
| cvc_word_id | UUID (FK CVCWord) | Yes | Word being tracked |
| first_attempt_correct_count | integer | Yes | Total times this word was completed with no wrong drops |
| star_level | integer (0-3) | Yes | Derived: 0 / 1 (≥2) / 2 (≥4) / 3 (≥7) |
| mastered_at | datetime | No | Set when star_level first reaches 3 |

### Relationships

- `CVCWordProgress.profile_id` → `Profile.id` (existing table, unchanged)
- `CVCWordProgress.cvc_word_id` → `CVCWord.id`
- Unique constraint on `(profile_id, cvc_word_id)`

### Deprecation note

`Pattern`, `BaseWord`, `WordCombo`, `PatternProgress` from M7 remain in the schema. No destructive drop in this spec. Cleanup is a separate cycle once CVC ships and staging confirms cutover.

## 5. API Contract

All endpoints scope progress via the existing `X-Profile-ID` header (same middleware as `/api/word-builder/*` and `/api/results`).

### GET /api/cvc-builder/round

**Description:** Get a round of CVC build challenges for the active profile.

**Query params:**
- `level` (optional) — `auto` (default), `1`, `2`, or `3`. `auto` resolves based on per-profile unlock state.
- `count` (optional) — `5` (default), `10`, or `20`. Capped silently to available words at the resolved level.

**Response (200):**
```json
{
  "level": 1,
  "challenges": [
    {
      "cvc_word_id": "uuid",
      "word": "cat",
      "image_path": "/assets/cvc/cat.png",
      "tile_segments": ["c", "a", "t"],
      "scrambled_tiles": ["t", "c", "a"],
      "distractors": []
    }
  ]
}
```

For L2: `distractors` contains 1 letter not in the target word. For L3: 2 distractors. For L1: empty array.

### POST /api/cvc-builder/results

**Description:** Record a build attempt and update star progress.

**Request:**
```json
{
  "cvc_word_id": "uuid",
  "is_correct": true,
  "wrong_drops": 0
}
```

`is_correct` is always `true` for completed words (the round flow does not allow advancing on incomplete words). `wrong_drops` is the count of wrong drops during this attempt; if `> 0`, the result does **not** count toward `first_attempt_correct_count`.

**Response (200):**
```json
{
  "cvc_word_id": "uuid",
  "first_attempt_correct_count": 3,
  "star_level": 1,
  "mastered_at": null,
  "level_unlocked": null
}
```

`level_unlocked` is set to the next level number (e.g., `2`) on the request that crosses the 70% threshold; otherwise `null`. Frontend uses this to fire the unlock toast exactly once.

### GET /api/cvc-builder/progress

**Description:** Get per-level mastery state for the active profile.

**Response (200):**
```json
{
  "levels": [
    {
      "level": 1,
      "unlocked": true,
      "mastery_percentage": 70.0,
      "words": [
        { "text": "cat", "star_level": 3, "mastered": true },
        { "text": "bat", "star_level": 2, "mastered": false }
      ]
    },
    {
      "level": 2,
      "unlocked": true,
      "mastery_percentage": 0.0,
      "words": []
    },
    {
      "level": 3,
      "unlocked": false,
      "mastery_percentage": 0.0,
      "words": []
    }
  ]
}
```

### Error responses

- `400` — invalid `level` or `count` query param.
- `404` — `cvc_word_id` not found in `POST /results`.
- `412` — Missing `X-Profile-ID` header (existing middleware contract).

## 6. UI Behavior

### States

- **Loading:** Spinner over a dim overlay while `/api/cvc-builder/round` resolves.
- **Picture-shown / tiles-presented:** Picture top, three slots middle, scrambled tiles bottom. No level badge unless L2 has unlocked.
- **Tile tap:** Tile speaks its phoneme; brief glow on the tile; speech queue cancels prior utterance.
- **Dragging:** Tile follows pointer/touch with shadow; valid slots highlight subtly.
- **Correct snap:** Tile bounces into slot, chime plays, slot color shifts to confirm.
- **Wrong shake:** Tile shakes (3 oscillations, ~150ms) and returns to its source position.
- **Word complete:** All slots filled; word speaks aloud; picture pulses; star fly-in to round counter; auto-advance after ~1.2s.
- **Round complete:** Reuses existing celebration screen with per-word star counts and any "Level N Unlocked!" toast.

### Screenshot Checkpoints

| Step | Description | Path |
|------|-------------|------|
| 1 | Home Games section with Word Builder card visible | `tests/screenshots/cvc-builder/step-01-home-card-visible.png` |
| 2 | Length picker (5/10/20) | `tests/screenshots/cvc-builder/step-02-length-picker.png` |
| 3 | Build screen initial state for "CAT" | `tests/screenshots/cvc-builder/step-03-build-screen-initial.png` |
| 4 | Tile tapped, phoneme speaking (visual cue) | `tests/screenshots/cvc-builder/step-04-tile-tapped.png` |
| 5 | Correct tile snapped into slot | `tests/screenshots/cvc-builder/step-05-correct-snap.png` |
| 6 | Wrong drop shake | `tests/screenshots/cvc-builder/step-06-wrong-shake.png` |
| 7 | Word complete (picture pulse + star fly-in) | `tests/screenshots/cvc-builder/step-07-word-complete.png` |
| 8 | Round complete with stars | `tests/screenshots/cvc-builder/step-08-round-complete-with-stars.png` |
| 9 | Level 2 unlocked toast on round-complete | `tests/screenshots/cvc-builder/step-09-level-up-unlock.png` |
| 10 | Per-word progress screen (stars per word) | `tests/screenshots/cvc-builder/step-10-progress-stars.png` |

UX gate: this spec requires `/add:ux specs/cvc-builder.md` before implementation begins. Wireframes will live at `specs/ux/cvc-builder-ux.md`.

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Round count > available words at level | Cap silently to available; if `count=20` and only 12 words available, return 12 challenges |
| Profile has zero progress | Resolve `level=auto` to L1; do not show level badge until L2 unlocks |
| Word with repeated letters (e.g., "pop") | Render two visually identical tiles for the repeated letter; both fully interchangeable in matching slots |
| Image asset missing (404 on `/assets/cvc/{word}.png`) | Show spoken-only fallback: a sound icon in place of the image, TTS speaks the word; tiles and slots still render normally |
| Tap during TTS playback | `useSpeech.cancel()` then play new utterance (matches Match Round behavior) |
| iOS first-gesture TTS gate | Reuse warm-up `speak("")` from `useSpeech` hook; first tap anywhere on screen unlocks subsequent speech |
| Network failure on `/api/cvc-builder/round` | Show retry screen with friendly child-friendly message; reuse existing error pattern from Match Round |
| Tile dragged outside any slot, then released | Tile returns to source position with no shake (not a wrong drop, just a non-event) |
| Multiple tiles dragged simultaneously (multi-touch) | Lock to first touch; ignore subsequent touches until first releases |
| `level_unlocked` race (two near-simultaneous results both crossing threshold) | Backend uses a single transaction; only one response sets `level_unlocked` |
| L3 fused tile (e.g., `sh`) dragged onto a single-letter slot | Treated as a wrong drop: shake and return |

## 8. Dependencies

- Profile system + `X-Profile-ID` middleware (existing)
- `useSpeech` hook from M8 (specs/word-pronunciation.md) — provides iOS-safe TTS with cancel + warm-up
- Star mastery convention (specs/word-image-matching.md, specs/word-builder.md) — same 2 / 4 / 7+ thresholds
- Quiz length picker component (existing, used by Match Round and prefix/suffix Word Builder)
- Round-complete celebration screen (existing)
- Alembic migration introducing `CVCWord` and `CVCWordProgress` tables
- Per-word picture assets at `/assets/cvc/{word}.png` — sourced manually for L1 first; image generation pipeline is out of scope (deferred)
- Build screen layout primitives from cycle-12's `BuildScreen.tsx` — refactor or branch on `mode="cvc"`

## 9. Infrastructure Prerequisites

| Category | Requirement |
|----------|-------------|
| Environment variables | None new |
| Registry images | Backend image with new Alembic migration baked in (existing CI pipeline handles this) |
| Cloud quotas | N/A |
| Network reachability | N/A |
| CI status | Backend + frontend pipelines green; coverage ≥ 80% (existing gate) |
| External secrets | N/A |
| Database migrations | New migration `00X_cvc_builder.py` creating `cvc_word` + `cvc_word_progress` tables; idempotent seed of L1 words via `seed_cvc_builder.py` |
| Image assets | `/assets/cvc/{word}.png` for at least the L1 set must exist before staging PAT; missing assets fall back gracefully but PAT requires real images |

**Verification before implementation:**
- `alembic upgrade head` runs cleanly on a fresh local DB and on staging
- `seed_cvc_builder.py` is idempotent (same pattern proven in cycle-9 + cycle-12)
- L1 image assets are committed to the frontend public dir
- `useSpeech` hook from M8 is unchanged and continues to pass its existing test suite

## 10. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-05-07 | 0.1.0 | calebdunn | Initial spec from /add:spec interview. Replaces M7's prefix/suffix content layer with developmentally appropriate CVC blending; reuses M7 mechanic, M8 useSpeech hook, and existing star mastery system. |
