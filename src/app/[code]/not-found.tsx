import Image from "next/image";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <Image src="/seazone-logo-azul.png" alt="Seazone" width={110} height={28} />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F07060]/10">
          <MapPin size={32} className="text-[#F07060]" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-[#1a2a4a]">Imóvel não encontrado</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Este link não corresponde a nenhum imóvel cadastrado. Verifique o link recebido do seu anfitrião.
        </p>
      </main>
    </div>
  );
}
