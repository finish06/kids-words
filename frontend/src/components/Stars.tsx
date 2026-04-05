interface StarsProps {
  level: number;
  size?: "small" | "medium" | "large";
  animated?: boolean;
}

export function Stars({ level, size = "medium", animated = false }: StarsProps) {
  const sizes = { small: "1rem", medium: "1.5rem", large: "2rem" };
  const fontSize = sizes[size];

  return (
    <span
      className={`stars-display ${animated && level === 3 ? "mastery-burst" : ""}`}
      style={{ fontSize }}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={i <= level ? "star-filled" : "star-empty"}
        >
          {i <= level ? "\u2B50" : "\u2606"}
        </span>
      ))}
    </span>
  );
}
