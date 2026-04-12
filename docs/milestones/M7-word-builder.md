# M7 — Word Builder

**Goal:** New game mode teaching prefix/suffix patterns with adaptive difficulty.
**Appetite:** 1-2 weeks
**Status:** PLANNED
**Target Maturity:** Beta

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Word Builder backend | specs/word-builder.md | SPECCED | 4 new tables, 3 endpoints, migration |
| Word Builder frontend | specs/word-builder.md | SPECCED | Build screen, snap animation, level indicator |
| Seed data (100+ combos) | specs/word-builder.md | SPECCED | 3 levels of patterns + base words |
| Adaptive difficulty | specs/word-builder.md | SPECCED | Auto-unlock levels via star mastery |

## Success Criteria

- [ ] Word Builder mode on home screen
- [ ] Build-a-word interaction with snap animation
- [ ] 3 difficulty levels with ~100 word combos
- [ ] Adaptive unlock (70%+ mastery → next level)
- [ ] Star progress per pattern
- [ ] Profile-scoped progress
- [ ] Tests written
- [ ] Deployed to staging

## Dependencies

- M6 (new categories) should be done first — validates seed pattern
- Alembic migration for new tables
