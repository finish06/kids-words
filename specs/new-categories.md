# Spec: New Categories — Shapes & Body Parts

**Version:** 0.1.0
**Created:** 2026-04-07
**PRD Reference:** docs/prd.md — Word Sets
**Milestone:** M6 — New Categories
**Status:** Implemented

## 1. Overview

Add two new word categories: Shapes (~20 words) and Body Parts (~25 words). Uses OpenMoji CDN images. Seed data only — no code changes needed beyond the seed files and running the idempotent seed.

### User Story

As a child (4-6), I want to learn shape and body part words, so that I can build vocabulary beyond animals, food, and colors.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Shapes category appears on home screen with ~20 words | Must |
| AC-002 | Body Parts category appears on home screen with ~25 words | Must |
| AC-003 | All words have OpenMoji images that load correctly | Must |
| AC-004 | Categories have appropriate icons and display order | Must |
| AC-005 | Idempotent seed adds new categories without affecting existing data | Must |
| AC-006 | Quiz picker works with new categories (5/10/20 options) | Must |
| AC-007 | Progress tracking works for new categories | Must |

## 3. User Test Cases

### TC-001: Shapes Category

**Precondition:** App loaded, categories visible
**Steps:**
1. Home screen shows Shapes category with word count
2. Tap Shapes → quiz picker → pick 5
3. Shape words appear with matching images
**Expected Result:** Shapes work like existing categories
**Maps to:** TBD

### TC-002: Body Parts Category

**Precondition:** App loaded
**Steps:**
1. Home screen shows Body Parts category
2. Play a round — body part images display correctly
**Expected Result:** Body parts work like existing categories
**Maps to:** TBD

### TC-003: Existing Data Preserved

**Precondition:** Existing profiles and progress
**Steps:**
1. Run seed script
2. New categories added
3. Existing progress (animals, food, colors) unchanged
**Expected Result:** Idempotent — adds only new data
**Maps to:** TBD

## 4. Data Model

No schema changes. Uses existing Category and Word tables. New seed data files.

## 5. Implementation Notes

- Create `backend/app/seed_shapes.py` — ~20 shape words with OpenMoji codes
- Create `backend/app/seed_bodyparts.py` — ~25 body part words with OpenMoji codes
- Update `backend/app/seed.py` to include new categories
- Run `python -m app.seed` — idempotent, adds missing only
- CategoryList illustrations: add SVG illustrations for new categories (or skip if not available)

### Shapes Word List (target ~20)
Circle, Square, Triangle, Star, Heart, Diamond, Rectangle, Oval, Pentagon, Hexagon, Arrow, Crescent, Cross, Ring, Cube, Sphere, Cone, Cylinder, Spiral, Infinity

### Body Parts Word List (target ~25)
Head, Face, Eye, Ear, Nose, Mouth, Tooth, Tongue, Hand, Foot, Arm, Leg, Finger, Knee, Bone, Brain, Heart, Muscle, Neck, Shoulder, Back, Belly, Thumb, Nail, Hair

## 6. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-07 | 0.1.0 | calebdunn | Initial spec |
