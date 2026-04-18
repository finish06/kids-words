import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWordBuilderProgress } from "../api/client";
import type { LevelProgress } from "../types";

export function WordBuilderCard() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<LevelProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWordBuilderProgress()
      .then((data) => {
        // Use the highest unlocked level with any data, else L1
        const unlocked = data.levels.filter((l) => l.unlocked);
        setProgress(
          unlocked.length > 0 ? unlocked[unlocked.length - 1] : data.levels[0] ?? null,
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const patternCount = progress?.patterns.length ?? 0;
  const masteredCount = progress?.patterns.filter((p) => p.mastered).length ?? 0;
  const masteryDots = Array.from({ length: patternCount }, (_, i) => i < masteredCount);

  return (
    <button
      className="game-card game-card--word-builder"
      onClick={() => navigate("/build")}
      aria-label="Word Builder game"
    >
      <div className="game-card-icon" aria-hidden="true">🧩</div>
      <div className="game-card-content">
        <h3 className="game-card-title">Word Builder</h3>
        {loading ? (
          <div className="game-card-subtitle">Loading…</div>
        ) : progress ? (
          <>
            <div className="game-card-level">Level {progress.level}</div>
            <div
              className="game-card-mastery"
              aria-label={`${masteredCount} of ${patternCount} patterns mastered`}
            >
              {masteryDots.map((filled, i) => (
                <span
                  key={i}
                  className={`mastery-dot${filled ? " mastery-dot--filled" : ""}`}
                  aria-hidden="true"
                >
                  {filled ? "●" : "○"}
                </span>
              ))}
              <span className="game-card-mastery-count">
                {" "}
                {masteredCount}/{patternCount} ★
              </span>
            </div>
          </>
        ) : (
          <div className="game-card-subtitle">Build words with prefixes &amp; suffixes!</div>
        )}
      </div>
    </button>
  );
}
