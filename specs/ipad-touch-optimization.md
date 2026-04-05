# Spec: iPad Touch Optimization

**Version:** 0.1.0
**Created:** 2026-04-05
**PRD Reference:** docs/prd.md — Non-Functional Requirements (Accessibility, Performance)
**Milestone:** M3
**Status:** Draft

## 1. Overview

Full responsive pass making the app iPad-native feeling. All UI elements sized for child fingers on iPad (mini through Pro), both portrait and landscape. Viewport fills the screen with no wasted space. Prepares for Capacitor iOS wrapping — standalone display mode, safe area handling, no bounce scroll.

### User Story

As a child using an iPad, I want the app to feel like a native iPad game with big tappable buttons that fill the screen, so that I can play easily without help.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | All interactive elements have minimum 48x48px touch targets (Apple HIG for children) | Must |
| AC-002 | App fills the full viewport with no horizontal scroll on any iPad (mini 768px to Pro 1024px+) | Must |
| AC-003 | Layout adapts between portrait and landscape orientations | Must |
| AC-004 | Image grid cards fill available space proportionally (no tiny cards with large gaps) | Must |
| AC-005 | Word text is large enough to read from arm's length (~3rem minimum on iPad) | Must |
| AC-006 | Profile picker avatars are large and easily tappable (80px+ circles) | Must |
| AC-007 | PIN pad keys are large enough for small fingers (60px+ on iPad) | Must |
| AC-008 | No rubber-band/bounce scrolling on iOS (overscroll-behavior: none) | Must |
| AC-009 | Safe area insets respected (notch, home indicator on newer iPads) | Must |
| AC-010 | Web app manifest with `display: standalone` for home screen install | Should |
| AC-011 | Apple touch icon and splash screen configured | Should |
| AC-012 | `viewport-fit=cover` meta tag for full-screen edge-to-edge | Must |
| AC-013 | No text selection or callout menus on long press (user-select: none, -webkit-touch-callout: none) | Must |
| AC-014 | Category cards fill width on portrait iPad (2 columns), expand in landscape (3 columns) | Should |
| AC-015 | Word list grid adapts columns to screen width (auto-fill, not fixed count) | Should |

## 3. User Test Cases

### TC-001: Portrait iPad — Full Screen Fill

**Precondition:** App open on iPad in portrait mode
**Steps:**
1. Load category list
2. Verify app fills full viewport height and width
3. No horizontal scrollbar visible
4. Content is centered with appropriate padding
**Expected Result:** App fills screen, no wasted space, no scrollbars
**Screenshot Checkpoint:** tests/screenshots/ipad-touch/tc-001-portrait.png
**Maps to:** TBD

### TC-002: Landscape iPad — Layout Adapts

**Precondition:** App open on iPad, rotate to landscape
**Steps:**
1. View category list — should show 3 columns
2. Start a round — image grid uses more columns
3. Word text remains readable
**Expected Result:** Layout adapts to wider viewport, uses space efficiently
**Screenshot Checkpoint:** tests/screenshots/ipad-touch/tc-002-landscape.png
**Maps to:** TBD

### TC-003: Touch Targets — Child Can Tap Easily

**Precondition:** App open on iPad
**Steps:**
1. Try tapping each interactive element (category cards, image cards, quiz picker buttons, profile avatars, PIN keys, back button)
2. All should respond to first tap without precision required
**Expected Result:** All targets >= 48x48px, easy to hit on first try
**Screenshot Checkpoint:** tests/screenshots/ipad-touch/tc-003-touch.png
**Maps to:** TBD

### TC-004: No iOS Scroll Bounce

**Precondition:** App open on iPad
**Steps:**
1. Try to scroll past the top or bottom of any screen
2. No rubber-band bounce effect
**Expected Result:** Overscroll is prevented
**Screenshot Checkpoint:** N/A
**Maps to:** TBD

### TC-005: Home Screen Install

**Precondition:** Open app in Safari on iPad
**Steps:**
1. Tap Share → Add to Home Screen
2. App appears on home screen with icon
3. Launch from home screen — opens full-screen (no Safari chrome)
**Expected Result:** Standalone web app experience
**Screenshot Checkpoint:** tests/screenshots/ipad-touch/tc-005-standalone.png
**Maps to:** TBD

## 4. Data Model

No data changes. This is purely CSS, HTML meta tags, and static assets.

## 5. API Contract

No API changes.

## 6. UI Behavior

### Viewport & Meta Tags
- `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`

### Safe Areas
- `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)`
- Applied to `.app` container

### Responsive Breakpoints
- **iPad mini portrait** (768px): 2-column category grid, 2-column image grid
- **iPad Air/Pro portrait** (820-1024px): 2-column category grid, 3-column image grid
- **iPad landscape** (1024px+): 3-column category grid, 3-4 column image grid
- **Word list**: auto-fill columns, min 130px per card

### Touch Sizes (Apple HIG + child-friendly)
| Element | Current | Target |
|---------|---------|--------|
| Category cards | min-height 120px | min-height 140px, full-width on portrait |
| Image cards | min-height 150px | min-height 180px |
| Quiz picker buttons | 120x120px | 130x130px |
| Profile avatars | 80px circle | 90px circle |
| PIN keys | 70px circle | 75px circle |
| Back button | 44px | 48px |
| Settings gear | 44px | 48px |

### iOS-Specific CSS
```css
html {
  -webkit-text-size-adjust: 100%;
  overscroll-behavior: none;
}
body {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  overscroll-behavior: none;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: auto;
}
```

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| iPad mini (smallest iPad, 768px) | Everything still fits and is tappable |
| iPad Pro 12.9" (largest, 1366px) | Layout scales up, doesn't look stretched |
| Split View / Slide Over | Gracefully handles reduced width |
| Rotation mid-round | Round state preserved, layout adapts |
| Keyboard appears (PIN input) | Content shifts up, input visible above keyboard |

## 8. Dependencies

- Capacitor iOS project setup (M3 — this spec prepares for it)
- Web app manifest (new file: public/manifest.json)
- Apple touch icon (new asset: public/apple-touch-icon.png)

## 9. Implementation Notes

- This is a CSS-only change + HTML meta tags + manifest file
- No backend changes
- No new components — modify existing CSS and index.html
- Test on iPad Simulator (Xcode) or real device
- Capacitor will use these same settings when wrapping

## 10. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-05 | 0.1.0 | calebdunn | Initial spec from /add:spec interview |
