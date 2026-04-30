"use client";

import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import {
  computeStages,
  countRemainingStages,
} from "./temporada-data";
import { useTemporadaNow } from "./use-temporada-now";

/**
 * TemporadaCounter — info-card com a próxima etapa e quantas faltam.
 *
 * Hidratação:
 *   - SSR: `now=0` → todas etapas viram `next/upcoming/tbd`, mas exibimos
 *     um esqueleto neutro pra não confundir o leitor enquanto carrega.
 *   - Client: `useTemporadaNow()` retorna `Date.now()` após hidratação,
 *     trocando o conteúdo pra dado real sem mismatch (idiomático com
 *     `useSyncExternalStore`).
 *
 * Reduced-motion: sem fade + slide; aparece direto.
 */

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function TemporadaCounter() {
  const reduce = useReducedMotion();
  const now = useTemporadaNow();
  const ready = now !== 0;

  const { next, remaining, total } = useMemo(() => {
    const stages = computeStages(now);
    return {
      next: stages.find((s) => s.status === "next") ?? null,
      remaining: countRemainingStages(stages),
      total: stages.length,
    };
  }, [now]);

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={reduce ? undefined : containerVariants}
      aria-label="Próxima etapa do calendário Moto1000GP 2026"
      className="relative isolate overflow-hidden rounded-sm border border-racing-white/10 bg-racing-asphalt/40 p-6 backdrop-blur-sm sm:p-8"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rotate-12 border-r-[3px] border-racing-red/60"
      />

      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-racing-mute">
        {ready ? "Próxima etapa" : "Calendário 2026"}
      </p>

      {ready && next ? (
        <>
          <p className="mt-3 font-display text-3xl uppercase leading-tight tracking-tight text-racing-white sm:text-4xl">
            {next.city}
            {next.state !== "—" ? (
              <span className="text-racing-blue-bright"> · {next.state}</span>
            ) : null}
          </p>
          <p className="mt-2 font-sans text-sm text-racing-white/70">
            {next.longDate} · {next.circuit}
          </p>
        </>
      ) : ready ? (
        <p className="mt-3 font-display text-3xl uppercase leading-tight tracking-tight text-racing-white sm:text-4xl">
          Temporada concluída
        </p>
      ) : (
        <p className="mt-3 font-display text-3xl uppercase leading-tight tracking-tight text-racing-white/30 sm:text-4xl">
          ——
        </p>
      )}

      <div className="mt-6 flex items-baseline gap-3 border-t border-racing-white/5 pt-5">
        <span className="font-mono text-4xl font-bold leading-none text-racing-white">
          {ready ? remaining.toString().padStart(2, "0") : "08"}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-racing-mute">
          {ready ? `de ${total} etapas restantes` : `de ${total} etapas`}
        </span>
      </div>
    </motion.aside>
  );
}
