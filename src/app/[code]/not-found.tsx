import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowLeft } from "lucide-react";

const PROPERTIES = [
  { code: "FLN001", city: "Florianópolis — SC" },
  { code: "GRM001", city: "Gramado — RS" },
  { code: "POA001", city: "Porto Alegre — RS" },
  { code: "RIO001", city: "Rio de Janeiro — RJ" },
  { code: "CWB001", city: "Curitiba — PR" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Nav */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <Image src="/seazone-logo-azul.png" alt="Seazone" width={110} height={28} />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F07060]/10">
          <MapPin size={32} className="text-[#F07060]" />
        </div>

        {/* Message */}
        <h1 className="mt-6 text-2xl font-bold text-[#1a2a4a]">Imóvel não encontrado</h1>
        <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-slate-500">
          Este código não corresponde a nenhum imóvel cadastrado. Verifique o link recebido do seu anfitrião.
        </p>

        {/* Property list */}
        <div className="mt-10 w-full max-w-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Imóveis disponíveis
          </p>
          <div className="flex flex-col gap-2">
            {PROPERTIES.map(({ code, city }) => (
              <Link
                key={code}
                href={`/${code}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all hover:border-[#F07060]/40 hover:shadow-sm"
              >
                <span className="font-semibold text-[#1a2a4a]">{code}</span>
                <span className="text-slate-400">{city}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="mt-8 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-[#1a2a4a]"
        >
          <ArrowLeft size={14} />
          Voltar ao início
        </Link>
      </main>
    </div>
  );
}
