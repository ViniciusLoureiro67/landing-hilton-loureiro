"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useHeroEntrySkip } from "./use-hero-entry-skip";
import { useHeroScrollProgress } from "./hero-scroll-context";

/**
 * Faixa de patrocinadores oficiais — loop horizontal infinito.
 *
 * Estrutura editorial: a cada passada do loop, um label "PATROCINADORES
 * OFICIAIS" antecede a sequência de marcas, criando ritmo e contexto
 * (o usuário entende imediatamente o que aquela faixa é).
 *
 * Loop sem corte: render duas cópias do conteúdo lado a lado e anima
 * o container `-50%` em X. Pausa em `prefers-reduced-motion` (sem
 * animação, apenas a primeira cópia visível).
 */

const SPONSORS = [
  "Garagem 57",
  "Formafit",
  "AC Vitha Clinic",
  "Brasil da Sorte",
] as const;

const LABEL = "Patrocinadores oficiais";

const Diamond = (
  <span
    aria-hidden
    className="mx-6 inline-block size-[6px] rotate-45 bg-racing-red sm:mx-9 sm:size-2"
  />
);

const Spacer = (
  <span aria-hidden className="mx-8 inline-block h-px w-10 bg-white/15 sm:mx-12 sm:w-16" />
);

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center whitespace-nowrap font-heading uppercase">
      <span className="flex items-center text-[10px] tracking-[0.55em] text-racing-mute/70 sm:text-xs">
        {LABEL}
      </span>
      {Spacer}
      {SPONSORS.map((name, idx) => (
        <span key={`${name}-${idx}`} className="flex items-center">
          <span className="text-sm font-semibold tracking-[0.32em] text-racing-white/90 sm:text-base">
            {name}
          </span>
          {idx < SPONSORS.length - 1 ? Diamond : null}
        </span>
      ))}
      {Spacer}
    </div>
  );
}

export function HeroMarquee() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();
  const skipAll = reduceMotion || skipEntry;

  // Scroll-driven: fade tardio + leve translate-y. O marquee é o
  // último elemento a sair do hero — segura presença até ~70%.
  const scrollProgress = useHeroScrollProgress();
  const scrollOpacity = useTransform(scrollProgress, [0, 0.45, 0.75], [1, 1, 0]);
  const scrollY = useTransform(scrollProgress, [0, 0.75], [0, 28]);

  return (
    // Camada externa: scroll-driven (opacity + translateY conforme rola).
    <motion.div
      style={reduceMotion ? undefined : { opacity: scrollOpacity, y: scrollY }}
      className="pointer-events-none absolute inset-x-0 bottom-24 z-10 sm:bottom-28"
      aria-label="Patrocinadores oficiais"
    >
      {/* Camada interna: entry animation (entra após o flash da largada). */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: skipAll ? 0 : 4.35,
          duration: skipAll ? 0.01 : 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="overflow-hidden border-y border-white/[0.06] bg-racing-blue-deep/40 py-4 backdrop-blur-sm"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-racing-blue-deep to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-racing-blue-deep to-transparent sm:w-32" />

        <div
          className={
            reduceMotion
              ? "flex w-max"
              : "flex w-max [animation:marquee-x_38s_linear_infinite]"
          }
        >
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </motion.div>
    </motion.div>
  );
}
