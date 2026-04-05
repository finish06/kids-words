import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { WordList } from "../WordList";

vi.mock("../../api/client", () => ({
  getCategoryProgress: vi.fn(),
}));

import { getCategoryProgress } from "../../api/client";
const mockGetCategoryProgress = vi.mocked(getCategoryProgress);

function renderWithRoute(slug = "animals") {
  return render(
    <MemoryRouter initialEntries={[`/words/${slug}`]}>
      <Routes>
        <Route path="/words/:slug" element={<WordList />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("WordList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockGetCategoryProgress.mockReturnValue(new Promise(() => {}));
    renderWithRoute();
    expect(screen.getByText("Loading words...")).toBeInTheDocument();
  });

  it("renders words with stars", async () => {
    mockGetCategoryProgress.mockResolvedValue({
      category: { id: "c1", name: "Animals", slug: "animals" },
      words: [
        {
          word_id: "w1",
          word_text: "CAT",
          image_url: "https://example.com/cat.png",
          category_slug: "animals",
          first_attempt_correct_count: 4,
          star_level: 2,
          mastered_at: null,
        },
        {
          word_id: "w2",
          word_text: "DOG",
          image_url: "https://example.com/dog.png",
          category_slug: "animals",
          first_attempt_correct_count: 0,
          star_level: 0,
          mastered_at: null,
        },
      ],
      summary: { total_words: 2, mastered: 0, mastery_percentage: 0 },
    });
    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("CAT")).toBeInTheDocument();
    });
    expect(screen.getByText("DOG")).toBeInTheDocument();
    expect(screen.getByText("Animals Words")).toBeInTheDocument();
    expect(screen.getByText("0/2 mastered")).toBeInTheDocument();
  });

  it("renders color circles for color:// URLs", async () => {
    mockGetCategoryProgress.mockResolvedValue({
      category: { id: "c2", name: "Colors", slug: "colors" },
      words: [
        {
          word_id: "w1",
          word_text: "RED",
          image_url: "color://#ef4444",
          category_slug: "colors",
          first_attempt_correct_count: 0,
          star_level: 0,
          mastered_at: null,
        },
      ],
      summary: { total_words: 1, mastered: 0, mastery_percentage: 0 },
    });
    renderWithRoute("colors");

    await waitFor(() => {
      expect(screen.getByText("RED")).toBeInTheDocument();
    });
    const circle = document.querySelector(".color-circle");
    expect(circle).toBeTruthy();
  });
});
