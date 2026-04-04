# Cycle 2 — CI/CD Pipeline + GitHub

**Milestone:** M1 — Word Recognition
**Maturity:** Alpha
**Status:** PLANNED
**Started:** 2026-04-04
**Completed:** TBD
**Duration Budget:** 1 session (~1 hour)

## Work Items

| Feature | Current Pos | Target Pos | Assigned | Est. Effort | Validation |
|---------|-------------|-----------|----------|-------------|------------|
| GitHub Actions CI | NOT_STARTED | COMPLETE | Agent-1 | ~30 min | Workflow runs ruff, mypy, pytest, vitest on push |
| Create GitHub repo | NOT_STARTED | COMPLETE | Agent-1 | ~10 min | Public repo created, remote added |
| Push + create PR | NOT_STARTED | COMPLETE | Agent-1 | ~10 min | feat branch pushed, PR opened to main |
| Update spec statuses | IMPLEMENTING | COMPLETE | Agent-1 | ~5 min | word-image-matching spec → Complete |

## Dependencies & Serialization

```
GitHub Actions CI workflow (write first)
    ↓
Create GitHub repo + add remote
    ↓
Push feat branch + create PR (triggers CI)
    ↓
Verify CI passes + update specs
```

Single-threaded execution. Sequential.

## Validation Criteria

### Cycle Success Criteria
- [ ] GitHub Actions workflow at .github/workflows/ci.yml
- [ ] CI runs: ruff check, mypy, pytest (backend), vitest (frontend)
- [ ] Public GitHub repo created
- [ ] feat/word-image-matching branch pushed
- [ ] PR created to main
- [ ] CI passes on the PR
- [ ] M1 milestone 8/8 success criteria met
