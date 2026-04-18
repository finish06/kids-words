import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Challenge } from "../../types";
import { useBuildRound } from "../useBuildRound";

vi.mock("../../api/client", () => ({
  postWordBuilderResult: vi
    .fn()
    .mockResolvedValue({
      id: "r1",
      recorded: true,
      responded_at: "2026-04-18T00:00:00Z",
      star_update: null,
    }),
}));

function buildChallenge(
  basePattern: string,
  options: { id: string; text: string; type: "prefix" | "suffix" }[],
  correctIndex = 0,
): Challenge {
  return {
    base_word: basePattern,
    correct_pattern: options[correctIndex],
    options,
    result_word: `${options[correctIndex].text}${basePattern}`,
    definition: "test definition",
  };
}

const sampleChallenges: Challenge[] = [
  buildChallenge("PLAY", [
    { id: "p-re", text: "RE-", type: "prefix" },
    { id: "p-un", text: "UN-", type: "prefix" },
    { id: "p-ing", text: "-ING", type: "suffix" },
  ]),
  buildChallenge("HAPPY", [
    { id: "p-un", text: "UN-", type: "prefix" },
    { id: "p-ing", text: "-ING", type: "suffix" },
  ]),
  buildChallenge(
    "RUN",
    [
      { id: "p-ing", text: "-ING", type: "suffix" },
      { id: "p-re", text: "RE-", type: "prefix" },
    ],
    0,
  ),
];

describe("useBuildRound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with the first challenge", () => {
    const { result } = renderHook(() => useBuildRound(sampleChallenges));
    expect(result.current.currentChallenge?.base_word).toBe("PLAY");
    expect(result.current.progress.current).toBe(1);
    expect(result.current.progress.total).toBe(3);
    expect(result.current.isComplete).toBe(false);
    expect(result.current.isCorrect).toBeNull();
  });

  it("marks correct tap as correct", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBuildRound(sampleChallenges));
    const correctId = result.current.currentChallenge!.correct_pattern.id;

    await act(async () => {
      await result.current.handleSelect(correctId);
    });

    expect(result.current.isCorrect).toBe(true);
    vi.useRealTimers();
  });

  it("marks wrong tap as incorrect and does not advance", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBuildRound(sampleChallenges));
    const wrong = result.current.currentChallenge!.options.find(
      (o) => o.id !== result.current.currentChallenge!.correct_pattern.id,
    )!;

    await act(async () => {
      await result.current.handleSelect(wrong.id);
    });

    expect(result.current.isCorrect).toBe(false);
    expect(result.current.progress.current).toBe(1);
    vi.useRealTimers();
  });

  it("advances after correct tap following the definition dwell", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBuildRound(sampleChallenges));
    const correctId = result.current.currentChallenge!.correct_pattern.id;

    await act(async () => {
      await result.current.handleSelect(correctId);
    });

    // Advance past the 2400ms dwell (snap + glow + 2s definition)
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    expect(result.current.progress.current).toBe(2);
    expect(result.current.currentChallenge?.base_word).toBe("HAPPY");
    expect(result.current.isCorrect).toBeNull();
    vi.useRealTimers();
  });

  it("completes the round after the final challenge", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useBuildRound(sampleChallenges.slice(0, 2)),
    );

    // Correct tap on challenge 1
    await act(async () => {
      await result.current.handleSelect(
        result.current.currentChallenge!.correct_pattern.id,
      );
    });
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    // Correct tap on challenge 2
    await act(async () => {
      await result.current.handleSelect(
        result.current.currentChallenge!.correct_pattern.id,
      );
    });
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    expect(result.current.isComplete).toBe(true);
    vi.useRealTimers();
  });

  it("accumulates pattern stars across a round", async () => {
    vi.useFakeTimers();
    const postWordBuilderResult = (
      await import("../../api/client")
    ).postWordBuilderResult as ReturnType<typeof vi.fn>;
    postWordBuilderResult.mockResolvedValue({
      id: "r1",
      recorded: true,
      responded_at: "2026-04-18T00:00:00Z",
      star_update: {
        pattern_id: "p-re",
        new_count: 2,
        new_star_level: 1,
        just_mastered: false,
      },
    });

    const { result } = renderHook(() => useBuildRound(sampleChallenges));
    await act(async () => {
      await result.current.handleSelect(
        result.current.currentChallenge!.correct_pattern.id,
      );
    });
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    expect(result.current.patternResults.length).toBe(1);
    expect(result.current.patternResults[0].starUpdate?.new_star_level).toBe(1);
    vi.useRealTimers();
  });

  it("allows retry after a wrong tap", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBuildRound(sampleChallenges));

    const wrong = result.current.currentChallenge!.options.find(
      (o) => o.id !== result.current.currentChallenge!.correct_pattern.id,
    )!;

    await act(async () => {
      await result.current.handleSelect(wrong.id);
    });

    // After the bounce-back window, state resets
    await act(async () => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.isCorrect).toBeNull();

    // Now tap the correct one
    await act(async () => {
      await result.current.handleSelect(
        result.current.currentChallenge!.correct_pattern.id,
      );
    });
    expect(result.current.isCorrect).toBe(true);
    vi.useRealTimers();
  });

  it("handles empty challenges array as an already-complete round", () => {
    const { result } = renderHook(() => useBuildRound([]));
    expect(result.current.isComplete).toBe(true);
    expect(result.current.currentChallenge).toBeNull();
  });
});
