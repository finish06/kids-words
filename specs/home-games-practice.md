# Spec: Home Games / Practice Structure

**Version:** 0.1.0
**Created:** 2026-04-18
**PRD Reference:** docs/prd.md
**Status:** Draft

## 1. Overview

Restructures the Home screen into two top-level sections — **Games** (Word Builder + Word Matching) and **Practice** (Listening Practice and future practice modes) — and introduces a dedicated **Word Matching** landing screen that shows the 5 category cards. The current behavior of showing 5 category cards directly on Home is replaced by a single consolidated "Word Matching" card under the Games section. Tapping it navigates to the new Word Matching screen.

This is a pure frontend restructure — no backend, API, or schema changes. Gameplay for both Word Builder and Match Round is unchanged.

### User Story

As a child (4-6), I want Home to show a clear menu of games to play and practice modes to try, so that the app feels organized as more activities are added and I can find what I want to play.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Home shows a **Games** section containing exactly 2 cards: Word Builder + Word Matching | Must |
| AC-002 | Home shows a **Practice** section below Games, containing the Listening Practice card + placeholder slot(s) for 1-2 future practice modes | Must |
| AC-003 | The 5 category cards (Animals, Colors, Food, Shapes, Body Parts) no longer appear on Home | Must |
| AC-004 | Tapping the Word Matching card on Home navigates to a new `/matching` route which renders the 5 category cards | Must |
| AC-005 | Tapping a category card on the Word Matching screen navigates to the Length Picker (same flow as today) | Must |
| AC-006 | Tapping the Word Builder card on Home still navigates directly to `/build` (unchanged) | Must |
| AC-007 | The Word Matching screen handles three states: loading (skeleton cards), error (retry affordance), empty ("No categories yet — check back soon") | Must |
| AC-008 | Back from Length Picker returns to the Word Matching screen (category grid) | Must |
| AC-009 | Back from the Word Matching screen returns to Home | Must |
| AC-010 | Word Matching screen and both Home sections render cleanly in dark mode | Must |
| AC-011 | iPad landscape (1366×1024) is the primary design viewport | Must |
| AC-012 | Future practice-mode card slots are visually present (e.g., dashed outline or ghost card) to signal extensibility | Should |
| AC-013 | No behavioral changes to Word Builder gameplay (cycle-15 state preserved) | Must |
| AC-014 | No behavioral changes to Match Round gameplay (tap-to-hear audio preserved) | Must |
| AC-015 | No backend changes — this is purely a frontend restructure | Must |

## 3. User Test Cases

### TC-001: Home shows Games + Practice sections with correct cards

**Precondition:** Fresh app load at `/` with a valid profile selected.
**Steps:**
1. Navigate to Home
2. Observe the top-level sections and cards
**Expected Result:** Home shows two sections titled "Games" and "Practice". Games has Word Builder + Word Matching cards. Practice has Listening Practice (disabled, "Coming soon") + at least one placeholder slot for a future mode. No category cards appear directly on Home.
**Screenshot Checkpoint:** `tests/screenshots/home-games-practice/step-01-home-layout.png`
**Maps to:** TBD

### TC-002: Word Matching happy path — child plays a 5-word Animals round

**Precondition:** Fresh app load at `/`.
**Steps:**
1. Tap the Word Matching card on Home
2. Observe the Word Matching screen — 5 category cards visible
3. Tap Animals
4. Observe the Length Picker — 5/10/20 options
5. Tap 5
6. Play through a 5-word round
7. Land on Round Complete
8. Tap Home to return
**Expected Result:** Each step navigates as expected. Match Round gameplay (tile selection, correct/wrong feedback, tap-to-hear on word + image) is preserved from cycle-15. Round Complete celebration appears. Home returns to the Games + Practice layout.
**Screenshot Checkpoint:** `tests/screenshots/home-games-practice/step-02-matching-to-round.png`
**Maps to:** TBD

### TC-003: Back navigation goes up one level

**Precondition:** Child has navigated Home → Word Matching → Animals → Length Picker.
**Steps:**
1. Tap Back on the Length Picker
2. Verify you land on the Word Matching screen (category grid visible)
3. Tap Back on the Word Matching screen
4. Verify you land on Home (Games + Practice sections visible)
**Expected Result:** Back is hierarchical — each tap moves up one level, never directly to Home from deep inside the flow.
**Screenshot Checkpoint:** `tests/screenshots/home-games-practice/step-03-back-navigation.png`
**Maps to:** TBD

### TC-004: Word Builder entry point unchanged

**Precondition:** Fresh app load at `/`.
**Steps:**
1. Tap the Word Builder card on Home
2. Observe that you land on the Word Builder Length Picker (same as cycle-15)
3. Complete a 5-word clue-based round
**Expected Result:** Word Builder flow is unchanged — Home tap → Length Picker → Build Screen with clue header → Round Complete. No regression from cycle-15.
**Screenshot Checkpoint:** `tests/screenshots/home-games-practice/step-04-word-builder-unchanged.png`
**Maps to:** TBD

### TC-005: Word Matching screen handles error state

**Precondition:** `/api/categories` is mocked to return a 500 error.
**Steps:**
1. Navigate to `/matching`
2. Observe the error state
3. Tap Retry
**Expected Result:** Error message "Let's try again" + Retry button appear. Tapping Retry re-fetches. On success, the category grid renders.
**Screenshot Checkpoint:** `tests/screenshots/home-games-practice/step-05-error-state.png`
**Maps to:** TBD

