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

const baseMock = {
  id: "test-id",
  messages: [] as ReturnType<typeof useChat>["messages"],
  sendMessage: vi.fn(),
  status: "ready" as const,
  stop: vi.fn(),
  setMessages: vi.fn(),
  error: undefined,
  clearError: vi.fn(),
  regenerate: vi.fn(),
  resumeStream: vi.fn(),
  addToolResult: vi.fn(),
  addToolOutput: vi.fn(),
  addToolApprovalResponse: vi.fn(),
};

describe("ChatPanel", () => {
  beforeEach(() => {
    vi.mocked(useChat).mockReturnValue({ ...baseMock });
  });

  it("renders the toggle button", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    expect(screen.getByRole("button", { name: /abrir chat/i })).toBeInTheDocument();
  });

  it("does not show chat window initially", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    expect(screen.queryByText("Assistente Seazone")).not.toBeInTheDocument();
  });

  it("opens chat window when toggle button is clicked", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    expect(screen.getByText("Assistente Seazone")).toBeInTheDocument();
  });

  it("shows empty state message when no messages exist", () => {
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    expect(screen.getByText(/tire dúvidas sobre o imóvel/i)).toBeInTheDocument();
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
    expect(screen.queryByText("Assistente Seazone")).not.toBeInTheDocument();
  });

  it("renders user and assistant message bubbles when messages exist", () => {
    vi.mocked(useChat).mockReturnValue({
      ...baseMock,
      messages: [
        { id: "1", role: "user", parts: [{ type: "text", text: "Onde fica o Wi-Fi?" }] },
        { id: "2", role: "assistant", parts: [{ type: "text", text: "A senha está na etiqueta." }] },
      ],
    });
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    expect(screen.getByText("Onde fica o Wi-Fi?")).toBeInTheDocument();
    expect(screen.getByText("A senha está na etiqueta.")).toBeInTheDocument();
  });

  it("shows typing indicator while streaming", () => {
    vi.mocked(useChat).mockReturnValue({ ...baseMock, status: "streaming" });
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    const dots = document.querySelectorAll(".animate-bounce");
    expect(dots.length).toBe(3);
  });

  it("disables input and send button while loading", () => {
    vi.mocked(useChat).mockReturnValue({ ...baseMock, status: "submitted" });
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));
    expect(screen.getByPlaceholderText(/digite sua mensagem/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /enviar/i })).toBeDisabled();
  });

  it("sends message and clears input on form submit", () => {
    const mockSendMessage = vi.fn();
    vi.mocked(useChat).mockReturnValue({ ...baseMock, sendMessage: mockSendMessage });
    render(<ChatPanel propertyCode="FLN001" />);
    fireEvent.click(screen.getByRole("button", { name: /abrir chat/i }));

    const input = screen.getByPlaceholderText(/digite sua mensagem/i);
    fireEvent.change(input, { target: { value: "Qual a senha do Wi-Fi?" } });
    fireEvent.submit(input.closest("form")!);

    expect(mockSendMessage).toHaveBeenCalledWith({ text: "Qual a senha do Wi-Fi?" });
    expect(input).toHaveValue("");
  });
});
