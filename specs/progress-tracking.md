# Spec: Progress Tracking

**Version:** 0.1.0
**Created:** 2026-04-04
**PRD Reference:** docs/prd.md — M2: Progress Tracking
**Milestone:** M2
**Status:** Implemented

## 1. Overview

Track word mastery using a star system. Each word earns stars based on how many times the child gets it correct on the first attempt: 2 correct = 1 star, 4 correct = 2 stars, 7+ correct = 3 stars (mastered). Stars are visible on the round complete screen and in a per-category word list view. Category cards on the home screen show mastery percentage.

### User Story

As a child (4-6), I want to see stars on words I've practiced, so that I feel motivated to keep learning and can see which words I've mastered.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Each word tracks a first-attempt correct count, persisted in a `WordProgress` database table | Must |
| AC-002 | Star levels are: 0 stars (0-1 correct), 1 star (2-3 correct), 2 stars (4-6 correct), 3 stars (7+ correct, mastered) | Must |
| AC-003 | `WordProgress` is updated automatically when a first-attempt correct answer is recorded via POST /api/results | Must |
| AC-004 | Round complete screen shows each word from the round with its current star count | Must |
| AC-005 | A per-category word list view shows all words with their star counts | Must |
| AC-006 | `GET /api/progress` returns star progress for all words | Must |
| AC-007 | `GET /api/progress/{category_slug}` returns star progress for words in a category | Must |
| AC-008 | Category cards on home screen show mastery percentage (% of words at 3 stars) | Should |
| AC-009 | Special celebration animation plays when a word reaches 3 stars (mastered) | Should |
| AC-010 | Only first-attempt correct answers (attempt_number = 1, is_correct = true) increment the count | Must |

## 3. User Test Cases

### TC-001: Star Progression — First Star

**Precondition:** Child has correctly identified "CAT" on first attempt 1 time before
**Steps:**
1. Child plays Animals round, word "CAT" appears
2. Child taps correct image on first try
3. Backend records result (attempt_number=1, is_correct=true)
4. WordProgress for "CAT" increments to 2 first-attempt corrects
5. Round completes
6. Round complete screen shows "CAT" with 1 star
**Expected Result:** CAT displays 1 star (2 first-attempt corrects)
**Screenshot Checkpoint:** tests/screenshots/progress-tracking/tc-001-first-star.png
**Maps to:** TBD

### TC-002: Star Progression — Mastery (3 Stars)

**Precondition:** Child has 6 first-attempt corrects for "DOG"
**Steps:**
1. Child plays round, "DOG" appears
2. Child taps correct image on first try (7th first-attempt correct)
3. Round completes
4. Round complete screen shows "DOG" with 3 stars
5. Mastery celebration animation plays
**Expected Result:** DOG displays 3 stars with celebration
**Screenshot Checkpoint:** tests/screenshots/progress-tracking/tc-002-mastery.png
**Maps to:** TBD

### TC-003: Retry Does Not Count

**Precondition:** Child has 1 first-attempt correct for "FISH"
**Steps:**
1. Word "FISH" appears
2. Child taps wrong image (shake)
3. Child taps correct image (attempt_number=2)
4. Round completes
5. Round complete shows "FISH" still at 0 stars (1 correct, needs 2)
**Expected Result:** Second-attempt correct does not increment progress
**Screenshot Checkpoint:** tests/screenshots/progress-tracking/tc-003-retry-no-count.png
**Maps to:** TBD

### TC-004: Category Word List View

**Precondition:** Child has played Animals multiple times, some words have stars
**Steps:**
1. Child navigates to category word list for Animals
2. All 100 animal words are listed
3. Each word shows its star count (0-3)
4. Words are sorted (mastered at bottom or top — TBD)
**Expected Result:** Word list displays all words with accurate star counts
**Screenshot Checkpoint:** tests/screenshots/progress-tracking/tc-004-word-list.png
**Maps to:** TBD

### TC-005: Category Mastery Percentage

**Precondition:** Animals has 100 words, 10 are mastered (3 stars)
**Steps:**
1. Child returns to home screen
2. Animals card shows "10% mastered"
**Expected Result:** Category card displays correct mastery percentage
**Screenshot Checkpoint:** tests/screenshots/progress-tracking/tc-005-category-percent.png
**Maps to:** TBD

