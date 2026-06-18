"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, MessageCircle, Sun, ArrowRight, Sparkles } from "lucide-react";
import type { ExperienceGuideContent } from "@/types/property";

const MONTHS_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

function currentMonthLabel(city: string) {
  return `${MONTHS_PT[new Date().getMonth()]} em ${city}`;
}

function truncateToTwoSentences(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(" ");
}

type Props = {
  propertyName: string;
  propertyCode: string;
  city: string;
};

export function WelcomeBanner({ propertyName, propertyCode, city }: Props) {
  const [seasonalTip, setSeasonalTip] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/experiences/${propertyCode}`, { method: "POST" })
      .then((r) => (r.ok ? (r.json() as Promise<ExperienceGuideContent>) : null))
      .then((data) => data && setSeasonalTip(data.seasonalTip))
      .catch(() => {});
  }, [propertyCode]);

  function goToExperiencias() {
    window.dispatchEvent(new CustomEvent("switch-tab", { detail: "experiencias" }));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Boas-vindas */}
        <div className="flex flex-col justify-between p-6 md:w-[56%]">
          <div>
            <p className="text-base font-semibold text-[#1a2a4a]">
              Bem-vindo ao{" "}
              <span className="text-[#F07060]">{propertyName}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Este guia reúne tudo que você precisa para a sua estadia — acesso,
              regras e comodidades do imóvel, recomendações personalizadas da
              região e um assistente virtual disponível para qualquer dúvida.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-4">
            {[
              { icon: <MapPin size={13} />, text: "Informações do imóvel" },
              { icon: <Star size={13} />, text: "Experiências na região" },
              { icon: <MessageCircle size={13} />, text: "Assistente virtual" },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="text-[#F07060]">{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Dica da temporada */}
        <div className="flex flex-1 flex-col justify-between border-t border-slate-100 bg-amber-50/60 p-6 md:border-l md:border-t-0">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun size={14} className="text-amber-500" />
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                  Dica da Temporada
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-400">
                <Sparkles size={9} />
                IA
              </span>
            </div>

            {/* Subtítulo dinâmico */}
            <p className="mt-3 text-sm font-semibold text-amber-800">
              {currentMonthLabel(city)}
            </p>

            {/* Conteúdo */}
            {seasonalTip ? (
              <p className="mt-1.5 text-sm leading-relaxed text-amber-700">
                {truncateToTwoSentences(seasonalTip)}
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-amber-200/70" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-amber-200/70" />
              </div>
            )}
          </div>

          <button
            onClick={goToExperiencias}
            className="mt-4 flex w-fit items-center gap-1.5 text-sm font-medium text-[#F07060] transition-colors hover:text-[#e8614f]"
          >
            Ver guia de experiências
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
