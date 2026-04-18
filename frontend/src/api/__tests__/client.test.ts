import { describe, expect, it, vi } from "vitest";
import {
  getActiveProfileId,
  getCategories,
  getCategoryProgress,
  getCategoryWords,
  getProfiles,
  getWordBuilderProgress,
  getWordBuilderRound,
  postResult,
  postWordBuilderResult,
  setActiveProfile,
  setupPin,
  verifyPin,
} from "../client";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("API client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActiveProfile(null);
  });

  it("getCategories fetches from /api/categories", async () => {
    const data = { categories: [{ id: "1", name: "Animals" }] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await getCategories();
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/categories"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("getCategoryWords fetches words for a slug", async () => {
    const data = { category: { id: "1" }, words: [] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await getCategoryWords("animals");
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/categories/animals/words"),
      expect.anything(),
    );
  });

  it("postResult sends POST to /api/results", async () => {
    const responseData = { id: "r1", recorded: true };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseData),
    });

    const result = await postResult({
      word_id: "w1",
      selected_word_id: "w1",
      is_correct: true,
      attempt_number: 1,
    });

    expect(result).toEqual(responseData);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/results"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(getCategories()).rejects.toThrow("API error: 404 Not Found");
  });

  it("setActiveProfile sets X-Profile-ID header", async () => {
    setActiveProfile("profile-123");
    expect(getActiveProfileId()).toBe("profile-123");

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ categories: [] }),
    });

    await getCategories();
    expect(mockFetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Profile-ID": "profile-123",
        }),
      }),
    );
  });

  it("getProfiles fetches profiles", async () => {
    const data = { profiles: [], pin_set: false, max_profiles: 3 };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await getProfiles();
    expect(result).toEqual(data);
  });

  it("setupPin sends POST", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "ok" }),
    });

    await setupPin("1234");
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/profiles/setup"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("verifyPin returns true on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ verified: true }),
    });

    expect(await verifyPin("1234")).toBe(true);
  });

  it("verifyPin returns false on failure", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    expect(await verifyPin("9999")).toBe(false);
  });

  it("getCategoryProgress fetches progress", async () => {
    const data = {
      category: { id: "1" },
      words: [],
      summary: { total_words: 0, mastered: 0, mastery_percentage: 0 },
    };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await getCategoryProgress("animals");
    expect(result).toEqual(data);
  });

  // Word Builder (M7)

  it("getWordBuilderRound fetches /api/word-builder/round with count", async () => {
    const data = { level: 1, challenges: [] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await getWordBuilderRound(5);
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/word-builder/round?count=5"),
      expect.anything(),
    );
  });

  it("getWordBuilderRound includes level param when provided", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ level: 2, challenges: [] }),
    });

    await getWordBuilderRound(10, 2);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/count=10.*level=2|level=2.*count=10/),
      expect.anything(),
    );
  });

  it("postWordBuilderResult sends POST with attempt body", async () => {
    const data = {
      id: "r1",
      recorded: true,
      responded_at: "2026-04-18T00:00:00Z",
      star_update: null,
    };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await postWordBuilderResult({
      pattern_id: "p-re",
      is_correct: true,
      attempt_number: 1,
    });

    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/word-builder/results"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("getWordBuilderProgress fetches /api/word-builder/progress", async () => {
    const data = { levels: [] };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const result = await getWordBuilderProgress();
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/word-builder/progress"),
      expect.anything(),
    );
  });
});
