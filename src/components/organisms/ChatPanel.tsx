"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send, X, Copy, Check, Phone, Wifi, Clock, KeyRound, User, Car, MapPin, ExternalLink,
} from "lucide-react";
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

const TEASER_DELAY_MS = 2000;

// ---------- Structured response types ----------

type StructuredMessage =
  | { type: "wifi"; network: string; password: string }
  | { type: "checkin"; time: string }
  | { type: "checkout"; time: string }
  | { type: "access"; accessType: string; instructions: string; code?: string }
  | { type: "contact"; name: string; phone: string }
  | { type: "parking"; available: boolean; instructions: string }
  | { type: "place"; name: string; description: string; category: "restaurant" | "pharmacy" | "supermarket" | "attraction" | "other" }
  | { type: "places_list"; category: "restaurant" | "pharmacy" | "supermarket" | "attraction" | "other"; items: { name: string; description: string }[] };

function parseStructured(text: string): StructuredMessage | null {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  }
  if (!t.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(t) as Record<string, unknown>;
    const valid = ["wifi", "checkin", "checkout", "access", "contact", "parking", "place", "places_list"];
    if (typeof parsed.type === "string" && valid.includes(parsed.type)) {
      return parsed as StructuredMessage;
    }
    return null;
  } catch {
    return null;
  }
}

/** Returns true when the text looks like an in-progress JSON blob */
function isLikelyStreamingJson(text: string): boolean {
  const t = text.trim();
  return t.startsWith("{") && !t.endsWith("}");
}

// ---------- Copy button ----------

function CopyBtn({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
        copied
          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
      {copied ? "Copiado!" : label}
    </button>
  );
}

// ---------- Card shell ----------

function CardShell({
  icon,
  title,
  accentColor = "#F07060",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full max-w-[82%] overflow-hidden rounded-2xl rounded-bl-sm border border-slate-200 bg-white shadow-sm"
      style={{ borderTop: `2.5px solid ${accentColor}` }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5">
        <span style={{ color: accentColor }}>{icon}</span>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {title}
        </p>
      </div>
      <div className="px-4 pb-4 pt-1">{children}</div>
    </div>
  );
}

// ---------- Field row inside cards ----------

function FieldRow({
  label,
  value,
  copyValue,
  mono = false,
}: {
  label: string;
  value: string;
  copyValue?: string;
  mono?: boolean;
}) {
  return (
    <div className="mt-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p
          className={`text-sm font-semibold text-slate-800 ${
            mono ? "rounded-md bg-slate-50 px-2 py-1 font-mono tracking-wider" : ""
          }`}
        >
          {value}
        </p>
        {copyValue !== undefined && <CopyBtn value={copyValue} />}
      </div>
    </div>
  );
}

// ---------- Card variants ----------

function WifiCard({ network, password }: { network: string; password: string }) {
  return (
    <CardShell icon={<Wifi size={13} />} title="Wi-Fi">
      <FieldRow label="Rede" value={network} copyValue={network} />
      <FieldRow label="Senha" value={password} copyValue={password} mono />
    </CardShell>
  );
}

function CheckTimeCard({ type, time }: { type: "checkin" | "checkout"; time: string }) {
  const isIn = type === "checkin";
  return (
    <CardShell icon={<Clock size={13} />} title={isIn ? "Check-in" : "Check-out"}>
      <p className="text-xs text-slate-500">{isIn ? "A partir das" : "Até"}</p>
      <p className="mt-0.5 text-3xl font-bold tracking-tight text-slate-900">{time}</p>
    </CardShell>
  );
}

function AccessCard({
  accessType,
  instructions,
  code,
}: {
  accessType: string;
  instructions: string;
  code?: string;
}) {
  return (
    <CardShell icon={<KeyRound size={13} />} title="Acesso ao imóvel">
      <p className="mt-1 text-xs font-medium text-slate-500">{accessType}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-700">{instructions}</p>
      {code && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Código
            </p>
            <p className="mt-0.5 font-mono text-xl font-bold tracking-[0.2em] text-slate-900">
              {code}
            </p>
          </div>
          <CopyBtn value={code} label="Copiar código" />
        </div>
      )}
    </CardShell>
  );
}

