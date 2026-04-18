import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCategories } from "../../test/mocks";
import { WordMatchingSection } from "../WordMatchingSection";

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

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <WordMatchingSection />
    </MemoryRouter>,
  );
}

describe("WordMatchingSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a Word Matching section heading", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText("Word Matching")).toBeInTheDocument();
    });
  });

  it("renders categories after loading", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Animals")).toBeInTheDocument();
    });
    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.getByText("6 words")).toBeInTheDocument();
    expect(screen.getByText("3 words")).toBeInTheDocument();
  });

  it("shows error state on API failure", async () => {
    mockGetCategories.mockRejectedValue(new Error("Network error"));
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Oops! Let's try again.")).toBeInTheDocument();
    });
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("navigates to play route on category click", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Animals")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Animals"));
    expect(mockNavigate).toHaveBeenCalledWith("/play/animals");
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
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Animals")).toBeInTheDocument();
    });
    expect(screen.queryByText("Body Parts")).not.toBeInTheDocument();
  });
});
