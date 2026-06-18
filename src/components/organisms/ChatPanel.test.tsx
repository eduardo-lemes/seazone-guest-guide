import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatPanel } from "./ChatPanel";

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(() => ({
    messages: [],
    sendMessage: vi.fn(),
    status: "ready",
  })),
}));

vi.mock("ai", () => ({
  DefaultChatTransport: vi.fn(),
}));

import { useChat } from "@ai-sdk/react";

describe("ChatPanel", () => {
  beforeEach(() => {
    vi.mocked(useChat).mockReturnValue({
      id: "test-id",
      messages: [],
      sendMessage: vi.fn(),
      status: "ready",
      stop: vi.fn(),
      setMessages: vi.fn(),
      error: undefined,
      clearError: vi.fn(),
      regenerate: vi.fn(),
      resumeStream: vi.fn(),
      addToolResult: vi.fn(),
      addToolOutput: vi.fn(),
      addToolApprovalResponse: vi.fn(),
    });
  });

  it("renders the toggle button", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    expect(screen.getByRole("button", { name: /abrir chat/i })).toBeInTheDocument();
  });

  it("does not show chat window initially", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    expect(screen.queryByText("Assistente")).not.toBeInTheDocument();
  });

  it("opens chat window when toggle button is clicked", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    expect(screen.getByText("Assistente")).toBeInTheDocument();
  });

  it("shows empty state message when no messages exist", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    expect(screen.getByText(/como posso te ajudar/i)).toBeInTheDocument();
  });

  it("renders input and send button when open", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    expect(screen.getByPlaceholderText(/digite sua mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  });

  it("closes chat window when toggle button is clicked again", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    fireEvent.click(screen.getByRole("button", { name: /fechar chat/i }));
    expect(screen.queryByText("Assistente")).not.toBeInTheDocument();
  });
});
