# Session Handoff
**Written:** 2026-04-18 (cycle-15 agent-done; PAT pending)

## Completed this session (away mode, ~1h used of 12h budget)

### Primary: cycle-15 Word Builder clue redesign + M8 Phonetics — AGENT_DONE
- PR #21 squash-merged as `bb6b9e0`
- 14 files changed, +669 / −81 lines
- 9 new Vitest tests (+useSpeech); total 98/98 pass; backend 81/81 pass
- Lint + types clean; CI green across 3 consecutive runs (stability gate)

### Shipped
- **`useSpeech` hook** — Web Speech API wrapper; iOS warm-up; kid-friendly rate/pitch/lang
- **Word Builder clue redesign** — clue sentence above base word, auto-plays on challenge load, tap to re-hear
- **Word Builder un-gated** — WordBuilderCard clickable again; cycle-14's "Coming soon" reverted
- **Match Round tap-to-hear** — target word + image cards speak (M8 feature proper)
- **Listening Practice card** — renamed from Word Phonetics; stays "Coming soon" placeholder
- **Seed clue audit** — 28 L1 combos updated to approved pattern-disciplined wording (FISH+-S dropped; idempotent seed auto-removed on staging)
- **Specs updated** — word-builder.md v0.3.0, word-builder-ux.md v1.1, word-pronunciation.md → Implementing

### Staging verified at `bb6b9e0`
- `/api/health` healthy, DB 54.8ms, fresh uptime
- `/api/word-builder/round?count=3` returns new clue wording: "a person who plays", "playing right now", "more than one dog"
- JS bundle: "Listening Practice" × 2, "Hear the clue" × 1, zero "Word Phonetics" references

## ➡ PAT CHECKLIST (for you on iPad at https://kids-words.staging.calebdunn.tech/)

1. [ ] Home shows Word Builder card **clickable** (not "Coming soon")
2. [ ] Home shows "Listening Practice — Coming soon" (renamed from Word Phonetics)
3. [ ] Tap Word Builder card → Length Picker with 5/10/20 options
4. [ ] Pick 5 → Build Screen renders with **clue sentence above base word**
5. [ ] Clue **auto-plays** on load (iOS Safari: may need one initial tap anywhere to warm up)
6. [ ] Tap the clue button → hear it re-spoken
7. [ ] Pattern tiles still work: correct = slide + glow; wrong = shake + bounce back
8. [ ] Play a 5-word round — verify each clue unambiguously points to one pattern (the cycle-13 PAT regression test)
9. [ ] Complete the round → Round Complete shows per-pattern stars
10. [ ] Tap "Play Again" → returns to Length Picker (not direct replay)
11. [ ] Return Home → tap Animals → in Match Round, tap the target word at top → hear it spoken
12. [ ] Tap any image card in Match Round → hear the word; matching logic still fires correctly
13. [ ] Toggle dark mode → clue button, speaker icon, Match Round word button render cleanly

**If PAT passes:** run `/add:cycle --complete` to write the learnings checkpoint, update M7 + M8 hill charts, and append to `cycle_history`. Likely candidate to close M7 + M8 both if all criteria met.

**If PAT reveals clue-wording issues:** clue text lives in `backend/app/seed_word_builder.py` — 5-minute edit + re-deploy via idempotent seed. Much smaller than a full cycle.

**If PAT reveals deeper UX issues:** log for cycle-16 (which was already planned for Listening Practice anyway).

## Config state
- `planning.current_milestone`: `M7-word-builder`
- `planning.current_cycle`: `cycle-15` (stays IN_PROGRESS until PAT; `/add:cycle --complete` will set to null)
- `cycle_history`: 9, 11, 12, 13, 14 — cycle-15 appends on formal close

## Milestones
- **M1-M6, M3:** COMPLETE
- **M7 Word Builder:** IN_PROGRESS — backend VERIFIED cycle-12; frontend+clue redesign shipped cycle-15; awaits PAT
- **M8 Audio & Pronunciation:** IN_PROGRESS — shipped alongside cycle-15 via useSpeech + Match Round audio + Word Builder clue; awaits PAT

## Deferred (for cycle-16 and beyond)
- Listening Practice game (needs `/add:spec` + `/add:ux` first)
- L2 + L3 Word Builder seed expansion
- Full Word Builder E2E Playwright (happy path, wrong-tap, level-up)
- iPad Capacitor build verification
- Configurable TTS rate / voice selection
- `learnings.md` → JSON migration (3rd retro action-item deferral; due for promotion above a cycle)

## Known stubs still in code
- Level-up modal detection (LevelUpModal renders when triggered but the pre/post-round progress diff is still a no-op; backend `unlocked` flag ready to consume when needed)
