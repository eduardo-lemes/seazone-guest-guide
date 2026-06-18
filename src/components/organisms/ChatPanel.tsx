"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { SeazoneIcon } from "@/components/atoms/SeazoneIcon";
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
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          message.role === "user"
            ? "bg-[#F07060] text-white"
            : "border border-slate-200 bg-white text-slate-800 shadow-sm"
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
      <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
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
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#F07060] text-white shadow-xl transition-all hover:scale-105 hover:bg-[#e8614f] active:scale-95"
      >
        {open ? <X size={22} /> : <SeazoneIcon size={26} className="text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6">
          <div className="flex items-center gap-2.5 bg-[#F07060] px-4 py-3.5">
            <SeazoneIcon size={20} className="text-white opacity-90" />
            <div>
              <p className="font-semibold leading-none text-white">Assistente Seazone</p>
              <p className="mt-0.5 text-xs text-white/80">Tire suas dúvidas sobre o imóvel</p>
            </div>
          </div>

          <div className="flex h-72 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-center text-xs text-slate-400">
                Olá! Como posso te ajudar?
              </p>
            )}
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition-colors focus:border-[#F07060] focus:bg-white disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Enviar"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F07060] text-white transition-colors hover:bg-[#e8614f] disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
