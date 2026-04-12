# Spec: User Accounts

**Version:** 0.1.0
**Created:** 2026-04-04
**PRD Reference:** docs/prd.md
**Milestone:** M2
**Status:** Implemented

## 1. Overview

Child profiles with per-child progress tracking. A parent sets a 4-digit PIN to manage up to 3 named child profiles (colored circle + initial as avatar). Children select their profile on launch to load their personal progress. A "Guest" mode allows immediate play without profile setup.

### User Story

As a parent, I want to create named profiles for my children, so that each child has their own star progress and the app feels personal to them.

As a child, I want to tap my name to start playing, so that I see my own stars and progress.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | App can be used immediately as "Guest" without creating any profiles | Must |
| AC-002 | Parent can set a 4-digit PIN to access profile management | Must |
| AC-003 | Parent can create up to 3 child profiles (name + color) | Must |
| AC-004 | Each profile displays as a colored circle with the child's initial | Must |
| AC-005 | Launch screen shows profile picker when profiles exist (name + avatar for each child, plus Guest) | Must |
| AC-005b | Switching profiles after initial selection requires entering the parent PIN (prevents kids from accessing other kids' profiles) | Must |
| AC-006 | Selecting a profile loads that child's progress (stars, WordProgress) | Must |
| AC-007 | All API calls include the active profile ID so progress is scoped per child | Must |
| AC-008 | Guest progress is stored under a special "guest" profile (no name required) | Must |
| AC-009 | Parent can edit a child's name and color from profile management | Should |
| AC-010 | Parent can delete a child profile (with confirmation) | Should |
| AC-011 | PIN is stored hashed in the backend database | Must |
| AC-012 | Profile data (name, color, PIN hash) stored in backend database | Must |

## 3. User Test Cases

### TC-001: First Launch — Guest Mode

**Precondition:** Fresh app, no profiles created
**Steps:**
1. Open app for the first time
2. App goes directly to category list (Guest mode)
3. Child plays a round, progress is recorded under Guest profile
**Expected Result:** No profile setup required, immediate play
**Screenshot Checkpoint:** tests/screenshots/user-accounts/tc-001-guest-mode.png
**Maps to:** TBD

### TC-002: Parent Creates First Profile

**Precondition:** App in Guest mode, no PIN set
**Steps:**
1. Parent taps settings/profile icon
2. App prompts to set a 4-digit PIN
3. Parent enters PIN (e.g., 1234) and confirms
4. Parent taps "Add Child"
5. Parent enters name "Emma" and picks a color (blue)
6. Profile "E" (blue circle) appears in profile list
**Expected Result:** Profile created, PIN set, profile visible on launch screen
**Screenshot Checkpoint:** tests/screenshots/user-accounts/tc-002-create-profile.png
**Maps to:** TBD

### TC-003: Child Selects Profile on Launch

**Precondition:** Profiles exist: Emma (blue), Jack (green)
**Steps:**
1. Open app
2. Profile picker shows: Emma (blue E), Jack (green J), Guest
3. Child taps "Emma"
4. Category list loads with Emma's progress
**Expected Result:** Emma's stars and progress are loaded
**Screenshot Checkpoint:** tests/screenshots/user-accounts/tc-003-profile-select.png
**Maps to:** TBD

### TC-004: Progress Is Scoped Per Child

**Precondition:** Emma has 3 stars on "CAT", Jack has 0 stars on "CAT"
**Steps:**
1. Launch as Emma, check word list — CAT shows 3 stars
2. Switch to Jack (go back to profile picker), check word list — CAT shows 0 stars
**Expected Result:** Each child has independent progress
**Screenshot Checkpoint:** tests/screenshots/user-accounts/tc-004-scoped-progress.png
**Maps to:** TBD

### TC-005: PIN Required for Profile Management

**Precondition:** PIN is set
**Steps:**
1. Tap settings/profile management icon
2. PIN entry screen appears
3. Enter wrong PIN — error message, retry
4. Enter correct PIN — profile management screen opens
**Expected Result:** Only correct PIN grants access to profile management
**Screenshot Checkpoint:** tests/screenshots/user-accounts/tc-005-pin-entry.png
**Maps to:** TBD

### TC-006: Maximum 3 Profiles

**Precondition:** 3 profiles already exist
**Steps:**
1. Parent opens profile management (enters PIN)
2. "Add Child" button is disabled or hidden
3. Message: "Maximum 3 profiles"
**Expected Result:** Cannot create more than 3 profiles
**Screenshot Checkpoint:** tests/screenshots/user-accounts/tc-006-max-profiles.png
**Maps to:** TBD

## 4. Data Model

### Profile

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| name | string | Yes | Child's display name (or "Guest") |
| color | string | Yes | Hex color for avatar circle |
| is_guest | boolean | Yes | True for the auto-created guest profile |
| created_at | datetime | Yes | Creation timestamp |

### ParentSettings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| pin_hash | string | Yes | Hashed 4-digit PIN |
| created_at | datetime | Yes | Creation timestamp |
| updated_at | datetime | Yes | Last update timestamp |

### Relationships

- Profile has many WordProgress (one-to-many via profile_id)
- Profile has many MatchResults (one-to-many via profile_id)
- WordProgress gains a `profile_id` foreign key (existing table modified)
- MatchResult gains a `profile_id` foreign key (existing table modified)
- Guest profile is auto-created on first app launch

## 5. API Contract

### POST /api/profiles/setup

**Description:** Set parent PIN and optionally create first child profile

**Request:**
```json
{
  "pin": "1234"
}
```

**Response (201):**
```json
{
  "message": "PIN set successfully"
}
```

### POST /api/profiles/verify-pin

**Description:** Verify parent PIN to access profile management

**Request:**
```json
{
  "pin": "1234"
}
```

**Response (200):**
```json
{
  "verified": true
}
```

**Error Responses:**
- `401` — Incorrect PIN

### GET /api/profiles

**Description:** List all child profiles (no auth required — just names and colors)

**Response (200):**
```json
{
  "profiles": [
    {
      "id": "uuid",
      "name": "Emma",
      "color": "#3b82f6",
      "is_guest": false
    },
    {
      "id": "uuid",
      "name": "Guest",
      "color": "#9ca3af",
      "is_guest": true
    }
  ],
  "pin_set": true,
  "max_profiles": 3
}
```

### POST /api/profiles

**Description:** Create a child profile (requires PIN verification first)

**Request:**
```json
{
  "name": "Emma",
  "color": "#3b82f6",
  "pin": "1234"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Emma",
  "color": "#3b82f6",
  "is_guest": false
}
```

**Error Responses:**
- `401` — Incorrect PIN
- `409` — Maximum profiles reached (3)
- `400` — Name required

### PUT /api/profiles/{id}

**Description:** Update a child profile (requires PIN)

**Request:**
```json
{
  "name": "Emmy",
  "color": "#ef4444",
  "pin": "1234"
}
```

**Response (200):** Updated profile object

### DELETE /api/profiles/{id}

**Description:** Delete a child profile and all associated progress (requires PIN)

**Request:**
```json
{
  "pin": "1234"
}
```

**Response (204):** No content

### Modified Existing Endpoints

All existing endpoints that record or read progress gain a `X-Profile-ID` header:
- `POST /api/results` — records result scoped to active profile
- `GET /api/progress` — returns progress for the active profile
- `GET /api/progress/{slug}` — returns category progress for the active profile

If no `X-Profile-ID` header is sent, defaults to the Guest profile.

## 6. UI Behavior

### Profile Picker (launch screen — new)

- Shown when 1+ named profiles exist
- Grid of colored circles with initials + name below
- Guest option always available (grey circle, "Guest" label)
- Tapping a profile stores the ID and navigates to category list
- If no profiles exist, skip directly to category list (Guest mode)

### Profile Management (behind PIN — new)

- Accessible from a small gear/settings icon on the category list screen
- PIN entry: 4 digit input with number pad, kid-friendly styling
- Profile list: name, color circle, edit/delete buttons
- "Add Child" button (disabled if 3 profiles exist)
- Create/edit form: name input + color picker (8 preset colors)

### Category List (modified)

- Small profile indicator in top corner (colored circle + name)
- Tap to switch profiles (returns to profile picker)

### States

- **No profiles:** Skip picker, play as Guest
- **Profiles exist:** Show picker on launch
- **PIN not set:** First visit to settings prompts PIN creation
- **Wrong PIN:** Shake animation + "Try again" (max 5 attempts, then 30s cooldown)

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Guest plays, then profiles are created later | Guest progress stays under Guest profile |
| Profile deleted while child is playing | Redirect to profile picker on next API call |
| PIN forgotten | No recovery in MVP (device-local concern). Future: parent email recovery. |
| Empty name submitted | Reject with validation error |
| Same name for two profiles | Allowed — differentiated by color and ID |

## 8. Dependencies

- Progress Tracking spec (WordProgress table must support profile_id)
- Existing MatchResult table modified (add profile_id column)
- Database migration required (new tables + column additions)

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-04 | 0.1.0 | calebdunn | Initial spec from /add:spec interview |
