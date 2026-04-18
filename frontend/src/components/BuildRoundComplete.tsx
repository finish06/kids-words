import { LevelUpModal } from "./LevelUpModal";
import type { PatternResult } from "../hooks/useBuildRound";

export interface BuildRoundCompleteProps {
  patternResults: PatternResult[];
  levelUp?: {
    newLevel: number;
    newPatterns: string[];
  } | null;
  onDismissLevelUp: () => void;
  onPlayAgain: () => void;
  onHome: () => void;
}

function starsFor(level: number): string {
  const filled = Math.max(0, Math.min(3, level));
  return "★".repeat(filled) + "☆".repeat(3 - filled);
}

export function BuildRoundComplete({
  patternResults,
  levelUp,
  onDismissLevelUp,
  onPlayAgain,
  onHome,
}: BuildRoundCompleteProps) {
  // Aggregate by pattern_id — a pattern may appear multiple times in a round.
  const aggregated = new Map<string, { text: string; starLevel: number }>();
  for (const r of patternResults) {
    const existing = aggregated.get(r.pattern_id);
    const newLevel = r.starUpdate?.new_star_level ?? existing?.starLevel ?? 0;
    aggregated.set(r.pattern_id, {
      text: r.pattern_text,
      starLevel: Math.max(newLevel, existing?.starLevel ?? 0),
    });
  }

  return (
    <div className="round-complete build-round-complete">
      <div className="celebration-header">🎉 Great job! 🎉</div>
      <div className="celebration-subtitle">
        You built {patternResults.length} word
        {patternResults.length === 1 ? "" : "s"}!
      </div>

      <div className="celebration-patterns">
        <div className="celebration-patterns-heading">
          Patterns practiced this round:
        </div>
        <div className="celebration-patterns-grid">
          {[...aggregated.entries()].map(([id, { text, starLevel }]) => (
            <div key={id} className="pattern-star-row">
              <span className="pattern-star-text">{text}</span>
              <span className="pattern-star-value" aria-label={`${starLevel} stars`}>
                {starsFor(starLevel)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="round-complete-actions">
        <button className="primary-button" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="secondary-button" onClick={onHome}>
          Home
        </button>
      </div>

      {levelUp && (
        <LevelUpModal
          newLevel={levelUp.newLevel}
          newPatterns={levelUp.newPatterns}
          onDismiss={onDismissLevelUp}
        />
      )}
    </div>
  );
}
