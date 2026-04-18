# Kids Words — Product Requirements Document

**Version:** 0.2.1
**Created:** 2026-04-04
**Author:** calebdunn
**Status:** Draft

## 1. Problem Statement

Young children (ages 4-6) need engaging, interactive tools to build word recognition skills as they prepare for reading. Existing apps are often cluttered, ad-heavy, or not focused enough on the core skill of matching words to their meanings through visual association. Kids Words provides a clean, focused word recognition experience where children learn by identifying and matching images to words.

## 2. Target Users

- **Primary:** Children ages 4-6 (Pre-K to Kindergarten) learning to recognize words
- **Secondary:** Parents/caregivers who set up the app and monitor progress

## 3. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Kid engagement | 5+ minute average session time | Session duration tracking |
| Return visits | 3+ sessions per week | Session frequency tracking |
| Learning progress | 80% accuracy improvement over 4 weeks | Correct match rate over time |

## 4. Scope

### In Scope (MVP)

- Word recognition activity: show images and words, child identifies or matches them
- Age-appropriate word sets (common nouns, colors, animals, etc.)
- Visual feedback for correct/incorrect answers (encouraging, non-punitive)
- Basic progress tracking (words learned, accuracy)
- Mobile-friendly responsive design (target: iPad/tablet use)
- Capacitor wrapper for iOS distribution

### Out of Scope

- Spelling practice (v2)
- Audio/pronunciation (v2)
- User accounts / cloud sync (v2)
- Multiplayer / competitive modes
- In-app purchases or ads
- Android app (iOS first)

## 5. Architecture

### Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Backend | Python | 3.14 | API server |
| Backend Framework | FastAPI | latest | REST API |
| Frontend | TypeScript | 5.x | Type-safe frontend |
| Frontend Framework | React | 19 | With Vite bundler |
| Mobile | Capacitor | latest | iOS app wrapper |
| Database | TBD | TBD | To be determined based on data needs |

### Infrastructure

| Component | Choice | Notes |
|-----------|--------|-------|
| Git Host | GitHub | Remote repository |
| Cloud Provider | GCP | Cloud Run for production |
| CI/CD | GitHub Actions | Automated pipeline |
| Containers | Docker Compose | All environments |
| IaC | None | Manual setup initially |

### Environment Strategy

| Environment | Purpose | URL | Deploy Trigger |
|-------------|---------|-----|----------------|
| Local | Development & unit tests | http://localhost:8000 | Manual |
| QA/Staging | Docker-based QA testing | TBD | Push to staging branch |
| Production | Live users | TBD | Merge to main → Cloud Run |

**Environment Tier:** 3 (full pipeline: local → QA/staging → production)

## 6. Milestones & Roadmap

### Current Maturity: Beta (promoted from Alpha on 2026-04-05)

### Roadmap

| Milestone | Goal | Target Maturity | Status | Success Criteria |
|-----------|------|-----------------|--------|------------------|
| M7: Word Builder | Prefix/suffix game mode with adaptive difficulty | Beta | NOW | 3 difficulty levels, ~100 combos, adaptive unlock, profile-scoped progress |
| M8: Audio & Pronunciation | Tap-to-hear via Web Speech API | Beta | NEXT | Tapping words/images speaks them on iOS + web |
| M1: Word Recognition | Core matching activity works | Alpha | COMPLETE | Kids can match words to images with visual feedback |
| M2: Staging Environment | Stand up staging at kids-words.staging.calebdunn.tech | Alpha | COMPLETE | App functional end-to-end on staging |
| M3: Infrastructure Hardening | Safe, repeatable deploys; no data loss on schema changes | Beta | COMPLETE | 7/7 — Alembic migrations + idempotent seed + CI ≥ 80% + release tags + staging deploy validated by cycle-12 migration |
| M4: Profile Enhancements | Edit/delete profiles | Beta | COMPLETE | Edit/delete flows shipped via PR #11 |
| M5: Dark Mode | Device auto-detect + manual toggle | Beta | COMPLETE | Dark mode shipped via PR #12 |
| M6: New Categories | Add Shapes + Body Parts word sets | Beta | COMPLETE | Shapes (20) + Body Parts (25) live on home |

### Milestone Detail

