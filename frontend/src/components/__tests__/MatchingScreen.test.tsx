import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCategories } from "../../test/mocks";
import { MatchingScreen } from "../MatchingScreen";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../api/client", () => ({
  getCategories: vi.fn(),
}));

import { getCategories } from "../../api/client";
const mockGetCategories = vi.mocked(getCategories);

function renderScreen() {
  return render(
    <MemoryRouter>
      <MatchingScreen />
    </MemoryRouter>,
  );
}

describe("MatchingScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading skeletons initially", () => {
    mockGetCategories.mockReturnValue(new Promise(() => {})); // never resolves
    renderScreen();
    const skeletons = document.querySelectorAll(".skeleton-card");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders the Word Matching header and category grid", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    renderScreen();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Word Matching" })).toBeInTheDocument();
    });
    expect(screen.getByText("Pick a category!")).toBeInTheDocument();
    expect(screen.getByText("Animals")).toBeInTheDocument();
    expect(screen.getByText("Colors")).toBeInTheDocument();
  });

  it("navigates to /play/:slug on category tap", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText("Animals")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Animals"));
    expect(mockNavigate).toHaveBeenCalledWith("/play/animals");
  });

  it("navigates back to Home on back tap", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText("Word Matching")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows error state on API failure", async () => {
    mockGetCategories.mockRejectedValue(new Error("Network error"));
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText("Oops! Let's try again.")).toBeInTheDocument();
    });
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("shows empty state when no categories are returned", async () => {
    mockGetCategories.mockResolvedValue({ categories: [] });
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText(/No categories yet/i)).toBeInTheDocument();
    });
  });

  it("filters out the body-parts category (hidden per prior decision)", async () => {
    mockGetCategories.mockResolvedValue({
      categories: [
        ...mockCategories,
        {
          id: "cat-99",
          name: "Body Parts",
          slug: "body-parts",
          icon_url: null,
          display_order: 5,
          word_count: 25,
        },
      ],
    });
    renderScreen();

    await waitFor(() => {
      expect(screen.getByText("Animals")).toBeInTheDocument();
    });
    expect(screen.queryByText("Body Parts")).not.toBeInTheDocument();
  });
});
