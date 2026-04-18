import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCategories } from "../../test/mocks";
import { HomeScreen } from "../HomeScreen";

vi.mock("../../api/client", () => ({
  getCategories: vi.fn(),
}));

import { getCategories } from "../../api/client";
const mockGetCategories = vi.mocked(getCategories);

describe("HomeScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
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

  it("shows both game cards as Coming soon (cycle-14 gating)", async () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Word Builder")).toBeInTheDocument();
      expect(screen.getByText("Word Phonetics")).toBeInTheDocument();
    });
    // Both cards should carry "Coming soon" until their design is finalized
    const comingSoon = screen.getAllByText("Coming soon");
    expect(comingSoon.length).toBeGreaterThanOrEqual(2);
  });
});
