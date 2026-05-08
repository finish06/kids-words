# Spec: Game Progress Bar

**Version:** 0.1.0
**Created:** 2026-05-07
**PRD Reference:** docs/prd.md
**Status:** Approved (UX signed off 2026-05-07)
**UI Design:** specs/ux/game-progress-bar-ux.md v1.0 (APPROVED 2026-05-07)
**Affects:** specs/word-image-matching.md, specs/word-builder.md, specs/cvc-builder.md, specs/home-games-practice.md
**Coupled with:** profile system (X-Profile-ID header), star mastery convention (2/4/7+)

## 1. Overview

Every Game card on Home (Word Matching, Word Builder, future CVC builder, and any future star-tracking Game) shows a horizontal progress bar with a star-count label. The bar fills with a gold gradient as the child earns stars, scoped to whatever that game considers its "tracked items" (words, patterns, etc.) and to its currently *unlocked* levels. Colors stay positive at every percentage — no warning colors at low values — so children always feel they're making progress and feel proud.

The bar replaces the existing dot row + `0/6 ★` text on the Word Builder card and adds a new progress UI to the Word Matching card (which has none today).

### User Story

As a child (4-6) using the app, I want to see a single colorful bar that grows as I earn stars in each game, so that I can see how far I've come and feel proud of my progress without needing to read percentages.

### Why this design

- **Per-game denominator** — each Game already has a different concept of "unit being mastered" (words for Matching/CVC, patterns for Word Builder). Forcing a uniform unit would require a model refactor for marginal gain. The bar is a percentage either way.
- **Unlocked-only denominator** — if a kid on Level 1 saw a bar that could never exceed ~33% (because L2/L3 are still locked), they'd feel stuck. Scoping to unlocked levels means 100% is reachable today; level unlock is framed as growth (`New level unlocked!`) rather than a regression in the bar.
- **Star count, no percentage** — `72 ★` is concrete and reading-light. `20%` is abstract for the audience. No fraction, because Word Matching's denominator (660) is intimidating and doesn't help motivation.
- **Always-positive colors** — gold star gradient at every fill level. No red/yellow at low fills. Children never see "warning" coloring on their own progress.
- **Confetti at 100%** — high-affect reward at the moment a kid masters everything currently available. Subtle on subsequent loads to avoid feeling stale.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Each Game card on Home that tracks stars displays a horizontal progress bar at the bottom of the card | Must |
| AC-002 | The bar consists of a filled section (gold gradient) and an empty section (soft neutral) | Must |
| AC-003 | Filled section uses linear-gradient `#fbbf24 → #f59e0b` (warm gold → amber) | Must |
| AC-004 | Empty section uses `rgba(255,255,255,0.15)` against the dark card background | Must |
| AC-005 | Filled width is exactly `stars_earned / stars_possible` of the bar's total width | Must |
| AC-006 | A star-count label `{N} ★` is rendered adjacent to the bar (e.g., right-aligned beneath it) | Must |
| AC-007 | No percentage text and no fraction text (e.g., `72/360`) is shown anywhere on the bar | Must |
| AC-008 | **Word Matching denominator** = sum across visible categories (`animals`, `colors`, `food`, `shapes`) of `word_count × 3`. Hidden categories (currently `body-parts`) are excluded — kids don't see those on the Word Matching card today, so their stars must not affect the bar. (e.g., today: (100+10+63+22) × 3 = 585) | Must |
| AC-009 | **Word Builder denominator** = `unlocked_pattern_count × 3` (e.g., today with L1 only: 6 × 3 = 18) | Must |
| AC-010 | **CVC builder denominator** = `unlocked_word_count × 3` (e.g., L1 only: 10 × 3 = 30) | Must |
| AC-011 | **stars_earned** = sum of `star_level` (0-3) across that game's tracked items at unlocked levels | Must |
| AC-012 | Bar width animates from current to new value over ~400ms when the value changes (card mount or real-time star earn) | Must |
| AC-013 | When the bar reaches 100% for the first time in a session, a confetti animation fires once on that card | Must |
| AC-014 | When the bar is at 100%, a `✨ Mastered!` badge appears at the right end of the bar | Must |
| AC-015 | When a new level unlocks (Word Builder, CVC, or any leveled future game), the denominator grows on the next render and a `New level unlocked!` toast fires once | Must |
| AC-016 | All values are scoped per profile via the existing `X-Profile-ID` header — switching profiles updates every bar | Must |
| AC-017 | Empty state (a brand-new profile with zero stars) shows an empty bar plus the label `0 ★` — no spinner, no error, no "no progress yet" message | Must |
| AC-018 | The existing dot row + `0/6 ★` element on `WordBuilderCard.tsx` is removed and replaced by the new progress bar | Must |
| AC-019 | Backend extends each game's progress endpoint with two fields: `stars_earned: int` and `stars_possible: int` | Must |
| AC-020 | The Home card grid (`GamesSection.tsx`) layout absorbs the bar without breaking existing card heights at 320px / 768px / 1024px viewports | Must |
| AC-021 | The bar is accessible: `aria-label="{stars_earned} of {stars_possible} stars earned"` on the bar element | Should |
| AC-022 | When `stars_possible === 0` (e.g., a misconfigured game), the card shows the empty state from AC-017, not a divide-by-zero error | Must |
| AC-023 | The bar persists across reloads: closing and reopening the app on the same profile shows the same fill | Must |
| AC-024 | Subtle glow on the bar when at 100% on subsequent visits (after the confetti has fired once) — "always celebrating" feel without being noisy | Should |

