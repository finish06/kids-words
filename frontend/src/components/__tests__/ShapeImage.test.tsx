import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ShapeImage } from "../ShapeImage";
import { BodyPartImage } from "../BodyPartImage";

describe("ShapeImage", () => {
  it("renders the named shape when the name is known", () => {
    const { container } = render(<ShapeImage name="CIRCLE" />);
    expect(container.querySelector(".shape-image")).not.toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders a text fallback when the shape name is unknown", () => {
    const { container, getByText } = render(
      <ShapeImage name="not-a-real-shape" />
    );
    expect(container.querySelector(".shape-fallback")).not.toBeNull();
    expect(getByText("not-a-real-shape")).not.toBeNull();
  });
});

describe("BodyPartImage", () => {
  it("renders the named body part when the name is known", () => {
    const { container } = render(<BodyPartImage name="HEAD" />);
    expect(container.querySelector(".shape-image")).not.toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders a text fallback when the body-part name is unknown", () => {
    const { container, getByText } = render(
      <BodyPartImage name="not-a-real-part" />
    );
    expect(container.querySelector(".shape-fallback")).not.toBeNull();
    expect(getByText("not-a-real-part")).not.toBeNull();
  });
});
