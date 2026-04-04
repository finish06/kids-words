# M2 — Staging Environment

**Goal:** Stand up kids-words on staging1 (192.168.1.145) accessible at kids-words.staging.calebdunn.tech, pulling beta images from dockerhub.calebdunn.tech.
**Appetite:** 1-2 days
**Status:** IN_PROGRESS
**Started:** 2026-04-04
**Target Maturity:** Alpha

## Hill Chart

```
Staging docker-compose    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
.env.staging              ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
Deploy hook integration   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
Seed data on staging      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
Smoke test                ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — not started
```

## Features

| Feature | Position | Notes |
|---------|----------|-------|
| Staging docker-compose.staging.yml | NOT_STARTED | Production compose pulling from registry, external `internal` network |
| .env.staging | NOT_STARTED | Database creds, API URL, registry auth |
| Deploy hook integration | NOT_STARTED | Wire into existing deploy-hook compose on staging1 |
| Seed data on staging | NOT_STARTED | Run seed script against staging postgres |
| Smoke test | NOT_STARTED | Verify app loads at kids-words.staging.calebdunn.tech |

## Staging Infrastructure

| Item | Value |
|------|-------|
| Host | staging1 — 192.168.1.145 |
| OS | Debian 12, Docker 29.3, Compose 5.1 |
| User | finish06 |
| Work dir | /opt/kids-words/ |
| Network | External `internal` (shared with Newt/Pangolin) |
| URL | kids-words.staging.calebdunn.tech |
| Registry | dockerhub.calebdunn.tech |
| Images | kids-words-backend:beta-{sha}, kids-words-frontend:beta-{sha} |
| Deploy | deploy-hook compose on staging1 |
| Restart | `restart: unless-stopped` |

## Success Criteria

- [ ] docker-compose.staging.yml pulls images from private registry
- [ ] Backend accessible on staging network
- [ ] Frontend accessible at kids-words.staging.calebdunn.tech
- [ ] Database seeded with word categories
- [ ] Deploy hook triggers pull + restart on new beta push
- [ ] App functional end-to-end on staging (category → quiz → match)

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
| cycle-4 | All staging setup | PLANNED | Single cycle |
