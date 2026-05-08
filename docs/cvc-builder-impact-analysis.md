# CVC Builder — Impact Analysis & Migration Options

**Author:** away-mode agent (cycle-17 prep)
**Date:** 2026-05-07
**Status:** Read-only inventory — no decisions made
**Purpose:** Inform the M7 closure decision (close + open M9 vs rescope M7 in place).
**Inputs:** `specs/cvc-builder.md` v0.1.0 Draft, `specs/word-builder.md` v0.3.0 Implementing, `docs/milestones/M7-word-builder.md`, current `main` at `61f42f2` (this branch).

---

## Existing M7 (prefix/suffix Word Builder) surface area

Total: **~2,398 LOC across 11 files + 4 DB tables + 1 migration + 2 routes wired**.

### Backend (~1,644 LOC)

| Path | LOC | Role | Disposition under CVC |
|------|-----|------|----------------------|
| `app/models.py` ll. 146-209 | 64 | `Pattern`, `BaseWord`, `WordCombo`, `PatternProgress` SQLAlchemy models | Tables stay in schema (deprecated, no destructive drop in spec); models could stay or be removed once routes go |
| `app/routes/word_builder.py` | 311 | 3 endpoints: `GET /round`, `POST /results`, `GET /progress` | **Replaced** if route prefix changes to `/api/cvc-builder/*` (Option A / C). **Refactored in place** if mode-aware (Option B). |
| `app/seed_word_builder.py` | 266 | Idempotent seed of L1 patterns, base words, combos, clue audit | **Replaced** by `seed_cvc_builder.py` regardless of option. Old seed becomes dead code. |
| `app/schemas.py` ll. 151-209 | ~55 | `PatternOption`, `WordBuilderRoundResponse`, `WordBuilderAttempt`, `PatternStarUpdate`, `WordBuilderResultResponse`, `LevelPatternProgress`, `WordBuilderProgressResponse` | **Replaced** by CVC schemas. Naming collision risk if Option B reuses prefixes. |
| `alembic/versions/002_word_builder.py` | 114 | Migration creating Pattern/BaseWord/WordCombo/PatternProgress | **Preserved** (history is immutable). New migration 003 adds CVC tables. |
| `app/main.py` ll. 17, 45 | 2 | Registers `word_builder_router` | **Replaced or supplemented** depending on option |
| `tests/test_word_builder.py` | 539 | Route tests (8 mypy errors deferred per away-mode boundary) | **Deleted** with M7 routes (Option A/C); **rewritten** under Option B |
| `tests/test_word_builder_migration.py` | 226 | Migration smoke tests | **Preserved** (history) |
| `tests/test_word_builder_seed.py` | 188 | Seed idempotency tests | **Replaced** by CVC seed tests |

### Frontend (~754 LOC)

| Path | LOC | Role | Disposition under CVC |
|------|-----|------|----------------------|
| `components/BuildScreen.tsx` | 255 | Build screen UI: clue header, base word, prefix/suffix tile rows, snap animation, result screen | **Replaced** (Option A) / **mode-aware refactor** (Option B/C). Reusable parts: snap animation, layout primitives, result transition. Prefix/suffix-specific: clue header, tile-side classification (prefix-left / suffix-right), pattern auto-play. |
| `components/WordBuilderCard.tsx` | 79 | Home Games-section card; reads `getWordBuilderProgress()` for level + mastery dots | **Replaced** (calls `getCVCBuilderProgress`) or **mode-aware** (rare in this size). Simpler to swap. |
| `components/BuildRoundComplete.tsx` | 80 | Round complete celebration with pattern star counts | **Reusable with adapter** — replace pattern-star data shape with per-word stars. |
| `hooks/useBuildRound.ts` | 131 | Round state machine: fetch challenges, track tile attempts, advance | **Replaced** (Option A) or **generalized** (Option B/C). Logic is round-flow generic; the data shape it manages is M7-specific. |
| `hooks/__tests__/useBuildRound.test.ts` | 209 | Hook tests | **Replaced or rewritten** alongside the hook |
| `types/index.ts` ll. 94-148 | 55 | `PatternType`, `PatternOption`, `WordBuilderAttempt`, `PatternStarUpdate`, `WordBuilderResultResponse`, `LevelPatternProgress`, `WordBuilderProgressResponse` | **Replaced** by `CVCWordChallenge`, `CVCAttempt`, etc. |
| `api/client.ts` ll. 143-157 | 15 | `getWordBuilderRound`, `recordWordBuilderResult`, `getWordBuilderProgress` | **Replaced** by `getCVCBuilderRound` etc. (Option A/C) or **renamed in place** (Option B). |
| `App.tsx` ll. 4, 107-108 | 3 | Routes `/build` (BuildPicker) and `/build/play` (BuildScreen) | **Path stays** (Option B) or **renamed to `/cvc/...`** (Option A) — but the kid-facing URL doesn't matter; safer to keep `/build` to avoid bookmarks breaking on staging. |
| `components/GamesSection.tsx` ll. 1, 14 | 2 | Imports + renders `<WordBuilderCard />` | **Unchanged label**; only the underlying card swap matters. |
| `components/__tests__/HomeScreen.test.tsx` | (M7 mocks at ll. 8, 11, 13) | Mocks `getWordBuilderProgress` | **Updated** to mock the new API client function |

