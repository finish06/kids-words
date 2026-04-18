# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

## [0.2.0] - 2026-04-18

First tagged release since the v0.1.0 MVP. Covers four milestones (M3-M6)
plus staging rollout and maturity promotion from Alpha to Beta.

### Added
- **Profile management (M4):** edit name/color and delete child profiles; guest
  profile remains non-editable (PR #11).
- **Dark mode (M5):** device-auto via `prefers-color-scheme` with manual
  sun/moon toggle, persisted in localStorage; all screens audited for contrast
  (PR #12).
- **New categories (M6):** Shapes (~20 words) and Body Parts (~25 words)
  with custom SVG illustrations and kid-recognizable body-part icons (PR #15).
- **Rich health and version endpoints:** `/api/health` reports DB latency
  and dependency status; `/api/version` reports git commit, Python version,
  build date (PR #10).
- **Alembic migrations + idempotent seed:** schema changes no longer lose
  data; Docker entrypoint auto-runs `alembic upgrade head` and seeds on
  every start.
- **Auto-deploy to staging:** webhook on merge to main promotes `:beta`
  image to `kids-words.staging.calebdunn.tech`; `:latest` reserved for
  tagged releases.
- **Frontend test coverage:** 75 Vitest tests, 86.2% line coverage
  (PR #13).
- **Backend integration tests:** 5 Alembic migration tests + 6 seed
  idempotency tests (PR #14).
- Project README, sequence diagrams, and API routes table in CLAUDE.md.

### Changed
- **Maturity promoted Alpha → Beta** (2026-04-05 retro).
- **CI coverage:** raised from ~68% to 93.33% across three consecutive
  runs. Root-caused a Python 3.13 + pytest-asyncio + httpx tracing issue;
  aligned CI to Python 3.14 to match local dev (PR #16 / cycle-11).
- **PRD Section 6** reconciled with actual milestone state; all eight
  milestones now reflected.

### Fixed
- Dark mode contrast audit across all screens.
- Body Parts icons redesigned for kid recognizability; Body Parts category
  temporarily hidden in the frontend pending final icon approval.
- Shapes: replaced Infinity with Semicircle; added Octagon and Decagon;
  redesigned Crescent as a golden moon.
- `Play Again` now resets quiz state instead of reloading the app.
- Profile indicator is display-only (no button affordance).
- Frontend lint clean: `useRound` purity and `ColorCircle` exports.


