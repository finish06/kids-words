# Session Handoff
**Written:** 2026-04-18 (cycle-11 complete)

## Completed This Session
- **Roadmap reconciliation** — M2 formally closed; PRD Section 6 rewritten to reflect all 8 milestones; PRD bumped to v0.2.0; maturity corrected to Beta.
- **Cycle-11 / M3 CI Coverage Root-Cause Fix — COMPLETE**
  - Root cause: Python 3.13 + pytest-asyncio + httpx.AsyncClient + FastAPI DI lose async trace context, so route handler bodies under-report in CI while tests pass.
  - Fix: aligned CI Python 3.13 → 3.14 to match local dev (PR #16, squash `fc65454`).
  - Result: 3 consecutive green CI runs at **93.33%** on the 80% threshold (cycle success criterion met).
- **v0.2.0 release tag** — user asked mid-cycle to reconcile the deployed version with the repo tag. Bumped `backend/pyproject.toml` 0.1.0 → 0.2.0, populated `CHANGELOG.md` (Added / Changed / Fixed covering M3-M6), cut annotated tag `v0.2.0` at `f746104`, pushed. Staging verified at 0.2.0 / `f746104` / healthy / DB 56ms.

## Decisions Made
- **CI Python upgrade bounded to CI only.** Production `backend/Dockerfile` stays on `python:3.13-slim`. Aligning CI to 3.14 fixes the async tracing gap without touching what ships.
- **Tag push confirmed with user** before `git push origin v0.2.0` (hard-to-reverse publication). Main push was autonomous.

## Blockers
None.

## Next Steps
1. **M3 remaining:** "Staging deploy works without manual DB reset" success criterion is still untested — needs a real schema change to validate the Alembic-upgrade-on-entrypoint path end-to-end. Queue for the next M3-touching cycle (likely alongside M7 backend, which needs a migration).
2. **Next milestones:** M7 Word Builder and M8 Audio & Pronunciation are PLANNED; M7 has the larger scope (4 tables, 3 endpoints, adaptive difficulty).
3. **Optional bookkeeping:** `backend/Dockerfile` could be bumped to Python 3.14 to fully align local / CI / prod — not urgent, but eliminates the "CI sees one Python, prod sees another" asymmetry.
4. `/add:retro` candidate: formal retro to (a) migrate `.add/learnings.md` to the JSON schema per `rules/learning.md`, (b) consider evidence-based Beta → GA gap analysis (coverage is now blocking at 80%+, release tags exist, conventional commits enforced — getting closer).
