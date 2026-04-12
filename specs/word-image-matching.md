# Spec: Word-Image Matching

**Version:** 0.1.0
**Created:** 2026-04-04
**PRD Reference:** docs/prd.md — Feature 1: Word-Image Matching
**Milestone:** M1: Word Recognition
**Status:** Implemented

## 1. Overview

The core learning activity of Kids Words. A word is displayed prominently at the top of the screen, and the child selects the matching image from a grid of options. Categories organize words into themed sets (animals, colors, shapes, food, family). Visual feedback encourages the child on correct answers and gently prompts retry on incorrect ones.

### User Story

As a child (4-6), I want to see a word and tap the matching picture, so that I learn to recognize words through visual association.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | App displays a list of word categories on the home screen | Must |
| AC-002 | Selecting a category starts a matching round with words from that category | Must |
| AC-003 | Each round displays a word at the top and 2-4 images in a grid below | Must |
| AC-004 | Tapping the correct image plays an encouraging animation and advances to the next word | Must |
| AC-005 | Tapping an incorrect image plays a gentle shake animation and allows retry (unlimited attempts) | Must |
| AC-006 | All touch targets are at least 44px for child-friendly interaction | Must |
| AC-007 | The UI is responsive and optimized for tablet-sized screens (iPad) | Must |
| AC-008 | Words and images are served from the backend API with database storage | Must |
| AC-009 | Answer results (word, selected image, correct/incorrect, timestamp) are posted to the backend | Must |
| AC-010 | A round completes after all words in the category have been shown | Should |
| AC-011 | Incorrect answer options are randomly selected from other words in the same category | Should |
| AC-012 | Word order within a round is randomized | Should |
| AC-013 | A completion celebration screen shows after finishing a round | Nice |

## 3. User Test Cases

### TC-001: Happy Path — Correct Match

**Precondition:** App is loaded, categories are available from API
**Steps:**
1. Child sees category list on home screen
2. Child taps "Animals" category
3. Word "CAT" appears at top of screen
4. Grid of images appears below (cat, dog, fish)
5. Child taps the cat image
6. Encouraging animation plays (stars, bounce, etc.)
7. Next word in the category appears automatically
**Expected Result:** Correct match is recorded, animation plays, next word loads
**Screenshot Checkpoint:** tests/screenshots/word-image-matching/tc-001-correct-match.png
**Maps to:** TBD

### TC-002: Incorrect Match — Retry

**Precondition:** A matching round is active with a word displayed
**Steps:**
1. Word "DOG" is displayed at top
2. Grid shows images: dog, cat, bird
3. Child taps the cat image (incorrect)
4. Cat image shakes gently
5. Child taps the dog image (correct)
6. Encouraging animation plays
**Expected Result:** Incorrect tap triggers shake, child can retry, correct tap succeeds
**Screenshot Checkpoint:** tests/screenshots/word-image-matching/tc-002-incorrect-retry.png
**Maps to:** TBD

### TC-003: Category Selection

**Precondition:** App is loaded
**Steps:**
1. Home screen displays available categories (Animals, Colors, Food)
2. Each category shows its name and an icon/thumbnail
3. Child taps "Colors" category
4. Matching round starts with color words
**Expected Result:** Categories load from API, tapping one starts a round with that category's words
**Screenshot Checkpoint:** tests/screenshots/word-image-matching/tc-003-category-selection.png
**Maps to:** TBD

### TC-004: Round Completion

**Precondition:** A matching round is active, only one word remains
**Steps:**
1. Last word in the category is displayed
2. Child taps the correct image
3. Encouraging animation plays
4. Completion screen appears (celebration, "Great job!" message)
**Expected Result:** Round ends after all words are answered, celebration screen shown
**Screenshot Checkpoint:** tests/screenshots/word-image-matching/tc-004-round-complete.png
**Maps to:** TBD

### TC-005: Multiple Incorrect Attempts

**Precondition:** A matching round is active with a word displayed
**Steps:**
1. Word "FISH" is displayed
2. Child taps wrong image — shake animation
3. Child taps wrong image again — shake animation
4. Child taps correct image — success animation
**Expected Result:** Unlimited retries allowed, no penalty or discouragement, success celebrated
**Screenshot Checkpoint:** tests/screenshots/word-image-matching/tc-005-multiple-retries.png
**Maps to:** TBD

