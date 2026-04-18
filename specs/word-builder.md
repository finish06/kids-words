# Spec: Word Builder — Prefix/Suffix Learning Mode

**Version:** 0.2.0
**Created:** 2026-04-07
**Updated:** 2026-04-18 (UX signed off; backend VERIFIED via cycle-12)
**PRD Reference:** docs/prd.md
**Milestone:** M7
**Status:** Implementing
**UI Design:** specs/ux/word-builder-ux.md (APPROVED 2026-04-18)

## 1. Overview

A new game mode where children build words by attaching prefixes and suffixes to base words. A base word (e.g., "PLAY") appears in the center with 2-3 tappable tiles around it (e.g., "RE-", "-ING", "-ED"). The child taps the correct tile and it snaps onto the word with an animation. Difficulty adapts automatically using the star mastery system — start with simple patterns (UN-, RE-, -ING) and unlock harder ones (PRE-, MIS-, -TION) as the child masters each level.

### User Story

As a child (4-8), I want to build words by adding pieces to them, so that I learn how prefixes and suffixes change word meanings.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | "Word Builder" mode accessible from home screen alongside word matching | Must |
| AC-002 | Base word displayed prominently in center of screen | Must |
| AC-003 | 2-3 prefix/suffix tiles displayed as tappable options | Must |
| AC-004 | Tapping correct tile: snap animation attaches tile to base word, shows completed word | Must |
| AC-005 | Tapping wrong tile: tile bounces back with gentle shake (same as word matching) | Must |
| AC-006 | Visual distinction between prefix tiles (attach left) and suffix tiles (attach right) | Must |
| AC-007 | 3 difficulty levels with adaptive progression | Must |
| AC-008 | Level 1: UN-, RE-, -ING, -ED, -S, -ER (~30 word combos) | Must |
| AC-009 | Level 2: PRE-, MIS-, DIS-, -TION, -NESS, -FUL, -LESS (~40 word combos) | Should |
| AC-010 | Level 3: OVER-, UNDER-, -ABLE, -MENT, -LY, -IST (~30 word combos) | Nice |
| AC-011 | Adaptive difficulty: start at Level 1, auto-unlock next level when 70%+ of patterns mastered (3 stars) | Must |
| AC-012 | Star mastery per pattern (same thresholds: 2→1 star, 4→2 stars, 7+→3 stars) | Must |
| AC-013 | Quiz length picker (5/10/20) before starting a round | Must |
| AC-014 | Round complete screen shows patterns practiced with stars | Must |
| AC-015 | Completed word briefly shows a simple definition or usage (e.g., "REPLAY = play again") | Should |
| AC-016 | Progress scoped per profile (same X-Profile-ID header) | Must |

## 3. User Test Cases

### TC-001: Happy Path — Build a Word

**Precondition:** Child on home screen, Word Builder mode visible
**Steps:**
1. Tap "Word Builder"
2. Quiz length picker: tap "5"
3. Base word "HAPPY" appears in center
4. Three tiles shown: "UN-", "-ING", "-ED"
5. Child taps "UN-"
6. "UN-" snaps to left of "HAPPY" → "UNHAPPY" with celebration
7. Brief definition: "UNHAPPY = not happy"
8. Next word appears
**Expected Result:** Tile attaches, word formed, definition shown, advances
**Maps to:** TBD

### TC-002: Wrong Tile

