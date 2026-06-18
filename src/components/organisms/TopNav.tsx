import { Waves } from "lucide-react";

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2.5 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
          <Waves size={15} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-slate-900">Guia do Hóspede</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-600">
            Seazone
          </p>
        </div>
      </div>
    </header>
  );
}
