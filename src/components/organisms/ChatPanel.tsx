"use client";

import { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { SeazoneIcon } from "@/components/atoms/SeazoneIcon";
import type { UIMessage, TextUIPart } from "ai";

type ChatPanelProps = {
  propertyCode: string;
};

const QUICK_SUGGESTIONS = [
  "Qual é a senha do Wi-Fi?",
  "Como faço o check-in?",
  "O que tem perto?",
];

const TEASER_SESSION_KEY = "seazone_chat_teaser_seen";
const TEASER_DELAY_MS = 2000;
const TEASER_AUTODISMISS_MS = 6000;

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");

  if (!text) return null;

  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F07060]">
          <SeazoneIcon size={14} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F07060]">
        <SeazoneIcon size={14} className="text-white" />
      </div>
      <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
      </div>
    </div>
  );
}

type TeaserProps = {
  visible: boolean;
  onOpen: () => void;
  onDismiss: () => void;
};

function ChatTeaser({ visible, onOpen, onDismiss }: TeaserProps) {
  return (
    <div
      role="dialog"
      aria-label="Convite para o assistente virtual"
      style={{
        transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        pointerEvents: visible ? "auto" : "none",
      }}
      className="fixed bottom-24 right-4 z-50 w-72 sm:right-6"
    >
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-lg transition-shadow hover:shadow-xl">
        <button
          onClick={onOpen}
          aria-label="Abrir assistente virtual"
          className="w-full p-4 text-left"
        >
          <div className="flex items-center gap-2.5 pr-6">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F07060]/10">
              <SeazoneIcon size={17} className="text-[#F07060]" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Posso ajudar?</p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Pergunte sobre Wi‑Fi, check‑in, check‑out ou restaurantes próximos.
          </p>
        </button>
        <button
          onClick={onDismiss}
          aria-label="Fechar convite"
          className="absolute right-3 top-3 rounded-full p-0.5 text-slate-400 transition-colors hover:text-slate-600"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function ChatPanel({ propertyCode }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [input, setInput] = useState("");

  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/chat", body: { propertyCode } })
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (sessionStorage.getItem(TEASER_SESSION_KEY)) return;

    const showTimer = setTimeout(() => setTeaserVisible(true), TEASER_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!teaserVisible) return;
    sessionStorage.setItem(TEASER_SESSION_KEY, "1");
    const dismissTimer = setTimeout(() => setTeaserVisible(false), TEASER_AUTODISMISS_MS);
    return () => clearTimeout(dismissTimer);
  }, [teaserVisible]);

  function dismissTeaser() {
    setTeaserVisible(false);
  }

  function openChat() {
    setTeaserVisible(false);
    setOpen(true);
  }

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
    <>
      <ChatTeaser visible={teaserVisible && !open} onOpen={openChat} onDismiss={dismissTeaser} />

      <button
        onClick={() => { setOpen((o) => !o); setTeaserVisible(false); }}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#F07060] text-white shadow-xl transition-all hover:scale-105 hover:bg-[#e8614f] active:scale-95"
      >
        {open ? <X size={22} /> : <SeazoneIcon size={26} className="text-white" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#F07060] px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <SeazoneIcon size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold leading-none text-white">Assistente Seazone</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <p className="text-xs text-white/80">Online agora</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex h-72 flex-col gap-3 overflow-y-auto bg-slate-50/60 p-4">
            {!hasMessages && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F07060]/10">
                  <SeazoneIcon size={24} className="text-[#F07060]" />
                </div>
                <p className="text-center text-sm text-slate-500">
                  Olá! Tire dúvidas sobre o imóvel.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="rounded-full border border-[#F07060]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#F07060] transition-colors hover:bg-[#F07060]/5"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          {/* Input */}
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
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
