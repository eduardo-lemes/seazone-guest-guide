import Image from "next/image";

const LINKS = [
  {
    label: "seazone.com.br",
    href: "https://seazone.com.br/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/destinoseazone/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/destinoseazone/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-[#1a2a4a]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Image
              src="/seazone-logo-azul.png"
              alt="Seazone"
              width={108}
              height={18}
              className="brightness-0 invert"
            />
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              Gestão inteligente de imóveis por temporada. Conectando hóspedes a experiências únicas em todo o Brasil.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
              Seazone
            </p>
            {LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
              >
                <span className="text-white/30">{icon}</span>
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Seazone Serviços Ltda. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/20">
            Guia do Hóspede — gerado com IA
          </p>
        </div>
      </div>
    </footer>
  );
}
