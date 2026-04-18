# Spec: Word Pronunciation (Tap to Hear)

**Version:** 0.2.0
**Created:** 2026-04-07
**Updated:** 2026-04-18 (cycle-15: implemented via `useSpeech` hook)
**PRD Reference:** docs/prd.md — Audio/pronunciation (v2)
**Milestone:** M8 — Audio & Pronunciation
**Status:** Implementing (PAT pending)
**Implemented via:** `frontend/src/hooks/useSpeech.ts` (shared infrastructure) + Match Round word+image tap-to-hear + Word Builder clue tap-to-hear

## 1. Overview

Tap any word or image during gameplay to hear it spoken aloud using the Web Speech API. Slower rate and friendly pitch tuned for children. Works in word matching, word builder, word list, and round complete screens. No audio files — uses the browser's built-in text-to-speech engine. Zero hosting cost, works offline on iOS.

### User Story

As a child (4-6), I want to tap a word and hear how it sounds, so that I learn to connect written words with spoken language.

## 2. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| AC-001 | Tapping a word in any screen speaks it aloud via Web Speech API | Must |
| AC-002 | Speech rate is slower than default (~0.8) for child-friendly pacing | Must |
| AC-003 | Speech pitch is slightly higher (~1.1) for a friendlier tone | Should |
| AC-004 | Small speaker icon visible on tappable words (affordance) | Must |
| AC-005 | Works during word matching round (tap word at top to hear it) | Must |
| AC-006 | Works in word list view (tap any word card to hear it) | Must |
| AC-007 | Works on round complete screen (tap word in summary) | Should |
| AC-008 | Works in word builder (hear base word, hear completed word) | Should |
| AC-009 | Does not interrupt gameplay — speaking doesn't block tapping answers | Must |
| AC-010 | Auto-speak the word when it first appears in a round (optional, toggleable) | Nice |
| AC-011 | Graceful fallback if speechSynthesis unavailable (no error, just no sound) | Must |
| AC-012 | Works on iPad Safari and Chrome | Must |

## 3. User Test Cases

### TC-001: Tap Word During Matching

**Precondition:** Word matching round active, "CAT" displayed at top
**Steps:**
1. Tap the word "CAT" at the top
2. Speaker icon pulses
3. Device speaks "cat" aloud
4. Game continues — not interrupted
**Expected Result:** Word spoken, no gameplay disruption
**Maps to:** TBD

### TC-002: Tap Word in Word List

**Precondition:** Viewing Animals word list
**Steps:**
1. Tap "ELEPHANT" word card
2. Device speaks "elephant"
**Expected Result:** Word spoken on tap
**Maps to:** TBD

### TC-003: No Speech API Available

**Precondition:** Browser without speechSynthesis support
**Steps:**
1. Tap a word
2. Nothing happens (no error, no crash)
**Expected Result:** Silent graceful degradation
**Maps to:** TBD

## 4. Data Model

No database changes. Uses browser Web Speech API only.

## 5. API Contract

No backend changes. Entirely client-side.

## 6. UI Behavior

### Speaker Affordance
- Small speaker/volume icon next to or overlaying tappable words
- Icon uses existing SVG sprite (`icon-volume` already exists)
- Subtle, doesn't clutter — appears on hover/focus or as a small badge

### Speaking State
- While speaking: icon pulses or animates
- Speaking cancels previous utterance (no overlap)
- `speechSynthesis.cancel()` before each new `speak()`

### Integration Points
- **MatchRound**: word text at top is tappable (already large, just add click handler)
- **WordList**: word cards are tappable (add click handler to card)
- **RoundComplete**: word summary items are tappable
- **WordBuilder** (M7): base word and completed word are tappable

### Implementation
```typescript
// hooks/useSpeech.ts
export function useSpeech() {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}
```

## 7. Edge Cases

| Case | Expected Behavior |
|------|-------------------|
| speechSynthesis not available | Silent no-op, no error |
| Rapid tapping multiple words | Cancel previous, speak latest |
| Speaking while navigating away | Cancel on unmount |
| iOS Safari requires user gesture | First tap triggers audio context — subsequent taps work |
| Very long words (e.g., "CATERPILLAR") | Speak at same rate, may take longer |
| Words with unusual pronunciation | Web Speech API handles most English words well |

## 8. Dependencies

- No backend changes
- No new dependencies (Web Speech API is built-in)
- SVG volume icon already in sprite
- Works with existing word matching + future word builder

## 9. Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-04-07 | 0.1.0 | calebdunn | Initial spec |