### TC-006: Progress Persists Across Sessions

**Precondition:** Child earned stars in previous session
**Steps:**
1. Close and reopen app
2. Navigate to category word list
3. Stars from previous session are still displayed
**Expected Result:** Progress loaded from database, persists across sessions
**Screenshot Checkpoint:** N/A
**Maps to:** TBD

## 4. Data Model

### WordProgress

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| word_id | UUID | Yes | Foreign key to Word (unique constraint) |
| first_attempt_correct_count | integer | Yes | Number of times answered correctly on first attempt |
| star_level | integer | Yes | Computed: 0 (0-1), 1 (2-3), 2 (4-6), 3 (7+) |
| mastered_at | datetime | No | Timestamp when word first reached 3 stars |
| updated_at | datetime | Yes | Last update timestamp |

### Star Level Thresholds

| First-Attempt Corrects | Stars | Label |
|------------------------|-------|-------|
| 0-1 | 0 | New |
| 2-3 | 1 | Learning |
| 4-6 | 2 | Practicing |
| 7+ | 3 | Mastered |

### Relationships

- WordProgress belongs to Word (one-to-one, unique on word_id)
- Created lazily — only when first correct answer is recorded

## 5. API Contract

### GET /api/progress

**Description:** Get star progress for all words

**Response (200):**
```json
{
  "progress": [
    {
      "word_id": "uuid",
      "word_text": "CAT",
      "category_slug": "animals",
      "first_attempt_correct_count": 4,
      "star_level": 2,
      "mastered_at": null
    }
  ],
  "summary": {
    "total_words": 122,
    "mastered": 10,
    "mastery_percentage": 8.2
  }
}
```

### GET /api/progress/{category_slug}

**Description:** Get star progress for words in a specific category

**Response (200):**
```json
{
  "category": {
    "name": "Animals",
    "slug": "animals"
  },
  "words": [
    {
      "word_id": "uuid",
      "word_text": "CAT",
      "image_url": "https://cdn.jsdelivr.net/...",
      "first_attempt_correct_count": 4,
      "star_level": 2,
      "mastered_at": null
    }
  ],
  "summary": {
    "total_words": 100,
    "mastered": 5,
    "mastery_percentage": 5.0
  }
}
```

**Error Responses:**
- `404` — Category not found

### POST /api/results (modified)

**Description:** Existing endpoint — now also updates WordProgress when `attempt_number=1` and `is_correct=true`.

No API contract change — the update happens server-side as a side effect.

## 6. UI Behavior

### Round Complete Screen (enhanced)

- After the celebration, show a word summary list
- Each word displays: word text, image thumbnail, star count (0-3 star icons)
- If a word just reached 3 stars, play a special mastery burst animation
- Stars are gold filled (earned) or grey outline (unearned)

### Category Word List View (new screen)

- Accessible from a "View Words" button on the category card or after quiz picker
- Lists all words in the category as a scrollable grid/list
- Each item: image, word text, star count
- Loading skeleton while fetching from API

### Category Card (enhanced)

- Below the word count, show "X% mastered" text
- Small progress bar or star indicator

### Mastery Celebration

- When a word reaches 3 stars during a round: extra-large star burst animation
- Brief text: "Mastered!" with sparkle effect
- Plays before auto-advancing to next word (adds ~500ms to the transition)

### States

- **Loading:** Skeleton placeholders for word list
- **Empty progress:** All words at 0 stars, "Start playing to earn stars!"
- **Full mastery:** All words at 3 stars, "Amazing! You mastered all {category} words!"

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Word has no WordProgress row yet | Display 0 stars, create row on first correct |
| Same word answered correctly multiple times in one round | Each first-attempt correct increments (one per round appearance) |
| Word already mastered, answered again | Count still increments but star stays at 3, no re-celebration |
| Category with 0 words played | Show 0% mastered, all words at 0 stars |
| API failure loading progress | Show word list without stars, retry button |

## 8. Dependencies

- Existing MatchResult recording (POST /api/results) — must be extended
- Word and Category models (already exist)
- Future: User accounts needed for multi-device progress sync (separate spec)

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-04 | 0.1.0 | calebdunn | Initial spec from /add:spec interview |
