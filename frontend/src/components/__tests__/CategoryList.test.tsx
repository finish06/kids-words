import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { mockCategories } from "../../test/mocks";
import { CategoryList } from "../CategoryList";

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
      <CategoryList />
    </MemoryRouter>,
  );
}

describe("CategoryList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading skeletons initially", () => {
    mockGetCategories.mockReturnValue(new Promise(() => {})); // never resolves
    renderWithRouter();
    expect(screen.getAllByClassName?.("skeleton-card") ?? document.querySelectorAll(".skeleton-card")).toBeTruthy();
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

  it("displays the app title", async () => {
    mockGetCategories.mockResolvedValue({ categories: mockCategories });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Kids Words")).toBeInTheDocument();
    });
  });

  it("renders empty state when no categories", async () => {
    mockGetCategories.mockResolvedValue({ categories: [] });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Pick a category!")).toBeInTheDocument();
    });
  });
});
