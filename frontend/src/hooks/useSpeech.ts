import { useCallback, useMemo, useRef } from "react";

/**
 * Web Speech API wrapper for Word Builder clues + Match Round audio (M8).
 *
 * iOS Safari requires a user gesture before speechSynthesis.speak() will
 * play. `warmUp()` speaks a silent utterance on the first call to satisfy
 * this. Attach it to a one-time document-level tap listener.
 *
 * Kid-friendly defaults: rate 0.85 (slower than natural), pitch 1.1 (warm),
 * lang explicit "en-US" (avoids non-English default voice on localized
 * browsers).
 */
export function useSpeech() {
  const warmedUpRef = useRef(false);

  const isSupported = useMemo(
    () =>
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof SpeechSynthesisUtterance !== "undefined",
    [],
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
  }, [isSupported]);

  const speak = useCallback(
    (text: string): Promise<void> => {
      if (!isSupported) return Promise.resolve();
      // Cancel any pending/speaking utterance so rapid taps don't queue up
      window.speechSynthesis.cancel();

      return new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.85;
        utterance.pitch = 1.1;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    },
    [isSupported],
  );

  const warmUp = useCallback(() => {
    if (!isSupported) return;
    if (warmedUpRef.current) return;
    warmedUpRef.current = true;
    const utterance = new SpeechSynthesisUtterance("");
    utterance.lang = "en-US";
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  return { isSupported, speak, cancel, warmUp };
}
