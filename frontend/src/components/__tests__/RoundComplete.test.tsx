import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RoundComplete } from "../RoundComplete";

describe("RoundComplete", () => {
  const defaultProps = {
    categoryName: "Animals",
    onPlayAgain: vi.fn(),
    onHome: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays celebration message with category name", () => {
    render(<RoundComplete {...defaultProps} />);
    expect(screen.getByText("Great Job!")).toBeInTheDocument();
    expect(
      screen.getByText("You finished all the Animals words!"),
    ).toBeInTheDocument();
  });

  it("displays stars", () => {
    render(<RoundComplete {...defaultProps} />);
    expect(screen.getByText(/⭐/)).toBeInTheDocument();
  });

  it("calls onPlayAgain when Play Again is clicked", async () => {
    render(<RoundComplete {...defaultProps} />);
    await userEvent.click(screen.getByText("Play Again"));
    expect(defaultProps.onPlayAgain).toHaveBeenCalledOnce();
  });

  it("calls onHome when More Categories is clicked", async () => {
    render(<RoundComplete {...defaultProps} />);
    await userEvent.click(screen.getByText("More Categories"));
    expect(defaultProps.onHome).toHaveBeenCalledOnce();
  });
});
