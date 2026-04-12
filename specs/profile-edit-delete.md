# Spec: Profile Edit & Delete

**Version:** 0.1.0
**Created:** 2026-04-05
**PRD Reference:** docs/prd.md — User Accounts
**Milestone:** M4 — Profile Enhancements
**Status:** Implemented

## 1. Overview

The Manage Profiles screen shows child profiles but tapping them does nothing. Parents need to edit a child's name and color, or delete a profile entirely. The backend APIs already exist (`PUT` and `DELETE /api/profiles/{id}`) — this is a frontend-only fix.

### User Story

As a parent, I want to tap a child's profile in Manage Profiles to edit their name/color or delete the profile, so that I can keep profiles up to date.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Tapping a profile in Manage Profiles opens an edit screen | Must |
| AC-002 | Edit screen shows current name (editable) and color picker | Must |
| AC-003 | Save button updates name and/or color via PUT /api/profiles/{id} | Must |
| AC-004 | Delete button with confirmation deletes the profile via DELETE /api/profiles/{id} | Must |
| AC-005 | After edit/delete, profile list refreshes to show changes | Must |
| AC-006 | Guest profile cannot be edited or deleted (no tap action) | Must |
| AC-007 | Delete confirmation: "Delete {name}? This removes all their progress." | Should |

## 3. User Test Cases

### TC-001: Edit Profile Name

**Precondition:** PIN verified, Manage Profiles screen showing Emma (pink)
**Steps:**
1. Tap Emma's profile
2. Edit screen appears with name "Emma" and pink selected
3. Change name to "Emmy"
4. Tap Save
5. Profile list shows "Emmy" instead of "Emma"
**Expected Result:** Name updated, list refreshed
**Maps to:** TBD

### TC-002: Change Profile Color

**Precondition:** PIN verified, edit screen for Emma
**Steps:**
1. Tap green color dot
2. Tap Save
3. Profile list shows Emma with green avatar
**Expected Result:** Color updated
**Maps to:** TBD

### TC-003: Delete Profile

**Precondition:** PIN verified, edit screen for Emma
**Steps:**
1. Tap Delete
2. Confirmation: "Delete Emma? This removes all their progress."
3. Tap Confirm
4. Profile list no longer shows Emma
**Expected Result:** Profile deleted, list refreshed
**Maps to:** TBD

### TC-004: Guest Not Editable

**Precondition:** Manage Profiles screen
**Steps:**
1. Guest profile has no tap action or is visually distinguished as non-editable
**Expected Result:** Cannot edit or delete Guest
**Maps to:** TBD

## 4. Data Model

No changes. Uses existing PUT and DELETE endpoints.

## 5. API Contract

Already implemented:
- `PUT /api/profiles/{id}` — update name/color (requires PIN in body)
- `DELETE /api/profiles/{id}` — delete profile (requires PIN in body)

## 6. UI Behavior

### Edit Screen (new)
- Back arrow to return to profile list
- Name input (pre-filled)
- Color picker (8 preset colors, current selected)
- Save button (primary purple)
- Delete button (red, bottom of screen)

### Delete Confirmation
- Modal or inline confirmation
- "Delete {name}? This removes all their progress."
- Cancel + Confirm buttons

## 7. Implementation Notes

- Frontend only — modify `ProfileManager.tsx`
- Add edit state management (selected profile, edit mode)
- Wire up `updateProfile()` and `deleteProfile()` API calls in client.ts
- `deleteProfile` needs to send PIN in request body with DELETE method

## 8. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-05 | 0.1.0 | calebdunn | Initial spec |
