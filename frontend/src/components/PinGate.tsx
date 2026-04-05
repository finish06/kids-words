import { useState } from "react";
import { verifyPin } from "../api/client";

interface PinGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PinGate({ onSuccess, onCancel }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="pin-screen">
      <h2 className="pin-title">Enter Parent PIN</h2>
      <p className="pin-subtitle">PIN required to switch profiles</p>
      <div className="pin-dots">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`pin-dot ${i < pin.length ? "filled" : ""}`}
          />
        ))}
      </div>
      {error && <p className="pin-error">{error}</p>}
      <div className="pin-pad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"].map(
          (key) =>
            key === "" ? (
              <div key="empty" className="pin-key empty" />
            ) : key === "←" ? (
              <button
                key="del"
                className="pin-key"
                onClick={() => {
                  setPin((p) => p.slice(0, -1));
                  setError("");
                }}
              >
                ←
              </button>
            ) : (
              <button
                key={key}
                className="pin-key"
                onClick={() => {
                  const newPin = pin + key;
                  if (newPin.length <= 4) setPin(newPin);
                  if (newPin.length === 4) {
                    verifyPin(newPin).then((ok) => {
                      if (ok) {
                        onSuccess();
                      } else {
                        setError("Wrong PIN");
                        setPin("");
                      }
                    });
                  }
                }}
              >
                {key}
              </button>
            ),
        )}
      </div>
      <button className="pin-back" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
