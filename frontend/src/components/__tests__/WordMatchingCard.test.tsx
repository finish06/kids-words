import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCategories } from "../../test/mocks";
import { WordMatchingCard } from "../WordMatchingCard";

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

describe("WordMatchingCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders card title", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    render(
      <MemoryRouter>
        <WordMatchingCard />
      </MemoryRouter>,
    );
    expect(screen.getByText("Word Matching")).toBeInTheDocument();
  });

  it("shows visible category count once loaded", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    render(
      <MemoryRouter>
        <WordMatchingCard />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/categories/i)).toBeInTheDocument();
    });
  });

  it("navigates to /matching on tap", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    render(
      <MemoryRouter>
        <WordMatchingCard />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByRole("button", { name: /word matching/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/matching");
  });

  it("falls back to static subtitle if API fails", async () => {
    mockGetCategories.mockRejectedValue(new Error("boom"));
    render(
      <MemoryRouter>
        <WordMatchingCard />
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText("Match words to images")).toBeInTheDocument();
    });
  });
});
