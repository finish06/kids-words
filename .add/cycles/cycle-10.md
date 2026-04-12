# Cycle 10 — M6 New Categories: Shapes & Body Parts

**Milestone:** M6 — New Categories
**Maturity:** Beta
**Status:** PLANNED
**Started:** TBD
**Completed:** TBD
**Duration Budget:** 12h away session (work estimated at ~2h)

## Goal

Add Shapes (~20 words) and Body Parts (~25 words) categories to the app. Data-only change — no schema modifications, no new endpoints. Write seed files, update seed.py, test, merge, deploy to staging, verify.

## Work Items

| # | Feature | Current Pos | Target Pos | Est. Effort | Validation |
|---|---------|-------------|-----------|-------------|------------|
| 1 | Shapes seed data | SPECCED | VERIFIED | ~30 min | AC-001, AC-003, AC-004 — 20 words with OpenMoji images, display_order=4 |
| 2 | Body Parts seed data | SPECCED | VERIFIED | ~30 min | AC-002, AC-003, AC-004 — 25 words with OpenMoji images, display_order=5 |
| 3 | Seed integration | SPECCED | VERIFIED | ~20 min | AC-005 — existing data preserved, new data added idempotently |
| 4 | Local verify | — | DONE | ~15 min | AC-006, AC-007 — quiz picker works, progress tracking works for new categories |
| 5 | Merge + staging deploy | — | DONE | ~15 min | Staging shows 5 categories, quiz round playable for Shapes |

## Dependencies & Serialization

```
Item 1 (seed_shapes.py)  ──┐
                            ├──→ Item 3 (update seed.py) → Item 4 (local verify) → Item 5 (merge + staging)
Item 2 (seed_bodyparts.py) ─┘
```

Items 1 + 2 are independent (can be written in parallel within a single agent session).
Item 3 depends on both. Items 4 + 5 are sequential gates.

## Parallel Strategy

Single-agent serial execution (config parallel_agents=1). No file reservations needed — all changes are in backend/app/seed_*.py files that no other cycle touches.

## Validation Criteria

### Per-Item

- **Item 1 (Shapes):** `seed_shapes.py` exists with ~20 (word, OpenMoji code) tuples. Category icon set. Seed inserts all words on fresh DB.
- **Item 2 (Body Parts):** `seed_bodyparts.py` exists with ~25 (word, OpenMoji code) tuples. Category icon set. Seed inserts all words on fresh DB.
- **Item 3 (Integration):** Running seed twice is no-op (existing test_seed_idempotency.py still passes). Word counts for Animals/Colors/Food unchanged. New categories added correctly.
- **Item 4 (Local):** `docker compose up` → frontend shows 5 categories. Tap Shapes → quiz picker → play 5-word round. Progress stars appear after correct answers.
- **Item 5 (Staging):** `GET /api/categories` on staging returns 5 categories. `GET /api/categories/shapes/words` returns ~20 words. cmux browser or curl verification.

### Cycle Success Criteria

- [ ] All 7 acceptance criteria from spec pass
- [ ] All existing tests pass (no regressions) — 48 backend + 75 frontend
- [ ] New seed files have correct OpenMoji codes (images load in browser)
- [ ] Idempotent seed test still passes
- [ ] CI green on PR
- [ ] PR merged to main
- [ ] Staging shows 5 categories and quiz is playable for Shapes
- [ ] M6 milestone updated to COMPLETE

## Agent Autonomy & Checkpoints

**Mode:** Beta + away 12h → autonomous within safety boundary.

### Autonomous (will do)
- Create `seed_shapes.py`, `seed_bodyparts.py`
- Update `seed.py` to include new categories
- Run full test suite locally
- Commit, push, open PR, wait for CI
- **Merge to main** (explicitly authorized by user for this cycle)
- Verify staging deployment via API calls or cmux browser
- Update M6 milestone + cycle-10 status
- Write handoff + learnings checkpoint

### NOT Autonomous
- Deploy to production
- Schema changes (none expected — this is data-only)
- Delete existing seed data or categories

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OpenMoji code wrong for a word | Medium | Low | Verify 2-3 images load before committing all |
| "Heart" collision between Shapes and Body Parts | Low | Low | Use different OpenMoji codes (2764 shape vs 1FAC0 anatomical) |
| Staging auto-deploy doesn't trigger | Low | Medium | Manually check build workflow run; if it fails, note in handoff |
| Word count exceeds 20-word quiz max | None | None | Quiz picker caps at 20; words > 20 just means not all shown per round |

## Notes

- Data-only milestone — no new endpoints, no schema changes, no frontend code changes
- Existing idempotent seed infrastructure (tested in cycle-9) handles all insertion logic
- Heart appears in both categories with different OpenMoji codes: ❤️ (shape/symbol) vs 🫀 (anatomical)
- Display order: Shapes = 4, Body Parts = 5 (after Animals=1, Colors=2, Food=3)
