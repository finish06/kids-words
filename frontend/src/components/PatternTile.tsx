import type { PatternOption } from "../types";

export interface PatternTileProps {
  pattern: PatternOption;
  state: "default" | "correct" | "wrong";
  onTap: (patternId: string) => void;
}

export function PatternTile({ pattern, state, onTap }: PatternTileProps) {
  const className = [
    "pattern-tile",
    `pattern-tile--${pattern.type}`,
    state === "correct" ? "pattern-tile--correct" : "",
    state === "wrong" ? "pattern-tile--wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={className}
      onClick={() => onTap(pattern.id)}
      aria-label={`Pattern ${pattern.text}, ${pattern.type}`}
    >
      {pattern.text}
    </button>
  );
}
