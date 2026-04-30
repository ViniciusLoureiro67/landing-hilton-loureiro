"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StageWithStatus } from "./temporada-data";
import { useTemporada } from "./temporada-context";

/**
 * TemporadaStageCard — card de uma etapa do calendário.
 *
 * Estados visuais:
 *   - past:     opacity reduzida, sem hover, ícone neutro
 *   - next:     borda esquerda vermelha, label "PRÓXIMA", ring no card
 *   - upcoming: borda translúcida, hover com slash de canto
 *   - tbd:      mesma estrutura de upcoming, com circuit em itálico + nota
 *
 * Sincroniza com o mapa via Context: hover/focus → setHoveredId; click →
 * setActiveId. Quando `isHighlighted` retorna true, o card recebe destaque
 * ainda que esteja no estado `past`.
 */

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

type Props = {
  stage: StageWithStatus;
};

export function TemporadaStageCard({ stage }: Props) {
  const reduce = useReducedMotion();
  const {
    setHoveredId,
    setActiveId,
    setHoveredStateUf,
    hoveredStateUf,
    isHighlighted,
  } = useTemporada();
  const highlighted =
    isHighlighted(stage.id) ||
    (hoveredStateUf !== null && hoveredStateUf === stage.state);
  const isPast = stage.status === "past";
  const isNext = stage.status === "next";
  const isTbd = stage.status === "tbd";

  return (
    <motion.li
      data-stage-id={stage.id}
      variants={reduce ? undefined : cardVariants}
      onMouseEnter={() => {
        if (!isPast) setHoveredId(stage.id);
        if (stage.state !== "—") setHoveredStateUf(stage.state);
      }}
      onMouseLeave={() => {
        setHoveredId(null);
        setHoveredStateUf(null);
      }}
      onFocus={() => {
        setHoveredId(stage.id);
        if (stage.state !== "—") setHoveredStateUf(stage.state);
      }}
      onBlur={() => {
        setHoveredId(null);
        setHoveredStateUf(null);
      }}
      onClick={() => setActiveId(stage.id)}
      aria-current={isNext ? "step" : undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActiveId(stage.id);
        }
      }}
      className={cn(
        "group relative isolate flex flex-col gap-3 overflow-hidden rounded-sm border bg-racing-asphalt/30 p-5 transition-all duration-300 sm:p-6",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-racing-blue-bright focus-visible:ring-offset-2 focus-visible:ring-offset-racing-blue-deep",
        isPast && "border-racing-white/5 opacity-50",
        isNext &&
          "border-racing-white/10 border-l-[3px] border-l-racing-red shadow-[0_0_24px_-12px_var(--racing-red)]",
        !isPast && !isNext && "border-racing-white/10 hover:border-racing-blue-bright/40",
        highlighted && !isPast && "border-racing-blue-bright/60 bg-racing-asphalt/60"
      )}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Slash decorativo no canto, aparece em hover dos cards futuros */}
      {!isPast && !isNext ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rotate-12 border-r-2 border-racing-red/0 transition-colors duration-300 group-hover:border-racing-red/70"
        />
      ) : null}

      <header className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span
            className={cn(
              "font-mono text-[10px] font-bold uppercase tracking-[0.35em]",
              isNext ? "text-racing-red" : "text-racing-mute"
            )}
          >
            Round {stage.round.toString().padStart(2, "0")}
          </span>
          {isNext ? (
            <span className="rounded-sm bg-racing-red px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-racing-white">
              Próxima
            </span>
          ) : null}
          {isPast ? (
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-racing-mute">
              Realizada
            </span>
          ) : null}
          {isTbd ? (
            <span className="rounded-sm border border-racing-yellow/40 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-racing-yellow">
              A definir
            </span>
          ) : null}
        </div>

        <span
          className={cn(
            "font-mono text-sm font-bold uppercase tracking-widest",
            isNext ? "text-racing-white" : "text-racing-white/80"
          )}
        >
          {stage.formattedDate}
        </span>
      </header>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={cn(
              "truncate font-display text-2xl uppercase leading-none tracking-tight sm:text-3xl",
              isPast ? "text-racing-white/70" : "text-racing-white"
            )}
          >
            {stage.city}
          </h3>
          {stage.state !== "—" ? (
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.3em] text-racing-blue-bright">
              {stage.state}
            </p>
          ) : null}
        </div>

        <ChevronRight
          aria-hidden
          className={cn(
            "size-5 shrink-0 transition-transform duration-300",
            isPast ? "text-racing-mute/40" : "text-racing-mute group-hover:text-racing-white group-hover:translate-x-1",
            highlighted && !isPast && "text-racing-blue-bright translate-x-1"
          )}
        />
      </div>

      <p
        className={cn(
          "font-sans text-sm leading-snug",
          isPast ? "text-racing-white/40" : "text-racing-white/70",
          isTbd && "italic"
        )}
      >
        {stage.circuit}
      </p>
    </motion.li>
  );
}
