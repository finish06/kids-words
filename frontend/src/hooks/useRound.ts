import { useCallback, useState } from "react";
import { postResult } from "../api/client";
import type { StarUpdate, Word } from "../types";

interface RoundState {
  currentIndex: number;
  words: Word[];
  options: Word[];
  isCorrect: boolean | null;
  selectedId: string | null;
  attemptNumber: number;
  isComplete: boolean;
  lastTapTime: number;
  wordResults: WordResult[];
}

const DEBOUNCE_MS = 300;
const OPTIONS_COUNT = 3;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickOptions(
  words: Word[],
  currentWord: Word,
  count: number,
): Word[] {
  const others = words.filter((w) => w.id !== currentWord.id);
  const distractors = shuffle(others).slice(0, count - 1);
  return shuffle([currentWord, ...distractors]);
}

export interface WordResult {
  text: string;
  starUpdate: StarUpdate | null;
}

export function useRound(words: Word[]) {
  const [state, setState] = useState<RoundState>(() => {
    const shuffled = shuffle(words);
    return {
      currentIndex: 0,
      words: shuffled,
      options: shuffled.length > 0
        ? pickOptions(shuffled, shuffled[0], OPTIONS_COUNT)
        : [],
      isCorrect: null,
      selectedId: null,
      attemptNumber: 1,
      isComplete: false,
      lastTapTime: 0,
      wordResults: [],
    };
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

      let starUpdate: StarUpdate | null = null;
      if (currentWord) {
        try {
          const result = await postResult({
            word_id: currentWord.id,
            selected_word_id: selectedWord.id,
            is_correct: correct,
            attempt_number: state.attemptNumber,
          });
          if (correct && result.star_update) {
            starUpdate = result.star_update;
          }
        } catch {
          // API failure doesn't block the round
        }
      }

      if (correct) {
        const wordResult: WordResult = {
          text: currentWord?.text ?? "",
          starUpdate,
        };

        setTimeout(() => {
          setState((prev) => {
            const nextIndex = prev.currentIndex + 1;
            const updatedResults = [...prev.wordResults, wordResult];
            if (nextIndex >= prev.words.length) {
              return { ...prev, isComplete: true, wordResults: updatedResults };
            }
            const nextWord = prev.words[nextIndex];
            return {
              ...prev,
              currentIndex: nextIndex,
              options: pickOptions(prev.words, nextWord, OPTIONS_COUNT),
              isCorrect: null,
              selectedId: null,
              attemptNumber: 1,
              wordResults: updatedResults,
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
    wordResults: state.wordResults,
    handleSelect,
  };
}
