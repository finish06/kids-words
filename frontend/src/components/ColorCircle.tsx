export function isColorUrl(url: string): boolean {
  return url.startsWith("color://");
}

export function parseColorHex(url: string): string {
  return url.replace("color://", "");
}

export function ColorCircle({ color }: { color: string }) {
  const isWhite = color === "#f8fafc";
  return (
    <div
      className={`color-circle ${isWhite ? "color-circle-white" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}
