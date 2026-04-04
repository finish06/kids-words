interface RoundCompleteProps {
  categoryName: string;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function RoundComplete({
  categoryName,
  onPlayAgain,
  onHome,
}: RoundCompleteProps) {
  return (
    <div className="round-complete">
      <div className="celebration">
        <span className="stars">⭐ ⭐ ⭐</span>
        <h1 className="great-job">Great Job!</h1>
        <p className="complete-message">
          You finished all the {categoryName} words!
        </p>
      </div>
      <div className="complete-actions">
        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="home-button" onClick={onHome}>
          More Categories
        </button>
      </div>
    </div>
  );
}
