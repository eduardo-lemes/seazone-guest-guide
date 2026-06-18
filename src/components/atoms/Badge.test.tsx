import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders the label", () => {
    render(<Badge label="WiFi" />);
    expect(screen.getByText("WiFi")).toBeInTheDocument();
  });

  it("applies default variant by default", () => {
    const { container } = render(<Badge label="WiFi" />);
    expect(container.firstChild).toHaveClass("bg-slate-100");
  });

  it("applies success variant", () => {
    const { container } = render(<Badge label="Disponível" variant="success" />);
    expect(container.firstChild).toHaveClass("bg-emerald-100");
  });
});
