import { useCallback, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { setActiveProfile } from "./api/client";
import { CategoryList } from "./components/CategoryList";
import { MatchRound } from "./components/MatchRound";
import { ProfilePicker } from "./components/ProfilePicker";
import { WordList } from "./components/WordList";
import type { Profile } from "./types";

function App() {
  const [profileSelected, setProfileSelected] = useState(false);
  const [profileName, setProfileName] = useState("Guest");
  const [profileColor, setProfileColor] = useState("#9ca3af");

  const handleProfileSelect = useCallback((profile: Profile) => {
    setProfileSelected(true);
    setProfileName(profile.name);
    setProfileColor(profile.color);
  }, []);

  const handleSwitchProfile = useCallback(() => {
    setActiveProfile(null);
    setProfileSelected(false);
  }, []);

  if (!profileSelected) {
    return (
      <div className="app">
        <ProfilePicker
          onSelect={handleProfileSelect}
          onSettings={() => {
            // TODO: PIN management screen
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="profile-indicator" onClick={handleSwitchProfile}>
        <div
          className="profile-avatar-small"
          style={{ backgroundColor: profileColor }}
        >
          {profileName[0].toUpperCase()}
        </div>
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
