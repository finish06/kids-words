import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { getProfiles, setActiveProfile } from "./api/client";
import { BuildPicker, BuildScreen } from "./components/BuildScreen";
import { HomeScreen } from "./components/HomeScreen";
import { Icon } from "./components/Icon";
import { MatchingScreen } from "./components/MatchingScreen";
import { MatchRound } from "./components/MatchRound";
import { ProfileManager } from "./components/ProfileManager";
import { ProfilePicker } from "./components/ProfilePicker";
import { WordList } from "./components/WordList";
import { useTheme } from "./hooks/useTheme";
import type { Profile } from "./types";

function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [screen, setScreen] = useState<
    "loading" | "picker" | "manage" | "app"
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

  if (screen === "loading") {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
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
        <div className="profile-indicator">
          <div
            className="profile-avatar-small"
            style={{ backgroundColor: profileColor }}
          >
            {profileName[0].toUpperCase()}
          </div>
          <span className="profile-label">{profileName}</span>
        </div>
        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            <Icon name={theme === "dark" ? "sun" : "moon"} size={22} />
          </button>
          <button className="settings-gear" onClick={() => setScreen("manage")}>
            <Icon name="gear" size={24} />
          </button>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/matching" element={<MatchingScreen />} />
        <Route path="/play/:slug" element={<MatchRound />} />
        <Route path="/words/:slug" element={<WordList />} />
        <Route path="/build" element={<BuildPicker />} />
        <Route path="/build/play" element={<BuildScreen />} />
      </Routes>
    </div>
  );
}

export default App;
