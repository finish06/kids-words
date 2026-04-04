# Implementation Plan: Beta Image Push

**Spec Version:** 0.1.0
**Created:** 2026-04-04
**Team Size:** Solo
**Estimated Duration:** 1 session (~1-2 hours)

## Overview

Extend the existing GitHub Actions CI workflow to build and push Docker images for both backend and frontend to `dockerhub.calebdunn.tech` on every merge to main. Beta images tagged `beta-{7-char-sha}`, versioned images on semver tags.

## Objectives

- Automate Docker image builds on merge to main
- Push to private registry with consistent tagging convention
- Gate image push on passing CI tests
- Support semver tag releases

## Implementation Phases

### Phase 1: Production Dockerfiles (30 min)

Current Dockerfiles are dev-oriented (hot reload, dev dependencies). Need production-ready multi-stage builds.

| Task ID | Description | Effort | Dependencies | AC |
|---------|-------------|--------|--------------|-----|
| TASK-001 | Create `backend/Dockerfile.prod` — multi-stage (build deps → slim runtime) | 15 min | — | AC-001 |
| TASK-002 | Create `frontend/Dockerfile.prod` — multi-stage (npm build → nginx serve) | 15 min | — | AC-001 |

### Phase 2: GitHub Actions Workflow (30 min)

Add a `deploy.yml` workflow that runs after CI passes.

| Task ID | Description | Effort | Dependencies | AC |
|---------|-------------|--------|--------------|-----|
| TASK-003 | Create `.github/workflows/deploy.yml` — triggers on push to main and semver tags | 15 min | — | AC-001, AC-005 |
| TASK-004 | Add registry login step using `REGISTRY_USERNAME` / `REGISTRY_PASSWORD` secrets | 5 min | TASK-003 | AC-004 |
| TASK-005 | Add build + push steps for backend image (`kids-words-backend:beta-{sha}`) | 5 min | TASK-004 | AC-002 |
| TASK-006 | Add build + push steps for frontend image (`kids-words-frontend:beta-{sha}`) | 5 min | TASK-004 | AC-003 |
| TASK-007 | Add semver tag detection — push `:X.Y.Z` tag when triggered by `v*` git tag | 10 min | TASK-005, TASK-006 | AC-006 |

### Phase 3: Verify & Commit (30 min)

| Task ID | Description | Effort | Dependencies | AC |
|---------|-------------|--------|--------------|-----|
| TASK-008 | Test workflow locally with `act` or push to branch and verify | 15 min | Phase 2 | All |
| TASK-009 | Commit, push, create PR, verify CI + deploy workflow triggers | 10 min | TASK-008 | All |
| TASK-010 | Update spec status to Complete | 5 min | TASK-009 | — |

## Effort Summary

| Phase | Estimated | Tasks |
|-------|-----------|-------|
| Phase 1: Prod Dockerfiles | 30 min | 2 |
| Phase 2: Deploy Workflow | 40 min | 5 |
| Phase 3: Verify & Commit | 30 min | 3 |
| **Total** | **~1.5 hours** | **10** |

## Dependencies

- `REGISTRY_USERNAME` and `REGISTRY_PASSWORD` secrets already configured
- Existing CI workflow (`.github/workflows/ci.yml`) must pass before deploy
- Private registry at `dockerhub.calebdunn.tech` accessible from GitHub Actions

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Registry unreachable from GH Actions | Low | High | Test with a manual push first, verify network |
| Dockerfile.prod build fails | Medium | Low | Test build locally before pushing |
| CI/deploy race condition | Low | Low | Use `workflow_run` trigger to chain after CI |

## Deliverables

- `backend/Dockerfile.prod` — production multi-stage Dockerfile
- `frontend/Dockerfile.prod` — production multi-stage Dockerfile (nginx)
- `.github/workflows/deploy.yml` — build + push workflow

## Task-to-AC Traceability

| AC | Tasks |
|----|-------|
| AC-001 | TASK-001, TASK-002, TASK-003 |
| AC-002 | TASK-005 |
| AC-003 | TASK-006 |
| AC-004 | TASK-004 |
| AC-005 | TASK-003 (workflow_run dependency on CI) |
| AC-006 | TASK-007 |

## Plan History

| Date | Version | Changes |
|------|---------|---------|
| 2026-04-04 | 0.1.0 | Initial plan |
