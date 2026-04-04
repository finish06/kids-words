import { useCallback, useMemo, useState } from "react";
import { postResult } from "../api/client";
import type { Word } from "../types";

interface RoundState {
  currentIndex: number;
  words: Word[];
  options: Word[];
  isCorrect: boolean | null;
  selectedId: string | null;
  attemptNumber: number;
  isComplete: boolean;
  lastTapTime: number;
}

const DEBOUNCE_MS = 300;
const OPTIONS_COUNT = 3;

function pickOptions(
  words: Word[],
  currentWord: Word,
  count: number,
): Word[] {
  const others = words.filter((w) => w.id !== currentWord.id);
  const shuffled = [...others].sort(() => Math.random() - 0.5);
  const distractors = shuffled.slice(0, count - 1);
  const options = [currentWord, ...distractors];
  return options.sort(() => Math.random() - 0.5);
}

export function useRound(words: Word[]) {
  const shuffledWords = useMemo(
    () => [...words].sort(() => Math.random() - 0.5),
    [words],
  );

  const [state, setState] = useState<RoundState>({
    currentIndex: 0,
    words: shuffledWords,
    options: shuffledWords.length > 0
      ? pickOptions(shuffledWords, shuffledWords[0], OPTIONS_COUNT)
      : [],
    isCorrect: null,
    selectedId: null,
    attemptNumber: 1,
    isComplete: false,
    lastTapTime: 0,
  });

  const currentWord = state.words[state.currentIndex] ?? null;

  const handleSelect = useCallback(
    async (selectedWord: Word) => {
      const now = Date.now();
      if (now - state.lastTapTime < DEBOUNCE_MS) return;
      if (state.isCorrect === true) return;

      const correct = selectedWord.id === currentWord?.id;

      setState((prev) => ({
        ...prev,
        isCorrect: correct,
        selectedId: selectedWord.id,
        lastTapTime: now,
        attemptNumber: correct ? prev.attemptNumber : prev.attemptNumber + 1,
      }));

      if (currentWord) {
        postResult({
          word_id: currentWord.id,
          selected_word_id: selectedWord.id,
          is_correct: correct,
          attempt_number: state.attemptNumber,
        }).catch(() => {
          // Silently fail — don't interrupt the child's experience
        });
      }

      if (correct) {
        setTimeout(() => {
          setState((prev) => {
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex >= prev.words.length) {
              return { ...prev, isComplete: true };
            }
            const nextWord = prev.words[nextIndex];
            return {
              ...prev,
              currentIndex: nextIndex,
              options: pickOptions(prev.words, nextWord, OPTIONS_COUNT),
              isCorrect: null,
              selectedId: null,
              attemptNumber: 1,
            };
          });
        }, 1200);
      } else {
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isCorrect: null,
            selectedId: null,
          }));
        }, 600);
      }
    },
    [currentWord, state.attemptNumber, state.isCorrect, state.lastTapTime],
  );

  return {
    currentWord,
    options: state.options,
    isCorrect: state.isCorrect,
    selectedId: state.selectedId,
    isComplete: state.isComplete,
    progress: {
      current: state.currentIndex + 1,
      total: state.words.length,
    },
    handleSelect,
  };
}
