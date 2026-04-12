# Project Learnings — kids-words

> **Tier 3: Project-Specific Knowledge**
>
> This file is maintained automatically by ADD agents. Entries are added at checkpoints
> (after verify, TDD cycles, deployments, away sessions) and reviewed during retrospectives.
>
> This is one of three knowledge tiers agents read before starting work:
> 1. **Tier 1: Plugin-Global** (`knowledge/global.md`) — universal ADD best practices
> 2. **Tier 2: User-Local** (`~/.claude/add/library.md`) — your cross-project wisdom
> 3. **Tier 3: Project-Specific** (this file) — discoveries specific to this project
>
> **Agents:** Read ALL three tiers before starting any task.
> **Humans:** Review with `/add:retro --agent-summary` or during full `/add:retro`.

## Technical Discoveries
- 2026-04-04: OpenMoji CDN correct path is `cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/{code}.png` — the npm path (`cdn.jsdelivr.net/npm/openmoji@15.1/`) returns 404. Source: trial and error with curl.
- 2026-04-04: SQLAlchemy `Word.results` relationship needs explicit `foreign_keys` when MatchResult has two FKs to words table. Source: mapper configuration error on first test run.
- 2026-04-04: Playwright E2E tests must live outside the frontend package (project root `tests/e2e/`) — Vitest's `globals: true` contaminates the Playwright runner with `@vitest/expect` Symbol conflicts. Source: runtime error on first Playwright run.
- 2026-04-04: Hatchling needs `[tool.hatch.build.targets.wheel] packages = ["app"]` when the package name doesn't match the directory name. Source: Docker build failure.

## Architecture Decisions
- 2026-04-04: Chose OpenMoji (CC BY-SA 4.0) over Pixabay/Unsplash for word images because emoji style is consistent, colorful, kid-friendly, and requires no API key or local storage.
- 2026-04-04: Chose `Annotated[AsyncSession, Depends(get_db)]` pattern over bare `Depends()` in route params to satisfy ruff B008 rule.
- 2026-04-04: Quiz length picker (5/10/20) added client-side — full word list fetched from API, then sliced to chosen length. No backend changes needed.

## What Worked
- Away mode: completed Phase 0 + Phase 1 + Phase 2 (24/32 tasks) in a single session
- OpenMoji CDN for images: zero local storage, instant availability, kid-friendly style
- Vitest + React Testing Library for frontend unit tests: fast, integrates with Vite config
- Docker Compose with volume mounts for hot reload during development

## What Didn't Work
- `npm ci` in Docker fails when local Node version (v25) differs from container (v22) — lock file incompatibility. Switched to `npm install` in Dockerfile.
- Port 5432 already in use on dev machine — had to remap postgres to 5433.
- Vite dev server in Docker needs explicit `host: '0.0.0.0'` in config + `usePolling: true` for file watching.

## Agent Checkpoints
- 2026-04-04 [cycle-1 complete]: Frontend tests + E2E. 27 unit tests (84% coverage) + 6 E2E tests. All quality gates passing. Backend 19 tests at 90% — no regressions. Cycle completed in ~2 hours vs 3-4 hour budget. Remaining for M1: CI/CD pipeline.
- 2026-04-11 [cycle-8 complete, retro]: Frontend coverage expansion for M3. Cycle was paused 7 days mid-flight; on resume, audited the codebase first and found 5 of 6 items already done — only `ProfileManager.test.tsx` remained. Added 19 tests covering setup/verify PIN flows, manage screen filtering, add/edit/delete profile flows. Totals: 75 tests / 86.2% line coverage (above 80% threshold). Non-obvious finding: the ProfileManager "PINs don't match" error string is dead code — the mismatch handler clears `pin`/`confirmPin`, which routes rendering back to the initial "Set a Parent PIN" screen, a screen that does not display the error. Functional UX, but worth cleaning up. Pre-existing lint errors (Math.random in useRound.ts, react-refresh warnings) left untouched — out of scope for a test-writing cycle.
- 2026-04-12 [cycle-9 + full retro]: M3 infrastructure week. Migration + seed integration tests (11 new) shipped via PR #14, after cycle-7's code-only PR shipped weeks earlier without tests. Audit-before-build pattern proved itself a second time — saved hours by scanning git/branches/main before writing any new code. CRITICAL discovery: `gh pr create` defaults to the repo's default branch as PR base, NOT `main`. The kids-words repo had its default branch set to `feat/word-image-matching` (an old initial branch with no `.github/workflows/`), which silently caused all new PRs to target the wrong branch and CI never fired — no error, no warning, just zero runs. Recovery: change repo default branch in GitHub settings + `gh pr edit <num> --base main` + push an empty commit to trigger pull_request synchronize. CI then ran and confirmed the previously-documented FastAPI dependency_overrides bug (local 92% / CI 76% on route files using overrides). Workaround: lifted CI threshold from 65% to 75% (new tests use their own engines and don't trip the bug). Real fix deferred to dedicated cycle. End-of-session staging smoke test via cmux browser automation completed a full Guest user round on https://kids-words.staging.calebdunn.tech — backend healthy at v0.2.0, all flows working.
- 2026-04-12 [retro 2026-04-12]: Scores: collab 7.0, ADD effectiveness 6.0, swarm 7.0. Notable directives captured: (1) when CI is mis-wired but local tests are strong, just merge and let post-merge CI confirm; (2) when the human signals overwhelm, give ONE next step, not a list; (3) end-to-end staging smoke tests with the actual UI before declaring done; (4) cmux CLI is the right tool for headless staging verification during away mode.

## Profile Update Candidates
- Playwright E2E tests must be isolated from Vitest globals — separate directory, separate config. Applies to any project using Vite + Vitest + Playwright together.