## 3. User Test Cases

### TC-001: Fresh Profile — Empty Bars Everywhere

**Precondition:** A brand-new profile is created and selected. No games played yet.
**Steps:**
1. Navigate to Home.
2. Observe the Word Matching card.
3. Observe the Word Builder card.
4. (When CVC builder ships) Observe the CVC card.

**Expected Result:** Each card shows a 0%-filled bar (entirely empty, soft neutral) with the label `0 ★`. No confetti, no badge, no error. Layout is intact.
**Screenshot Checkpoint:** `tests/screenshots/game-progress-bar/step-01-empty-bars.png`
**Maps to:** TBD

### TC-002: Earning Stars Grows the Bar

**Precondition:** Profile has played some Word Matching but is not yet at 100%.
**Steps:**
1. Note the current Word Matching label, e.g. `12 ★`.
2. Open Word Matching, complete a 5-word round, get all 5 first-attempt-correct (driving star growth on multiple words).
3. Return to Home.
4. Observe the Word Matching card.

**Expected Result:** The bar visibly grows (animates over ~400ms) from its prior fill to the new fill. The star count label increments accordingly (e.g., `12 ★ → 17 ★`). No confetti unless 100% was crossed.
**Screenshot Checkpoint:** `tests/screenshots/game-progress-bar/step-02-bar-growth.png`
**Maps to:** TBD

### TC-003: 100% Mastery — Confetti + Badge

**Precondition:** Profile is one star away from 100% on Word Builder L1 (e.g., `17/18 ★`, only `-ER` pattern not yet 3-starred).
**Steps:**
1. Open Word Builder, complete a round including the final star needed on `-ER`.
2. Return to Home.
3. Observe the Word Builder card.

**Expected Result:** Bar fills to 100%, confetti animation plays once over the card (~1.2s), and the `✨ Mastered!` badge slides in at the right end of the bar. Label reads `18 ★`.
**Screenshot Checkpoint:** `tests/screenshots/game-progress-bar/step-03-100-percent-confetti.png`
**Maps to:** TBD

### TC-004: Level Unlock Grows the Denominator

**Precondition:** Profile has 100% on Word Builder L1 (`18 ★` mastered), L2 patterns just seeded into DB and now meet the 70% unlock threshold.
**Steps:**
1. Trigger the unlock by completing a round whose result crosses the 70% threshold.
2. Return to Home.
3. Observe the Word Builder card.

**Expected Result:** A `New level unlocked!` toast fires once. The bar denominator grows from 18 to 36 (6 + 6 patterns × 3). The fill drops from 100% to ~50% (because L1 stars carry forward but L2 starts at zero). Star count reads `18 ★`. No regression messaging — only positive framing.
**Screenshot Checkpoint:** `tests/screenshots/game-progress-bar/step-04-level-unlock.png`
**Maps to:** TBD

## 4. Data Model

**No new tables.** This feature uses existing star data:

| Source | Field used | Game |
|--------|-----------|------|
| `WordProgress.star_level` (existing, range 0-3) | sum across all words at unlocked categories | Word Matching |
| `PatternProgress.star_level` (existing, range 0-3) | sum across all patterns at unlocked levels | Word Builder |
| `CVCWordProgress.star_level` (proposed in `specs/cvc-builder.md`, range 0-3) | sum across all words at unlocked levels | CVC builder |

