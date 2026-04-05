import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColorCircle, isColorUrl, parseColorHex } from "../ColorCircle";

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
    expect(circle?.getAttribute("style")).toContain("background-color: rgb(239, 68, 68)");
  });

  it("adds border for white color", () => {
    const { container } = render(<ColorCircle color="#f8fafc" />);
    const circle = container.querySelector(".color-circle");
    expect(circle?.getAttribute("style")).toContain("border");
  });

  it("no border for non-white color", () => {
    const { container } = render(<ColorCircle color="#ef4444" />);
    const circle = container.querySelector(".color-circle");
    const style = circle?.getAttribute("style") ?? "";
    expect(style).not.toContain("3px solid");
  });
});
