# Session Handoff
**Written:** 2026-04-18 (cycle-13 + cycle-14 closed; cycle-15 direction captured)

## Session summary

Long session covering: roadmap reconciliation → cycle-11 (CI fix) → retro → cycle-12 (Word Builder backend) → M3 closure → /add:ux Word Builder → cycle-13 (Word Builder frontend) → PAT → cycle-14 (gating) → product redesign direction for cycle-15.

## State on main

```
4a5d1cd  chore: gate Word Builder behind Coming soon (cycle-14) (#20)
d12e928  chore(add): cycle-13 agent-done — AWAITING_PAT
e507610  feat: Word Builder frontend (M7 cycle-13) (#19)
9e8d0aa  chore(add): plan cycle-13 — M7 Word Builder frontend
145ae69  docs(ux): sign off Word Builder (M7) UX design
7d6ad9b  docs: close M3 milestone — 7/7 success criteria met
...
```

Staging at `4a5d1cd` running Python 3.14.4. Both game cards gated as "Coming soon"; Word Matching fully functional.

## Cycles closed this session

- **cycle-11** — CI coverage root-cause fix (Python 3.14 alignment). COMPLETE.
- **cycle-12** — M7 Word Builder backend. COMPLETE. Closed M3's last criterion in the process.
- **cycle-13** — M7 Word Builder frontend. COMPLETE — PAT outcome "ship + gate."
- **cycle-14** — Gate Word Builder card as "Coming soon" (PAT response). COMPLETE.

## PAT outcome → cycle-15 direction (captured, not yet planned)

PAT on cycle-13 surfaced a challenge-model ambiguity: English morphology is generative, so many challenges have multiple valid English answers that the current single-correct-pattern model treats as wrong (e.g., tapping `-S` on PAINT builds PAINTS, a real word, but challenge marked `-ED` correct).

**Product direction (approved in-session):**
- Word Builder redesign uses a **spoken clue** per challenge (e.g., "a person who paints" → -ER)
- Couples with **M8 Phonetics** — tapping the clue speaks it aloud so pre-readers can play
- **Cycle-15 scope:** useSpeech hook + Word Builder redesign + Match Round tap-to-hear + placeholder "Listening Practice" card on Home
- **Cycle-16 (later):** Listening Practice new game mode (after `/add:spec` + `/add:ux`)
- **Approved L1 clue table captured in `.add/cycle-15-direction.md`**

## ➡ Next steps (for when you return)

1. **Invoke `/add:cycle --plan`** when ready to plan cycle-15. Pre-answered cycle-questions captured in `.add/cycle-15-direction.md` to shorten the interview.
2. **Alternative:** invoke `/add:spec specs/listening-practice.md` first if you want to spec the Listening Practice game now so cycle-15 can include it.
3. **Declare `/add:away` for cycle-15 execution** — estimated ~10-16h for the combined Word Builder redesign + M8 TTS + Match Round audio. Away mode matches the shape well (similar to cycle-12 + cycle-13).

## Milestones state

- **M1-M6:** COMPLETE
- **M3:** COMPLETE (closed this session — 7/7 success criteria, including staging-deploy-without-reset validated by cycle-12 migration)
- **M7 Word Builder:** IN_PROGRESS. Backend VERIFIED (cycle-12). Frontend built + shipped but gated (cycle-13 + cycle-14). Redesign planned for cycle-15.
- **M8 Audio & Pronunciation:** PLANNED → will be delivered in cycle-15 alongside the Word Builder redesign.

## Config state
- `planning.current_milestone`: `M7-word-builder`
- `planning.current_cycle`: `null` (both cycle-13 + cycle-14 closed; cycle-15 not yet planned)
- `cycle_history`: 9, 11, 12, 13, 14 appended

## Known stubs / deferred

- **Level-up modal detection** — LevelUpModal is built + wired in cycle-13; pre/post-round progress diff is a no-op stub. Cycle-15 or later can consume the backend `unlocked` flag.
- **L2 + L3 Word Builder seed** — deferred until after cycle-15's clue redesign.
- **Listening Practice spec + UX artifact** — prerequisite for cycle-16.
- **Configurable TTS rate / voice** — future parent-settings polish.
- **`.add/learnings.md` → JSON migration** — retro action item deferred now for 3rd time. Should be promoted above a cycle soon.

## Open learnings from this session (summarized)

- **PAT-gated cycle closure worked well.** Cycle-13's two-stage close (agent-done + human-PAT) cleanly separated shipping from design validation. Worth keeping as a Beta pattern for user-facing feature cycles.
- **Product-design issues should close as cycle success, not failure.** Cycle-13 delivered per spec; spec needed revision. Closing cycle-13 as COMPLETE + opening cycle-15 is the right framing — not "cycle-13 failed."
- **English morphology lesson.** Any pattern-matching game built on verb/adjective/noun forms must handle generative morphology explicitly (clue-based, multi-correct, or curated). Worth promoting to `~/.claude/add/library.md` at next retro.
- **Cycle-15's coupling of M7 + M8.** When two planned milestones turn out to share infrastructure (Web Speech API), combining them is often better than sequencing them. Watch for this pattern on future dependencies.