**No data model changes.** The denominator is computed from the count of items multiplied by 3 (max stars per item).

## 5. API Contract

Extend each game's existing progress endpoint with two new fields. No new endpoints.

### GET /api/progress (Word Matching aggregate)

Existing response shape, with two new fields on the `summary` object:

```json
{
  "progress": [...],
  "summary": {
    "total_words": 220,
    "mastered": 36,
    "mastery_percentage": 16.4,
    "stars_earned": 72,
    "stars_possible": 660
  }
}
```

`stars_possible` = `total_words × 3` across all categories that exist in the DB (no concept of locked categories today).

### GET /api/word-builder/progress

Existing response, with two new top-level fields:

```json
{
  "levels": [
    { "level": 1, "unlocked": true, "patterns": [...], "mastery_percentage": 0.0 },
    { "level": 2, "unlocked": false, "patterns": [], "mastery_percentage": 0.0 },
    { "level": 3, "unlocked": false, "patterns": [], "mastery_percentage": 0.0 }
  ],
  "stars_earned": 0,
  "stars_possible": 18
}
```

`stars_possible` = `unlocked_pattern_count × 3`, summed across `levels` where `unlocked === true`.
`stars_earned` = `sum(p.star_level for p in unlocked_patterns)`.

### GET /api/cvc-builder/progress (proposed by specs/cvc-builder.md)

When that spec is implemented, its response gains the same two top-level fields:

```json
{
  "levels": [...],
  "stars_earned": 0,
  "stars_possible": 30
}
```

`stars_possible` = `unlocked_word_count × 3`. `stars_earned` = sum of `star_level` across unlocked words.

### Error responses

No new error modes. Existing 412 (missing X-Profile-ID), 404 (profile not found) behaviors unchanged.

## 6. UI Behavior

### States

- **Loading:** Skeleton placeholder where the bar will be (no spinner; cards already render their other content). Resolves in well under 200ms typical.
- **Empty (zero stars):** Empty bar, label `0 ★`, no celebration UI. Default for fresh profiles. (AC-017)
- **Partial (any 0 < N < total):** Bar filled to `N / total`, label `{N} ★`. Bar animates on mount over ~400ms.
- **Full (N === total):** Bar at 100%, `✨ Mastered!` badge at right end, confetti once-per-session on threshold cross, subtle glow on subsequent visits.
- **Error (network failure on /progress):** Card renders without the bar (degraded but not broken); existing card content (icon, title, "tap to play") still works. No error toast — kids don't need to see network errors.

### Visual specification

```
WordBuilderCard rendered example:

┌────────────────────────────────────────┐
│ 🧩  Word Builder                       │
│     Build words from sounds.           │
│                                        │
│     ████████████████░░░░░░░░░░░░       │
│                                  18 ★  │
└────────────────────────────────────────┘
```

- Bar height: 8px
- Border radius: 4px
- Bar margins: 16px from card horizontal padding; 12px above the label
- Label font: 14px, weight 600, color `#fbbf24` (matches gradient start)
- Filled gradient: `linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)` (rotated to horizontal)
- Empty fill: `rgba(255,255,255,0.15)`
- 100% glow: `box-shadow: 0 0 12px 2px rgba(251, 191, 36, 0.4)` on the filled portion
- Animation: `transition: width 400ms ease-out` on the filled element

### Screenshot Checkpoints

| Step | Description | Path |
|------|-------------|------|
| 1 | Home with empty bars on both Game cards (fresh profile) | `tests/screenshots/game-progress-bar/step-01-empty-bars.png` |
| 2 | Home after a round, bar visibly grown | `tests/screenshots/game-progress-bar/step-02-bar-growth.png` |
| 3 | 100% mastery moment with confetti + badge | `tests/screenshots/game-progress-bar/step-03-100-percent-confetti.png` |
| 4 | Level unlock toast + denominator growth | `tests/screenshots/game-progress-bar/step-04-level-unlock.png` |
| 5 | iPad landscape layout — both cards' bars rendering side-by-side | `tests/screenshots/game-progress-bar/step-05-ipad-landscape.png` |
| 6 | Dark mode rendering (gold gradient still readable) | `tests/screenshots/game-progress-bar/step-06-dark-mode.png` |

**UI design APPROVED — see `specs/ux/game-progress-bar-ux.md` v1.0 for wireframes, state matrix, confetti choreography, and key decisions.** The notes above describe the overall approach; the UX artifact is the source of truth for screen layout, timing, and edge-case behavior.

