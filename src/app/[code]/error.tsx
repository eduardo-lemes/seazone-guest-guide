"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

type ErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle size={36} className="text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Algo deu errado</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Ocorreu um erro ao carregar esta página. Tente novamente.
      </p>
      <button
        onClick={unstable_retry}
        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white"
      >
        Tentar novamente
      </button>
    </div>
  );
}
