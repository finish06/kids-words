import type { StarUpdate } from "../types";
import { Stars } from "./Stars";

interface RoundCompleteProps {
  categoryName: string;
  wordResults: Array<{ text: string; starUpdate: StarUpdate | null }>;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function RoundComplete({
  categoryName,
  wordResults,
  onPlayAgain,
  onHome,
}: RoundCompleteProps) {
  const masteredThisRound = wordResults.filter(
    (w) => w.starUpdate?.just_mastered,
  );

  return (
    <div className="round-complete">
      <div className="celebration">
        <span className="stars">⭐ ⭐ ⭐</span>
        <h1 className="great-job">Great Job!</h1>
        <p className="complete-message">
          You finished all the {categoryName} words!
        </p>
      </div>

      {wordResults.length > 0 && (
        <div className="round-word-summary">
          {wordResults.map((wr, i) => (
            <div
              key={i}
              className={`round-word-item ${wr.starUpdate?.just_mastered ? "mastery-burst" : ""}`}
            >
              <span className="round-word-text">{wr.text}</span>
              <Stars
                level={wr.starUpdate?.new_star_level ?? 0}
                size="small"
                animated={wr.starUpdate?.just_mastered ?? false}
              />
            </div>
          ))}
        </div>
      )}

      {masteredThisRound.length > 0 && (
        <p className="mastery-message">
          🎉 Mastered {masteredThisRound.length} word
          {masteredThisRound.length > 1 ? "s" : ""}!
        </p>
      )}

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
