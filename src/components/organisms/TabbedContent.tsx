"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Property } from "@/types/property";

const MapView = dynamic(() => import("@/components/organisms/MapView"), {
  ssr: false,
  loading: () => <div className="h-[560px] animate-pulse rounded-2xl bg-slate-100" />,
});

type Tab = "sobre" | "experiencias" | "mapa";

type Props = {
  property: Property;
  accessInfo: React.ReactNode;
  stayRules: React.ReactNode;
  contact: React.ReactNode;
  amenities: React.ReactNode;
  experienceGuide: React.ReactNode;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "sobre", label: "Sobre o Imóvel" },
  { id: "experiencias", label: "Experiências" },
  { id: "mapa", label: "Mapa" },
];

export function TabbedContent({
  property,
  accessInfo,
  stayRules,
  contact,
  amenities,
  experienceGuide,
}: Props) {
  const [active, setActive] = useState<Tab>("sobre");
  const [mapaVisited, setMapaVisited] = useState(false);

  function handleTabClick(id: Tab) {
    if (id === "mapa") setMapaVisited(true);
    setActive(id);
  }

  return (
    <div>
      <nav className="sticky top-14 z-40 border-b border-slate-200 bg-white">
        <div className="flex overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`relative whitespace-nowrap px-6 py-4 text-sm font-medium transition-colors ${
                active === id
                  ? "text-[#F07060]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
              {active === id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F07060]" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="py-8">
        <div hidden={active !== "sobre"} className="space-y-10">
          <section>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Amenidades
            </p>
            {amenities}
          </section>

          <div className="h-px bg-slate-200" />

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Acesso
              </p>
              {accessInfo}
            </section>
            <section className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Regras
              </p>
              {stayRules}
            </section>
            <section className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Contato
              </p>
              {contact}
            </section>
          </div>
        </div>

        <div hidden={active !== "experiencias"}>
          {experienceGuide}
        </div>

        {mapaVisited && (
          <div hidden={active !== "mapa"}>
            <MapView property={property} isActive={active === "mapa"} />
          </div>
        )}
      </div>
    </div>
  );
}
