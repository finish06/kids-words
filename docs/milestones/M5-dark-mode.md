# M5 — Dark Mode

**Goal:** Add dark mode support with device auto-detection and manual toggle.
**Appetite:** 1 day
**Status:** COMPLETE
**Started:** 2026-04-05
**Closed:** 2026-04-12 (retro — dark mode shipped via PR #12 + contrast audit follow-ups)
**Target Maturity:** Beta

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Dark Mode | specs/dark-mode.md | SPECCED | CSS variables + localStorage + toggle |

## Success Criteria

- [ ] App follows device prefers-color-scheme by default
- [ ] Sun/moon toggle in header switches theme
- [ ] Manual override persists in localStorage
- [ ] All screens render correctly in dark mode
- [ ] No flash of wrong theme on load
- [ ] Deployed to staging
