import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RoundComplete } from "../RoundComplete";

describe("RoundComplete", () => {
  const defaultProps = {
    categoryName: "Animals",
    wordResults: [
      { text: "CAT", starUpdate: { word_id: "1", new_count: 3, new_star_level: 1, just_mastered: false } },
      { text: "DOG", starUpdate: null },
    ],
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

  it("displays celebration icon", () => {
    render(<RoundComplete {...defaultProps} />);
    expect(document.querySelector(".celebration-icon")).toBeInTheDocument();
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

  it("shows word summary with stars", () => {
    render(<RoundComplete {...defaultProps} />);
    expect(screen.getByText("CAT")).toBeInTheDocument();
    expect(screen.getByText("DOG")).toBeInTheDocument();
  });

  it("shows mastery message when words are mastered", () => {
    const props = {
      ...defaultProps,
      wordResults: [
        { text: "CAT", starUpdate: { word_id: "1", new_count: 7, new_star_level: 3, just_mastered: true } },
      ],
    };
    render(<RoundComplete {...props} />);
    expect(screen.getByText(/Mastered 1 word/)).toBeInTheDocument();
  });
});
