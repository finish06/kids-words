export function isColorUrl(url: string): boolean {
  return url.startsWith("color://");
}

export function parseColorHex(url: string): string {
  return url.replace("color://", "");
}

export function isShapeUrl(url: string): boolean {
  return url.startsWith("shape://");
}

export function parseShapeName(url: string): string {
  return url.replace("shape://", "");
}

export function isBodyPartUrl(url: string): boolean {
  return url.startsWith("bodypart://");
}

export function parseBodyPartName(url: string): string {
  return url.replace("bodypart://", "");
}
