# Spec: Auto Staging Deploy

**Version:** 0.1.0
**Created:** 2026-04-05
**PRD Reference:** docs/prd.md — Infrastructure
**Milestone:** M3
**Status:** Draft

## 1. Overview

After beta images are pushed to the registry, automatically trigger the deploy-hook on staging1 to pull and restart the kids-words containers. Eliminates manual SSH + docker compose pull on every merge to main.

### User Story

As a developer, I want staging to auto-deploy when I merge to main, so that I don't have to SSH in and manually pull images.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Deploy workflow triggers staging webhook after successful image push | Must |
| AC-002 | Webhook payload includes app name, git ref, SHA, and image tag | Must |
| AC-003 | Webhook is signed with HMAC-SHA256 using WEBHOOK_SECRET | Must |
| AC-004 | Deploy-hook apps.yaml on staging1 includes kids-words config | Must |
| AC-005 | Staging containers auto-restart with new images after webhook | Must |
| AC-006 | Health check verifies backend responds after deploy | Should |
| AC-007 | Versioned releases (v* tags) do NOT auto-deploy to staging | Must |

## 3. Implementation Notes

- GitHub secrets: WEBHOOK_SECRET, STAGING_WEBHOOK_URL (https://deploy.staging.calebdunn.tech)
- Deploy-hook apps.yaml entry for kids-words pointing to /opt/kids-words
- Webhook step added to .github/workflows/deploy.yml after image push
- Same pattern as ndc-loader/drugs-quiz projects

## 4. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-05 | 0.1.0 | calebdunn | Initial spec |
