"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { SeazoneIcon } from "@/components/atoms/SeazoneIcon";
import type { UIMessage, TextUIPart } from "ai";

type Props = { propertyCode: string };

const QUICK_SUGGESTIONS = [
  "Qual a senha do Wi-Fi?",
  "Como faço check-in?",
  "Que restaurantes tem perto?",
  "A que horas é o check-out?",
];

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");
  if (!text) return null;
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F07060]">
          <SeazoneIcon size={12} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-[#F07060] text-white"
            : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F07060]">
        <SeazoneIcon size={12} className="text-white" />
      </div>
      <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3.5 py-3 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
      </div>
    </div>
  );
}

export function ChatSidebar({ propertyCode }: Props) {
  const [input, setInput] = useState("");

  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/chat", body: { propertyCode } })
  );

  const { messages, sendMessage, status } = useChat({ transport });
  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  function handleSend(text: string) {
    if (!text.trim() || isLoading) return;
    sendMessage({ text: text.trim() });
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend(input);
  }

  return (
    <div
      className="sticky flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ top: "calc(3.5rem + 1px)", maxHeight: "calc(100vh - 5rem)" }}
    >
      <div className="flex items-center gap-2.5 bg-[#F07060] px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
          <SeazoneIcon size={17} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-white">Assistente Seazone</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <p className="text-xs text-white/80">Online</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50/50 p-4">
        {!hasMessages && (
          <div className="flex flex-col gap-2">
            <p className="text-center text-xs text-slate-400">Tire dúvidas sobre o imóvel.</p>
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 transition-colors hover:border-[#F07060]/30 hover:text-[#F07060]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>

      {!hasMessages && (
        <p className="border-t border-slate-100 bg-white px-4 py-2 text-center text-[10px] text-slate-400">
          As respostas são baseadas nas informações do imóvel.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-100 bg-white p-3">
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
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
