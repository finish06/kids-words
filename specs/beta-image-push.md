# Spec: Beta Image Push

**Version:** 0.1.0
**Created:** 2026-04-04
**PRD Reference:** docs/prd.md — Infrastructure
**Milestone:** M1 (CI/CD)
**Status:** Draft

## 1. Overview

On every merge to `main`, GitHub Actions builds Docker images for both backend and frontend, then pushes them to the private registry at `dockerhub.calebdunn.tech` with a `beta-{7-char-sha}` tag. Semver-tagged releases push versioned images. This follows the same convention used across all of the developer's projects.

### User Story

As a developer, I want every merge to main to automatically build and push Docker images to my private registry, so that QA/staging environments can pull the latest beta build without manual intervention.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Merge to main triggers a GitHub Actions workflow that builds backend and frontend Docker images | Must |
| AC-002 | Backend image is pushed as `dockerhub.calebdunn.tech/kids-words-backend:beta-{7-char-sha}` | Must |
| AC-003 | Frontend image is pushed as `dockerhub.calebdunn.tech/kids-words-frontend:beta-{7-char-sha}` | Must |
| AC-004 | Workflow authenticates to registry using `REGISTRY_USERNAME` and `REGISTRY_PASSWORD` GitHub secrets | Must |
| AC-005 | CI tests (backend + frontend) must pass before images are built and pushed | Must |
| AC-006 | Semver git tags (e.g., `v0.1.0`) push versioned images (`:0.1.0`) in addition to beta tags | Should |
| AC-007 | Workflow uses multi-platform or linux/amd64 builds suitable for the staging server | Should |
| AC-008 | Build uses Docker layer caching for faster CI runs | Nice |

## 3. User Test Cases

### TC-001: Merge to Main Pushes Beta Images

**Precondition:** PR is approved, CI passes
**Steps:**
1. Merge PR to `main`
2. GitHub Actions workflow triggers
3. CI tests run and pass
4. Backend Docker image builds
5. Frontend Docker image builds
6. Both images pushed to `dockerhub.calebdunn.tech`
**Expected Result:** Both images available at registry with `beta-{sha}` tag
**Screenshot Checkpoint:** N/A (CI workflow)
**Maps to:** TBD

### TC-002: CI Failure Blocks Image Push

**Precondition:** Code with failing tests is merged (or PR CI fails)
**Steps:**
1. Push code that fails tests
2. CI tests run and fail
3. Image build step should not execute
**Expected Result:** No images pushed to registry when tests fail
**Screenshot Checkpoint:** N/A
**Maps to:** TBD

### TC-003: Semver Tag Pushes Versioned Image

**Precondition:** Code is on main, passing CI
**Steps:**
1. Create and push a semver tag: `git tag v0.1.0 && git push --tags`
2. GitHub Actions workflow triggers on tag
3. Images built and pushed with `:0.1.0` tag
**Expected Result:** Images available at `dockerhub.calebdunn.tech/kids-words-backend:0.1.0`
**Screenshot Checkpoint:** N/A
**Maps to:** TBD

## 4. Data Model

No database changes. This is purely CI/CD infrastructure.

## 5. API Contract

No API changes.

## 6. UI Behavior

No UI changes.

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Registry is unreachable | Workflow fails with clear error, does not affect test results |
| Invalid credentials | Workflow fails at login step with auth error |
| Concurrent merges to main | Each merge gets its own workflow run with unique SHA tag |
| Tag and merge happen simultaneously | Both beta and versioned images are pushed |

## 8. Dependencies

- GitHub Actions secrets: `REGISTRY_USERNAME`, `REGISTRY_PASSWORD` (already configured)
- Private registry: `dockerhub.calebdunn.tech` (Docker Registry v2)
- Existing CI workflow (`.github/workflows/ci.yml`) — extend or create separate workflow

## 9. Implementation Notes

- Registry: `dockerhub.calebdunn.tech` (Docker Registry v2, username: finish06)
- Beta tag format: `beta-{7-char-sha}` (e.g., `beta-abc1234`)
- Versioned tag format: `{semver}` (e.g., `0.1.0`, stripped of `v` prefix)
- Keep last 10 beta images (cleanup can be added later)
- Both images need production-ready Dockerfiles (multi-stage for smaller size)
- Build order: tests first, then images (tests gate the push)

## 10. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-04 | 0.1.0 | calebdunn | Initial spec from /add:spec interview |