Two design-time decisions captured in the UX artifact and not previously pinned in this spec: (a) Word Matching keeps its `Pick a category!` subtitle while Word Builder drops its `Build words with prefixes & suffixes!` subtitle (since WB has a level indicator filling the bottom-left slot and WM has nothing else there); (b) the level-unlock toast text is `✨ New level unlocked! ✨` and the level transition copy is `Level X → Level Y` shown for ~3s before snapping.

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Brand-new profile (zero stars) | Empty bar + `0 ★` label. No "no data" message. (AC-017) |
| `stars_possible === 0` (no items seeded) | Empty bar + `0 ★`. No divide-by-zero error. (AC-022) |
| Profile switch mid-Home view | Cards refetch progress; bars animate to new profile's values |
| Network failure on `/progress` | Card renders without the bar; no error toast — kids don't need to see this |
| Stars exceed possible (data anomaly, e.g., a row with star_level > 3) | Cap displayed fill at 100%; log the anomaly server-side; do not crash |
| 100% mastery already on Home open | Confetti does NOT fire (one-shot per session-cross-threshold); badge + glow visible |
| Rapid successive Home opens at 100% | Confetti fires at most once per session per game card |
| Level unlock during a round | Toast fires when the kid returns to Home, not mid-round |
| Reduced-motion preference (`prefers-reduced-motion`) | Bar transitions and confetti respect the system preference: bar snaps to value, confetti is replaced with a static badge fade-in |
| Card scroll/clipping at narrow widths (<320px) | Label wraps below the bar rather than truncating |
| Two profiles: one at 100%, one at 0% | Switching between them animates the bar from one value to the other (not a snap) |
| Listening Practice card or other non-star-tracking cards | No bar rendered. The bar is only on Game cards that opt in by exposing `stars_earned` + `stars_possible` |

## 8. Dependencies

- Existing star-tracking system: `WordProgress.star_level`, `PatternProgress.star_level` (and future `CVCWordProgress.star_level`)
- Profile system + `X-Profile-ID` middleware
- Home Games/Practice structure (`HomeScreen.tsx`, `GamesSection.tsx`) from cycle-16
- `WordBuilderCard.tsx` (existing) — to be modified per AC-018
- `WordMatchingCard.tsx` (existing, currently has no progress UI) — to gain a bar
- `CVCBuilderCard.tsx` (proposed in `specs/cvc-builder.md`) — to ship with a bar from day one
- Confetti library — `canvas-confetti` (small, ~3KB gzipped, no React dependency); a lighter custom CSS-only fallback acceptable
- Star icon convention (existing `Stars.tsx` uses `★` glyph) — reused for label

## 9. Infrastructure Prerequisites

| Category | Requirement |
|----------|-------------|
| Environment variables | None new |
| Registry images | Backend image with the extended `/progress` responses |
| Cloud quotas | N/A |
| Network reachability | N/A |
| CI status | Backend + frontend pipelines green; coverage ≥ 80% |
| External secrets | N/A |
| Database migrations | None — feature uses existing tables and columns |
| Frontend dependency | `canvas-confetti` added to `frontend/package.json` (or CSS-only fallback chosen during UX) |

**Verification before implementation:**
- Existing star-tracking endpoints return the new `stars_earned` + `stars_possible` fields under integration tests
- `WordBuilderCard.tsx` no longer renders the dot row (visual regression test on the cycle-16 Home layout)
- Confetti fires exactly once per session-cross-threshold per card (test via mock + spy)

## 10. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-05-07 | 0.1.0 | calebdunn | Initial spec from `/add:spec` interview. Per-game progress bar with always-positive colors; replaces the Word Builder dot row; ships forward-compatible with CVC builder and any future star-tracking Game. |
| 2026-05-07 | 0.2.0 | calebdunn | UX signed off (specs/ux/game-progress-bar-ux.md v1.0). Status Draft → Approved. §6 updated to reference UX artifact and pin two design-time decisions (subtitle treatment per game; toast/transition copy). |
| 2026-05-07 | 0.2.1 | calebdunn | AC-008 narrowed to exclude hidden categories from the Word Matching denominator. Body-parts is currently the only hidden category (per cycle-13 hide decision in `WordMatchingCard.tsx`). Today's denominator: 585 (was 660). Open Question #1 in plan resolved. |