### Cross-feature touch points (preserved regardless of option)

- `useSpeech` hook (M8 specs/word-pronunciation.md) — used by `BuildScreen` for clue TTS. CVC builder reuses the same hook for picture-tap and tile-tap audio.
- Profile system + `X-Profile-ID` middleware — unchanged.
- Length picker (`LengthPicker.tsx`) — round-prefix component, unchanged.
- Star mastery thresholds (2/4/7+) — convention shared across `MatchRound`, `BuildScreen`, future CVC builder.
- Home Games/Practice restructure (cycle-16) — Word Builder card slot is preserved; swap happens behind the card label.

---

## Pre-existing tech debt visible during audit

1. **Local mypy strict tree-wide currently fails 8 errors in `tests/test_word_builder.py`** — 7 unused `type: ignore` comments and 1 `call-overload` at line 87 (`int(spec["level"])` against an `object`-typed dict value). CI's `mypy app/` invocation is unaffected. These were boundaried in this away session because the file may be deleted under Options A/C.

2. **`models.py` lines 146-209 (Pattern/BaseWord/WordCombo/PatternProgress)** are the same models exercised by 11 tests across `test_word_builder.py` and `test_word_builder_migration.py`. Removing these models is safe iff (a) every consuming route/seed/test is removed first, and (b) the migration history is preserved.

3. **`useBuildRound.ts` is M7-specific in shape** — it returns `{ challenge: BuildRoundChallenge, ... }` where `BuildRoundChallenge` has `correct_pattern: PatternOption`. Generalizing this to CVC would require the challenge type to be a union, which fans out to BuildScreen and tests.

4. **No `/api/word-builder/*` deprecation header** — if CVC ships at a parallel path, old clients (staging cache, capacitor build) might still hit `/api/word-builder/*` for a while. Backend should keep returning 200s during the transition.

---

## Migration sequence options

Each option is a candidate. The goal of this doc is to make the trade-offs explicit, not to choose.

### Option A — Close M7, open M9, parallel implementation

1. New Alembic migration `003_cvc_builder.py`: creates `cvc_word`, `cvc_word_progress`. `Pattern`/`BaseWord`/`WordCombo`/`PatternProgress` tables stay in DB (no destructive drop).
2. New backend module `app/routes/cvc_builder.py`, new seed `app/seed_cvc_builder.py`, new schemas `CVCWord*`, `CVCRound*`. Wire in `main.py`.
3. New frontend components: `CVCBuildScreen.tsx`, `CVCBuildRoundComplete.tsx`, `useCVCBuildRound.ts`, `CVCBuilderCard.tsx`. New types and API client functions.
4. `GamesSection.tsx` swaps `<WordBuilderCard />` → `<CVCBuilderCard />` once L1 ships.
5. `App.tsx` routes: keep `/build` aliased to CVC by adding a redirect, or add new `/cvc-build` and remove `/build` after staging confirms.
6. M7 prefix/suffix code stays compiled but unreferenced from the Home tree. Mark `specs/word-builder.md` Deprecated. Schedule a separate cleanup cycle to delete the dead code + drop the tables.

**Pros:** Clean separation. Smallest risk of breaking what's on staging during transition. New code reviewed in isolation.
**Cons:** ~1,644 backend + ~754 frontend LOC of dead code on `main` until cleanup. Two parallel sets of nearly-identical primitives (BuildScreen vs CVCBuildScreen) until cleanup. Two seed scripts, two migrations to maintain in CI.

**Estimated cycle scope:** TDD-strict backend (~3-5 days), frontend after `/add:ux` (~3-5 days), staging PAT, cleanup deferred.

### Option B — Rescope M7 in place, mode-aware refactor

