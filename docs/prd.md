# Kids Words — Product Requirements Document

**Version:** 0.1.0
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

### Current Maturity: Alpha

### Roadmap

| Milestone | Goal | Target Maturity | Status | Success Criteria |
|-----------|------|-----------------|--------|------------------|
| M1: Word Recognition | Core matching activity works | Alpha | NOW | Kids can match words to images with visual feedback |
| M2: Progress Tracking | Track and display learning progress | Alpha | NEXT | Parents can see accuracy and words learned |
| M3: iOS App | Ship Capacitor iOS build | Beta | LATER | App runs on iPad via TestFlight |

### Milestone Detail

#### M1: Word Recognition [NOW]
**Goal:** Build the core word-image matching activity that kids can use on a tablet.
**Appetite:** 2-3 weeks
**Target maturity:** Alpha
**Features:**
- word-image-matching — Core activity where kids match words to images
- word-sets — Curated age-appropriate word categories (animals, colors, etc.)
- visual-feedback — Encouraging animations for correct/incorrect answers
**Success criteria:**
- [ ] Child can complete a word matching round
- [ ] At least 3 word categories available
- [ ] Visual feedback is encouraging and age-appropriate
- [ ] Works on tablet-sized screens

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
