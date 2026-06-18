"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";

export function TopNav() {
  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "Guia do Hóspede Seazone", url: window.location.href }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-[0_1px_0_0_#f0706022,0_2px_0_0_#f0706010]">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
        <Image
          src="/seazone-logo-azul.png"
          alt="Seazone"
          width={140}
          height={22}
          className="object-contain"
          priority
        />
        <span className="h-5 w-px bg-slate-200" />
        <span className="text-sm text-slate-400">Guia do Hóspede</span>

        <div className="ml-auto">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