## 4. Data Model

### Category

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| name | string | Yes | Display name (e.g. "Animals") |
| slug | string | Yes | URL-safe identifier (e.g. "animals") |
| icon_url | string | No | Category thumbnail/icon image URL |
| display_order | integer | Yes | Sort order on home screen |
| created_at | datetime | Yes | Creation timestamp |

### Word

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| text | string | Yes | The word to display (e.g. "CAT") |
| image_url | string | Yes | URL to the matching image |
| category_id | UUID | Yes | Foreign key to Category |
| created_at | datetime | Yes | Creation timestamp |

### MatchResult

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| word_id | UUID | Yes | Foreign key to Word |
| selected_word_id | UUID | Yes | The word whose image was tapped |
| is_correct | boolean | Yes | Whether the selection was correct |
| attempt_number | integer | Yes | Which attempt this was (1 = first try) |
| responded_at | datetime | Yes | When the answer was submitted |

### Relationships

- Category has many Words (one-to-many)
- Word has many MatchResults (one-to-many)
- MatchResult belongs to a Word (the target) and references a selected Word

## 5. API Contract

### GET /api/categories

**Description:** List all word categories

**Request:** No parameters

**Response (200):**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Animals",
      "slug": "animals",
      "icon_url": "/images/categories/animals.png",
      "display_order": 1,
      "word_count": 8
    }
  ]
}
```

### GET /api/categories/{slug}/words

**Description:** Get all words with images for a category, shuffled for a round

**Request:** Path parameter `slug` (string)

**Response (200):**
```json
{
  "category": {
    "id": "uuid",
    "name": "Animals",
    "slug": "animals"
  },
  "words": [
    {
      "id": "uuid",
      "text": "CAT",
      "image_url": "/images/words/cat.png"
    }
  ]
}
```

**Error Responses:**
- `404` — Category not found

### POST /api/results

**Description:** Record a match attempt result

**Request:**
```json
{
  "word_id": "uuid",
  "selected_word_id": "uuid",
  "is_correct": true,
  "attempt_number": 1
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "recorded": true
}
```

**Error Responses:**
- `400` — Invalid request body (missing fields, invalid UUIDs)
- `404` — Word not found

## 6. UI Behavior

### States

- **Loading:** Skeleton placeholders for category cards and word/image grid while API responds
- **Empty:** "No categories yet" message if no categories exist (admin concern, not child-facing)
- **Error:** Friendly retry screen ("Oops! Let's try again" with a retry button) if API fails
- **Active Round:** Word displayed prominently at top (large, bold font), image grid below
- **Correct Answer:** Stars/confetti animation, brief pause, auto-advance to next word
- **Incorrect Answer:** Selected image shakes gently (0.3s), remains tappable
- **Round Complete:** Celebration screen with "Great job!" and option to pick another category

### Screenshot Checkpoints

| Step | Description | Path |
|------|-------------|------|
| 1 | Home screen with category list | tests/screenshots/word-image-matching/step-01-home.png |
| 2 | Active round with word and image grid | tests/screenshots/word-image-matching/step-02-active-round.png |
| 3 | Correct answer animation | tests/screenshots/word-image-matching/step-03-correct.png |
| 4 | Incorrect answer shake | tests/screenshots/word-image-matching/step-04-incorrect.png |
| 5 | Round completion celebration | tests/screenshots/word-image-matching/step-05-complete.png |

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Category has only 1 word | Show that word with images from other categories as distractors |
| Category has only 2 words | Show 2 image options per question |
| API is unreachable | Show friendly error with retry button |
| Image fails to load | Show placeholder with word text as fallback |
| Child taps very rapidly | Debounce taps (ignore taps within 300ms of last tap) |
| Child navigates away mid-round | Round state is not persisted — starts fresh on return |

## 8. Dependencies

- FastAPI backend with database (PostgreSQL or SQLite TBD)
- Image hosting solution (local file serving for MVP, cloud storage later)
- Word set seed data (at least 3 categories with 6-10 words each)

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-04 | 0.1.0 | calebdunn | Initial spec from /add:spec interview |
