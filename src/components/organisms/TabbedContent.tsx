"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Home, Sparkles, Map } from "lucide-react";
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

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "sobre", label: "Sobre o Imóvel", icon: <Home size={14} /> },
  { id: "experiencias", label: "Experiências", icon: <Sparkles size={14} /> },
  { id: "mapa", label: "Mapa", icon: <Map size={14} /> },
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

  useEffect(() => {
    function onSwitchTab(e: Event) {
      const id = (e as CustomEvent<Tab>).detail;
      handleTabClick(id);
    }
    window.addEventListener("switch-tab", onSwitchTab);
    return () => window.removeEventListener("switch-tab", onSwitchTab);
  }, []);

  return (
    <div>
      <nav className="sticky top-14 z-40 border-b border-slate-200 bg-white">
        <div className="flex overflow-x-auto">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`relative flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-medium transition-colors ${
                active === id
                  ? "text-[#F07060]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="opacity-70">{icon}</span>
              {label}
              {active === id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F07060]" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="py-8 min-h-[640px]">
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
