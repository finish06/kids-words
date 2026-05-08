# Cycle-17 Prioritization Memo

**Author:** away-mode agent (cycle-17 prep)
**Date:** 2026-05-07
**Status:** Memo — input for `/add:cycle --plan` when human returns
**Predecessor:** cycle-16 (Home Games/Practice + /matching) — IN_PROGRESS, awaiting iPad PAT
**Branch in flight:** `chore/away-2026-05-07-quality-baseline` (this branch — to be PR'd as cycle-17 prep, not yet merged)

---

## Triage of deferred items from `.add/handoff.md`

| Item | Verdict | Reason |
|------|---------|--------|
| Listening Practice game | **Keep** | Independent of M7/CVC. Still needs `/add:spec` + `/add:ux`. |
| L2 + L3 Word Builder seed expansion | **Drop** | Stale. Morphology content is being replaced by CVC; expanding old seed is wasted work. |
| Full Word Builder E2E Playwright | **Replace** | Stale for prefix/suffix model. Replace with "CVC builder E2E (happy / wrong-drop / level-up)" once CVC ships. |
| Level-up modal detection | **Keep, retitle** | Still relevant — `specs/cvc-builder.md` AC-015 + the `level_unlocked` field on `POST /results`. Retitle "CVC level-up modal" once CVC backend lands. |
| Configurable TTS rate / voice | **Keep** | Still relevant — affects Match Round, future CVC, future Listening Practice. Parent-settings polish. |
| `.add/learnings.md` → JSON migration | **Keep** | Mechanical cleanup. Not blocking. Good filler when nothing else is unblocked. |

---

## New items surfaced this session

| # | Item | Origin |
|---|------|--------|
| N1 | M7 closure decision (Option A / B / C) | `docs/cvc-builder-impact-analysis.md` — human-only call |
| N2 | M7 closure execution (PRD update, milestone closure or rescope, mark `specs/word-builder.md` Deprecated) | Mechanical follow-up to N1 |
| N3 | CVC backend implementation (tables, migrations, routes, seed, schemas) | `specs/cvc-builder.md` §4-5, AC-001..023 |
| N4 | `/add:ux specs/cvc-builder.md` (UX interview, blocks frontend work) | `specs/cvc-builder.md` §6 |
| N5 | L1 image asset sourcing (10 PNGs at `/assets/cvc/{word}.png`) | `docs/cvc-builder-image-shopping-list.md` |
| N6 | CVC frontend implementation (BuildScreen / hook / card / API client) | `specs/cvc-builder.md` §6, blocked by N4 + N5 |
| N7 | Pre-existing test_word_builder.py mypy debt (8 errors) | This session — boundaried; resolves with M7 cleanup or rescope |
| N8 | iPad PAT for cycle-16 home Games/Practice + /matching | `.add/handoff.md` — independent of M7 closure |

---

## Recommended cycle-17 candidate set

The right shape of cycle-17 depends on the M7 closure decision (N1). Three candidate cycles, picked by maturity (beta) and WIP limit (3 per `.add/config.json`):

### If N1 = Option A (parallel, recommended in spec)

**Cycle-17 (3-4 days):**
1. **N8 — iPad PAT for cycle-16** → closes cycle-16 via `/add:cycle --complete`
2. **N2 — M7 closure mechanical execution** → PRD edit, M7 milestone marked COMPLETE, M9 milestone created, `specs/word-builder.md` → Deprecated
3. **N3 — CVC backend** (TDD-strict) → migration 003, tables, routes, seed, schemas, ~30-40 tests
4. **N4 — `/add:ux specs/cvc-builder.md`** (in parallel with N3 — UX is human-driven, doesn't block backend TDD)

**Cycle-18 (3-5 days):**
5. **N5 — L1 image asset sourcing** → 10 PNGs delivered
6. **N6 — CVC frontend** → BuildScreen/CVCBuildScreen, hook, card, API client, ~20-30 tests
7. **CVC E2E Playwright** → 3-5 scenarios

**Backlog:**
- Listening Practice (its own cycle, after CVC stabilizes)
- Configurable TTS (small, can be folded into any cycle as polish)
- Level-up modal detection (small, fold into N6 or N7)
- learnings.md → JSON migration (filler)

### If N1 = Option B (rescope in place)

**Cycle-17 (5-7 days, one bigger swing):**
1. N8, N2 (modified — rescope rather than close)
2. N3 + N6 combined: mode-aware refactor of BuildScreen + useBuildRound + new tables + new seed + new tests + retire old morphology tests
3. N4 in parallel
4. N5 in parallel

**Cycle-18:** L1 polish, E2E, Listening Practice.

(Higher risk, longer first-staging, but lower long-term LOC.)

### If N1 = Option C (shared primitives)

**Cycle-17 (4-5 days):**
1. N8, N2
2. Extract primitives from BuildScreen/useBuildRound — refactor only, M7 still works
3. CVC backend (N3)
4. N4 + N5 in parallel

**Cycle-18:** CVC frontend (built on primitives), E2E.

(Slowest first-staging, best long-term shape.)

---

## Risk flags for whichever cycle ships next

1. **L1 images are a soft prerequisite for PAT.** AC-021 fallback works, but PAT requires real images for the audience-readiness check. Decide image source (gen / commission / manual stock) before mid-cycle.
2. **`/add:ux` interview can't run autonomously.** Human time required. Block out 30-45 min when ready.
3. **Backend TDD speed depends on test fixture clarity.** The conftest annotation fix this session removed one source of friction; no other obvious blockers.
4. **Capacitor iOS build hasn't been verified against the new `useSpeech` warm-up logic in cycle-15.** Cycle-15 PAT only covered staging web. The CVC builder inherits the same hook — first iOS PAT for CVC may surface latent issues.
5. **Pre-existing test_word_builder.py mypy debt** resolves automatically when M7 routes/tests are removed (Option A/C) or refactored (Option B). No separate cleanup task needed.

---

## What this memo deliberately does NOT do

- Pick the M7 closure option (N1 — human decision)
- Generate a `/add:cycle` plan (that's a separate skill invocation)
- Open M9 milestone or edit PRD
- Schedule UX interview slots

## Recommended human-side first moves on return

1. Run iPad PAT (cycle-16) — full checklist in `.add/handoff.md`
2. Decide M7 closure option using `docs/cvc-builder-impact-analysis.md`
3. Run `/add:cycle --plan` with chosen option in mind
4. Then `/add:ux specs/cvc-builder.md` once cycle-17 plan is committed
