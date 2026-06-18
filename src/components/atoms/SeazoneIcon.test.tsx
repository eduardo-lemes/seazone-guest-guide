import { render } from "@testing-library/react";
import { SeazoneIcon } from "./SeazoneIcon";

describe("SeazoneIcon", () => {
  it("renders an svg element", () => {
    const { container } = render(<SeazoneIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(<SeazoneIcon size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("applies custom className", () => {
    const { container } = render(<SeazoneIcon className="text-red-500" />);
    expect(container.querySelector("svg")).toHaveClass("text-red-500");
  });
});
