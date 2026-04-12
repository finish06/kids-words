# M8 — Audio & Pronunciation

**Goal:** Add audio cues for words and images using the Web Speech API. Children can tap any word or image to hear it spoken, reinforcing the link between written and spoken language.
**Appetite:** 2-3 days
**Status:** PLANNED
**Created:** 2026-04-12 (retro — broke out from word-pronunciation spec which had referenced an undefined M8)
**Target Maturity:** Beta

## Hill Chart

```
Tap-to-Hear (Web Speech API)  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  0% — spec exists, implementation not started
```

## Features

| Feature | Spec | Position | Notes |
|---------|------|----------|-------|
| Word Pronunciation | specs/word-pronunciation.md | SPECCED | Tap word/image → SpeechSynthesis playback. Zero hosting cost, works offline on iOS. |

## Success Criteria

- [ ] Tapping a word in Match Round speaks it aloud
- [ ] Tapping an image card in Match Round speaks the matching word
- [ ] Speech rate tuned slower for children (~0.85)
- [ ] Speech pitch tuned warm/friendly for children
- [ ] Works in Word Builder mode (when M7 ships)
- [ ] Works in Word List screen
- [ ] Works on iOS Capacitor build
- [ ] No external audio assets (uses browser SpeechSynthesis only)
- [ ] Tested on Safari, Chrome, and iPad Safari

## Cycle Tracking

| Cycle | Features | Status | Notes |
|-------|----------|--------|-------|
| (none yet) | | | |

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| iOS Web Speech requires user gesture before first speak() call | High | Medium | Trigger a silent warm-up speak("") on first user interaction |
| Voice quality varies by device/OS | Medium | Low | Accept platform default voices; document the variance |
| Speech queue accumulates if user taps rapidly | Medium | Low | Cancel pending speech before queueing new |

## Notes

- Created during 2026-04-12 retro to resolve the orphaned `specs/word-pronunciation.md` reference
- Depends on PRD section "Audio/pronunciation (v2)" which is part of the post-MVP roadmap
- No backend changes — pure frontend feature
