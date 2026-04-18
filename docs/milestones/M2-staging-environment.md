# M2 — Staging Environment

**Goal:** Stand up kids-words on staging1 (192.168.1.145) accessible at kids-words.staging.calebdunn.tech, pulling beta images from dockerhub.calebdunn.tech.
**Appetite:** 1-2 days
**Status:** COMPLETE
**Started:** 2026-04-04
**Closed:** 2026-04-18 (formal close — staging has been live since M6 cycle-10)
**Target Maturity:** Alpha

## Hill Chart

```
Staging docker-compose    ████████████████████████████████  100% — live
.env.staging              ████████████████████████████████  100% — live
Deploy hook integration   ████████████████████████████████  100% — live
Seed data on staging      ████████████████████████████████  100% — auto-seed via Docker entrypoint
Smoke test                ████████████████████████████████  100% — verified via M6 Shapes round
```

## Features

| Feature | Position | Notes |
|---------|----------|-------|
| Staging docker-compose.staging.yml | COMPLETE | Pulls beta images from private registry |
| .env.staging | COMPLETE | DB creds, API URL, registry auth |
| Deploy hook integration | COMPLETE | Wired into staging1 deploy-hook compose |
| Seed data on staging | COMPLETE | Auto-seed via `python -m app.seed` in Docker entrypoint (idempotent) |
| Smoke test | COMPLETE | App loads at kids-words.staging.calebdunn.tech; Shapes quiz round played (cycle-10) |

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

- [x] docker-compose.staging.yml pulls images from private registry
- [x] Backend accessible on staging network
- [x] Frontend accessible at kids-words.staging.calebdunn.tech
- [x] Database seeded with word categories
- [x] Deploy hook triggers pull + restart on new beta push
- [x] App functional end-to-end on staging (category → quiz → match)

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
| cycle-4 | All staging setup | COMPLETE | Staging live; formally closed 2026-04-18 |
