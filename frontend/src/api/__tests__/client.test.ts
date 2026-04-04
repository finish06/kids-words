import { describe, expect, it, vi } from "vitest";
import { getCategories, getCategoryWords, postResult } from "../client";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("API client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("getCategoryWords fetches from /api/categories/{slug}/words", async () => {
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
});
