# M7 — Word Builder

**Goal:** New game mode teaching prefix/suffix patterns with adaptive difficulty.
**Appetite:** 1-2 weeks
**Status:** COMPLETE (closed by cycle-16 iPad PAT on 2026-05-16)
**Started:** 2026-04-18 (cycle-12)
**Closed:** 2026-05-16
**Target Maturity:** Beta

## Hill Chart

```
Word Builder backend     ████████████████████████████████  100% — VERIFIED (cycle-12, PR #17)
Seed data (L1, ~30)      ████████████████████████████████  100% — 6 patterns, 15 base words, 29 combos
Adaptive difficulty      ████████████████████████████████  100% — AC-011 unlock logic in GET /progress
Word Builder frontend    ████████████████████████████████  100% — VERIFIED (cycles 13/14/15, PR #19/#20/#21 + c03a3e8)
Clue-centered redesign   ████████████████████████████████  100% — VERIFIED (cycle-15 + clue-leak patch)
Home Games/Practice      ████████████████████████████████  100% — VERIFIED (cycle-16 PR #22, iPad PAT passed)
Seed data (L2 + L3)      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    0% — deferred backlog (post-M7)
```

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Word Builder backend | specs/word-builder.md | DONE | 4 tables, 3 endpoints, migration 002. TDD-strict (33 new tests). PR #17 merged cycle-12. |
| Adaptive difficulty | specs/word-builder.md | DONE | AC-011 unlock logic in GET /progress endpoint |
| Seed data (Level 1) | specs/word-builder.md | DONE | 6 L1 patterns, 15 base words, 29 combos. Auto-seeds via Docker entrypoint. |
| Word Builder frontend | specs/word-builder.md | DONE | 11 new components, BuildScreen + tiles + animations, useBuildRound hook. PR #19 cycle-13 → gated PR #20 cycle-14 → clue redesign PR #21 cycle-15. |
| Clue-centered redesign | specs/word-builder.md | DONE | useSpeech + clue header + tap-to-hear; clue-leak fix (c03a3e8) ensures bare base verbs. |
| Home Games/Practice restructure | specs/home-games-practice.md | DONE | Cycle-16 PR #22. iPad PAT passed 2026-05-16. |
| Seed data (L2 + L3) | specs/word-builder.md | NOT_STARTED | Deferred backlog — re-prioritize when content gaps surface from usage |

## Success Criteria

- [x] Word Builder mode on home screen — Games section card (cycle-13/16)
- [x] Build-a-word interaction with snap animation — BuildScreen + CSS keyframes (cycle-13)
- [ ] 3 difficulty levels with ~100 word combos — L1 done (29 combos); L2+L3 deferred to backlog
- [x] Adaptive unlock (70%+ mastery → next level) — backend shipped cycle-12
- [x] Star progress per pattern — PatternProgress table shipped cycle-12
- [x] Profile-scoped progress — X-Profile-ID header, verified on staging
- [x] Tests written — 33 backend (cycle-12) + 14 frontend (cycle-13) + cycle-15/16 additions; 99 backend / 107 frontend tests total
- [x] Deployed to staging — multiple staging deploys; latest 783b08f (cycle-16)
- [x] iPad PAT passed — 2026-05-16 (12/12 checklist items)

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
| cycle-12 | Backend + L1 seed + adaptive logic | COMPLETE | PR #17 merged; staging verified; M3 last criterion closed alongside |
| cycle-13 | Frontend (initial tile-match design) | COMPLETE-WITH-PAT-FINDING | PR #19; PAT caught generative-morphology ambiguity (PAINT → -ED/-S/-ER all valid). |
| cycle-14 | Surgical "Coming soon" gating | COMPLETE | PR #20; preserved cycle-12+13 code while redesign planned. |
| cycle-15 | Clue-centered redesign + M8 phonetics | COMPLETE-WITH-PAT-ITERATION | PR #21 + clue-leak fix c03a3e8. M7 + M8 both Implemented. |
| cycle-16 | Home Games/Practice restructure | COMPLETE | PR #22; iPad PAT passed 2026-05-16 — closes M7. |

## Dependencies

- M6 (new categories) — done (seed pattern validated)
- Alembic migration for new tables — done (migration 002 shipped cycle-12)
- `/add:ux specs/word-builder.md` — resolved during cycle-13 (and re-validated by cycle-15 redesign)

## Outstanding Backlog (post-M7)

- L2 + L3 Word Builder seed expansion
- Full Word Builder E2E Playwright (happy path, wrong-tap, level-up)
- Level-up modal detection (backend flag is ready to consume)
- Configurable TTS rate / voice
