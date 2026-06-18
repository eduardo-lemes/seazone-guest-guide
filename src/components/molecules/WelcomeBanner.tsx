"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, MessageCircle, Sun, ArrowRight } from "lucide-react";
import type { ExperienceGuideContent } from "@/types/property";

type Props = {
  propertyName: string;
  propertyCode: string;
};

export function WelcomeBanner({ propertyName, propertyCode }: Props) {
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
        <div className="flex flex-1 flex-col justify-between p-6">
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
        <div className="flex flex-col justify-between border-t border-slate-100 bg-amber-50 p-6 md:w-[42%] md:border-l md:border-t-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                <Sun size={14} className="text-amber-500" />
              </div>
              <p className="text-sm font-semibold text-amber-700">Dica da Temporada</p>
            </div>

            {seasonalTip ? (
              <p className="mt-3 text-sm leading-relaxed text-amber-900">{seasonalTip}</p>
            ) : (
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-amber-200" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-amber-200" />
                <div className="h-3 w-3/5 animate-pulse rounded bg-amber-200" />
              </div>
            )}
          </div>

          <button
            onClick={goToExperiencias}
            className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[#F07060] transition-colors hover:text-[#e8614f]"
          >
            Ver recomendações da região
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
