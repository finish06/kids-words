# Implementation Plan: iPad Touch Optimization

**Spec Version:** 0.1.0
**Created:** 2026-04-05
**Team Size:** Solo
**Estimated Duration:** 1 session (~1.5 hours)

## Overview

CSS-only responsive pass + HTML meta tags + web app manifest. No backend changes, no new components. Makes the app feel native on iPad with proper touch targets, full viewport fill, and Capacitor-ready configuration.

## Implementation Phases

### Phase 1: HTML & Meta Tags (15 min)

| Task ID | Description | Effort | AC |
|---------|-------------|--------|-----|
| TASK-001 | Update `index.html` viewport meta (viewport-fit=cover, user-scalable=no) | 5 min | AC-012 |
| TASK-002 | Add apple-mobile-web-app meta tags (capable, status-bar-style) | 5 min | AC-010 |
| TASK-003 | Create `public/manifest.json` (display: standalone, icons, theme) | 5 min | AC-010 |

### Phase 2: Global CSS — iOS Fixes (15 min)

| Task ID | Description | Effort | AC |
|---------|-------------|--------|-----|
| TASK-004 | Add overscroll-behavior: none to html/body | 5 min | AC-008 |
| TASK-005 | Add -webkit-touch-callout: none, user-select: none | 3 min | AC-013 |
| TASK-006 | Add safe-area-inset padding to .app container | 5 min | AC-009 |
| TASK-007 | Fix body to viewport (position: fixed, overflow: auto) | 2 min | AC-002 |

### Phase 3: Touch Target Sizing (20 min)

| Task ID | Description | Effort | AC |
|---------|-------------|--------|-----|
| TASK-008 | Increase category card min-height to 140px, full-width portrait | 5 min | AC-001, AC-014 |
| TASK-009 | Increase image card min-height to 180px | 3 min | AC-001, AC-004 |
| TASK-010 | Increase quiz picker buttons to 130x130px | 3 min | AC-001 |
| TASK-011 | Increase profile avatars to 90px, PIN keys to 75px | 5 min | AC-006, AC-007 |
| TASK-012 | Increase back button and gear to 48px | 2 min | AC-001 |
| TASK-013 | Ensure word text is 3rem+ on iPad | 2 min | AC-005 |

### Phase 4: Responsive Layout (20 min)

| Task ID | Description | Effort | AC |
|---------|-------------|--------|-----|
| TASK-014 | Category grid: 2 cols portrait, 3 cols landscape | 5 min | AC-003, AC-014 |
| TASK-015 | Image grid: fill available space, adaptive columns | 5 min | AC-003, AC-004 |
| TASK-016 | Word list grid: auto-fill min 130px | 3 min | AC-015 |
| TASK-017 | Profile picker: responsive avatar grid | 3 min | AC-003 |
| TASK-018 | PIN pad: centered, sized for iPad | 4 min | AC-003 |

### Phase 5: Assets & Verify (15 min)

| Task ID | Description | Effort | AC |
|---------|-------------|--------|-----|
| TASK-019 | Create apple-touch-icon.png (192x192) | 5 min | AC-011 |
| TASK-020 | TypeScript check + build | 3 min | — |
| TASK-021 | Commit, push, PR, verify CI | 7 min | — |

## Effort Summary

| Phase | Effort | Tasks |
|-------|--------|-------|
| Phase 1: HTML & Meta | 15 min | 3 |
| Phase 2: iOS CSS | 15 min | 4 |
| Phase 3: Touch Targets | 20 min | 6 |
| Phase 4: Responsive | 20 min | 5 |
| Phase 5: Assets & Verify | 15 min | 3 |
| **Total** | **~1.5 hours** | **21** |

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| iOS Safari quirks | Medium | Medium | Test on iPad Simulator, use -webkit prefixes |
| Safe area padding breaks existing layout | Low | Medium | Use env() with fallback values |
| position:fixed body causes scroll issues | Medium | Medium | Test all screens, use overflow:auto on inner container |

## Deliverables

- Modified: `frontend/index.html` (meta tags)
- Modified: `frontend/src/index.css` (responsive + iOS fixes)
- New: `frontend/public/manifest.json`
- New: `frontend/public/apple-touch-icon.png`

## Plan History

| Date | Version | Changes |
|------|---------|---------|
| 2026-04-05 | 0.1.0 | Initial plan |
