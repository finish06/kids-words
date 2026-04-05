# Cycle 5 — User Accounts + Progress Tracking

**Milestone:** M2 — Progress & Profiles
**Maturity:** Alpha
**Status:** IN_PROGRESS
**Started:** 2026-04-04
**Completed:** TBD
**Duration Budget:** 1 session (~4-6 hours, autonomous)

## Work Items

| Feature | Current Pos | Target Pos | Assigned | Est. Effort | Validation |
|---------|-------------|-----------|----------|-------------|------------|
| User Accounts (backend) | SPECCED | IMPLEMENTING | Agent-1 | ~2h | Profile, ParentSettings models, 6 API endpoints, tests |
| User Accounts (frontend) | SPECCED | IMPLEMENTING | Agent-1 | ~1.5h | Profile picker, PIN entry, profile management screens |
| Progress Tracking (backend) | SPECCED | IMPLEMENTING | Agent-1 | ~1.5h | WordProgress model, progress endpoints, auto-update on result |
| Progress Tracking (frontend) | SPECCED | IMPLEMENTING | Agent-1 | ~1.5h | Stars on round complete, word list view, category %, mastery celebration |
| Tests + quality gates | NOT_STARTED | COMPLETE | Agent-1 | ~1h | Backend + frontend tests, coverage >= 80% |
| PR + merge | NOT_STARTED | COMPLETE | Agent-1 | ~15 min | PR created, CI green, merge to main |

## Dependencies & Serialization

```
User Accounts (backend) — models, migrations, API endpoints
    ↓
User Accounts (frontend) — profile picker, PIN, management
    ↓
Progress Tracking (backend) — WordProgress model, progress endpoints, result hook
    ↓
Progress Tracking (frontend) — stars UI, word list, category %, mastery animation
    ↓
Tests + quality gates
    ↓
PR + merge → auto-deploy beta images
```

Single-threaded execution. Sequential.

## Validation Criteria

- [ ] Profile, ParentSettings, WordProgress models created with migrations
- [ ] 6 profile API endpoints working (setup, verify-pin, list, create, update, delete)
- [ ] 2 progress API endpoints working (GET /progress, GET /progress/{slug})
- [ ] POST /results auto-updates WordProgress on first-attempt correct
- [ ] Profile picker on launch, PIN management, profile CRUD
- [ ] Stars on round complete + word list view + category mastery %
- [ ] Mastery celebration animation at 3 stars
- [ ] X-Profile-ID header scopes all progress
- [ ] Backend tests >= 80% coverage
- [ ] Frontend tests updated for new components
- [ ] CI green, PR merged

## Agent Autonomy

Away mode, Alpha maturity: Full autonomy. Execute cycle, commit to feature branch, push, create PR. Do not merge to main without human review.

Update: Human said to go ahead and merge if CI passes.
