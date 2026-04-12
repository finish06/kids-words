# Spec: Dark Mode

**Version:** 0.1.0
**Created:** 2026-04-05
**PRD Reference:** docs/prd.md
**Milestone:** M5 — Dark Mode
**Status:** Implemented

## 1. Overview

Dark mode support that follows the device setting by default with a manual toggle override. Sun/moon icon in the app header lets kids switch themselves. Preference stored in localStorage (device-wide, not per-profile).

### User Story

As a child using the app at night, I want a dark background so the screen isn't too bright and hurts my eyes.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | App respects `prefers-color-scheme: dark` media query by default | Must |
| AC-002 | Sun/moon toggle icon in app header switches between light and dark | Must |
| AC-003 | Manual toggle overrides device setting | Must |
| AC-004 | Preference persisted in localStorage (`kids-words-theme`) | Must |
| AC-005 | On load: check localStorage first, fall back to device preference | Must |
| AC-006 | All screens render correctly in dark mode (categories, quiz, round complete, profiles, PIN, word list) | Must |
| AC-007 | Color circles for Colors category remain visible in dark mode | Must |
| AC-008 | OpenMoji images remain clear against dark backgrounds | Should |
| AC-009 | Toggle is 48px+ touch target | Must |
| AC-010 | No flash of wrong theme on page load | Should |

## 3. User Test Cases

### TC-001: Auto Dark Mode

**Precondition:** Device set to dark mode, no localStorage override
**Steps:**
1. Open app
2. App renders with dark background
**Expected Result:** Dark theme applied automatically
**Maps to:** TBD

### TC-002: Manual Toggle

**Precondition:** App in light mode
**Steps:**
1. Tap moon icon in header
2. App switches to dark mode
3. Icon changes to sun
4. Tap sun icon
5. App switches back to light mode
**Expected Result:** Toggle works, preference saved
**Maps to:** TBD

### TC-003: Persistence

**Precondition:** User toggled to dark mode manually
**Steps:**
1. Close and reopen app
2. App loads in dark mode (even if device is set to light)
**Expected Result:** localStorage override persists
**Maps to:** TBD

## 4. Data Model

No database changes. Uses `localStorage.getItem("kids-words-theme")` with values `"light"`, `"dark"`, or `null` (follow device).

## 5. API Contract

No API changes.

## 6. UI Behavior

### Dark Mode Color Palette

```css
:root[data-theme="dark"] {
  --color-bg: #1a1a2e;
  --color-card: #16213e;
  --color-primary: #818cf8;
  --color-primary-light: #a5b4fc;
  --color-success: #4ade80;
  --color-error: #f87171;
  --color-text: #e4e4e7;
  --color-text-light: #a1a1aa;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.4);
}
```

### Toggle Icon
- Light mode: moon icon (tap to go dark)
- Dark mode: sun icon (tap to go light)
- Position: app header, next to gear icon
- Size: 48px+ touch target

### Implementation Approach
- Set `data-theme` attribute on `<html>` element
- CSS variables swap via `[data-theme="dark"]` selector
- `prefers-color-scheme` media query as fallback when no localStorage
- Inline script in `<head>` to set theme before render (prevents flash)

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| No localStorage + device light | Light mode |
| No localStorage + device dark | Dark mode |
| localStorage = "dark" + device light | Dark mode (override) |
| localStorage = "dark" + device changes | Stays dark (manual override) |
| User clears localStorage | Falls back to device preference |
| White color circle in dark mode | Gets a visible border (already handled) |

## 8. Dependencies

- No backend changes
- CSS-only with minimal JS for toggle logic
- SVG icons for sun/moon (add to icons.svg sprite)

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-05 | 0.1.0 | calebdunn | Initial spec |
