import { render, screen } from "@testing-library/react";
import { TopNav } from "./TopNav";

describe("TopNav", () => {
  it("renders the Seazone logo", () => {
    render(<TopNav />);
    expect(screen.getByAltText("Seazone")).toBeInTheDocument();
  });

  it("renders the guide label", () => {
    render(<TopNav />);
    expect(screen.getByText("Guia do Hóspede")).toBeInTheDocument();
  });

  it("renders as a header element", () => {
    const { container } = render(<TopNav />);
    expect(container.querySelector("header")).toBeInTheDocument();
  });
});
