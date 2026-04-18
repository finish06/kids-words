# UX Design: Word Builder (M7)

**Spec:** specs/word-builder.md
**Status:** APPROVED
**Approved:** 2026-04-18
**Iterations:** 1 (5 core questions + 2 concern re-asks)
**Target viewport:** iPad landscape (primary), iPad portrait (secondary)
**Maturity:** Beta — full state matrix + explicit approval + spec notes required

## Context: Home Screen Restructure

Before diving into Word Builder's own screens, the Home screen needs restructuring because **Word Builder is the second game in the app**, and **M8 (Word Phonetics) will be a third**. The existing 5 category cards (Animals, Colors, Food, Shapes, Body Parts) are actually sub-screens of a single game (Word Matching), not independent games.

**Chosen approach: Hybrid layout.** Top row shows games (Word Builder now, Phonetics later); below that, a `Word Matching` section keeps the familiar 5-category grid. Zero extra tap for Word Matching users, one tap for Word Builder (same as today's category tap).

## Screens

### Screen 1 — Home (restructured)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [Profile: Emma ▾]                                      [Settings gear]  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Games                                                                   │
│  ┌────────────────────────────┐  ┌────────────────────────────┐          │
│  │  🧩  Word Builder          │  │  🔊  Word Phonetics        │          │
│  │                            │  │                            │          │
│  │  Level 1   ●●○○○○  2/6 ★  │  │  Coming soon              │          │
│  │  "Build words with RE-     │  │  (tap a word, hear it)     │          │
│  │   and -ING!"               │  │                            │          │
│  └────────────────────────────┘  └────────────────────────────┘          │
│                                                                          │
│  Word Matching                                                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ 🐻      │  │ 🌈      │  │ 🍎      │  │ ⭐       │  │ 🫀       │         │
│  │Animals  │  │Colors   │  │ Food    │  │Shapes   │  │BodyParts│         │
│  │ 12/100  │  │  3/10   │  │  8/63   │  │  0/20   │  │  0/25   │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Word Builder card displays current level, mastery dots (6 patterns at L1 → 6 dots, filled when ≥3 stars), and a rotating tease of active patterns.
- Word Phonetics card shows "Coming soon" placeholder so the slot doesn't appear dead. Disabled until M8 ships — tap shows a brief "coming soon" toast.
- Word Matching section heading is new; the card grid below is unchanged from today.
- Profile picker + settings gear are unchanged.

### Screen 2 — Length Picker (pre-Build round)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [← back]   Word Builder — Level 1                                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│                       How long a round?                                  │
│                                                                          │
│     ┌──────────┐       ┌──────────┐       ┌──────────┐                   │
│     │          │       │          │       │          │                   │
│     │    5     │       │    10    │       │    20    │                   │
│     │  words   │       │  words   │       │  words   │                   │
│     │          │       │          │       │          │                   │
│     └──────────┘       └──────────┘       └──────────┘                   │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Identical visual treatment to the Word Matching length picker (reuse the existing component where possible).
- Edge case: when the valid combo pool for the current level is smaller than the selected length, greyed-out options make this visible. If only 8 combos available → "5" enabled, "10" and "20" greyed.
- Header shows current level — primes the child for what they're about to play.

### Screen 3 — Build Screen

**Default state (child about to tap):**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [← back]   Level 1   ●●○○○○          Round 3 of 5           ☀︎ dark     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│   ┌─────────┐                                        ┌─────────┐         │
│   │  RE-    │                                        │  -ING   │         │
│   │ (blue)  │                                        │ (green) │         │
│   └─────────┘                                        └─────────┘         │
│                                                                          │
│                         ╔═════════════════╗                              │
│                         ║                 ║                              │
│                         ║     PLAY        ║                              │
│                         ║                 ║                              │
│                         ╚═════════════════╝                              │
│                                                                          │
│   ┌─────────┐                                        ┌─────────┐         │
│   │  UN-    │                                        │  -ED    │         │
│   │ (blue)  │                                        │ (green) │         │
│   └─────────┘                                        └─────────┘         │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Notes:**
- **Symmetric flanks:** prefix tiles (blue, per AC-006) left; suffix tiles (green) right. Spatial metaphor reinforces which end of the word they attach to.
- **Empty flank is OK:** when all 3 options are the same type (e.g., all suffixes `-ING`, `-ED`, `-S`), the opposite flank stays blank. No forced symmetry. This honestly reflects the challenge and avoids distorting backend distractor logic. 3 tiles can stack vertically on whichever side is populated.
- **iPad no-scroll constraint:** the whole Build Screen must fit in the iPad landscape viewport (1366×1024 target). Tiles + base word + definition are all visible at once, never requiring scroll during a challenge.
- **Dark-mode-safe:** tile colors use CSS variables so both themes read well. Base-word container uses a theme-aware background.
- **Header shows:** back button, current level + mastery dots, round counter (e.g., "Round 3 of 5"), theme toggle.

**Correct tap (PLAY + RE- → REPLAY):**

```
┌──────────────────────────────────────────────────────────────────────────┐
│  [← back]   Level 1   ●●○○○○          Round 3 of 5                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                                                                          │
│                     (RE- tile slides right →)                            │
│                                                                          │
│                         ╔═══════════════════════╗                        │
│                         ║  ✨                    ║                        │
│                         ║     REPLAY            ║  ← glow + bounce       │
│                         ║                       ║                        │
│                         ╚═══════════════════════╝                        │
│                                                                          │
│                            play again                                    │
│                           (fades in 2s)                                  │
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Timing sequence:**
1. `t=0ms` — child taps RE-
2. `t=0–200ms` — RE- tile slides from its flank to attach at the left of PLAY; other tiles fade out
3. `t=200ms` — combined REPLAY visible; brief glow + bounce (~300ms)
4. `t=400ms` — definition ("play again") fades in below
5. `t=400–2400ms` — 2s dwell (per AC-015)
6. `t=2400ms` — auto-advance to next challenge

**Wrong tap (e.g., UN- on PLAY — UNPLAY isn't in the combo table):**

```
           ┌─────────┐
           │  UN-    │  ← gentle shake + bounce back to original slot
           │ (blue)  │     (no error text, no penalty, retry immediate)
           └─────────┘
```

Other tiles stay in place. Round state unchanged. Same non-punitive UX as Word Matching's wrong-tap. No toast, no "try again" text — the bounce itself is the feedback.

**Initial load (fetching round from `GET /api/word-builder/round`):**

```
│                         ╔═════════════════╗                              │
│                         ║                 ║                              │
│                         ║    ░░░░░░░░     ║  ← skeleton placeholder     │
│                         ║                 ║                              │
│                         ╚═════════════════╝                              │
│                                                                          │
│                     (tiles not yet rendered)                             │
```

Usually sub-200ms on staging. Skeleton prevents a blank-canvas flash.

**Network error fetching round:**

```
                    ┌───────────────────────────┐
                    │                           │
                    │  Hmm, let's try again!    │
                    │                           │
                    │     ┌───────────┐         │
                    │     │   Retry   │         │
                    │     └───────────┘         │
                    │                           │
                    └───────────────────────────┘
```

Same friendly retry pattern as Match Round's network-error state. No scary error text; the retry button is the obvious action.

### Screen 4 — Round Complete

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                          🎉  Great job!  🎉                              │
│                                                                          │
│                         You built 5 words!                               │
│                                                                          │
│                    Patterns practiced this round:                        │
│                                                                          │
│        RE-  ★★★       -ING ★★☆       -ED  ★☆☆       UN- ★☆☆              │
│                                                                          │
│                                                                          │
│              ┌───────────────┐        ┌───────────────┐                  │
│              │   Play Again  │        │   Home        │                  │
│              └───────────────┘        └───────────────┘                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Notes:**
- Celebration template reused from Word Matching. Pattern stars replace word stars.
- **"Play Again" routes to Length Picker** (not direct replay) — deliberate re-commitment per round. Diverges from Word Matching's direct replay behavior.
- "Home" returns to the home screen.

**Level-up modal (overlays Round Complete when threshold crossed):**

```
         ┌──────────────────────────────────────┐
         │                                      │
         │         ✨ Level 2 Unlocked! ✨       │
         │                                      │
         │      You've mastered Level 1.        │
         │   New patterns: PRE-, MIS-, -TION    │
         │                                      │
         │        ┌──────────────┐              │
         │        │  Let's go!   │              │
         │        └──────────────┘              │
         │                                      │
         └──────────────────────────────────────┘
```

**Notes:**
- Appears on top of Round Complete when the round just completed pushed L1 mastery across 70% (backend computes `unlocked: true` in `GET /progress`; frontend shows the modal if the flag flipped during this round).
- Gold/celebratory palette (uses the star-mastery colors) to visually separate from error banners.
- Dismiss returns to Round Complete behind; next Length Picker will default to L2 (highest unlocked).

## State Matrix

| State | Behavior | Reference |
|---|---|---|
| **Initial load** | Skeleton base-word placeholder; tiles invisible | New — not in spec |
| **Ready (tiles visible)** | Default Build Screen — 2-3 options rendered in flanks | Spec §6 |
| **Correct tap** | Tile slides to base word → combined word with glow/bounce → definition fades in (2s) → auto-advance | Spec §6 + AC-004 + AC-015 |
| **Wrong tap** | Tile shakes, bounces back to slot; no error text; retry immediate | Spec §6 + AC-005 |
| **Round complete** | Celebration screen with per-pattern stars | AC-014 |
| **Level unlocked (modal)** | Gold modal overlaid on Round Complete | AC-011 + AC-014 |
| **Length picker, reduced pool** | Grey out length options when combo pool is smaller than requested | Spec §7 edge case |
| **Network error (fetching round)** | Friendly retry modal — "Let's try again!" | Parity with Match Round's error UX |
| **Homogeneous options** | When all 3 options are same type, opposite flank stays empty | UX decision — see Key Decisions |

## Flow

```
Home
 └─[Word Builder card tap]→ Length Picker
                             └─[5/10/20 tap]→ Build Screen (loops per challenge)
                                              ├─[correct tap]→ snap → definition → next challenge
                                              ├─[wrong tap]→ bounce back → retry
                                              └─[last challenge done]→ Round Complete
                                                                        ├─[threshold crossed this round?]
                                                                        │   └─yes→ Level-up modal
                                                                        │          └─[dismiss]→ Round Complete
                                                                        ├─[Play Again]→ Length Picker
                                                                        └─[Home]→ Home
```

## Key Decisions

| Decision | Rationale | Alternatives Considered |
|---|---|---|
| **Hybrid home layout (Games row + Word Matching grid)** | Preserves zero-extra-tap for Word Matching users while giving Word Builder equal visual weight. Scales to M8 (Phonetics) and future games without another restructure. | Two-level navigation (adds a tap for Matching users); flat grid (gets crowded with ≥3 games). |
| **Symmetric flanks on Build Screen (prefix left, suffix right)** | Spatial metaphor reinforces AC-006's prefix/suffix distinction. Color coding (blue/green) is redundant with position, which is accessibility-friendly. | Stacked with directional arrows (loses spatial cue); dock at bottom (loses left/right semantic). |
| **Empty flank allowed when options are type-homogeneous** | Honest reflection of the challenge; no backend distortion. Kids learn "this time all the pieces go on the end." | Force ≥1 of each type in every challenge (distorts distractor logic); center tiles vertically on one side (still asymmetric, harder to lay out). |
| **"Play Again" → Length Picker (not direct replay)** | Each round is a deliberate commitment. Prevents accidental infinite-loop behavior for kids who just keep tapping. | Direct replay same length/level (Word Matching's behavior). |
| **2s definition dwell per AC-015 (not configurable in M7)** | Simplicity wins for v1. Configurable dwell is future polish — add to a settings cycle alongside other parent-gated prefs. | Tap-to-freeze (adds interaction complexity to a celebration moment); configurable via settings (out of scope). |
| **iPad landscape-first, no-scroll Build Screen** | Target device is tablet (per PRD §4); landscape maximizes room for symmetric flanks. No-scroll prevents kids losing context mid-tap. | Phone-first (wrong target); portrait-primary (cramps flank layout). |
| **Dark-mode-safe from the start** | M5 shipped dark mode; new screens must not break it. Use CSS variables for all theme-dependent values. | Build light-first, audit later (generates rework). |

## Figma Reference

N/A — wireframes generated in session. iPad landscape canvas (1366×1024 reference).

## Spec Notes

Minor spec observations — no AC rewrites needed, but frontend implementers should know:

- **AC-001** ("Word Builder mode accessible from home screen alongside word matching") remains true; the home-screen shape evolves from a flat category grid to a grouped `Games` + `Word Matching` layout. The existing category-grid code likely moves into a `WordMatchingSection` component; the new `GamesSection` is the parent for Word Builder + future Phonetics.

- **"Play Again" behavior** is documented here; spec §6 is silent on it. Deliberate divergence from Word Matching's replay.

- **Configurable definition dwell** (tap-to-freeze, parent-set default) is **future scope** — log as a candidate for a post-M7 settings/polish cycle. 2s is the M7 default per AC-015.

- **Level-unlocked modal styling** uses the star-mastery gold palette — not a new color system, reuses existing star celebration tokens.

- **Homogeneous-option flanks** (e.g., all 3 options are suffixes) leave one flank empty. Implementation note: tile layout must handle 0/1/2/3 tiles per flank gracefully. Each flank renders its own tile stack independently.

- **Word Phonetics card** on Home is a **placeholder for M8** — ship it disabled with "Coming soon" copy in cycle-13 so M7 Frontend delivers the full home restructure in one cycle, rather than needing a second restructure pass when M8 lands.
