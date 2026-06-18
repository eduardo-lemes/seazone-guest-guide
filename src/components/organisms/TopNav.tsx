import { SeazoneIcon } from "@/components/atoms/SeazoneIcon";

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2.5 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F07060] shadow-sm">
          <SeazoneIcon size={22} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-[#1a2a4a]">Guia do Hóspede</p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F07060]">
            Seazone
          </p>
        </div>
      </div>
    </header>
  );
}
