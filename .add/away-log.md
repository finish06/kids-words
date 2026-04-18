# Away Mode Log

**Started:** 2026-04-18 (cycle-15 away session)
**Expected Return:** +12h
**Duration:** 12 hours
**Cycle:** cycle-15 (M7 Word Builder clue redesign + M8 Phonetics)

## Work Plan (approved)

1. Branch + useSpeech hook (RED → GREEN → REFACTOR)
2. Seed clue audit per approved table; drop FISH+-S
3. BuildScreen clue header + un-gate WordBuilderCard
4. Match Round tap-to-hear (M8 feature)
5. Listening Practice card rename
6. Spec updates (word-builder v0.3.0, word-builder-ux v1.1, word-pronunciation Implemented)
7. E2E regression update (home-restructure.spec.ts)
8. Quality gates + CSS polish + 3 green CI runs + self-merge
9. Staging verification + PAT handoff

## Queued for return (PAT gate)
- Manual play-through on iPad staging
- /add:cycle --complete after PAT passes

## Boundaries
- No prod deploy; no Listening Practice game; no L2/L3 seed; no formal --complete

## Progress Log

| Time | Task | Status | Notes |
|------|------|--------|-------|
| T+0 | Away log init, feature branch create | STARTED | Beginning RED phase |
