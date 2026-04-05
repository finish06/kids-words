import { Icon } from "./Icon";

interface StarsProps {
  level: number;
  size?: "small" | "medium" | "large";
  animated?: boolean;
}

export function Stars({ level, size = "medium", animated = false }: StarsProps) {
  const iconSizes = { small: 16, medium: 24, large: 32 };
  const iconSize = iconSizes[size];

  return (
    <span
      className={`stars-display ${animated && level === 3 ? "mastery-burst" : ""}`}
    >
      {[1, 2, 3].map((i) => (
        <Icon
          key={i}
          name={i <= level ? "star-filled" : "star-empty"}
          size={iconSize}
          className={i <= level ? "star-filled" : "star-empty"}
        />
      ))}
    </span>
  );
}
