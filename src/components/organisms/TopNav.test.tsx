import { render, screen } from "@testing-library/react";
import { TopNav } from "./TopNav";

describe("TopNav", () => {
  it("renders the brand name and subtitle", () => {
    render(<TopNav />);
    expect(screen.getByText("Guia do Hóspede")).toBeInTheDocument();
    expect(screen.getByText("Seazone")).toBeInTheDocument();
  });

  it("renders as a header element", () => {
    const { container } = render(<TopNav />);
    expect(container.querySelector("header")).toBeInTheDocument();
  });
});
