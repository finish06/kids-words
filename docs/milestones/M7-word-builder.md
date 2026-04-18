# M7 — Word Builder

**Goal:** New game mode teaching prefix/suffix patterns with adaptive difficulty.
**Appetite:** 1-2 weeks
**Status:** IN_PROGRESS
**Started:** 2026-04-18 (cycle-12)
**Target Maturity:** Beta

## Hill Chart

```
Word Builder backend     ████████████████████████████████  100% — VERIFIED (cycle-12, PR #17, staging at b7c6d1e)
Seed data (L1, ~30)      ████████████████████████████████  100% — 6 patterns, 15 base words, 29 combos
Adaptive difficulty      ████████████████████████████████  100% — AC-011 unlock logic in GET /progress
Word Builder frontend    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    0% — UI-gated, awaits /add:ux
Seed data (L2 + L3)      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    0% — deferred to post-frontend cycle
```

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Word Builder backend | specs/word-builder.md | VERIFIED | 4 tables, 3 endpoints, migration 002. TDD-strict (33 new tests). PR #17 merged cycle-12. |
| Adaptive difficulty | specs/word-builder.md | VERIFIED | AC-011 unlock logic in GET /progress endpoint |
| Seed data (Level 1) | specs/word-builder.md | VERIFIED | 6 L1 patterns, 15 base words, 29 combos. Auto-seeds via Docker entrypoint. |
| Seed data (L2 + L3) | specs/word-builder.md | NOT_STARTED | Deferred to post-frontend cycle — benefits from UI feedback on content |
| Word Builder frontend | specs/word-builder.md | SPECCED | UI-gated — awaits `/add:ux specs/word-builder.md` |

## Success Criteria

- [ ] Word Builder mode on home screen
- [ ] Build-a-word interaction with snap animation
- [ ] 3 difficulty levels with ~100 word combos (L1 done; L2+L3 pending)
- [x] Adaptive unlock (70%+ mastery → next level) — backend shipped cycle-12
- [x] Star progress per pattern — PatternProgress table shipped cycle-12
- [x] Profile-scoped progress — X-Profile-ID header, verified on staging
- [x] Tests written (backend) — 33 new tests, 94% coverage
- [x] Deployed to staging — b7c6d1e live at kids-words.staging.calebdunn.tech

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
| cycle-12 | Backend + L1 seed + adaptive logic | COMPLETE | PR #17 merged; staging verified; M3 last criterion closed alongside |

## Dependencies

- M6 (new categories) — done (seed pattern validated)
- Alembic migration for new tables — done (migration 002 shipped cycle-12)
- `/add:ux specs/word-builder.md` — **blocker for Frontend cycle**
