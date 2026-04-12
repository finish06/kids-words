export function isColorUrl(url: string): boolean {
  return url.startsWith("color://");
}

export function parseColorHex(url: string): string {
  return url.replace("color://", "");
}
