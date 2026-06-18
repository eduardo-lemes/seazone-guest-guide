import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders a not-found heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("shows a helpful message about the property code", () => {
    render(<NotFound />);
    expect(screen.getByText(/imóvel não encontrado/i)).toBeInTheDocument();
  });

  it("has a link back to home", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: /voltar ao início/i })).toHaveAttribute("href", "/");
  });

  it("shows available property links", () => {
    render(<NotFound />);
    expect(screen.getByRole("link", { name: /FLN001/i })).toHaveAttribute("href", "/FLN001");
  });
});
