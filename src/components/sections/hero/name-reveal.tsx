"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Reveal das duas linhas do nome (HILTON · LOUREIRO) com clip-path mask:
 * cada linha entra como se a tinta varresse de baixo para cima
 * (`inset(100% 0 0 0)` → `inset(0 0 0 0)`), em stagger.
 *
 * Bate mais forte que o blur+translate genérico de 80% das landings, e é
 * robusto em qualquer fonte/tamanho. O número 76 fica em componente
 * próprio para virar elemento de design dominante (HeroBigNumber).
 *
 * Tratamento outline (HILTON) + fill (LOUREIRO) cria duas camadas
 * tipográficas estilo pôster esportivo.
 *
 * Sob `prefers-reduced-motion`: fade único curto (≤200ms), sem clip.
 */

function buildMaskParent(skipEntry: boolean): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: skipEntry ? 0 : 0.18,
        delayChildren: skipEntry ? 0 : 1.3,
      },
    },
  };
}

const MASK_LINE: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", y: 24 },
  show: {
    clipPath: "inset(0% 0 0 0)",
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const MASK_UNDERLINE: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const REDUCED_PARENT: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const REDUCED_CHILD: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
};

export function NameReveal() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();
  const parent = reduceMotion
    ? REDUCED_PARENT
    : buildMaskParent(skipEntry);
  const line = reduceMotion ? REDUCED_CHILD : MASK_LINE;

  return (
    <motion.h1
      initial="hidden"
      animate="show"
      variants={parent}
      className="font-display uppercase leading-[0.82] tracking-[-0.02em] text-racing-white"
    >
      <span className="sr-only">Hilton Loureiro</span>

      {/* Linha 1 — HILTON, outline grosso. Clip-path corre dentro do
          `overflow-hidden`. drop-shadow forte para destacar sobre a foto. */}
      <span aria-hidden className="block overflow-hidden pb-1">
        <motion.span
          variants={line}
          className="block text-[3.75rem] sm:text-[5rem] lg:text-[7.5rem] xl:text-[9.5rem]"
          style={{
            WebkitTextStroke: reduceMotion ? "0" : "2.5px oklch(0.97 0 0)",
            color: reduceMotion ? "var(--racing-white)" : "transparent",
            filter: reduceMotion
              ? "none"
              : "drop-shadow(0 6px 24px oklch(0 0 0 / 0.55))",
          }}
        >
          Hilton
        </motion.span>
      </span>

      {/* Linha 2 — LOUREIRO, sólido com drop-shadow para legibilidade. */}
      <span aria-hidden className="block overflow-hidden pb-1">
        <motion.span
          variants={line}
          className="block text-[3.75rem] text-racing-white sm:text-[5rem] lg:text-[7.5rem] xl:text-[9.5rem]"
          style={{
            filter: reduceMotion
              ? "none"
              : "drop-shadow(0 6px 24px oklch(0 0 0 / 0.55))",
          }}
        >
          Loureiro
        </motion.span>
      </span>

      {/* Sublinha vermelha que cresce sob o nome — assinatura visual, ecoa
          o slash do logo "76". Aria-hidden, decorativo. */}
      {!reduceMotion && (
        <motion.span
          aria-hidden
          variants={MASK_UNDERLINE}
          style={{ originX: 0 }}
          className="mt-3 block h-[3px] w-32 bg-racing-red sm:mt-4 sm:w-44 lg:w-56"
        />
      )}
    </motion.h1>
  );
}
