"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Marquee horizontal infinito — palmarés + marcas + tagline curtas.
 *
 * Loop sem corte: render duas cópias do conteúdo lado a lado e anima
 * o container `-50%` em X. Pausa em `prefers-reduced-motion` (sem
 * animação, apenas a primeira cópia visível).
 */

const TOKENS = [
  "Bicampeão Brasileiro Endurance 600cc",
  "2024",
  "2025",
  "Yamaha YZF-R1",
  "Pirelli",
  "LS2",
  "Alpinestars",
  "Motul",
  "PRT Racing",
  "Garagem 53",
  "Moto1000GP 2026",
];

const SEPARATOR = (
  <span aria-hidden className="mx-6 inline-block h-2 w-2 rotate-45 bg-racing-red sm:mx-8" />
);

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center whitespace-nowrap font-heading text-xs uppercase tracking-[0.3em] text-racing-mute/85 sm:text-sm">
      {TOKENS.map((token, idx) => (
        <span key={`${token}-${idx}`} className="flex items-center">
          <span>{token}</span>
          {SEPARATOR}
        </span>
      ))}
    </div>
  );
}

export function HeroMarquee() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();
  const skipAll = reduceMotion || skipEntry;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: skipAll ? 0 : 2.3,
        duration: skipAll ? 0.01 : 0.6,
        ease: "easeOut",
      }}
      className="pointer-events-none absolute inset-x-0 bottom-24 z-10 overflow-hidden border-y border-white/[0.06] bg-racing-blue-deep/40 py-3 backdrop-blur-sm sm:bottom-28"
      aria-hidden
    >
      {/* Edge fades para amaciar o corte nas extremidades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-racing-blue-deep to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-racing-blue-deep to-transparent sm:w-24" />

      <div
        className={
          reduceMotion
            ? "flex w-max"
            : "flex w-max [animation:marquee-x_42s_linear_infinite]"
        }
      >
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </motion.div>
  );
}
