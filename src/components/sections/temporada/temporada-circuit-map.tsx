"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import type { CircuitDef } from "./temporada-circuits";

/**
 * CircuitMap — silhueta da pista renderizada no popover, vibe minimapa
 * de jogo de corrida. Linha branca com glow vermelho + draw animation.
 *
 * Camadas (back → front):
 *   1. grid sutil de fundo (telemetria game UI)
 *   2. underglow vermelho difuso (filter: blur via stroke-width grosso)
 *   3. linha principal branca, draw via stroke-dasharray
 *   4. start/finish line (tick perpendicular curto, branco)
 */
type Props = Readonly<{
  circuit: CircuitDef;
}>;

export function CircuitMap({ circuit }: Props) {
  const reduce = useReducedMotion();
  const gradientId = `circuit-grid-${circuit.id}`;
  const viewBox = circuit.viewBox ?? "0 0 100 60";
  const strokeWidth = circuit.strokeWidth ?? 1;
  const tickSize = circuit.startTickSize ?? 4;
  // Parse viewBox pra dimensionar o pattern e o rect de fundo proporcional
  // ao sistema de coords do circuito.
  const [vbX, vbY, vbW, vbH] = viewBox.split(/\s+/).map(Number);
  const gridSize = Math.max(vbW, vbH) / 12;
  const gridStrokeWidth = gridSize * 0.05;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-sm border border-racing-white/10 bg-racing-asphalt/40">
      <svg
        viewBox={viewBox}
        role="img"
        aria-label={`Layout do ${circuit.short} — ${circuit.length} km, ${circuit.turns} curvas, ${circuit.direction === "CW" ? "horário" : "anti-horário"}`}
        className="block min-h-0 w-full flex-1"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id={gradientId}
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="var(--racing-white)"
              strokeOpacity={0.04}
              strokeWidth={gridStrokeWidth}
            />
          </pattern>
        </defs>

        <rect x={vbX} y={vbY} width={vbW} height={vbH} fill={`url(#${gradientId})`} />

        {/* Grupo de trace + tick + pulso. Quando o circuito vem de SVG
            externo (Wikimedia), `transform` reposiciona/scaleia pra dentro
            do canvas original. */}
        <g transform={circuit.transform}>

        {/* Underglow vermelho (mais grosso, sem fill, com opacity baixa
            simulando halo). Usar filter:blur seria mais bonito mas pesado
            em SVG pequeno — stroke grosso translúcido dá o mesmo efeito. */}
        <motion.path
          d={circuit.path}
          fill="none"
          stroke="var(--racing-red)"
          strokeWidth={strokeWidth * 3}
          strokeOpacity={0.35}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.35 }}
          transition={{
            pathLength: { duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.1 },
            opacity: { duration: 0.4, delay: 0.1 },
          }}
        />

        {/* Linha principal — branca, fininha, "racing line" */}
        <motion.path
          d={circuit.path}
          fill="none"
          stroke="var(--racing-white)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            pathLength: { duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.05 },
          }}
        />

        {/* Start/finish — tick perpendicular curto, branco intenso */}
        <motion.line
          x1={circuit.start.x - tickSize / 2}
          y1={circuit.start.y}
          x2={circuit.start.x + tickSize / 2}
          y2={circuit.start.y}
          transform={`rotate(${circuit.start.angle + 90} ${circuit.start.x} ${circuit.start.y})`}
          stroke="var(--racing-white)"
          strokeWidth={strokeWidth * 1.5}
          strokeLinecap="round"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.25 }}
        />

        {/* Pulso vermelho na linha de chegada (decorativo) */}
        {!reduce ? (
          <motion.circle
            cx={circuit.start.x}
            cy={circuit.start.y}
            r={tickSize * 0.4}
            fill="var(--racing-red)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.6, 2.2, 2.6] }}
            transition={{
              duration: 1.6,
              ease: "easeOut",
              delay: 1.4,
              repeat: Infinity,
              repeatDelay: 1.8,
            }}
          />
        ) : null}
        </g>
      </svg>

      {/* HUD strip — meta-info estilo dashboard de jogo, abaixo do SVG */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-racing-white/10 bg-racing-blue-deep/85 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-racing-mute">
        <span className="text-racing-white/80">{circuit.length.toFixed(3)} km</span>
        <span className="text-racing-white/40">·</span>
        <span>{circuit.turns} curvas</span>
        <span className="text-racing-white/40">·</span>
        <span className="text-racing-blue-bright">
          {circuit.direction === "CW" ? "→" : "←"} {circuit.direction}
        </span>
      </div>
    </div>
  );
}
