// Listening Practice card — placeholder for a future standalone game mode
// (cycle-16 after /add:spec + /add:ux). Renamed from "Word Phonetics" in
// cycle-15 when M8 TTS infrastructure shipped as a cross-game feature.
export function WordPhoneticsCard() {
  return (
    <div
      className="game-card game-card--phonetics game-card--disabled"
      aria-label="Listening Practice — coming soon"
    >
      <div className="game-card-icon" aria-hidden="true">
        🔊
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">Listening Practice</h3>
        <div className="game-card-subtitle">Coming soon</div>
        <div className="game-card-tease">Hear the word, find the match</div>
      </div>
    </div>
  );
}
