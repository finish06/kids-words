import { useState } from "react";
import { createProfile, deleteProfile, setupPin, updateProfile, verifyPin } from "../api/client";
import type { Profile } from "../types";
import { Icon } from "./Icon";

const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

interface ProfileManagerProps {
  pinSet: boolean;
  profiles: Profile[];
  onDone: () => void;
}

export function ProfileManager({
  pinSet,
  profiles,
  onDone,
}: ProfileManagerProps) {
  const [step, setStep] = useState<"pin" | "verify" | "manage" | "add" | "edit">(
    pinSet ? "verify" : "pin",
  );
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  // Add/edit profile state
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) setPin((p) => p + digit);
  };

  const handleConfirmDigit = (digit: string) => {
    if (confirmPin.length < 4) setConfirmPin((p) => p + digit);
  };

  // Step: Set new PIN
  if (step === "pin") {
    if (confirmPin.length === 0 && pin.length < 4) {
      return (
        <div className="pin-screen">
          <h2 className="pin-title">Set a Parent PIN</h2>
          <p className="pin-subtitle">4 digits to manage profiles</p>
          <div className="pin-dots">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`pin-dot ${i < pin.length ? "filled" : ""}`}
              />
            ))}
          </div>
          <PinPad onDigit={handlePinDigit} onDelete={() => setPin((p) => p.slice(0, -1))} />
          <button className="pin-back" onClick={onDone}>Cancel</button>
        </div>
      );
    }

    if (pin.length === 4 && confirmPin.length < 4) {
      return (
        <div className="pin-screen">
          <h2 className="pin-title">Confirm PIN</h2>
          <div className="pin-dots">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`pin-dot ${i < confirmPin.length ? "filled" : ""}`}
              />
            ))}
          </div>
          {error && <p className="pin-error">{error}</p>}
          <PinPad onDigit={handleConfirmDigit} onDelete={() => setConfirmPin((p) => p.slice(0, -1))} />
          <button className="pin-back" onClick={() => { setPin(""); setConfirmPin(""); setError(""); }}>
            Start Over
          </button>
        </div>
      );
    }

    if (pin.length === 4 && confirmPin.length === 4) {
      if (pin !== confirmPin) {
        setError("PINs don't match. Try again.");
        setPin("");
        setConfirmPin("");
      } else {
        setupPin(pin)
          .then(() => {
            setVerified(true);
            setStep("manage");
          })
          .catch(() => setError("Failed to set PIN"));
        setPin("");
        setConfirmPin("");
      }
    }
  }

  // Step: Verify existing PIN
  if (step === "verify" && !verified) {
    return (
      <div className="pin-screen">
        <h2 className="pin-title">Enter Parent PIN</h2>
        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? "filled" : ""}`}
            />
          ))}
        </div>
        {error && <p className="pin-error">{error}</p>}
        <PinPad
          onDigit={(d) => {
            const newPin = pin + d;
            if (newPin.length <= 4) setPin(newPin);
            if (newPin.length === 4) {
              verifyPin(newPin).then((ok) => {
                if (ok) {
                  setVerified(true);
                  setStep("manage");
                  setPin(newPin);
                } else {
                  setError("Wrong PIN");
                  setPin("");
                }
              });
            }
          }}
          onDelete={() => { setPin((p) => p.slice(0, -1)); setError(""); }}
        />
        <button className="pin-back" onClick={onDone}>Cancel</button>
      </div>
    );
  }

  // Step: Add profile
  if (step === "add") {
    const childCount = profiles.filter((p) => !p.is_guest).length;
    return (
      <div className="profile-manage-screen">
        <h2 className="pin-title">Add Child</h2>
        {childCount >= 3 ? (
          <p className="pin-error">Maximum 3 profiles</p>
        ) : (
          <>
            <input
              className="profile-name-input"
              type="text"
              placeholder="Child's name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <div className="color-picker">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`color-dot ${c === newColor ? "selected" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setNewColor(c)}
                />
              ))}
            </div>
            <button
              className="play-again-button"
              disabled={!newName.trim()}
              onClick={() => {
                createProfile(newName.trim(), newColor, pin).then(() => {
                  setNewName("");
                  window.location.reload();
                });
              }}
            >
              Create Profile
            </button>
          </>
        )}
        <button className="pin-back" onClick={() => setStep("manage")}>
          Back
        </button>
      </div>
    );
  }

  // Step: Edit profile
  if (step === "edit" && editingProfile) {
    return (
      <div className="profile-manage-screen">
        <h2 className="pin-title">Edit {editingProfile.name}</h2>
        <input
          className="profile-name-input"
          type="text"
          placeholder="Child's name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={20}
          autoFocus
        />
        <div className="color-picker">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`color-dot ${c === newColor ? "selected" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setNewColor(c)}
            />
          ))}
        </div>
        <button
          className="play-again-button"
          disabled={!newName.trim()}
          onClick={() => {
            updateProfile(editingProfile.id, newName.trim(), newColor, pin).then(() => {
              window.location.reload();
            });
          }}
        >
          Save
        </button>

        {!showDeleteConfirm ? (
          <button
            className="delete-button"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Profile
          </button>
        ) : (
          <div className="delete-confirm">
            <p className="delete-warning">
              Delete {editingProfile.name}? This removes all their progress.
            </p>
            <div className="delete-actions">
              <button
                className="delete-button"
                onClick={() => {
                  deleteProfile(editingProfile.id, pin).then(() => {
                    window.location.reload();
                  });
                }}
              >
                Confirm Delete
              </button>
              <button
                className="pin-back"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button className="pin-back" onClick={() => { setStep("manage"); setShowDeleteConfirm(false); }}>
          Back
        </button>
      </div>
    );
  }

  // Step: Manage profiles
  return (
    <div className="profile-manage-screen">
      <h2 className="pin-title">Manage Profiles</h2>
      <div className="managed-profiles">
        {profiles
          .filter((p) => !p.is_guest)
          .map((p) => (
            <button
              key={p.id}
              className="managed-profile-item clickable"
              onClick={() => {
                setEditingProfile(p);
                setNewName(p.name);
                setNewColor(p.color);
                setShowDeleteConfirm(false);
                setStep("edit");
              }}
            >
              <div
                className="profile-avatar"
                style={{ backgroundColor: p.color }}
              >
                {p.name[0].toUpperCase()}
              </div>
              <span className="profile-name">{p.name}</span>
            </button>
          ))}
      </div>
      {profiles.filter((p) => !p.is_guest).length < 3 && (
        <button
          className="play-again-button"
          onClick={() => setStep("add")}
        >
          <Icon name="plus" size={20} /> Add Child
        </button>
      )}
      <button className="home-button" onClick={onDone}>
        Done
      </button>
    </div>
  );
}

function PinPad({
  onDigit,
  onDelete,
}: {
  onDigit: (d: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="pin-pad">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"].map(
        (key) =>
          key === "" ? (
            <div key="empty" className="pin-key empty" />
          ) : key === "←" ? (
            <button key="del" className="pin-key" onClick={onDelete}>
              <Icon name="arrow-left" size={18} />
            </button>
          ) : (
            <button
              key={key}
              className="pin-key"
              onClick={() => onDigit(key)}
            >
              {key}
            </button>
          ),
      )}
    </div>
  );
}