function ContactCard({ name, phone }: { name: string; phone: string }) {
  const formatted = phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  return (
    <CardShell icon={<User size={13} />} title="Contato">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{name}</p>
          <p className="mt-0.5 text-xs text-slate-400">{formatted}</p>
        </div>
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-1.5 rounded-xl bg-[#F07060] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#e8614f] hover:shadow-md active:scale-95"
        >
          <Phone size={12} />
          Ligar
        </a>
      </div>
    </CardShell>
  );
}

function ParkingCard({ available, instructions }: { available: boolean; instructions: string }) {
  return (
    <CardShell
      icon={<Car size={13} />}
      title="Estacionamento"
      accentColor={available ? "#10b981" : "#94a3b8"}
    >
      <div className="mt-1 flex items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            available
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {available ? "Disponível" : "Não disponível"}
        </span>
      </div>
      {instructions && (
        <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-slate-600">
          <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
          {instructions}
        </p>
      )}
    </CardShell>
  );
}

const PLACE_CATEGORY_CONFIG: Record<string, { color: string; label: string }> = {
  restaurant:  { color: "#f97316", label: "Restaurante" },
  pharmacy:    { color: "#22c55e", label: "Farmácia" },
  supermarket: { color: "#a855f7", label: "Mercado" },
  attraction:  { color: "#3b82f6", label: "Atração" },
  other:       { color: "#64748b", label: "Local" },
};

function PlaceCard({
  name,
  description,
  category,
}: {
  name: string;
  description: string;
  category: string;
}) {
  const cfg = PLACE_CATEGORY_CONFIG[category] ?? PLACE_CATEGORY_CONFIG.other;

  function handleViewOnMap() {
    window.dispatchEvent(new CustomEvent("focus-map", { detail: { name } }));
  }

  return (
    <CardShell icon={<MapPin size={13} />} title={cfg.label} accentColor={cfg.color}>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-slate-800">{name}</p>
        <p className="text-xs leading-relaxed text-slate-500">{description}</p>
        <div className="mt-1 flex flex-wrap gap-2">
          <button
            onClick={handleViewOnMap}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
          >
            <MapPin size={11} className="text-[#F07060]" />
            Ver no mapa
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            <ExternalLink size={11} />
            Google Maps
          </a>
        </div>
      </div>
    </CardShell>
  );
}

const PLACES_LIST_LABELS: Record<string, string> = {
  restaurant: "Restaurantes próximos",
  pharmacy: "Farmácias próximas",
  supermarket: "Mercados próximos",
  attraction: "Atrações próximas",
  other: "Locais próximos",
};

function PlacesListCard({
  category,
  items,
}: {
  category: string;
  items: { name: string; description: string }[];
}) {
  const cfg = PLACE_CATEGORY_CONFIG[category] ?? PLACE_CATEGORY_CONFIG.other;
  const title = PLACES_LIST_LABELS[category] ?? "Locais próximos";

  return (
    <CardShell icon={<MapPin size={13} />} title={title} accentColor={cfg.color}>
      <div className="mt-1 space-y-3">
        {items.map((item, i) => (
          <div key={i} className={i > 0 ? "border-t border-slate-100 pt-3" : ""}>
            <p className="text-[13px] font-semibold text-slate-800">{item.name}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("focus-map", { detail: { name: item.name } })
                  )
                }
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
              >
                <MapPin size={10} className="text-[#F07060]" />
                Ver no mapa
              </button>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <ExternalLink size={10} />
                Google Maps
              </a>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

function StructuredCard({ data }: { data: StructuredMessage }) {
  switch (data.type) {
    case "wifi":
      return <WifiCard network={data.network} password={data.password} />;
    case "checkin":
      return <CheckTimeCard type="checkin" time={data.time} />;
    case "checkout":
      return <CheckTimeCard type="checkout" time={data.time} />;
    case "access":
      return (
        <AccessCard
          accessType={data.accessType}
          instructions={data.instructions}
          code={data.code}
        />
      );
    case "contact":
      return <ContactCard name={data.name} phone={data.phone} />;
    case "parking":
      return <ParkingCard available={data.available} instructions={data.instructions} />;
    case "place":
      return <PlaceCard name={data.name} description={data.description} category={data.category} />;
    case "places_list":
      return <PlacesListCard category={data.category} items={data.items} />;
  }
}

// ---------- Smart text renderer ----------

function SmartText({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim() !== "");
  const isList = lines.some((l) => l.trim().startsWith("- ") || l.trim().startsWith("• "));

  if (isList) {
    return (
      <ul className="space-y-1.5">
        {lines.map((line, i) => {
          const content = line.replace(/^[-•]\s*/, "").trim();
          return (
            <li key={i} className="flex items-start gap-1.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F07060]/60" />
              <span className="text-sm leading-relaxed text-slate-700">{content}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      {lines.map((line, i) => (
        <p key={i} className={`text-sm leading-relaxed text-slate-800 ${i > 0 ? "mt-1.5" : ""}`}>
          {line}
        </p>
      ))}
    </>
  );
}

// ---------- Message bubbles ----------

const fadeInStyle: React.CSSProperties = {
  animation: "chatMsgIn 0.22s ease both",
};

function MessageBubble({
  message,
  isStreaming,
}: {
  message: UIMessage;
  isStreaming: boolean;
}) {
  const text = message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");

  if (!text) return null;

  const isUser = message.role === "user";

  if (!isUser) {
    // Suppress raw JSON while it's being streamed
    if (isStreaming && isLikelyStreamingJson(text)) return null;

    const structured = parseStructured(text);
    if (structured) {
      return (
        <div className="flex items-end gap-2" style={fadeInStyle}>
          <BotAvatar />
          <StructuredCard data={structured} />
        </div>
      );
    }

    return (
      <div className="flex items-end gap-2" style={fadeInStyle}>
        <BotAvatar />
        <div className="max-w-[82%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <SmartText text={text} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row-reverse items-end gap-2" style={fadeInStyle}>
      <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-[#F07060] px-4 py-2.5">
        <p className="text-sm leading-relaxed text-white">{text}</p>
      </div>
    </div>
  );
}

function BotAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F07060]">
      <SeazoneIcon size={14} className="text-white" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.3s]" />
      </div>
    </div>
  );
}

// ---------- Teaser ----------

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

// ---------- Main component ----------

export function ChatPanel({ propertyCode }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [transport] = useState(
    () => new DefaultChatTransport({ api: "/api/chat", body: { propertyCode } })
  );

  const { messages, sendMessage, status } = useChat({ transport });

  const isLoading = status === "submitted" || status === "streaming";
  const isStreaming = status === "streaming";
  const hasMessages = messages.length > 0;

  useEffect(() => {
    const showTimer = setTimeout(() => setTeaserVisible(true), TEASER_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
      {/* Keyframe for message entry animation */}
      <style>{`
        @keyframes chatMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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

          {/* Messages area */}
          <div className="flex h-[26rem] flex-col gap-3 overflow-y-auto bg-slate-50/60 p-4">
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
              <MessageBubble
                key={m.id}
                message={m}
                isStreaming={isStreaming && m === messages[messages.length - 1]}
              />
            ))}

            {/* Show typing indicator when submitted (before stream starts) or when streaming a JSON card */}
            {(status === "submitted" ||
              (isStreaming &&
                isLikelyStreamingJson(
                  messages[messages.length - 1]?.parts
                    .filter((p): p is TextUIPart => p.type === "text")
                    .map((p) => p.text)
                    .join("") ?? ""
                ))) && <TypingIndicator />}

            <div ref={bottomRef} />
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