1. Same data-model addition as Option A (new tables, no drop).
2. `BuildScreen.tsx`, `useBuildRound.ts`, `WordBuilderCard.tsx` become mode-aware (`mode: "morphology" | "cvc"`). Backend `/api/word-builder/round` response gets a discriminated `mode` field; frontend branches on it.
3. Seed swap: `seed_word_builder.py` content → CVC content (or new file replaces it). Old prefix/suffix data not seeded; migration 002 tables stay empty in fresh DBs.
4. Single React component tree, single hook, single API client function — but bigger and conditionally rendered.
5. M7 milestone "rescoped" to deliver CVC content; PRD M7 detail block updated; `specs/word-builder.md` archived as superseded by `specs/cvc-builder.md`.

**Pros:** Smallest LOC delta on `main` (no parallel components). One mental model for future cycles. URL `/build` stays without redirects.
**Cons:** BuildScreen and useBuildRound become mode-aware (extra branching, harder to test cleanly). Refactor carries higher breakage risk — both M7's existing tests and the new CVC tests have to coexist on a single component tree until M7 tests are removed. Discriminated unions across the API contract are easy to regress. PatternType/PatternOption types collide with CVC types unless renamed.

**Estimated cycle scope:** ~5-7 days (refactor + new code + dual-mode tests until M7 mode is removed).

### Option C — Close M7, open M9, share primitives via adapters

1. Same new tables + new routes as Option A.
2. Frontend: `BuildScreen.tsx` is generalized — extract layout primitives (`<TilePalette>`, `<SnapTarget>`, `<RoundShell>`) shared by both prefix/suffix and CVC modes. M7's BuildScreen becomes a thin wrapper over the primitives; CVC's screen is another thin wrapper.
3. `useBuildRound` is split into `useRoundShell` (generic state machine) and per-mode adapters that translate API responses into the shell's expected shape.
4. M7 routes/seed/tests stay live until CVC ships; then a follow-up cycle deletes them.

**Pros:** Best long-term shape (shared primitives, clean separation, both modes coexist briefly). Sets up cleanly for future game modes (Listening Practice, etc.).
**Cons:** Most complex initial implementation. Generic-too-soon risk: extracting primitives before the second use case is fully built tends to over-fit M7. Slower to first staging.
**Estimated cycle scope:** ~7-10 days (primitive extraction + new code).

---

## Quick comparison

| Dimension | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| First-staging speed | Fast | Medium | Slow |
| Risk to existing M7 staging behavior during transition | Lowest | Highest | Low |
| LOC on main during transition | Highest | Lowest | High |
| Cleanup cycle required | Yes (delete M7) | No | Yes (delete M7) |
| Refactor risk | Low | High | Medium |
| Long-term shape | OK | OK if M7 mode is removed | Best |
| Effort to write tests | Low | Medium | High |

---

## Recommendations for the M7 closure decision

This is a decision the human must make. To support it:

1. **Read this doc end-to-end before choosing.** The PRD revision history will need an entry either way.
2. **The spec (`specs/cvc-builder.md`) is written assuming Option A or C** — it explicitly says "M7 tables remain as deprecated — no destructive drop in this spec." Option B would require rewording §4 of the spec.
3. **iPad PAT for cycle-16 is independent of this decision** — that PAT is for the home Games/Practice restructure; it doesn't gate M7 closure.
4. **If you choose Option A:** the simplest path is to commit to a `feat/cvc-builder-backend` branch first (TDD-strict on backend), merge once green, then `feat/cvc-builder-frontend` after `/add:ux`. M7 stays untouched on `main` until a separate cleanup cycle.
5. **If you choose Option B:** consider whether `useSpeech` clue auto-play (cycle-15 addition to BuildScreen) would survive the mode-aware refactor or get tangled with the CVC picture-tap. The cleanest route is to keep `useSpeech` decoupled and have each mode's UI invoke it directly.

---

## What this doc explicitly does NOT do

- Choose an option (architecture decision = human).
- Edit any M7 code.
- Modify the spec.
- Update `docs/milestones/M7-word-builder.md` or `docs/prd.md`.
- Drop, rename, or alter any DB tables.
- Estimate beyond the rough cycle ranges above (real estimates require `/add:plan`).

## See also

- `specs/cvc-builder.md` — the new spec (Draft)
- `specs/word-builder.md` — the M7 spec (Implementing — to be marked Deprecated post-decision)
- `docs/milestones/M7-word-builder.md` — current M7 hill chart
- `.add/handoff.md` — cycle-16 PAT checklist (independent gate)
- `.add/cycle-15-direction.md` — the cycle-15 redesign that preceded this analysis
