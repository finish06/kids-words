export function ColorCircle({ color }: { color: string }) {
  const isWhite = color === "#f8fafc";
  return (
    <div
      className={`color-circle ${isWhite ? "color-circle-white" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}
