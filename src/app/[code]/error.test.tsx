import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "./error";

describe("ErrorPage", () => {
  const mockError = new Error("Test error") as Error & { digest?: string };
  const mockRetry = vi.fn();

  it("renders an error heading", () => {
    render(<ErrorPage error={mockError} unstable_retry={mockRetry} />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("shows an error message", () => {
    render(<ErrorPage error={mockError} unstable_retry={mockRetry} />);
    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
  });

  it("renders a retry button", () => {
    render(<ErrorPage error={mockError} unstable_retry={mockRetry} />);
    expect(screen.getByRole("button", { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it("calls unstable_retry when retry button is clicked", () => {
    render(<ErrorPage error={mockError} unstable_retry={mockRetry} />);
    fireEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));
    expect(mockRetry).toHaveBeenCalledOnce();
  });
});
