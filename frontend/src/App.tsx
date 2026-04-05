import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { getProfiles, setActiveProfile } from "./api/client";
import { CategoryList } from "./components/CategoryList";
import { Icon } from "./components/Icon";
import { MatchRound } from "./components/MatchRound";
import { PinGate } from "./components/PinGate";
import { ProfileManager } from "./components/ProfileManager";
import { ProfilePicker } from "./components/ProfilePicker";
import { WordList } from "./components/WordList";
import type { Profile } from "./types";

function App() {
  const [screen, setScreen] = useState<
    "loading" | "picker" | "manage" | "switch" | "app"
  >("loading");
  const [profileName, setProfileName] = useState("Guest");
  const [profileColor, setProfileColor] = useState("#9ca3af");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [pinSet, setPinSet] = useState(false);

  useEffect(() => {
    getProfiles()
      .then((data) => {
        setProfiles(data.profiles);
        setPinSet(data.pin_set);
        if (data.profiles.length === 1 && data.profiles[0].is_guest) {
          setActiveProfile(data.profiles[0].id);
          setProfileName("Guest");
          setScreen("app");
        } else if (data.profiles.length > 1) {
          setScreen("picker");
        } else {
          setScreen("app");
        }
      })
      .catch(() => setScreen("app"));
  }, []);

  const handleProfileSelect = useCallback((profile: Profile) => {
    setActiveProfile(profile.id);
    setProfileName(profile.name);
    setProfileColor(profile.color);
    setScreen("app");
  }, []);

  const handleSwitchProfile = useCallback(() => {
    if (pinSet) {
      setScreen("switch");
    } else {
      setActiveProfile(null);
      setScreen("picker");
    }
  }, [pinSet]);

  if (screen === "loading") {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (screen === "switch") {
    return (
      <div className="app">
        <PinGate
          onSuccess={() => {
            setActiveProfile(null);
            setScreen("picker");
          }}
          onCancel={() => setScreen("app")}
        />
      </div>
    );
  }

  if (screen === "manage") {
    return (
      <div className="app">
        <ProfileManager
          pinSet={pinSet}
          profiles={profiles}
          onDone={() => window.location.reload()}
        />
      </div>
    );
  }

  if (screen === "picker") {
    return (
      <div className="app">
        <ProfilePicker
          onSelect={handleProfileSelect}
          onSettings={() => setScreen("manage")}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">
        <button className="profile-indicator" onClick={handleSwitchProfile}>
          <div
            className="profile-avatar-small"
            style={{ backgroundColor: profileColor }}
          >
            {profileName[0].toUpperCase()}
          </div>
        </button>
        <button className="settings-gear" onClick={() => setScreen("manage")}>
          <Icon name="gear" size={24} />
        </button>
      </div>
      <Routes>
        <Route path="/" element={<CategoryList />} />
        <Route path="/play/:slug" element={<MatchRound />} />
        <Route path="/words/:slug" element={<WordList />} />
      </Routes>
    </div>
  );
}

export default App;
