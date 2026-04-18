import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeScreen } from "../HomeScreen";

vi.mock("../../api/client", () => ({
  getCategories: vi.fn(),
  getWordBuilderProgress: vi.fn(),
}));

import { getCategories, getWordBuilderProgress } from "../../api/client";
const mockGetCategories = vi.mocked(getCategories);
const mockGetProgress = vi.mocked(getWordBuilderProgress);

describe("HomeScreen (cycle-16 Games/Practice structure)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCategories.mockResolvedValue({
      categories: [
        {
          id: "cat-1",
          name: "Animals",
          slug: "animals",
          icon_url: null,
          display_order: 1,
          word_count: 100,
        },
      ],
    });
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

  it("renders Games and Practice section headings", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Games")).toBeInTheDocument();
      expect(screen.getByText("Practice")).toBeInTheDocument();
    });
  });

  it("renders Word Builder and Word Matching cards in Games", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Word Builder")).toBeInTheDocument();
      expect(screen.getByText("Word Matching")).toBeInTheDocument();
    });
  });

  it("renders Listening Practice placeholder in Practice section", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Listening Practice")).toBeInTheDocument();
      expect(screen.getByText("Coming soon")).toBeInTheDocument();
    });
  });

  it("renders a ghost placeholder slot in Practice section", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("More coming soon")).toBeInTheDocument();
    });
  });

  it("does NOT render category cards directly on Home (they moved to /matching)", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    // Wait a tick for any rendering to settle
    await waitFor(() => {
      expect(screen.getByText("Games")).toBeInTheDocument();
    });
    // Animals is a category; it should not appear on Home anymore
    expect(screen.queryByText("Animals")).not.toBeInTheDocument();
    // No "Word Matching" section heading either — it's now a card inside Games
    expect(screen.queryByRole("heading", { level: 2, name: /^Word Matching$/i })).not.toBeInTheDocument();
  });
});
