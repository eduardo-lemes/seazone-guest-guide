"use client";

import { useState } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage, TextUIPart } from "ai";

type ChatPanelProps = {
  propertyCode: string;
};

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");

  if (!text) return null;

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          message.role === "user"
            ? "bg-emerald-600 text-white"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
      </div>
    </div>
  );
}

export function ChatPanel({ propertyCode }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/chat", body: { propertyCode } })
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 shadow-lg text-white"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col rounded-2xl border border-slate-200 bg-white shadow-xl sm:right-6">
          <div className="rounded-t-2xl bg-emerald-600 px-4 py-3">
            <p className="font-semibold text-white">Assistente</p>
            <p className="text-xs text-emerald-100">Tire suas dúvidas sobre o imóvel</p>
          </div>

          <div className="flex h-72 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-center text-xs text-slate-400">Olá! Como posso te ajudar?</p>
            )}
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Enviar"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
