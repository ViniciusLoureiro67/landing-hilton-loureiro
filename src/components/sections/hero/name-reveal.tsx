"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
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
        staggerChildren: skipEntry ? 0 : 0.22,
        // Casa com `LIGHTS_OUT_AT + 0.2`: nome começa a varrer logo
        // depois das luzes apagarem e o flash explodir.
        delayChildren: skipEntry ? 0 : 3.3,
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

// Delay absoluto pra a sublinha — usa esse valor independente do stagger
// do parent. Casa com `delayChildren (3.3) + 2 * stagger (0.22) + duração
// do reveal (0.85) ≈ 4.59s` → underline aparece DEPOIS de "Loureiro" estar
// completamente visível, não antes.
const UNDERLINE_DELAY = 4.6;

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
    <>
      <motion.h1
        initial="hidden"
        animate="show"
        variants={parent}
        className="font-display uppercase leading-[0.82] tracking-[-0.02em] text-racing-white"
      >
        <span className="sr-only">Hilton Loureiro</span>

        {/* Linha 1 — HILTON, outline grosso. Clip-path corre dentro do
            `overflow-hidden`. */}
        <span aria-hidden className="block overflow-hidden pb-1">
          <motion.span
            variants={line}
            className="block text-[3.75rem] sm:text-[5rem] lg:text-[7.5rem] xl:text-[9.5rem]"
            style={{
              WebkitTextStroke: "2.5px oklch(0.97 0 0)",
              color: "transparent",
            }}
          >
            Hilton
          </motion.span>
        </span>

        {/* Linha 2 — LOUREIRO, sólido com sombra leve para legibilidade. */}
        <span aria-hidden className="block overflow-hidden pb-1">
          <motion.span
            variants={line}
            className="block text-[3.75rem] text-racing-white sm:text-[5rem] lg:text-[7.5rem] xl:text-[9.5rem]"
          >
            Loureiro
          </motion.span>
        </span>
      </motion.h1>

      {/* Sublinha vermelha que cresce sob o nome — assinatura visual, ecoa
          o slash do logo "76". Aria-hidden, decorativo.
          
          IMPORTANTE: foi separada do `motion.h1` parent porque, ao ficar
          dentro do staggerChildren, o `delay` próprio da transition
          sobrescrevia o `delayChildren` do pai e fazia a barra aparecer
          ANTES da sequência de ignição (em ~0.3s). Agora controla o
          timing absoluto (`UNDERLINE_DELAY`), garantindo que entra DEPOIS
          do reveal completo do nome. */}
      <motion.span
        aria-hidden
        initial={{ scaleX: reduceMotion ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                delay: skipEntry ? 0 : UNDERLINE_DELAY,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }
        }
        style={{ originX: 0 }}
        className="mt-3 block h-[3px] w-32 bg-racing-red shadow-[0_0_18px_oklch(0.58_0.23_27_/_0.35)] sm:mt-4 sm:w-44 lg:w-56"
      />
    </>
  );
}