### TC-006: Word Matching screen handles empty state

**Precondition:** `/api/categories` is mocked to return `{ categories: [] }`.
**Steps:**
1. Navigate to `/matching`
2. Observe the empty state
**Expected Result:** Friendly message "No categories yet — check back soon" (or similar kid-friendly wording). No broken layout. Back button still works.
**Screenshot Checkpoint:** `tests/screenshots/home-games-practice/step-06-empty-state.png`
**Maps to:** TBD

### TC-007: Dark mode parity

**Precondition:** Dark mode enabled via header toggle.
**Steps:**
1. Visit Home — verify Games + Practice sections read cleanly
2. Tap Word Matching — verify category screen reads cleanly
3. Complete a round — verify match round still reads cleanly
**Expected Result:** All new screens and section headings use existing CSS variables; no pure-white backgrounds or invisible text.
**Screenshot Checkpoint:** `tests/screenshots/home-games-practice/step-07-dark-mode.png`
**Maps to:** TBD

## 4. Data Model

No new entities. Uses existing `Category` data via `GET /api/categories`.

### Relationships

N/A — no new relationships.

## 5. API Contract

No new endpoints. Existing endpoint reused:

- `GET /api/categories` — returns the 5 category cards for rendering on the new `/matching` screen. Same contract as today.

No request/response changes.

## 6. UI Behavior

### Home Screen (restructured)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Profile]                                          [Settings] [Theme]   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Games                                                                   │
│  ┌────────────────────────┐  ┌────────────────────────┐                  │
│  │  🧩  Word Builder      │  │  🎯  Word Matching     │                  │
│  │  Level 1  ●●○○○○ 2/6★ │  │  5 categories          │                  │
│  └────────────────────────┘  └────────────────────────┘                  │
│                                                                          │
│  Practice                                                                │
│  ┌────────────────────────┐  ┌────────────────────────┐                  │
│  │  🔊  Listening Practice │  │  ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴  │                  │
│  │  Coming soon           │  │   More coming soon    │                  │
│  └────────────────────────┘  └────────────────────────┘                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Games section:** 2 cards side-by-side (iPad landscape); responsive wrap for portrait
- **Practice section:** 1 real card + 1 dashed-outline placeholder to signal extensibility
- **Word Builder card:** unchanged from cycle-15 (level + mastery dots + tap → `/build`)
- **Word Matching card:** new consolidated card showing "5 categories" hint; tap → `/matching`

### Word Matching Screen (new route `/matching`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [← back]  Word Matching                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Pick a category!                                                        │
│                                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ 🐻      │  │ 🌈      │  │ 🍎      │  │ ⭐       │  │ 🫀       │         │
│  │Animals  │  │Colors   │  │ Food    │  │Shapes   │  │BodyParts│         │
│  │ 12/100  │  │  3/10   │  │  8/63   │  │  0/20   │  │  0/25   │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

Essentially the current home category grid, relocated onto its own route. Back button top-left navigates to Home.

### State matrix

| State | Behavior |
|---|---|
| Loading | 5 skeleton category cards (same pattern as existing WordMatchingSection) |
| Ready | Category grid renders |
| Error | "Let's try again" + Retry button (same pattern as existing) |
| Empty | Friendly message "No categories yet — check back soon" |

### Routing

| Route | Component | Notes |
|---|---|---|
| `/` | HomeScreen | Restructured with GamesSection + PracticeSection |
| `/matching` | MatchingScreen | **new** — category grid (reuses existing CategoryList/WordMatchingSection logic) |
| `/play/:slug` | MatchRound | unchanged |
| `/words/:slug` | WordList | unchanged |
| `/build` | BuildPicker | unchanged |
| `/build/play` | BuildScreen | unchanged |

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| `/api/categories` returns empty | Empty state message on `/matching`; no broken UI |
| `/api/categories` returns 500 | Error state + Retry button |
| Child taps Back repeatedly | Each Back moves up one level; on Home, Back is disabled (browser-level handles it) |
| Profile switching mid-flow | Navigate back to Home automatically (existing app behavior) |
| Future practice modes added | New card replaces the placeholder slot in the Practice section; no other layout change |
| Dark mode toggle mid-flow | All new screens respond to the theme change via CSS variables |

## 8. Dependencies

- **Existing:** `GET /api/categories` endpoint (unchanged)
- **Existing components to reuse:** `CategoryList` (or `WordMatchingSection`) component logic — the category grid rendering + state handling moves to the new `MatchingScreen` route
- **Out of scope:** Listening Practice game (still placeholder; spec'd later in cycle-16-or-later)
- **Out of scope:** Level-up modal detection for Word Builder (still stubbed from cycle-13)
- **Out of scope:** L2 + L3 Word Builder seed expansion
- **Constraint:** No behavioral changes to Word Builder gameplay (cycle-15 state preserved)
- **Constraint:** No behavioral changes to Match Round gameplay (tap-to-hear audio preserved)
- **Constraint:** Dark mode parity required for all new UI
- **Constraint:** iPad landscape (1366×1024) primary viewport; responsive fallback for portrait

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-18 | 0.1.0 | calebdunn | Initial draft from /add:spec interview |
