import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCategories } from "../../test/mocks";
import { HomeScreen } from "../HomeScreen";

vi.mock("../../api/client", () => ({
  getCategories: vi.fn(),
  getWordBuilderProgress: vi.fn(),
}));

import { getCategories, getWordBuilderProgress } from "../../api/client";
const mockGetCategories = vi.mocked(getCategories);
const mockGetProgress = vi.mocked(getWordBuilderProgress);

describe("HomeScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    mockGetProgress.mockResolvedValue({
      levels: [
        {
          level: 1,
          unlocked: true,
          patterns: [
            { text: "RE-", star_level: 0, mastered: false },
            { text: "UN-", star_level: 0, mastered: false },
          ],
          mastery_percentage: 0,
        },
      ],
    });
  });

  it("renders the app title", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Kids Words")).toBeInTheDocument();
    });
  });

  it("renders both Games and Word Matching sections", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Games")).toBeInTheDocument();
      expect(screen.getByText("Word Matching")).toBeInTheDocument();
    });
  });

  it("shows Word Builder re-enabled (cycle-15) + Listening Practice placeholder", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Word Builder")).toBeInTheDocument();
      expect(screen.getByText("Listening Practice")).toBeInTheDocument();
    });
    // Listening Practice still reads "Coming soon"; Word Builder is now live
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.queryByText("Word Phonetics")).not.toBeInTheDocument();
  });
});
