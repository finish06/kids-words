# Spec: Quiz Length Picker

**Version:** 0.1.0
**Created:** 2026-04-04
**PRD Reference:** docs/prd.md — Feature 1: Word-Image Matching
**Milestone:** M1: Word Recognition
**Status:** Complete

## 1. Overview

After selecting a category, the child chooses how many words to practice in a round: 5, 10, or 20. This prevents overwhelming young learners with 100-word rounds and gives a sense of completion at manageable intervals.

### User Story

As a child (4-6), I want to pick how many words to practice, so that I can do a short or long round depending on my attention span.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | After tapping a category, a quiz length picker screen appears before the round starts | Must |
| AC-002 | Three length options are displayed: 5, 10, and 20 | Must |
| AC-003 | Each option is a large, tappable button showing the number | Must |
| AC-004 | Options that exceed the category's word count are disabled | Must |
| AC-005 | Tapping an option starts a round with that many randomly selected words from the category | Must |
| AC-006 | A back button returns the user to the category list | Must |
| AC-007 | The category name is displayed as a title on the picker screen | Should |

## 3. User Test Cases

### TC-001: Pick 5-Word Quiz

**Precondition:** App is loaded, categories available
**Steps:**
1. Child taps "Animals" category
2. Quiz length picker appears showing "Animals" title and three buttons: 5, 10, 20
3. Child taps "5"
4. Matching round starts with 5 randomly selected animal words
5. Progress shows "1 / 5"
**Expected Result:** Round uses exactly 5 words, progress reflects the chosen count
**Screenshot Checkpoint:** tests/screenshots/quiz-length-picker/tc-001-pick-five.png
**Maps to:** TBD

### TC-002: Pick 20-Word Quiz

**Precondition:** Category has at least 20 words
**Steps:**
1. Child taps a category with 20+ words
2. Child taps "20"
3. Round starts with 20 words
**Expected Result:** Round uses exactly 20 words, progress shows "X / 20"
**Screenshot Checkpoint:** tests/screenshots/quiz-length-picker/tc-002-pick-twenty.png
**Maps to:** TBD

### TC-003: Disabled Option for Small Category

**Precondition:** A category exists with fewer than 20 words (e.g., Colors with 10)
**Steps:**
1. Child taps "Colors" category (10 words)
2. Quiz length picker appears
3. "20" button is visually dimmed and not tappable
4. "5" and "10" buttons are active
**Expected Result:** Options exceeding the category word count are disabled
**Screenshot Checkpoint:** tests/screenshots/quiz-length-picker/tc-003-disabled-option.png
**Maps to:** TBD

### TC-004: Back Navigation

**Precondition:** Quiz length picker is displayed
**Steps:**
1. Child taps "← Back" button
2. Returns to category list
**Expected Result:** Navigation returns to home screen without starting a round
**Screenshot Checkpoint:** tests/screenshots/quiz-length-picker/tc-004-back.png
**Maps to:** TBD

## 4. Data Model

No new data entities. This feature is entirely frontend state — the quiz length is used to slice the words array returned by `GET /api/categories/{slug}/words`.

## 5. API Contract

No new endpoints. Uses existing `GET /api/categories/{slug}/words` — the full word list is fetched, then sliced client-side to the chosen length.

## 6. UI Behavior

### States

- **Picker Screen:** Category name as title, "How many words?" subtitle, three large number buttons (5, 10, 20)
- **Disabled Button:** Reduced opacity (0.3), `cursor: not-allowed`, not clickable
- **Transition:** Tapping a valid option immediately transitions to the matching round

### Layout

- Back button top-left
- Category name centered, large bold text (2.5rem, primary color)
- Subtitle below ("How many words?")
- Three square buttons (120x120px) in a horizontal row, centered
- Each button shows just the number in large bold text (2.5rem)
- Buttons have card styling (white bg, primary border, shadow, rounded corners)
- Hover/tap scales to 1.08x

### Screenshot Checkpoints

| Step | Description | Path |
|------|-------------|------|
| 1 | Picker with all options enabled | tests/screenshots/quiz-length-picker/step-01-all-enabled.png |
| 2 | Picker with 20 disabled (small category) | tests/screenshots/quiz-length-picker/step-02-disabled.png |

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Category has fewer than 5 words | All three options disabled — unlikely with current seed data |
| Category has exactly 10 words | 5 and 10 enabled, 20 disabled |
| Words are randomized per quiz | Each quiz picks a different random subset |

## 8. Dependencies

- Requires word-image-matching spec (categories and words must exist)
- No backend changes required

## 9. Implementation Notes

- Implemented in `frontend/src/components/MatchRound.tsx` as `QuizLengthPicker` component
- Quiz lengths defined as `const QUIZ_LENGTHS = [5, 10, 20] as const`
- Words shuffled and sliced client-side before passing to `MatchGame`
- CSS in `frontend/src/index.css` under "Quiz Length Picker" section

## 10. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-04 | 0.1.0 | calebdunn | Initial spec (retroactive, matches implementation) |