**Precondition:** Word Builder round active
**Steps:**
1. Base word "PLAY" shown
2. Tiles: "RE-", "UN-", "-NESS"
3. Child taps "UN-" (wrong — "UNPLAY" isn't a word)
4. Tile shakes and bounces back
5. Child taps "RE-" → "REPLAY" with celebration
**Expected Result:** Wrong answer shakes, retry allowed, correct answer succeeds
**Maps to:** TBD

### TC-003: Adaptive Level Unlock

**Precondition:** Child has mastered 70%+ of Level 1 patterns
**Steps:**
1. After completing a round, Level 2 unlocks
2. Next round includes Level 2 patterns (PRE-, MIS-, -TION)
3. Level indicator shown during round
**Expected Result:** Harder patterns introduced automatically
**Maps to:** TBD

### TC-004: Pattern Progress

**Precondition:** Child practiced RE- pattern 7+ times correctly
**Steps:**
1. View progress for Word Builder
2. RE- shows 3 stars (mastered)
3. UN- shows 1 star (learning)
**Expected Result:** Star progress tracked per pattern
**Maps to:** TBD

## 4. Data Model

### Pattern

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| text | string | Yes | The prefix/suffix (e.g., "RE-", "-ING") |
| type | string | Yes | "prefix" or "suffix" |
| level | integer | Yes | Difficulty level (1, 2, or 3) |
| meaning | string | Yes | Brief meaning (e.g., "again", "not", "action of") |

### BaseWord

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| text | string | Yes | The base word (e.g., "PLAY") |
| level | integer | Yes | Difficulty level |

### WordCombo

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| base_word_id | UUID | Yes | FK to BaseWord |
| pattern_id | UUID | Yes | FK to Pattern |
| result_word | string | Yes | The combined word (e.g., "REPLAY") |
| definition | string | No | Brief definition (e.g., "play again") |

### PatternProgress

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| pattern_id | UUID | Yes | FK to Pattern |
| profile_id | UUID | Yes | FK to Profile |
| first_attempt_correct_count | integer | Yes | Same as WordProgress |
| star_level | integer | Yes | 0-3 stars |
| mastered_at | datetime | No | When 3 stars reached |

## 5. API Contract

### GET /api/word-builder/round

**Description:** Get a round of word-building challenges

**Query params:** `level` (optional, auto-detect from progress), `count` (5/10/20)

**Response (200):**
```json
{
  "level": 1,
  "challenges": [
    {
      "base_word": "HAPPY",
      "correct_pattern": { "id": "uuid", "text": "UN-", "type": "prefix" },
      "options": [
        { "id": "uuid", "text": "UN-", "type": "prefix" },
        { "id": "uuid", "text": "-ING", "type": "suffix" },
        { "id": "uuid", "text": "-ED", "type": "suffix" }
      ],
      "result_word": "UNHAPPY",
      "definition": "not happy"
    }
  ]
}
```

### POST /api/word-builder/results

**Description:** Record a word-building attempt (updates PatternProgress)

**Request:**
```json
{
  "pattern_id": "uuid",
  "is_correct": true,
  "attempt_number": 1
}
```

### GET /api/word-builder/progress

**Description:** Get pattern mastery progress for active profile

**Response (200):**
```json
{
  "levels": [
    {
      "level": 1,
      "unlocked": true,
      "patterns": [
        { "text": "RE-", "star_level": 3, "mastered": true },
        { "text": "UN-", "star_level": 1, "mastered": false }
      ],
      "mastery_percentage": 50.0
    },
    {
      "level": 2,
      "unlocked": false,
      "patterns": []
    }
  ]
}
```

## 6. UI Behavior

> **UI design approved — see `specs/ux/word-builder-ux.md` for wireframes, state matrix, and flow diagrams.** The notes below describe the overall approach; the UX artifact is the source of truth for screen layout, timing, and edge-case behavior.

### Home Screen
- **Home is restructured** into a `Games` row (Word Builder + Phonetics placeholder for M8) and a `Word Matching` section that keeps the existing 5 category cards. This is a home-navigation change, not a card-styling change.
- Word Builder card shows current level + mastery dots + rotating tease of active patterns
- Word Phonetics card ships in cycle-13 as a disabled "Coming soon" placeholder so M8 lands without another home restructure

### Build Screen
- Base word large and centered (3rem+)
- Prefix tiles on the left side, suffix tiles on the right side
- Tiles are rounded, colorful, tappable (48px+ height)
- Color coding: prefixes blue, suffixes green
- Correct tap: tile slides and snaps to word with bounce animation
- Combined word appears with brief glow
- Definition fades in below for 2 seconds

### Level Indicator
- Small badge showing "Level 1", "Level 2", etc.
- Progress bar showing % patterns mastered in current level

### Round Complete
- Same celebration screen as word matching
- Shows patterns practiced with star counts
- "Level 2 Unlocked!" notification if threshold reached

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Child at Level 1 with no progress | Show only Level 1 patterns |
| All Level 1 patterns mastered | Auto-unlock Level 2, mix L1+L2 in rounds |
| Pattern has only one valid combo | Show 2 wrong options from other patterns |
| Base word works with multiple patterns | Show as separate challenges |
| Child picks 20 but level has fewer combos | Cap at available combos, adjust picker |

## 8. Dependencies

- Profile system (X-Profile-ID for progress scoping)
- Star mastery system (same thresholds)
- Quiz length picker (reuse existing component)
- Round complete screen (reuse with pattern data)
- Alembic migration for new tables (Pattern, BaseWord, WordCombo, PatternProgress)

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-07 | 0.1.0 | calebdunn | Initial spec |
| 2026-04-18 | 0.2.0 | calebdunn | Backend VERIFIED (cycle-12, PR #17); UX signed off (specs/ux/word-builder-ux.md); §6 notes updated to reflect home-screen restructure + pointer to UX artifact; status Draft → Implementing |
