"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Sequência de "ignição" estilo semáforo de largada da MotoGP/F1:
 * vermelho → amarelo → verde acendem em ~1.2s, com glow forte.
 * Quando o verde acende, dispara um flash radial vermelho-amarelo no
 * hero todo (largada!) e a estrutura inteira dissolve.
 *
 * Diferenciais vs. v1:
 * - luzes centradas (top da viewport) e MUITO maiores (24px desktop)
 * - barra horizontal estilo grid de largada de moto
 * - flash radial de largada = ponto culminante (não termina apagando
 *   tímido, termina explodindo)
 * - frame escuro envolvendo as luzes (estilo painel oficial)
 *
 * `useReducedMotion()` retorna `null` quando o usuário pediu menos
 * movimento (a sequência inteira é descartada).
 */

const LIGHTS = [
  { id: "red-1", color: "var(--racing-red)" },
  { id: "red-2", color: "var(--racing-red)" },
  { id: "yellow", color: "var(--racing-yellow)" },
  { id: "green", color: "oklch(0.74 0.22 145)" },
] as const;

export function IgnitionLights() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();

  // Pula a sequência se o usuário pediu menos movimento OU se já viu o
  // hero rodar nesta sessão.
  if (reduceMotion || skipEntry) {
    return null;
  }

  return (
    <>
      {/* Painel das luzes — barra horizontal central, top da viewport */}
      <motion.div
        aria-hidden
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: [1, 1, 0], y: [0, 0, -8] }}
        transition={{
          duration: 1.9,
          times: [0, 0.78, 1],
          ease: [0.4, 0, 0.2, 1],
        }}
        className="pointer-events-none absolute left-1/2 top-[28%] z-30 -translate-x-1/2 sm:top-[24%]"
      >
        <motion.ul
          initial="dim"
          animate="lit"
          variants={{
            lit: {
              transition: { staggerChildren: 0.32, delayChildren: 0.15 },
            },
          }}
          className="flex items-center gap-4 rounded-full border border-white/10 bg-racing-blue-deep/85 px-5 py-4 shadow-[0_24px_64px_-16px_oklch(0_0_0_/_0.6)] backdrop-blur sm:gap-5 sm:px-7 sm:py-5"
        >
          {LIGHTS.map((light) => (
            <motion.li
              key={light.id}
              variants={{
                dim: {
                  opacity: 0.16,
                  scale: 0.85,
                  boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                },
                lit: {
                  opacity: 1,
                  scale: 1,
                  boxShadow: `0 0 28px 6px ${light.color}, inset 0 0 12px 2px ${light.color}`,
                  transition: { duration: 0.16, ease: "easeOut" },
                },
              }}
              style={{ backgroundColor: light.color }}
              className="size-4 rounded-full sm:size-5 lg:size-6"
            />
          ))}
        </motion.ul>
        <motion.span
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 0] }}
          transition={{
            duration: 1.9,
            times: [0, 0.6, 0.78, 0.9],
            ease: "easeOut",
          }}
          className="mt-2 block text-center font-mono text-[10px] uppercase tracking-[0.4em] text-racing-white/85"
        >
          Largada
        </motion.span>
      </motion.div>

      {/* Flash radial — dispara junto com a luz verde (~0.9s do início).
          Cresce do centro para fora, vermelho/amarelo, dissolve em 600ms. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0, 1, 0], scale: [0.6, 0.6, 1.2, 1.7] }}
        transition={{
          duration: 1.9,
          times: [0, 0.55, 0.78, 1],
          ease: [0.16, 1, 0.3, 1],
        }}
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, oklch(0.86 0.18 95 / 0.55) 0%, oklch(0.58 0.23 27 / 0.35) 30%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}
