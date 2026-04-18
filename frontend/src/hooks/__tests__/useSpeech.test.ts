import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSpeech } from "../useSpeech";

interface MockUtterance {
  text: string;
  lang: string;
  rate: number;
  pitch: number;
  onend: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
}

const mockSpeak = vi.fn((utterance: MockUtterance) => {
  // Synchronously fire onend so speak() resolves for tests
  setTimeout(() => utterance.onend?.({}), 0);
});
const mockCancel = vi.fn();

const UtteranceConstructor = vi.fn(
  function (this: MockUtterance, text: string) {
    this.text = text;
    this.lang = "";
    this.rate = 1;
    this.pitch = 1;
    this.onend = null;
    this.onerror = null;
  } as unknown as { new (text: string): MockUtterance },
);

describe("useSpeech", () => {
  beforeEach(() => {
    mockSpeak.mockClear();
    mockCancel.mockClear();
    UtteranceConstructor.mockClear();
    (globalThis as unknown as { speechSynthesis: unknown }).speechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
      speaking: false,
      pending: false,
      paused: false,
    };
    (globalThis as unknown as {
      SpeechSynthesisUtterance: unknown;
    }).SpeechSynthesisUtterance = UtteranceConstructor;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("isSupported is true when speechSynthesis is available", () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.isSupported).toBe(true);
  });

  it("isSupported is false when speechSynthesis is missing", () => {
    delete (globalThis as { speechSynthesis?: unknown }).speechSynthesis;
    const { result } = renderHook(() => useSpeech());
    expect(result.current.isSupported).toBe(false);
  });

  it("speak creates an utterance with lang en-US and kid-friendly rate/pitch", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSpeech());

    const promise = result.current.speak("a person who paints");
    await vi.runAllTimersAsync();
    await promise;

    expect(UtteranceConstructor).toHaveBeenCalledWith("a person who paints");
    expect(mockSpeak).toHaveBeenCalledTimes(1);
    const utterance = mockSpeak.mock.calls[0][0];
    expect(utterance.lang).toBe("en-US");
    expect(utterance.rate).toBe(0.85);
    expect(utterance.pitch).toBe(1.1);
  });

  it("speak cancels any pending speech before queueing a new utterance", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSpeech());

    result.current.speak("first");
    result.current.speak("second");
    await vi.runAllTimersAsync();

    // Cancel should have been called before each speak() to clear prior queue
    expect(mockCancel).toHaveBeenCalled();
    // Both utterances should have been speak'd
    expect(mockSpeak).toHaveBeenCalledTimes(2);
    expect(mockSpeak.mock.calls[1][0].text).toBe("second");
  });

  it("cancel clears any in-flight speech", () => {
    const { result } = renderHook(() => useSpeech());
    result.current.cancel();
    expect(mockCancel).toHaveBeenCalled();
  });

  it("warmUp triggers a silent speak to satisfy iOS first-gesture requirement", () => {
    const { result } = renderHook(() => useSpeech());
    result.current.warmUp();
    // Warm-up uses a silent empty utterance
    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(UtteranceConstructor).toHaveBeenCalledWith("");
  });

  it("warmUp is idempotent — calling it multiple times only warms up once", () => {
    const { result } = renderHook(() => useSpeech());
    result.current.warmUp();
    result.current.warmUp();
    result.current.warmUp();
    // Only the first call actually speaks
    expect(mockSpeak).toHaveBeenCalledTimes(1);
  });

  it("speak resolves when the utterance ends", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useSpeech());

    let resolved = false;
    const promise = result.current.speak("hello").then(() => {
      resolved = true;
    });
    await vi.runAllTimersAsync();
    await promise;

    expect(resolved).toBe(true);
  });

  it("speak is a no-op and resolves immediately when not supported", async () => {
    delete (globalThis as { speechSynthesis?: unknown }).speechSynthesis;
    const { result } = renderHook(() => useSpeech());

    await expect(result.current.speak("anything")).resolves.toBeUndefined();
    expect(mockSpeak).not.toHaveBeenCalled();
  });
});
