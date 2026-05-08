import { describe, it, expect } from "vitest";
import {
  isColorUrl,
  parseColorHex,
  isShapeUrl,
  parseShapeName,
  isBodyPartUrl,
  parseBodyPartName,
} from "../colorUtils";

describe("colorUtils", () => {
  describe("isColorUrl", () => {
    it("returns true for color:// urls", () => {
      expect(isColorUrl("color://#ff0000")).toBe(true);
    });

    it("returns false for non-color urls", () => {
      expect(isColorUrl("/images/cat.png")).toBe(false);
      expect(isColorUrl("shape://circle")).toBe(false);
      expect(isColorUrl("bodypart://hand")).toBe(false);
      expect(isColorUrl("")).toBe(false);
    });
  });

  describe("parseColorHex", () => {
    it("strips the color:// prefix", () => {
      expect(parseColorHex("color://#ff0000")).toBe("#ff0000");
      expect(parseColorHex("color://#abcdef")).toBe("#abcdef");
    });

    it("returns the string unchanged when no prefix is present", () => {
      expect(parseColorHex("#ff0000")).toBe("#ff0000");
    });
  });

  describe("isShapeUrl", () => {
    it("returns true for shape:// urls", () => {
      expect(isShapeUrl("shape://circle")).toBe(true);
    });

    it("returns false for non-shape urls", () => {
      expect(isShapeUrl("/images/circle.png")).toBe(false);
      expect(isShapeUrl("color://#ff0000")).toBe(false);
      expect(isShapeUrl("")).toBe(false);
    });
  });

  describe("parseShapeName", () => {
    it("strips the shape:// prefix", () => {
      expect(parseShapeName("shape://circle")).toBe("circle");
      expect(parseShapeName("shape://triangle")).toBe("triangle");
    });

    it("returns the string unchanged when no prefix is present", () => {
      expect(parseShapeName("circle")).toBe("circle");
    });
  });

  describe("isBodyPartUrl", () => {
    it("returns true for bodypart:// urls", () => {
      expect(isBodyPartUrl("bodypart://hand")).toBe(true);
    });

    it("returns false for non-bodypart urls", () => {
      expect(isBodyPartUrl("/images/hand.png")).toBe(false);
      expect(isBodyPartUrl("shape://circle")).toBe(false);
      expect(isBodyPartUrl("")).toBe(false);
    });
  });

  describe("parseBodyPartName", () => {
    it("strips the bodypart:// prefix", () => {
      expect(parseBodyPartName("bodypart://hand")).toBe("hand");
      expect(parseBodyPartName("bodypart://eye")).toBe("eye");
    });

    it("returns the string unchanged when no prefix is present", () => {
      expect(parseBodyPartName("hand")).toBe("hand");
    });
  });
});
