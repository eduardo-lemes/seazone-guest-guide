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

  it("tells the user to check the link from the host", () => {
    render(<NotFound />);
    expect(screen.getByText(/verifique o link recebido/i)).toBeInTheDocument();
  });
});
