import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { mockCategoryWordsResponse } from "../../test/mocks";
import { MatchRound } from "../MatchRound";

vi.mock("../../api/client", () => ({
  getCategoryWords: vi.fn(),
  postResult: vi.fn().mockResolvedValue({ id: "r1", recorded: true }),
}));

import { getCategoryWords } from "../../api/client";
const mockGetCategoryWords = vi.mocked(getCategoryWords);

function renderWithRoute(slug = "animals") {
  return render(
    <MemoryRouter initialEntries={[`/play/${slug}`]}>
      <Routes>
        <Route path="/play/:slug" element={<MatchRound />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MatchRound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockGetCategoryWords.mockReturnValue(new Promise(() => {}));
    renderWithRoute();
    expect(screen.getByText("Loading words...")).toBeInTheDocument();
  });

  it("shows error state on API failure", async () => {
    mockGetCategoryWords.mockRejectedValue(new Error("fail"));
    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("Oops! Let's try again.")).toBeInTheDocument();
    });
  });

  it("shows quiz length picker after loading", async () => {
    mockGetCategoryWords.mockResolvedValue(mockCategoryWordsResponse);
    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("Animals")).toBeInTheDocument();
    });
    expect(screen.getByText("How many words?")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("disables quiz length options that exceed word count", async () => {
    // 6 words — 10 and 20 should be disabled
    mockGetCategoryWords.mockResolvedValue(mockCategoryWordsResponse);
    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    expect(screen.getByText("5")).not.toBeDisabled();
    expect(screen.getByText("10")).toBeDisabled();
    expect(screen.getByText("20")).toBeDisabled();
  });

  it("starts round after picking quiz length", async () => {
    mockGetCategoryWords.mockResolvedValue(mockCategoryWordsResponse);
    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("5"));

    // Should now show a word and image grid
    await waitFor(() => {
      expect(screen.getByText("1 / 5")).toBeInTheDocument();
    });
  });

  it("navigates home when back button clicked from picker", async () => {
    mockGetCategoryWords.mockResolvedValue(mockCategoryWordsResponse);
    renderWithRoute();

    await waitFor(() => {
      expect(document.querySelector(".back-button")).toBeInTheDocument();
    });

    await userEvent.click(document.querySelector(".back-button")!);

    await waitFor(() => {
      expect(screen.getByText("Home")).toBeInTheDocument();
    });
  });

  it("shows word text and image options during round", async () => {
    mockGetCategoryWords.mockResolvedValue(mockCategoryWordsResponse);
    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText("5"));

    await waitFor(() => {
      // Should have image cards (role=button)
      const imageCards = document.querySelectorAll(".image-card");
      expect(imageCards.length).toBeGreaterThanOrEqual(2);
    });

    // A word should be displayed
    const wordText = document.querySelector(".word-text");
    expect(wordText).toBeTruthy();
    expect(wordText?.textContent).toBeTruthy();
  });
});
