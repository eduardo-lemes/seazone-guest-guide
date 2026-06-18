import Image from "next/image";

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
        <Image
          src="/seazone-logo-azul.png"
          alt="Seazone"
          width={110}
          height={18}
          className="object-contain"
          priority
        />
        <span className="h-5 w-px bg-slate-200" />
        <span className="text-sm font-medium text-slate-500">Guia do Hóspede</span>
      </div>
    </header>
  );
}
