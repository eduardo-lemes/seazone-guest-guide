import { render, screen } from "@testing-library/react";
import { SeazoneIcon } from "./SeazoneIcon";

describe("SeazoneIcon", () => {
  it("renders an img element with seazone logo", () => {
    render(<SeazoneIcon />);
    expect(screen.getByRole("img", { name: /seazone/i })).toBeInTheDocument();
  });

  it("applies custom size", () => {
    render(<SeazoneIcon size={32} />);
    const img = screen.getByRole("img", { name: /seazone/i });
    expect(img).toHaveAttribute("width", "32");
    expect(img).toHaveAttribute("height", "32");
  });

  it("applies custom className", () => {
    render(<SeazoneIcon className="custom-class" />);
    expect(screen.getByRole("img", { name: /seazone/i })).toHaveClass("custom-class");
  });

  it("applies white filter when white prop is true", () => {
    const { container } = render(<SeazoneIcon white />);
    const img = container.querySelector("img");
    expect(img).toHaveStyle({ filter: "brightness(0) invert(1)" });
  });
});
