import { useEffect, useState } from "react";
import { getProfiles, setActiveProfile } from "../api/client";
import type { Profile } from "../types";
import { Icon } from "./Icon";

interface ProfilePickerProps {
  onSelect: (profile: Profile) => void;
  onSettings: () => void;
}

export function ProfilePicker({ onSelect, onSettings }: ProfilePickerProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfiles()
      .then((data) => {
        setProfiles(data.profiles);
        setLoading(false);
        // If only guest, auto-select
        if (
          data.profiles.length === 1 &&
          data.profiles[0].is_guest
        ) {
          setActiveProfile(data.profiles[0].id);
          onSelect(data.profiles[0]);
        }
      })
      .catch(() => setLoading(false));
  }, [onSelect]);

  if (loading) {
    return (
      <div className="profile-picker">
        <div className="loading">Loading profiles...</div>
      </div>
    );
  }

  // Only guest exists — skip picker
  if (profiles.length <= 1) return null;

  return (
    <div className="profile-picker">
      <h1 className="title">Who's Playing?</h1>
      <div className="profiles-grid">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            className="profile-card"
            onClick={() => {
              setActiveProfile(profile.id);
              onSelect(profile);
            }}
          >
            <div
              className="profile-avatar"
              style={{ backgroundColor: profile.color }}
            >
              {profile.is_guest ? "?" : profile.name[0].toUpperCase()}
            </div>
            <span className="profile-name">{profile.name}</span>
          </button>
        ))}
      </div>
      <button className="settings-link" onClick={onSettings}>
        <Icon name="gear" size={16} /> Manage Profiles
      </button>
    </div>
  );
}
