import { useCallback, useState } from "react";
import { postWordBuilderResult } from "../api/client";
import type { Challenge, PatternStarUpdate } from "../types";

const DEBOUNCE_MS = 300;
// Total dwell on a correct tap: ~200ms slide + ~300ms glow/bounce + 2000ms
// definition fade — then advance. Matches specs/ux/word-builder-ux.md timing.
const ADVANCE_DELAY_MS = 2400;
const WRONG_RESET_MS = 600;

export interface PatternResult {
  pattern_id: string;
  pattern_text: string;
  starUpdate: PatternStarUpdate | null;
}

interface RoundState {
  currentIndex: number;
  challenges: Challenge[];
  isCorrect: boolean | null;
  selectedPatternId: string | null;
  attemptNumber: number;
  isComplete: boolean;
  lastTapTime: number;
  patternResults: PatternResult[];
}

export function useBuildRound(challenges: Challenge[]) {
  const [state, setState] = useState<RoundState>(() => ({
    currentIndex: 0,
    challenges,
    isCorrect: null,
    selectedPatternId: null,
    attemptNumber: 1,
    isComplete: challenges.length === 0,
    lastTapTime: 0,
    patternResults: [],
  }));

  const currentChallenge = state.challenges[state.currentIndex] ?? null;

  const handleSelect = useCallback(
    async (patternId: string) => {
      const now = Date.now();
      if (now - state.lastTapTime < DEBOUNCE_MS) return;
      if (state.isCorrect === true) return;
      if (!currentChallenge) return;

      const correct = patternId === currentChallenge.correct_pattern.id;

      setState((prev) => ({
        ...prev,
        isCorrect: correct,
        selectedPatternId: patternId,
        lastTapTime: now,
        attemptNumber: correct ? prev.attemptNumber : prev.attemptNumber + 1,
      }));

      let starUpdate: PatternStarUpdate | null = null;
      try {
        const result = await postWordBuilderResult({
          pattern_id: correct
            ? currentChallenge.correct_pattern.id
            : patternId,
          is_correct: correct,
          attempt_number: state.attemptNumber,
        });
        if (correct && result.star_update) {
          starUpdate = result.star_update;
        }
      } catch {
        // API failure doesn't block the round
      }

      if (correct) {
        const patternResult: PatternResult = {
          pattern_id: currentChallenge.correct_pattern.id,
          pattern_text: currentChallenge.correct_pattern.text,
          starUpdate,
        };

        setTimeout(() => {
          setState((prev) => {
            const nextIndex = prev.currentIndex + 1;
            const updatedResults = [...prev.patternResults, patternResult];
            if (nextIndex >= prev.challenges.length) {
              return {
                ...prev,
                isComplete: true,
                patternResults: updatedResults,
                isCorrect: null,
                selectedPatternId: null,
                attemptNumber: 1,
              };
            }
            return {
              ...prev,
              currentIndex: nextIndex,
              isCorrect: null,
              selectedPatternId: null,
              attemptNumber: 1,
              patternResults: updatedResults,
            };
          });
        }, ADVANCE_DELAY_MS);
      } else {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isCorrect: null,
            selectedPatternId: null,
          }));
        }, WRONG_RESET_MS);
      }
    },
    [currentChallenge, state.attemptNumber, state.isCorrect, state.lastTapTime],
  );

  return {
    currentChallenge,
    isCorrect: state.isCorrect,
    selectedPatternId: state.selectedPatternId,
    isComplete: state.isComplete,
    progress: {
      current: state.currentIndex + 1,
      total: state.challenges.length,
    },
    patternResults: state.patternResults,
    handleSelect,
  };
}
