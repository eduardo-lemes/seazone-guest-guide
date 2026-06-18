import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <MapPin size={36} className="text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Imóvel não encontrado</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Este código de imóvel não existe. Verifique o link recebido do seu anfitrião.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