#### M7: Word Builder [NOW]
**Goal:** New game mode teaching prefix/suffix patterns with adaptive difficulty.
**Appetite:** 1-2 weeks
**Target maturity:** Beta
**Features:**
- Word Builder backend — 4 new tables, 3 endpoints, migration
- Word Builder frontend — Build screen, snap animation, level indicator
- Seed data (100+ combos) across 3 levels
- Adaptive difficulty — auto-unlock levels via star mastery
**Success criteria:**
- [ ] Word Builder mode on home screen
- [ ] Build-a-word interaction with snap animation
- [ ] 3 difficulty levels with ~100 word combos
- [ ] Adaptive unlock (70%+ mastery → next level)
- [ ] Star progress per pattern
- [ ] Profile-scoped progress
**Dependencies:** M6 (validates seed pattern — DONE); Alembic migration for new tables.

#### M8: Audio & Pronunciation [NEXT]
**Goal:** Tap any word or image to hear it spoken via the Web Speech API. Reinforces the link between written and spoken language with zero hosting cost.
**Appetite:** 2-3 days
**Target maturity:** Beta
**Features:**
- Word Pronunciation — specs/word-pronunciation.md (SPECCED)
**Success criteria:**
- [ ] Tapping a word in Match Round speaks it aloud
- [ ] Tapping an image card speaks the matching word
- [ ] Speech rate tuned slower for children (~0.85)
- [ ] Works across Match Round, Word List, and (eventually) Word Builder
- [ ] Works on iOS Capacitor build
- [ ] No external audio assets

#### M3: Infrastructure Hardening [COMPLETE — 2026-04-18]
**Goal:** Make deployments safe and repeatable. No more data loss on schema changes.
**Appetite:** 1 week | **Delivered:** ~13 days across cycles 7, 8, 9, 11, 12
**Target maturity:** Beta | **Closed:** 2026-04-18
**Success criteria (7/7):**
- [x] `alembic upgrade head` applies schema changes without data loss (cycle-9 tests)
- [x] Seed script is idempotent (cycle-9, 6 tests)
- [x] Docker entrypoint auto-runs migrations on start (cycle-7)
- [x] CI backend coverage ≥ 80% (cycle-11 — 93.33% × 3 green runs after Python 3.14 alignment)
- [x] Frontend coverage ≥ 80% (cycle-8 — 86.2%)
- [x] Release tags pushed (v0.1.0 MVP + v0.2.0 covering M3-M6)
- [x] Staging deploy works without manual DB reset (cycle-12 migration 002 auto-applied cleanly)

### Maturity Promotion Path

| From | To | Requirements |
|------|-----|-------------|
| Alpha → Beta | Feature specs for all user-facing features, 50%+ test coverage, PR workflow, 2+ environments configured, TDD evidence |
| Beta → GA | 80%+ test coverage, E2E tests, CI/CD pipeline active, release tags, branch protection, environment separation verified |

## 7. Key Features

### Feature 1: Word-Image Matching
The core learning activity. Children are shown a word and must select the matching image from a set of options (or vice versa). Difficulty adapts based on the child's progress — starting with 2 options and increasing to 4.

### Feature 2: Word Sets
Curated collections of age-appropriate words organized by category: animals, colors, shapes, food, family, etc. Each word has an associated image. Word sets can be expanded over time.

### Feature 3: Visual Feedback
Positive, encouraging feedback for correct answers (animations, stars, celebrations). Gentle, non-punitive feedback for incorrect answers (try again encouragement). No scores or failure states — focus on learning, not testing.

## 8. Non-Functional Requirements

- **Performance:** Page load < 2s, interaction response < 200ms
- **Security:** No personal data collection from children (COPPA-aware design)
- **Accessibility:** Large touch targets (min 44px), high contrast text, screen reader support for parent-facing UI

## 9. Open Questions

- What database is best for this use case? (Could be SQLite for simplicity, or PostgreSQL for future scale)
- Should word images be illustrated or photographic?
- How many words per category in MVP?
- Local-first data storage or API-backed from the start?

## 10. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-04 | 0.1.0 | calebdunn | Initial draft from /add:init interview |
| 2026-04-18 | 0.2.0 | calebdunn | Section 6 reconciled with docs/milestones/; M2 formally closed; maturity corrected to Beta; M4-M8 added to roadmap table |
| 2026-04-18 | 0.2.1 | calebdunn | M3 Infrastructure Hardening closed (7/7 criteria met via cycles 7-12); M7 promoted Next → Now; M3 detail block moved to COMPLETE section |
