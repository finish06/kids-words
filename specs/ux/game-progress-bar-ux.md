# UX Design: Game Progress Bar

**Spec:** specs/game-progress-bar.md
**Status:** APPROVED (v1.0)
**Approved:** 2026-05-07
**Iterations:** 1
**Target viewport:** iPad landscape (primary), iPad portrait (secondary), narrow phone (down to 320px)
**Maturity:** Beta — full state matrix + explicit approval + spec notes required

## Context

A horizontal gold-gradient progress bar sits at the bottom of every star-tracking Game card on Home. It replaces the existing dot row + `0/6 ★` element on `WordBuilderCard.tsx` and adds new progress UI to `WordMatchingCard.tsx` (which has none today). Forward-compatible with the proposed CVC builder per `specs/cvc-builder.md`.

Always-positive coloring (gold throughout, never red/yellow/warning) so children at any progress level feel they're moving forward and feel proud.

## Screens

### Word Matching card

```
┌──────────────────────────────────────────────┐
│  🎯  Word Matching                           │
│                                              │
│      ████████████░░░░░░░░░░░░░░░░░░░░        │
│                                      72 ★   │
│                                              │
│      Pick a category!                        │
└──────────────────────────────────────────────┘
```

- Encouragement subtitle ("Pick a category!") **stays**. Word Matching has no level indicator and the bar alone would leave the bottom of the card sparse. The subtitle also doubles as a navigation hint (it's an aggregator over 5 sub-categories).
- Bar is full-width inside the card's 16px horizontal padding.
- Star count `72 ★` right-aligned, 14px gold (`#fbbf24`).

### Word Builder card

**Before** (current shipped UI — dot row + fraction):

```
┌──────────────────────────────────────────────┐
│  🧩  Word Builder                            │
│                                              │
│      Level 1   ●●○○○○  2/6 ★                │
│      Build words with prefixes & suffixes!   │
└──────────────────────────────────────────────┘
```

**After** (this design):

```
┌──────────────────────────────────────────────┐
│  🧩  Word Builder                            │
│                                              │
│      ████████████░░░░░░░░░░░░░░░░░░░░        │
│                                      6 ★    │
│                                              │
│      Level 1                                 │
└──────────────────────────────────────────────┘
```

- The encouragement subtitle ("Build words with prefixes & suffixes!") is **dropped**. Reasoning: it's marketing copy aimed at parents; once the bar shows real progress, the kid doesn't need a tagline.
- The level indicator **stays** (the kid wants to know which level they're on).
- The dot row + `2/6 ★` is fully replaced.

### CVC builder card (forward-compatible — when the spec ships)

```
┌──────────────────────────────────────────────┐
│  🧩  Word Builder                            │
│                                              │
│      ██████████░░░░░░░░░░░░░░░░░░░░░░        │
│                                      9 ★    │
│                                              │
│      Level 1                                 │
└──────────────────────────────────────────────┘
```

The CVC builder reuses the Word Builder card slot (per the M7 closure direction TBD). Same layout. Denominator changes meaning (words × 3 instead of patterns × 3), but the kid doesn't need to know that.

## State matrix

| State | Bar fill | Label | Badge | Animation |
|-------|----------|-------|-------|-----------|
| **Loading** | (skeleton placeholder, soft pulse) | (hidden until data arrives) | — | 200ms cross-fade when data loads |
| **Empty (0 ★)** | empty (entirely soft neutral) | `0 ★` | — | none |
| **Partial** | width = `stars_earned / stars_possible` | `{N} ★` | — | width 400ms ease-out on mount + on real-time gain |
| **Threshold-cross to 100%** | full | `{N} ★` | `✨ Mastered!` slides in from right | confetti burst from bar's right end (~1.2s) |
| **100% (subsequent loads)** | full | `{N} ★` | `✨ Mastered!` static | gentle gold glow pulse on bar |
| **Level unlock** | drops from prior% (often 100%) to new value | `{N} ★` | — | `✨ New level unlocked! ✨` toast over card, 2.5s; `Level 1 → Level 2` transition copy on the card for ~3s, then snaps to `Level 2` |
| **Network error on /progress** | — (bar hidden) | — | — | card renders normally without bar; no error toast |
| **Reduced motion** | bar snaps to value (no transition); confetti replaced with badge fade-in (~300ms); glow becomes static gold border | — | — | per `prefers-reduced-motion: reduce` |

## Confetti choreography (threshold-cross to 100%)

```
┌──────────────────────────────────────────────┐
│  🧩  Word Builder              ✨ ✨ ✨        │
│                              ✨    ✨   ✨       │
│      ████████████████████████████████   ✨    │
│                                      18 ★   │
│                                              │
│      Level 1   ✨ Mastered!                   │
└──────────────────────────────────────────────┘
```

- **Origin:** the bar's right end (where the star count lives).
- **Direction:** angles outward from the right end, ~30° spread upward and outward.
- **Duration:** ~1.2s; particles fade as they leave the card.
- **Density:** moderate — enough to feel celebratory, not overwhelming.
- **Trigger:** fires once per session-cross-threshold. Not on subsequent Home loads.
- **Reduced motion:** confetti suppressed; `✨ Mastered!` badge fades in over ~300ms instead.

## Level unlock moment

```
        ┌──────────────────────────────────┐
        │   ✨ New level unlocked! ✨       │   ← gold pill toast positioned
        └──────────────────────────────────┘     over the card, auto-dismiss
                                                  2.5s
┌──────────────────────────────────────────────┐
│  🧩  Word Builder                            │
│                                              │
│      ██████████████████░░░░░░░░░░░░░░░       │
│                                     18 ★    │
│                                              │
│      Level 1 → Level 2                       │   ← shown ~3s, then snaps
└──────────────────────────────────────────────┘     to `Level 2`
```

- Toast styled as a gold pill (`#fbbf24` background, dark text), shadow lift to read above the card.
- Bar fill drops from 100% to ~50% (denominator grew from 18 to 36; L1 stars carry forward).
- The drop is framed as growth: gold gradient continues, toast is celebratory, level transition is shown.

## iPad landscape (both Game cards visible)

```
┌────────────────────────────────────────┐  ┌────────────────────────────────────────┐
│  🎯  Word Matching                     │  │  🧩  Word Builder                      │
│                                        │  │                                        │
│      ███████░░░░░░░░░░░░░░░░░          │  │      █████████████████░░░░░░░░         │
│                              72 ★     │  │                              13 ★      │
│                                        │  │                                        │
│      Pick a category!                  │  │      Level 1                           │
└────────────────────────────────────────┘  └────────────────────────────────────────┘
```

Bars match in height (8px), animation timing (400ms), and label style. Visual rhyming between cards.

## Visual specification

| Property | Value |
|----------|-------|
| Bar height | 8px |
| Bar border-radius | 4px |
| Bar horizontal margin (within card) | 16px |
| Margin between bar and label | 12px |
| Filled gradient | `linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)` |
| Empty fill | `rgba(255, 255, 255, 0.15)` |
| 100% glow | `box-shadow: 0 0 12px 2px rgba(251, 191, 36, 0.4)` on filled element |
| Bar transition | `width 400ms ease-out` |
| Label font | 14px, weight 600, color `#fbbf24` (matches gradient start) |
| Label position | right-aligned beneath the bar |
| Label format | `{N} ★` — star count only, no fraction, no percentage |
| `Mastered!` badge | gold pill, `✨ Mastered!`, 12px, weight 600, dark text on gold |
| Level unlock toast | gold pill, `✨ New level unlocked! ✨`, 14px, dark text, 2.5s auto-dismiss, fade in/out 200ms |
| Level transition copy | `Level 1 → Level 2`, shown ~3s, then snaps to new level |

## Dark mode

Empty fill `rgba(255,255,255,0.15)` reads against both light and dark card backgrounds (the existing card backgrounds use the dark palette `#0f0f23` / `#1a1a2e`). Gold gradient stays warm against the dark. Star label `#fbbf24` has 8.5:1 contrast against the dark card — well above WCAG AA.

## Accessibility

- Bar carries `aria-label="{stars_earned} of {stars_possible} stars earned"` (per AC-021). Screen readers can announce progress without seeing the gold.
- `prefers-reduced-motion: reduce` honored: bar snaps to value, confetti suppressed, toast fades instead of slides, glow becomes static border.
- Color is not the only signal — the star-count label tells the same story numerically.
- Touch targets unaffected: the entire card stays tappable; the bar is decorative within the card's existing button.

## Flow

1. Kid opens Home → cards render → bars animate from 0 to current value over 400ms.
2. Kid taps a Game card → plays a round → returns to Home → bars animate to new values; confetti fires if any card crossed 100%.
3. If a level unlocks, toast fires once on return; `Level X → Level Y` transition shown for ~3s.

## Key Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Drop Word Builder subtitle, keep Word Matching subtitle | WB has the level indicator filling the bottom-left slot; WM has nothing else there and the subtitle doubles as a "tap to pick" cue | Drop both (sparse), keep both (cluttered against new bar) |
| Confetti burst from bar's right end | Ties the celebration to the place where stars accumulate; directional and meaningful | Full-card overlay (invasive), center burst (less directional) |
| Toast positioned over the card | Card-localized — the celebration belongs to that game | Top-of-Home banner (generic), inline above bar (cramped on small cards), modal (disruptive) |
| `Level 1 → Level 2` shown for ~3s, then snaps | Acknowledges the change, then settles | Snap immediately (too abrupt), keep the arrow forever (visually noisy) |
| Star count only, no fraction or percent | 4-6 year olds can recognize digits incrementing; percentages are abstract; denominators (660) are intimidating | `72/360 ★`, `20%`, kid-friendly text labels |
| Gold gradient `#fbbf24 → #f59e0b` | Echoes the star reward kids already know | Indigo accent (cool), green solid (flat), rainbow segments (busy) |
| Bar replaces dot row entirely on Word Builder | Two progress visualizations on one card is redundant; the bar is the new mental model | Keep dots, add bar (clutter), keep fraction text alone (no visual progress signal) |

## Spec impact

`specs/game-progress-bar.md` already covers the visual spec, state matrix, and edge cases comprehensively. Two minor notes for the spec:

1. The choice to **keep Word Matching's subtitle but drop Word Builder's** is a UX-time decision not pinned in the spec. Worth a one-line note in §6 of the spec for traceability.
2. The toast text `✨ New level unlocked! ✨` and the `Level 1 → Level 2` transition copy were finalized here, not in the spec. AC-015 mentions the toast but doesn't pin the wording — consider locking it in §6 or just trusting this UX artifact.

## Figma Reference

N/A — wireframes generated in session. No Figma source.
