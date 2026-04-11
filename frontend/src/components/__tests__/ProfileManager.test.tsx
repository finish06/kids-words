import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileManager } from "../ProfileManager";
import type { Profile } from "../../types";

vi.mock("../../api/client", () => ({
  setupPin: vi.fn(),
  verifyPin: vi.fn(),
  createProfile: vi.fn(),
  updateProfile: vi.fn(),
  deleteProfile: vi.fn(),
}));

import {
  createProfile,
  deleteProfile,
  setupPin,
  updateProfile,
  verifyPin,
} from "../../api/client";

const mockSetupPin = vi.mocked(setupPin);
const mockVerifyPin = vi.mocked(verifyPin);
const mockCreateProfile = vi.mocked(createProfile);
const mockUpdateProfile = vi.mocked(updateProfile);
const mockDeleteProfile = vi.mocked(deleteProfile);

const profiles: Profile[] = [
  { id: "g1", name: "Guest", color: "#9ca3af", is_guest: true },
  { id: "e1", name: "Emma", color: "#ec4899", is_guest: false },
];

async function typePin(digits: string) {
  for (const d of digits) {
    await userEvent.click(screen.getByText(d));
  }
}

describe("ProfileManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Stub reload — jsdom doesn't implement navigation
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload: vi.fn() },
    });
  });

  describe("Setup PIN flow (pinSet=false)", () => {
    it("renders set-PIN screen initially", () => {
      render(
        <ProfileManager pinSet={false} profiles={profiles} onDone={vi.fn()} />,
      );
      expect(screen.getByText("Set a Parent PIN")).toBeInTheDocument();
      expect(screen.getByText("4 digits to manage profiles")).toBeInTheDocument();
    });

    it("calls onDone when Cancel clicked on set-PIN screen", async () => {
      const onDone = vi.fn();
      render(
        <ProfileManager pinSet={false} profiles={profiles} onDone={onDone} />,
      );
      await userEvent.click(screen.getByText("Cancel"));
      expect(onDone).toHaveBeenCalledOnce();
    });

    it("advances to confirm screen after 4 digits", async () => {
      render(
        <ProfileManager pinSet={false} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("1234");
      expect(screen.getByText("Confirm PIN")).toBeInTheDocument();
    });

    it("resets to set-PIN screen when confirm PIN does not match", async () => {
      render(
        <ProfileManager pinSet={false} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("1234");
      await typePin("5678");
      // Mismatch clears state; user returns to initial set-PIN screen
      await waitFor(() => {
        expect(screen.getByText("Set a Parent PIN")).toBeInTheDocument();
      });
      expect(mockSetupPin).not.toHaveBeenCalled();
    });

    it("calls setupPin and shows manage screen when PINs match", async () => {
      mockSetupPin.mockResolvedValue(undefined as unknown as void);
      render(
        <ProfileManager pinSet={false} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("1234");
      await typePin("1234");
      await waitFor(() => {
        expect(mockSetupPin).toHaveBeenCalledWith("1234");
      });
      await waitFor(() => {
        expect(screen.getByText("Manage Profiles")).toBeInTheDocument();
      });
    });
  });

  describe("Verify PIN flow (pinSet=true)", () => {
    it("renders verify screen initially", () => {
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={vi.fn()} />,
      );
      expect(screen.getByText("Enter Parent PIN")).toBeInTheDocument();
    });

    it("shows Wrong PIN on incorrect entry", async () => {
      mockVerifyPin.mockResolvedValue(false);
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("9999");
      await waitFor(() => {
        expect(screen.getByText("Wrong PIN")).toBeInTheDocument();
      });
    });

    it("advances to manage screen on correct PIN", async () => {
      mockVerifyPin.mockResolvedValue(true);
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("1234");
      await waitFor(() => {
        expect(screen.getByText("Manage Profiles")).toBeInTheDocument();
      });
    });

    it("cancel returns via onDone", async () => {
      const onDone = vi.fn();
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={onDone} />,
      );
      await userEvent.click(screen.getByText("Cancel"));
      expect(onDone).toHaveBeenCalledOnce();
    });
  });

  describe("Manage screen", () => {
    async function openManageScreen() {
      mockVerifyPin.mockResolvedValue(true);
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("1234");
      await waitFor(() => {
        expect(screen.getByText("Manage Profiles")).toBeInTheDocument();
      });
    }

    it("lists non-guest profiles only", async () => {
      await openManageScreen();
      expect(screen.getByText("Emma")).toBeInTheDocument();
      expect(screen.queryByText("Guest")).not.toBeInTheDocument();
    });

    it("shows Add Child when under max profiles", async () => {
      await openManageScreen();
      expect(screen.getByText(/Add Child/)).toBeInTheDocument();
    });

    it("hides Add Child when at max profiles", async () => {
      mockVerifyPin.mockResolvedValue(true);
      const full: Profile[] = [
        { id: "g1", name: "Guest", color: "#9ca3af", is_guest: true },
        { id: "c1", name: "A", color: "#ef4444", is_guest: false },
        { id: "c2", name: "B", color: "#22c55e", is_guest: false },
        { id: "c3", name: "C", color: "#3b82f6", is_guest: false },
      ];
      render(
        <ProfileManager pinSet={true} profiles={full} onDone={vi.fn()} />,
      );
      await typePin("1234");
      await waitFor(() => {
        expect(screen.getByText("Manage Profiles")).toBeInTheDocument();
      });
      expect(screen.queryByText(/Add Child/)).not.toBeInTheDocument();
    });

    it("calls onDone when Done clicked", async () => {
      mockVerifyPin.mockResolvedValue(true);
      const onDone = vi.fn();
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={onDone} />,
      );
      await typePin("1234");
      await waitFor(() => {
        expect(screen.getByText("Done")).toBeInTheDocument();
      });
      await userEvent.click(screen.getByText("Done"));
      expect(onDone).toHaveBeenCalledOnce();
    });
  });

  describe("Add profile flow", () => {
    it("creates a profile with name and color", async () => {
      mockVerifyPin.mockResolvedValue(true);
      mockCreateProfile.mockResolvedValue(undefined as unknown as Profile);
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("1234");
      await waitFor(() => {
        expect(screen.getByText(/Add Child/)).toBeInTheDocument();
      });
      await userEvent.click(screen.getByText(/Add Child/));

      const input = screen.getByPlaceholderText("Child's name");
      await userEvent.type(input, "Oliver");
      await userEvent.click(screen.getByText("Create Profile"));

      await waitFor(() => {
        expect(mockCreateProfile).toHaveBeenCalledWith(
          "Oliver",
          expect.any(String),
          "1234",
        );
      });
    });

    it("disables Create Profile when name is empty", async () => {
      mockVerifyPin.mockResolvedValue(true);
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("1234");
      await waitFor(() => {
        expect(screen.getByText(/Add Child/)).toBeInTheDocument();
      });
      await userEvent.click(screen.getByText(/Add Child/));

      const button = screen.getByText("Create Profile") as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });
  });

  describe("Edit profile flow", () => {
    async function openEditScreen() {
      mockVerifyPin.mockResolvedValue(true);
      render(
        <ProfileManager pinSet={true} profiles={profiles} onDone={vi.fn()} />,
      );
      await typePin("1234");
      await waitFor(() => {
        expect(screen.getByText("Emma")).toBeInTheDocument();
      });
      await userEvent.click(screen.getByText("Emma"));
      await waitFor(() => {
        expect(screen.getByText("Edit Emma")).toBeInTheDocument();
      });
    }

    it("pre-fills name and opens edit screen", async () => {
      await openEditScreen();
      const input = screen.getByPlaceholderText(
        "Child's name",
      ) as HTMLInputElement;
      expect(input.value).toBe("Emma");
    });

    it("saves updated profile with new name", async () => {
      mockUpdateProfile.mockResolvedValue(undefined as unknown as Profile);
      await openEditScreen();
      const input = screen.getByPlaceholderText("Child's name");
      await userEvent.clear(input);
      await userEvent.type(input, "Emmy");
      await userEvent.click(screen.getByText("Save"));

      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith(
          "e1",
          "Emmy",
          expect.any(String),
          "1234",
        );
      });
    });

    it("shows delete confirmation before deleting", async () => {
      await openEditScreen();
      await userEvent.click(screen.getByText("Delete Profile"));
      expect(screen.getByText(/Delete Emma\?/)).toBeInTheDocument();
      expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    });

    it("deletes profile on confirm", async () => {
      mockDeleteProfile.mockResolvedValue(undefined as unknown as void);
      await openEditScreen();
      await userEvent.click(screen.getByText("Delete Profile"));
      await userEvent.click(screen.getByText("Confirm Delete"));

      await waitFor(() => {
        expect(mockDeleteProfile).toHaveBeenCalledWith("e1", "1234");
      });
    });
  });
});
