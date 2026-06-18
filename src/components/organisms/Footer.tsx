import Image from "next/image";
import { Instagram, Linkedin, ExternalLink } from "lucide-react";

const LINKS = [
  { label: "seazone.com.br", href: "https://seazone.com.br/", icon: <ExternalLink size={13} /> },
  { label: "Instagram", href: "https://www.instagram.com/destinoseazone/", icon: <Instagram size={13} /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/destinoseazone/", icon: <Linkedin size={13} /> },
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
