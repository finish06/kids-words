# Spec: Post-Quiz Navigation

**Version:** 0.1.0
**Created:** 2026-04-05
**PRD Reference:** docs/prd.md — Word-Image Matching
**Milestone:** M4
**Status:** Draft

## 1. Overview

After completing a quiz, "Play Again" restarts the same category quiz (back to quiz length picker) and "More Categories" returns to the category list. Neither action should trigger the profile picker or reload the app.

### User Story

As a child, I want Play Again to start another round of the same category immediately, so that I can keep practicing without re-selecting my profile.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | "Play Again" navigates to the quiz length picker for the same category (not app reload) | Must |
| AC-002 | "More Categories" navigates to the category list screen | Must |
| AC-003 | Neither action triggers the profile picker | Must |
| AC-004 | Active profile is preserved across both navigations | Must |

## 3. User Test Cases

### TC-001: Play Again

**Precondition:** Child completed a 5-word Animals quiz, round complete screen showing
**Steps:**
1. Tap "Play Again"
2. Quiz length picker appears for Animals
3. Profile stays the same (no profile picker)
**Expected Result:** Same category, fresh quiz, same profile
**Maps to:** TBD

### TC-002: More Categories

**Precondition:** Round complete screen showing
**Steps:**
1. Tap "More Categories"
2. Category list appears
3. Profile stays the same
**Expected Result:** Category list, no profile picker
**Maps to:** TBD

## 4. Implementation Notes

- Replace `window.location.reload()` with React state reset or `navigate()`
- `onPlayAgain`: reset quiz state (clear `quizWords` to show picker again)
- `onHome`: `navigate("/")`
- Both already exist in MatchRound — just need to not reload the page

## 5. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-05 | 0.1.0 | calebdunn | Initial spec |
