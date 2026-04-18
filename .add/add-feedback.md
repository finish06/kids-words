# ADD Methodology Feedback

Suggestions from retrospectives that could feed upstream to ADD itself.
Each entry is marked `Streamed: false` until it's been shared with the
ADD plugin project.

## 2026-04-18

- **Suggestion:** Auto-check for unpushed base commit before branching. When `/add:cycle --plan` or `/add:spec` is about to hand off to execution that would create a feature branch + PR, it should first check `git log origin/main..main` (or equivalent). If there are any unpushed commits on the local base branch, warn: "your local main has commits not on origin; push them first or your feature PR's squash merge will cause local/remote divergence." Root-cause of this retro's merge-fiasco.
- **Evidence:** cycle-11 (PR #16) squash-merged a feature branch that contained an unpushed local-main commit (`5ad4a6a`). GitHub's squash was based on last-pushed origin/main, leaving local main diverged from remote and requiring `git reset origin/main` to recover.
- **Retro:** .add/retros/retro-2026-04-18.md
- **Streamed:** false

- **Suggestion (related, captured but not chosen by user):** Add a PRD-sync check to retro pre-flight. Scan PRD Section 6 against `docs/milestones/M*.md` and flag drift (missing milestones, wrong names, stale maturity) before asking questions. Root-cause of this retro's late-caught roadmap drift.
- **Evidence:** PRD had listed M1/M2/M3 with stale names for weeks while milestone files tracked M1-M8 at Beta maturity. Caught only because `/add:roadmap --edit` forced a read of both. A retro pre-flight check would catch this every 2 weeks.
- **Retro:** .add/retros/retro-2026-04-18.md
- **Streamed:** false

- **Suggestion (related, captured but not chosen by user):** Auto-migrate `learnings.md` → JSON when `/add:retro` runs against a pre-migration project. If `.add/learnings.json` doesn't exist but `.add/learnings.md` does, offer to migrate inline before writing new entries. Would close a deferred action item that's been outstanding across two retros.
- **Evidence:** Action #3 from retro 2026-04-12 (migrate to JSON) was deferred again in retro 2026-04-18. The project keeps accumulating markdown-format learnings that can't participate in smart filtering.
- **Retro:** .add/retros/retro-2026-04-18.md
- **Streamed:** false
