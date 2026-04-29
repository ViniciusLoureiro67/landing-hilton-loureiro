import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { Hilton76Logo } from "@/components/Hilton76Logo";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const WHATSAPP_HREF =
  "https://wa.me/5582996696666?text=Ol%C3%A1%20Hilton%2C%20vim%20pelo%20site%20oficial%20e%20gostaria%20de%20conversar.";
const INSTAGRAM_HREF = "https://www.instagram.com/hilton_loureiro76/";
const EMAIL_HREF = "mailto:hiltonloureiro@hotmail.com";

export function Footer() {
  return (
    <footer
      id="contato"
      className="relative overflow-hidden border-t border-white/5 bg-racing-blue-deep"
    >
      <span aria-hidden className="racing-number-bg absolute -right-10 -top-24 select-none opacity-60">
        76
      </span>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <Hilton76Logo className="h-10 w-auto" />
          <p className="mt-4 max-w-sm text-sm text-racing-mute">
            Piloto profissional do Campeonato Brasileiro Moto1000GP.
            Bicampeão Brasileiro Endurance 600cc (2024–2025).
          </p>
        </div>

        <nav className="lg:col-span-3">
          <h3 className="font-heading text-xs uppercase tracking-[0.25em] text-racing-mute">
            Site
          </h3>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li><Link href="#sobre" className="hover:text-racing-red transition-colors">Sobre</Link></li>
            <li><Link href="#temporada" className="hover:text-racing-red transition-colors">Temporada 2026</Link></li>
            <li><Link href="#galeria" className="hover:text-racing-red transition-colors">Galeria</Link></li>
            <li><Link href="#patrocinio" className="hover:text-racing-red transition-colors">Para sua marca</Link></li>
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h3 className="font-heading text-xs uppercase tracking-[0.25em] text-racing-mute">
            Contato
          </h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 hover:text-racing-red transition-colors"
              >
                <MessageCircle className="size-4 text-racing-red" />
                <span>WhatsApp <span className="text-racing-mute">· (82) 99669-6666</span></span>
              </a>
            </li>
            <li>
              <a
                href={INSTAGRAM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 hover:text-racing-red transition-colors"
              >
                <InstagramIcon className="size-4 text-racing-red" />
                <span>@hilton_loureiro76</span>
              </a>
            </li>
            <li>
              <a
                href={EMAIL_HREF}
                className="group inline-flex items-center gap-3 hover:text-racing-red transition-colors"
              >
                <Mail className="size-4 text-racing-red" />
                <span>hiltonloureiro@hotmail.com</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-racing-mute sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Hilton Loureiro · Todos os direitos reservados.</span>
          <span className="font-mono uppercase tracking-widest">#76 · pt-BR</span>
        </div>
      </div>
    </footer>
  );
}
