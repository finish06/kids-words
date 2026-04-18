// Placeholder card for M8 Word Phonetics (Audio & Pronunciation).
// Ships disabled so home restructure lands once, not twice.
export function WordPhoneticsCard() {
  return (
    <div
      className="game-card game-card--phonetics game-card--disabled"
      aria-label="Word Phonetics game — coming soon"
    >
      <div className="game-card-icon" aria-hidden="true">🔊</div>
      <div className="game-card-content">
        <h3 className="game-card-title">Word Phonetics</h3>
        <div className="game-card-subtitle">Coming soon</div>
        <div className="game-card-tease">Tap a word, hear it spoken</div>
      </div>
    </div>
  );
}
