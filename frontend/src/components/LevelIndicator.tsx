export interface LevelIndicatorProps {
  level: number;
  masteredCount?: number;
  totalPatterns?: number;
}

export function LevelIndicator({
  level,
  masteredCount,
  totalPatterns,
}: LevelIndicatorProps) {
  const showDots =
    typeof masteredCount === "number" && typeof totalPatterns === "number";
  return (
    <div className="level-indicator" aria-label={`Level ${level}`}>
      <span className="level-badge">Level {level}</span>
      {showDots && totalPatterns > 0 && (
        <span className="level-mastery-dots" aria-hidden="true">
          {Array.from({ length: totalPatterns }, (_, i) =>
            i < (masteredCount ?? 0) ? "●" : "○",
          ).join("")}
        </span>
      )}
    </div>
  );
}
