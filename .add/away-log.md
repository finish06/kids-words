# Away Mode Log

**Started:** 2026-05-07
**Expected Return:** 2026-05-07 +12h (~12-hour window)
**Duration:** 12h
**Autonomy level:** autonomous (per `.add/config.json`)
**Branch:** `main` at `783b08f`; will create feature branches as needed.

## Context entering away mode

- New spec landed this session: `specs/cvc-builder.md` (Status: Draft).
- Spec replaces M7 prefix/suffix Word Builder content with developmentally appropriate CVC blending for ages 4-6.
- Implementation gated on `/add:ux specs/cvc-builder.md` (human interview) — cannot start TDD autonomously.
- Cycle-16 still IN_PROGRESS pending iPad PAT (only human can verify).
- M7 closure vs rescope is an architecture decision — must queue.
- Previous away log (cycle-15) archived to `.add/away-logs/away-2026-04-18-cycle-15.md`.

## Work Plan

### Autonomous (in progress)
1. **Run `/add:verify` baseline + fix mechanical lint/type issues.** Commit to feature branch, no merge.
2. **Coverage gap audit on shipped M3-M8 + cycle-16 features.** Write missing tests within existing specs. No behavior changes.
3. **Write `docs/cvc-builder-impact-analysis.md`.** Read-only inventory of prefix/suffix Word Builder code → CVC migration options (no decisions made).
4. **Write `docs/cvc-builder-image-shopping-list.md`.** L1 image asset spec (10 words).
5. **(If time) Cycle-17 prioritization memo.** Triage deferred list from handoff.

### Queued for human return
1. iPad PAT for cycle-16 (12-item checklist in `.add/handoff.md`).
2. M7 closure decision — close + open M9 for CVC, or rescope M7 in place? (impact-analysis doc informs this)
3. `/add:ux specs/cvc-builder.md` — UX interview, blocks CVC implementation.
4. Image source decision — generate / manual / commission. (shopping-list doc is the input)
5. Mark `specs/word-builder.md` Deprecated (after M7 decision lands so it's done in the right order).
6. `/add:spec` interview for Listening Practice game.

## Boundaries

- ❌ No production deploys, no merges to `main`
- ❌ No edits to existing prefix/suffix Word Builder code (M7 cleanup waits on decision)
- ❌ No drop of `Pattern` / `BaseWord` / `WordCombo` / `PatternProgress` tables
- ❌ No autonomous `/add:ux` (requires human interview)
- ❌ No new feature specs
- ✅ Commits to feature branches, conventional format
- ✅ PRs created, not merged
- ✅ Lint/type/format auto-fixes within shipped code

## Progress Log

| Time | Task | Status | Notes |
|------|------|--------|-------|
| start | Plan approved, away log created, prior log archived | COMPLETE | 5 tasks tracked |
