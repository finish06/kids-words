import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColorCircle } from "../ColorCircle";
import { isColorUrl, parseColorHex } from "../colorUtils";

describe("isColorUrl", () => {
  it("returns true for color:// URLs", () => {
    expect(isColorUrl("color://#ef4444")).toBe(true);
  });

  it("returns false for regular URLs", () => {
    expect(isColorUrl("https://example.com/img.png")).toBe(false);
  });
});

describe("parseColorHex", () => {
  it("extracts hex color from color:// URL", () => {
    expect(parseColorHex("color://#ef4444")).toBe("#ef4444");
  });
});

describe("ColorCircle", () => {
  it("renders a circle with the specified color", () => {
    const { container } = render(<ColorCircle color="#ef4444" />);
    const circle = container.querySelector(".color-circle");
    expect(circle).toBeTruthy();
    expect(circle?.getAttribute("style")).toContain("background-color");
  });

  it("adds white class for white color", () => {
    const { container } = render(<ColorCircle color="#f8fafc" />);
    const circle = container.querySelector(".color-circle-white");
    expect(circle).toBeTruthy();
  });

  it("no white class for non-white color", () => {
    const { container } = render(<ColorCircle color="#ef4444" />);
    const circle = container.querySelector(".color-circle-white");
    expect(circle).toBeNull();
  });
});
