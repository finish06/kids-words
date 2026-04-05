import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProfilePicker } from "../ProfilePicker";

vi.mock("../../api/client", () => ({
  getProfiles: vi.fn(),
  setActiveProfile: vi.fn(),
}));

import { getProfiles } from "../../api/client";
const mockGetProfiles = vi.mocked(getProfiles);

describe("ProfilePicker", () => {
  const defaultProps = {
    onSelect: vi.fn(),
    onSettings: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockGetProfiles.mockReturnValue(new Promise(() => {}));
    render(<ProfilePicker {...defaultProps} />);
    expect(screen.getByText("Loading profiles...")).toBeInTheDocument();
  });

  it("auto-selects guest when only profile", async () => {
    mockGetProfiles.mockResolvedValue({
      profiles: [{ id: "g1", name: "Guest", color: "#9ca3af", is_guest: true }],
      pin_set: false,
      max_profiles: 3,
    });
    render(<ProfilePicker {...defaultProps} />);

    await waitFor(() => {
      expect(defaultProps.onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Guest" }),
      );
    });
  });

  it("shows profile cards when multiple profiles exist", async () => {
    mockGetProfiles.mockResolvedValue({
      profiles: [
        { id: "g1", name: "Guest", color: "#9ca3af", is_guest: true },
        { id: "e1", name: "Emma", color: "#ec4899", is_guest: false },
      ],
      pin_set: true,
      max_profiles: 3,
    });
    render(<ProfilePicker {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Who's Playing?")).toBeInTheDocument();
    });
    expect(screen.getByText("Guest")).toBeInTheDocument();
    expect(screen.getByText("Emma")).toBeInTheDocument();
  });

  it("calls onSelect when profile is tapped", async () => {
    mockGetProfiles.mockResolvedValue({
      profiles: [
        { id: "g1", name: "Guest", color: "#9ca3af", is_guest: true },
        { id: "e1", name: "Emma", color: "#ec4899", is_guest: false },
      ],
      pin_set: true,
      max_profiles: 3,
    });
    render(<ProfilePicker {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Emma")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText("Emma"));
    expect(defaultProps.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Emma" }),
    );
  });

  it("shows manage profiles button", async () => {
    mockGetProfiles.mockResolvedValue({
      profiles: [
        { id: "g1", name: "Guest", color: "#9ca3af", is_guest: true },
        { id: "e1", name: "Emma", color: "#ec4899", is_guest: false },
      ],
      pin_set: true,
      max_profiles: 3,
    });
    render(<ProfilePicker {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Manage Profiles")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText("Manage Profiles"));
    expect(defaultProps.onSettings).toHaveBeenCalledOnce();
  });
});
