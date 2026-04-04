# Cycle 4 — Staging Environment Setup

**Milestone:** M2 — Staging Environment
**Maturity:** Alpha
**Status:** PLANNED
**Started:** TBD
**Completed:** TBD
**Duration Budget:** 1 session (~1-2 hours)

## Work Items

| Feature | Current Pos | Target Pos | Assigned | Est. Effort | Validation |
|---------|-------------|-----------|----------|-------------|------------|
| docker-compose.staging.yml | NOT_STARTED | COMPLETE | Agent-1 | ~30 min | Compose file pulls from registry, uses external network |
| .env.staging template | NOT_STARTED | COMPLETE | Agent-1 | ~15 min | Template with all required vars |
| Deploy hook config | NOT_STARTED | COMPLETE | Agent-1 | ~15 min | Integrates with staging1 deploy-hook |
| Deploy to staging1 | NOT_STARTED | COMPLETE | Human | ~20 min | SSH, create dirs, place files, docker compose up |
| Seed + smoke test | NOT_STARTED | COMPLETE | Human | ~15 min | Seed DB, verify at kids-words.staging.calebdunn.tech |

## Dependencies & Serialization

```
docker-compose.staging.yml + .env.staging (can be written in parallel)
    ↓
Deploy hook config
    ↓
Commit + push to main (triggers beta image build)
    ↓
Deploy to staging1 (SSH — human action)
    ↓
Seed + smoke test
```

## Validation Criteria

- [ ] docker-compose.staging.yml created and committed
- [ ] .env.staging.example committed (actual .env gitignored)
- [ ] Deploy hook integration documented
- [ ] Files deployed to /opt/kids-words/ on staging1
- [ ] `docker compose up -d` succeeds on staging1
- [ ] kids-words.staging.calebdunn.tech loads the app
- [ ] Categories + words display correctly

## Notes

- staging1 uses external `internal` docker network (shared with Newt/Pangolin reverse proxy)
- Containers use `restart: unless-stopped`
- Frontend nginx needs to proxy /api/ to backend container
- Database data persists via named volume
- Deploy hook compose file on staging1 handles automated pulls
