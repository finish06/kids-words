export function isColorUrl(url: string): boolean {
  return url.startsWith("color://");
}

export function parseColorHex(url: string): string {
  return url.replace("color://", "");
}

export function ColorCircle({ color }: { color: string }) {
  return (
    <div
      className="color-circle"
      style={{
        backgroundColor: color,
        border: color === "#f8fafc" ? "3px solid #cbd5e1" : "none",
      }}
    />
  );
}
