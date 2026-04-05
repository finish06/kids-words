import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PinGate } from "../PinGate";

vi.mock("../../api/client", () => ({
  verifyPin: vi.fn(),
}));

import { verifyPin } from "../../api/client";
const mockVerifyPin = vi.mocked(verifyPin);

describe("PinGate", () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders PIN entry screen", () => {
    render(<PinGate {...defaultProps} />);
    expect(screen.getByText("Enter Parent PIN")).toBeInTheDocument();
    expect(screen.getByText("PIN required to switch profiles")).toBeInTheDocument();
  });

  it("shows 4 empty dots initially", () => {
    const { container } = render(<PinGate {...defaultProps} />);
    const dots = container.querySelectorAll(".pin-dot");
    expect(dots).toHaveLength(4);
    const filled = container.querySelectorAll(".pin-dot.filled");
    expect(filled).toHaveLength(0);
  });

  it("fills dots as digits are entered", async () => {
    const { container } = render(<PinGate {...defaultProps} />);
    mockVerifyPin.mockResolvedValue(false);

    await userEvent.click(screen.getByText("1"));
    const filled = container.querySelectorAll(".pin-dot.filled");
    expect(filled).toHaveLength(1);
  });

  it("calls onCancel when Cancel is clicked", async () => {
    render(<PinGate {...defaultProps} />);
    await userEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onCancel).toHaveBeenCalledOnce();
  });

  it("calls onSuccess on correct PIN", async () => {
    mockVerifyPin.mockResolvedValue(true);
    render(<PinGate {...defaultProps} />);

    await userEvent.click(screen.getByText("1"));
    await userEvent.click(screen.getByText("2"));
    await userEvent.click(screen.getByText("3"));
    await userEvent.click(screen.getByText("4"));

    // Wait for verify to resolve
    await vi.waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalledOnce();
    });
  });

  it("shows error on wrong PIN", async () => {
    mockVerifyPin.mockResolvedValue(false);
    render(<PinGate {...defaultProps} />);

    await userEvent.click(screen.getByText("1"));
    await userEvent.click(screen.getByText("1"));
    await userEvent.click(screen.getByText("1"));
    await userEvent.click(screen.getByText("1"));

    await vi.waitFor(() => {
      expect(screen.getByText("Wrong PIN")).toBeInTheDocument();
    });
  });

  it("supports backspace", async () => {
    const { container } = render(<PinGate {...defaultProps} />);

    await userEvent.click(screen.getByText("1"));
    await userEvent.click(screen.getByText("2"));
    expect(container.querySelectorAll(".pin-dot.filled")).toHaveLength(2);

    await userEvent.click(screen.getByText("←"));
    expect(container.querySelectorAll(".pin-dot.filled")).toHaveLength(1);
  });
});
