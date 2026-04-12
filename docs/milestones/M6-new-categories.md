# M6 — New Categories

**Goal:** Expand word library with Shapes and Body Parts categories.
**Appetite:** 1 day
**Status:** COMPLETE
**Closed:** 2026-04-12 (cycle-10)
**Started:** 2026-04-07
**Target Maturity:** Beta

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Shapes (~20 words) | specs/new-categories.md | SPECCED | Seed data + OpenMoji |
| Body Parts (~25 words) | specs/new-categories.md | SPECCED | Seed data + OpenMoji |

## Success Criteria

- [x] Shapes category with ~20 words appears on home screen
- [x] Body Parts category with ~25 words appears on home screen
- [x] All OpenMoji images load correctly (verified via staging quiz round)
- [x] Existing progress preserved (idempotent seed — 48/48 tests pass)
- [x] Quiz picker works (5/10/20) — played 5-word Shapes round on staging
- [x] Deployed to staging (auto-seed added to Docker entrypoint)
