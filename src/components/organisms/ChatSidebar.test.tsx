import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatSidebar } from "./ChatSidebar";

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
  id: "test",
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

describe("ChatSidebar", () => {
  beforeEach(() => {
    vi.mocked(useChat).mockReturnValue({ ...baseMock });
  });

  it("renders the header with assistant name", () => {
    render(<ChatSidebar propertyCode="FLN001" />);
    expect(screen.getByText("Assistente Seazone")).toBeInTheDocument();
  });

  it("renders online status indicator", () => {
    render(<ChatSidebar propertyCode="FLN001" />);
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("renders quick suggestion buttons", () => {
    render(<ChatSidebar propertyCode="FLN001" />);
    expect(screen.getByText("Qual a senha do Wi-Fi?")).toBeInTheDocument();
  });

  it("renders input and send button", () => {
    render(<ChatSidebar propertyCode="FLN001" />);
    expect(screen.getByPlaceholderText(/digite sua mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  });

  it("sends message on quick suggestion click", () => {
    const mockSend = vi.fn();
    vi.mocked(useChat).mockReturnValue({ ...baseMock, sendMessage: mockSend });
    render(<ChatSidebar propertyCode="FLN001" />);
    fireEvent.click(screen.getByText("Qual a senha do Wi-Fi?"));
    expect(mockSend).toHaveBeenCalledWith({ text: "Qual a senha do Wi-Fi?" });
  });

  it("shows disclaimer text when no messages", () => {
    render(<ChatSidebar propertyCode="FLN001" />);
    expect(screen.getByText(/respostas são baseadas/i)).toBeInTheDocument();
  });
});
