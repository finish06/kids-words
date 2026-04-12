# Spec: Health & Version Endpoints

**Version:** 0.1.0
**Created:** 2026-04-05
**PRD Reference:** docs/prd.md — Infrastructure
**Milestone:** M3 — Infrastructure Hardening
**Status:** Implemented

## 1. Overview

Rich health and version endpoints for backend observability and frontend status. Backend `/api/health` returns operational status with dependency checks and uptime. Backend `/api/version` returns build metadata. Frontend `/health` returns basic status and version.

### User Story

As a developer/operator, I want health and version endpoints that show service status, uptime, dependency health, and build info, so that I can monitor the app and debug deployment issues.

## 2. Acceptance Criteria

### Backend

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | `GET /api/health` returns status, version, uptime_seconds, start_time | Must |
| AC-002 | `/api/health` includes dependencies array with name, status, latency_ms for each dependency | Must |
| AC-003 | Dependencies checked: database (PostgreSQL connection + simple query) | Must |
| AC-004 | Overall status is "healthy" only if all dependencies are healthy | Must |
| AC-005 | Overall status is "degraded" if any dependency is unhealthy | Must |
| AC-006 | `GET /api/version` returns version, git_commit, git_branch, build_date | Must |
| AC-007 | `/api/version` returns architecture, python_version, hostname, os | Must |
| AC-008 | Build metadata injected via environment variables at build time | Should |
| AC-009 | Health endpoint responds in < 500ms even when dependencies are slow (timeout) | Should |

### Frontend

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-010 | `GET /health` returns JSON with status and version | Must |
| AC-011 | Frontend version derived from package.json or build-time injection | Must |
| AC-012 | Health endpoint served by nginx (no JS runtime needed) | Should |

## 3. User Test Cases

### TC-001: Backend Health — All Healthy

**Precondition:** Backend running, database connected
**Steps:**
1. `GET /api/health`
**Expected Result:**
```json
{
  "status": "healthy",
  "version": "0.1.0",
  "uptime_seconds": 3621,
  "start_time": "2026-04-05T02:00:00Z",
  "dependencies": [
    {
      "name": "database",
      "status": "healthy",
      "latency_ms": 2.3
    }
  ]
}
```
**Maps to:** TBD

### TC-002: Backend Health — Database Down

**Precondition:** Backend running, database unreachable
**Steps:**
1. `GET /api/health`
**Expected Result:**
```json
{
  "status": "degraded",
  "version": "0.1.0",
  "uptime_seconds": 3621,
  "start_time": "2026-04-05T02:00:00Z",
  "dependencies": [
    {
      "name": "database",
      "status": "unhealthy",
      "latency_ms": null,
      "error": "connection refused"
    }
  ]
}
```
**Maps to:** TBD

### TC-003: Backend Version

**Precondition:** Backend running
**Steps:**
1. `GET /api/version`
**Expected Result:**
```json
{
  "version": "0.1.0",
  "git_commit": "9dbd9f9",
  "git_branch": "main",
  "build_date": "2026-04-05T03:52:56Z",
  "architecture": "x86_64",
  "python_version": "3.13.12",
  "hostname": "kids-words-backend-1",
  "os": "Linux"
}
```
**Maps to:** TBD

### TC-004: Frontend Health

**Precondition:** Frontend nginx running
**Steps:**
1. `GET /health`
**Expected Result:**
```json
{
  "status": "healthy",
  "version": "0.1.0"
}
```
**Maps to:** TBD

## 4. Data Model

No database changes. Uses in-memory state (start_time) and environment variables.

## 5. API Contract

### GET /api/health (backend — enhanced)

**Response (200):**
```json
{
  "status": "healthy | degraded",
  "version": "string",
  "uptime_seconds": 3621.5,
  "start_time": "ISO8601 datetime",
  "dependencies": [
    {
      "name": "database",
      "status": "healthy | unhealthy",
      "latency_ms": 2.3,
      "error": "optional error message"
    }
  ]
}
```

### GET /api/version (backend — new)

**Response (200):**
```json
{
  "version": "string",
  "git_commit": "string",
  "git_branch": "string",
  "build_date": "string",
  "architecture": "string",
  "python_version": "string",
  "hostname": "string",
  "os": "string"
}
```

### GET /health (frontend — new, nginx-served)

**Response (200):**
```json
{
  "status": "healthy",
  "version": "string"
}
```

## 6. Implementation Notes

### Backend

- Track `start_time` at app startup (module-level `datetime.now(UTC)`)
- Compute `uptime_seconds` as `now - start_time`
- Database health check: `SELECT 1` with 3-second timeout, measure latency
- Version info from env vars: `GIT_COMMIT`, `GIT_BRANCH`, `BUILD_DATE`
- Fallback: read from local values if env vars not set (dev mode)
- `architecture`, `python_version`, `hostname`, `os` from `platform` module

### Dockerfile.prod

- Pass build args: `--build-arg GIT_COMMIT=... --build-arg BUILD_DATE=...`
- Set as ENV in container

### Frontend

- Generate `health.json` at build time: `{"status":"healthy","version":"$VERSION"}`
- Nginx serves `/health` → `/health.json` (static file, no JS needed)
- Version from `package.json` version field

### Deploy workflow

- Pass git SHA and build date as Docker build args

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| Database connection timeout | Status "degraded", latency_ms null, error message |
| Multiple dependencies, one down | Status "degraded", healthy deps still show latency |
| Env vars not set (local dev) | Use fallback values ("dev", "unknown", etc.) |
| Health endpoint under load | Timeout dependency checks at 3s, respond within 5s |

## 8. Dependencies

- Existing health endpoint (`GET /api/health`) — enhanced, not replaced
- Docker build args in Dockerfile.prod and deploy.yml

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-05 | 0.1.0 | calebdunn | Initial spec |
