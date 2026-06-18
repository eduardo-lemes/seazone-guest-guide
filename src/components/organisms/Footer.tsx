import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#1a2a4a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Image
              src="/seazone-logo-azul.png"
              alt="Seazone"
              width={100}
              height={18}
              className="brightness-0 invert"
            />
            <p className="mt-2 text-sm text-white/50">
              Gestão inteligente de imóveis por temporada
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Seazone Serviços Ltda.
        </div>
      </div>
    </footer>
  );
}
