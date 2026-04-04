import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { mockWords } from "../../test/mocks";
import { useRound } from "../useRound";

vi.mock("../../api/client", () => ({
  postResult: vi.fn().mockResolvedValue({ id: "r1", recorded: true }),
}));

describe("useRound", () => {
  it("initializes with first word and options", () => {
    const { result } = renderHook(() => useRound(mockWords.slice(0, 3)));

    expect(result.current.currentWord).toBeTruthy();
    expect(result.current.options.length).toBeGreaterThanOrEqual(2);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isCorrect).toBeNull();
    expect(result.current.progress.current).toBe(1);
    expect(result.current.progress.total).toBe(3);
  });

  it("marks correct answer", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useRound(mockWords.slice(0, 3)));

    const correctWord = result.current.currentWord!;

    await act(async () => {
      await result.current.handleSelect(correctWord);
    });

    expect(result.current.isCorrect).toBe(true);
    vi.useRealTimers();
  });

  it("marks incorrect answer", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useRound(mockWords.slice(0, 3)));

    const currentWord = result.current.currentWord!;
    const wrongWord = result.current.options.find(
      (o) => o.id !== currentWord.id,
    )!;

    await act(async () => {
      await result.current.handleSelect(wrongWord);
    });

    expect(result.current.isCorrect).toBe(false);
    vi.useRealTimers();
  });

  it("advances after correct answer", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useRound(mockWords.slice(0, 3)));

    const firstWord = result.current.currentWord!;

    await act(async () => {
      await result.current.handleSelect(firstWord);
    });

    // Advance past the 1200ms delay
    await act(async () => {
      vi.advanceTimersByTime(1300);
    });

    expect(result.current.progress.current).toBe(2);
    expect(result.current.currentWord?.id).not.toBe(firstWord.id);
    vi.useRealTimers();
  });

  it("completes round after all words answered", async () => {
    vi.useFakeTimers();
    const words = mockWords.slice(0, 2); // only 2 words
    const { result } = renderHook(() => useRound(words));

    // Answer word 1
    await act(async () => {
      await result.current.handleSelect(result.current.currentWord!);
    });
    await act(async () => {
      vi.advanceTimersByTime(1300);
    });

    // Answer word 2
    await act(async () => {
      await result.current.handleSelect(result.current.currentWord!);
    });
    await act(async () => {
      vi.advanceTimersByTime(1300);
    });

    expect(result.current.isComplete).toBe(true);
    vi.useRealTimers();
  });

  it("handles empty words array", () => {
    const { result } = renderHook(() => useRound([]));
    expect(result.current.currentWord).toBeNull();
    expect(result.current.options).toEqual([]);
    expect(result.current.isComplete).toBe(false);
  });
});
