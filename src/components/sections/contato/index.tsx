"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { CharReveal } from "@/components/motion/char-reveal";
import { cn } from "@/lib/utils";
import {
  EMAIL_ADDRESS,
  EMAIL_HREF,
  INSTAGRAM_HREF,
  PRESS_KIT_HREF,
  WHATSAPP_HREF,
} from "@/lib/links";
import { ContatoForm } from "./contato-form";

/**
 * Seção Contato (#contato) — fechamento da landing.
 *
 * Layout (lg+):
 *   [============= header ==============]
 *   [   FORM (col-span-7)   ][ CHANNELS + PRESS KIT (col-span-5) ]
 *
 * O form abre o WhatsApp pré-preenchido (sem backend). À direita, três
 * cards de canal (WhatsApp / E-mail / Instagram) + um botão de download
 * do press kit em PDF.
 *
 * Background: "76" gigante assimétrico (recorrente nas seções) + paleta
 * `racing-blue-deep` pra fechar coerente com o resto da landing.
 */

export function Contato() {
  const reduce = useReducedMotion();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section
      id="contato"
      aria-labelledby="contato-heading"
      className="relative isolate overflow-x-clip bg-racing-blue-deep py-24 lg:py-32"
    >
      <span
        aria-hidden
        className="racing-number-bg pointer-events-none absolute -left-32 bottom-12 select-none opacity-100"
      >
        76
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-12 lg:mb-20">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : undefined}
            transition={
              reduce
                ? { duration: 0.2 }
                : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
            }
            className="font-mono text-xs uppercase tracking-[0.3em] text-racing-mute"
          >
            <span className="text-racing-red">07</span>
            <span
              aria-hidden
              className="mx-3 inline-block h-px w-8 align-middle bg-racing-mute/40"
            />
            Contato
          </motion.p>

          <h2
            id="contato-heading"
            className="mt-3 font-display uppercase leading-[0.88] tracking-tight text-racing-white"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
          >
            <CharReveal
              as="span"
              text="Pronto"
              stagger={0.07}
              delay={0.25}
              viewportAmount={0.3}
            />{" "}
            <CharReveal
              as="span"
              text="pra largar."
              stagger={0.07}
              delay={0.65}
              viewportAmount={0.3}
              className="text-racing-blue-bright"
            />
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : undefined}
            transition={
              reduce
                ? { duration: 0.2 }
                : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 }
            }
            className="mt-6 max-w-[58ch] text-base leading-[1.7] text-racing-white/65 lg:mt-8 lg:text-lg"
          >
            Patrocínio, imprensa ou parceria — fala direto comigo.{" "}
            <span className="text-racing-white/85">
              Sem intermediário, sem agência.
            </span>{" "}
            Resposta em até 24h.
          </motion.p>
        </div>

        {/* Grid: Form + Channels */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-7">
            <ContatoForm />
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-5">
            <ChannelHeader />
            <ChannelCard
              href={WHATSAPP_HREF}
              icon={<MessageCircle className="size-5" strokeWidth={1.7} />}
              kicker="WhatsApp · resposta direta"
              label="(82) 99669-6666"
              accent="red"
              external
            />
            <ChannelCard
              href={EMAIL_HREF}
              icon={<Mail className="size-5" strokeWidth={1.7} />}
              kicker="E-mail"
              label={EMAIL_ADDRESS}
              accent="blue"
            />
            <ChannelCard
              href={INSTAGRAM_HREF}
              icon={<InstagramIcon className="size-5" />}
              kicker="Instagram"
              label="@hilton_loureiro76"
              accent="white"
              external
            />

            {/* Press kit — separador editorial + download CTA */}
            <div className="mt-4 border-t border-racing-white/10 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute">
                <span className="text-racing-red">·</span> Para imprensa
              </p>
              <PressKitButton />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ChannelHeader() {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute">
      <span className="text-racing-red">·</span> Canais diretos
    </p>
  );
}

/**
 * Ícone do Instagram inline — `lucide-react@1.14` (versão usada no projeto)
 * não exporta o `<Instagram />`. SVG de 24x24 com stroke pra casar com o
 * estilo dos outros ícones lucide.
 */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

type Accent = "red" | "blue" | "white";

const ACCENT_CLASSES: Record<Accent, string> = {
  red: "hover:border-racing-red/60 hover:bg-racing-red/5",
  blue: "hover:border-racing-blue-bright/60 hover:bg-racing-blue-bright/5",
  white: "hover:border-racing-white/35 hover:bg-racing-white/5",
};

const ICON_BG_CLASSES: Record<Accent, string> = {
  red: "bg-racing-red/15 text-racing-red group-hover:bg-racing-red/25",
  blue: "bg-racing-blue-bright/15 text-racing-blue-bright group-hover:bg-racing-blue-bright/25",
  white: "bg-racing-white/10 text-racing-white group-hover:bg-racing-white/20",
};

function ChannelCard({
  href,
  icon,
  kicker,
  label,
  accent,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  kicker: string;
  label: string;
  accent: Accent;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {})}
      aria-label={`${kicker} — ${label}${external ? " (abre em nova aba)" : ""}`}
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-sm border border-racing-white/10 bg-racing-blue-deep/40 px-4 py-4 transition-[border-color,background-color] duration-300 sm:px-5",
        ACCENT_CLASSES[accent]
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-sm transition-[background-color] duration-300",
          ICON_BG_CLASSES[accent]
        )}
      >
        {icon}
      </span>
      <span className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute">
          {kicker}
        </span>
        <span className="truncate font-heading text-base font-bold uppercase tracking-wider text-racing-white">
          {label}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-racing-white/40 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-racing-white" />
    </a>
  );
}

function PressKitButton() {
  return (
    <a
      href={PRESS_KIT_HREF}
      download="hilton76-press-kit.pdf"
      aria-label="Baixar press kit oficial em PDF"
      className="group relative mt-3 flex items-center gap-4 overflow-hidden rounded-sm border border-racing-white/10 bg-racing-blue-deep/40 px-5 py-4 transition-[border-color,background-color] duration-300 hover:border-racing-yellow/55 hover:bg-racing-yellow/5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-racing-yellow/15 text-racing-yellow transition-[background-color] duration-300 group-hover:bg-racing-yellow/25">
        <ArrowDownToLine className="size-5" strokeWidth={1.7} />
      </span>
      <span className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute">
          Press kit · PDF
        </span>
        <span className="font-heading text-base font-bold uppercase tracking-wider text-racing-white">
          Baixar mídia em alta
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 font-mono text-[9px] uppercase tracking-[0.3em] text-racing-mute/70">
        ~7 MB
      </span>
    </a>
  );
}
