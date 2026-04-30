"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  SVG_VIEWBOX,
  clusterStatus,
  groupByState,
  groupClusters,
  projectLatLon,
  stateStatus,
  type StageCluster,
  type StageStatus,
  type StageWithStatus,
} from "./temporada-data";
import {
  BRAZIL_STATES,
  type BrazilStateGeometry,
} from "./temporada-states-data";
import { useTemporada } from "./temporada-context";

/**
 * TemporadaMap — mapa awwwards-tier do Brasil:
 *
 *   1. 27 estados desenhados como paths individuais (silhueta nacional gerada
 *      automaticamente da união visual)
 *   2. Cada UF tem stagger de entrada N→S, path-drawing via stroke-dasharray
 *      + glow se for anfitrião de etapa
 *   3. Siglas UF muito discretas no centroide (escala adaptativa pro estado)
 *   4. Pinos das 8 etapas em cascata sobre os estados
 *   5. Scanline radar contínuo (decorativo, prefers-reduced-motion-aware)
 *   6. Click em estado-anfitrião destaca seu(s) card(s) na lista; click em
 *      estado vazio mostra micro-feedback "Sem etapa neste estado"
 */

// ───────────────────────────────────────────────────────────────
// Arcos de trajetória — ligam etapas consecutivas (round 1 → 2 → ... → 8)
// ───────────────────────────────────────────────────────────────

/**
 * Constrói um arco de Bézier quadrático entre dois pontos com curvatura
 * proporcional à distância. O ponto de controle é deslocado perpendicularmente
 * pra dar a sensação de "rota desenhada à mão" sobre o mapa.
 */
function buildArcPath(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  curvature = 0.22
): string {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const dist = Math.hypot(dx, dy);
  // Vetor perpendicular normalizado (90° anti-horário)
  const nx = -dy / dist;
  const ny = dx / dist;
  const cx = mx + nx * dist * curvature;
  const cy = my + ny * dist * curvature;
  return `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(
    1
  )} ${bx.toFixed(1)} ${by.toFixed(1)}`;
}

type TrajectoryArcsProps = {
  stages: StageWithStatus[];
};

function TrajectoryArcs({ stages }: TrajectoryArcsProps) {
  const reduce = useReducedMotion();

  const arcs = useMemo(() => {
    const valid = stages.filter((s) => s.lat !== null && s.lon !== null);
    return valid.slice(0, -1).map((from, i) => {
      const to = valid[i + 1];
      const a = projectLatLon(from.lat as number, from.lon as number);
      const b = projectLatLon(to.lat as number, to.lon as number);
      // Auto-toggle de curvatura pra alternar lados — evita arcos sobrepostos
      const curvature = i % 2 === 0 ? 0.22 : -0.18;
      return {
        id: `${from.id}-${to.id}`,
        d: buildArcPath(a.x, a.y, b.x, b.y, curvature),
        // Entrada após pinos: 1.2 + maxRound*0.08 + 0.1 + i*0.18
        delay: 2.0 + i * 0.18,
        // "concluído" se ambas as etapas já passaram
        completed: from.status === "past" && to.status === "past",
      };
    });
  }, [stages]);

  return (
    <g aria-hidden="true">
      {arcs.map((arc) => (
        <motion.path
          key={arc.id}
          d={arc.d}
          fill="none"
          stroke={
            arc.completed
              ? "var(--racing-mute)"
              : "var(--racing-blue-bright)"
          }
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="4 6"
          opacity={arc.completed ? 0.35 : 0.6}
          initial={
            reduce
              ? { pathLength: 1, opacity: arc.completed ? 0.35 : 0.6 }
              : { pathLength: 0, opacity: 0 }
          }
          animate={{
            pathLength: 1,
            opacity: arc.completed ? 0.35 : 0.6,
          }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  pathLength: {
                    duration: 0.8,
                    ease: [0.65, 0, 0.35, 1],
                    delay: arc.delay,
                  },
                  opacity: { duration: 0.4, delay: arc.delay },
                }
          }
          style={{ pointerEvents: "none" }}
        />
      ))}
    </g>
  );
}

// ───────────────────────────────────────────────────────────────
// Pinos
// ───────────────────────────────────────────────────────────────

const STATUS_VISUALS: Record<
  StageStatus,
  { fill: string; stroke: string; size: number; label: string }
> = {
  past: {
    fill: "var(--racing-mute)",
    stroke: "var(--racing-mute)",
    size: 10,
    label: "Já realizada",
  },
  next: {
    fill: "var(--racing-red)",
    stroke: "var(--racing-red)",
    size: 16,
    label: "Próxima etapa",
  },
  upcoming: {
    fill: "var(--racing-blue-bright)",
    stroke: "var(--racing-blue-bright)",
    size: 13,
    label: "Etapa futura",
  },
  tbd: {
    fill: "var(--racing-mute)",
    stroke: "var(--racing-mute)",
    size: 10,
    label: "A definir",
  },
};

function clusterAriaLabel(cluster: StageCluster, status: StageStatus): string {
  const statusLabel = STATUS_VISUALS[status].label;
  const rounds = cluster.stages
    .map((s) => `etapa ${s.round} em ${s.longDate}`)
    .join("; ");
  return `${cluster.city}${
    cluster.state !== "—" ? `, ${cluster.state}` : ""
  }. ${rounds}. ${statusLabel}.`;
}

function Pin({ cluster, scale }: { cluster: StageCluster; scale: number }) {
  const reduce = useReducedMotion();
  const { setHoveredId, setActiveId, isHighlighted } = useTemporada();
  const status = clusterStatus(cluster);
  const visual = STATUS_VISUALS[status];

  const { x, y } = projectLatLon(cluster.lat, cluster.lon);
  const radius = visual.size * scale;
  const primaryStage =
    cluster.stages.find((s) => s.status === "next") ?? cluster.stages[0];
  const isClusterMulti = cluster.stages.length > 1;
  const highlighted = cluster.stages.some((s) => isHighlighted(s.id));

  return (
    <motion.g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => setHoveredId(primaryStage.id)}
      onMouseLeave={() => setHoveredId(null)}
      onFocus={() => setHoveredId(primaryStage.id)}
      onBlur={() => setHoveredId(null)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 320,
              damping: 22,
              delay: 1.2 + cluster.stages[0].round * 0.08,
            }
      }
      style={{
        cursor: "pointer",
        transformOrigin: "center",
        transformBox: "fill-box",
      }}
    >
      {/* Drop shadow soft — destaca o pino sobre o fill colorido do estado */}
      <circle
        cx={0}
        cy={2}
        r={radius + 2}
        fill="oklch(0.05 0 0)"
        opacity={0.55}
        style={{ filter: "blur(3px)" }}
      />

      {/* Anel base branco — separa o pino do estado */}
      <circle
        cx={0}
        cy={0}
        r={radius + 3}
        fill="oklch(0.97 0 0)"
        opacity={0.95}
      />

      {/* Ring pulsante para a próxima etapa */}
      {status === "next" && !reduce ? (
        <circle
          cx={0}
          cy={0}
          r={radius + 8}
          fill="none"
          stroke={visual.stroke}
          strokeWidth={2}
          opacity={0.9}
          style={{
            animation: "pin-pulse 1.8s ease-out infinite",
            transformOrigin: "center",
          }}
        />
      ) : null}

      {/* Halo de highlight (hover/active) */}
      {highlighted ? (
        <circle
          cx={0}
          cy={0}
          r={radius + 12}
          fill="none"
          stroke="var(--racing-white)"
          strokeWidth={2}
          opacity={0.7}
        />
      ) : null}

      {/* Pino — corpo */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius}
        fill={visual.fill}
        animate={highlighted ? { scale: 1.18 } : { scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />

      {radius >= 11 ? (
        <text
          x={0}
          y={0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          className="select-none font-mono"
          fontSize={radius * 0.95}
          fontWeight={700}
          fill="var(--racing-white)"
        >
          {primaryStage.round}
        </text>
      ) : null}

      {isClusterMulti ? (
        <g transform={`translate(${radius * 0.85}, ${-radius * 0.95})`}>
          <circle
            r={9 * scale}
            fill="var(--racing-blue-deep)"
            stroke="var(--racing-white)"
            strokeWidth={1}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="select-none font-mono"
            fontSize={10 * scale}
            fontWeight={700}
            fill="var(--racing-white)"
          >
            ×{cluster.stages.length}
          </text>
        </g>
      ) : null}

      <circle
        cx={0}
        cy={0}
        r={Math.max(radius + 6, 18)}
        fill="transparent"
        role="button"
        tabIndex={0}
        aria-label={clusterAriaLabel(cluster, status)}
        aria-current={status === "next" ? "step" : undefined}
        onClick={() => setActiveId(primaryStage.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveId(primaryStage.id);
          }
        }}
        style={{ outline: "none" }}
      />
    </motion.g>
  );
}

// ───────────────────────────────────────────────────────────────
// Estado individual
// ───────────────────────────────────────────────────────────────

const STATE_FILL_BY_STATUS: Record<StageStatus, string> = {
  past: "oklch(0.28 0.05 258 / 0.55)",
  next: "oklch(0.45 0.18 28 / 0.30)",
  upcoming: "oklch(0.40 0.14 254 / 0.40)",
  tbd: "oklch(0.28 0.05 258 / 0.40)",
};

const STATE_FILL_ACTIVE_BY_STATUS: Record<StageStatus, string> = {
  past: "oklch(0.32 0.07 258 / 0.75)",
  next: "oklch(0.55 0.22 28 / 0.55)",
  upcoming: "oklch(0.50 0.18 254 / 0.65)",
  tbd: "oklch(0.30 0.06 258 / 0.65)",
};

const STATE_DEFAULT_FILL = "oklch(0.22 0.05 258 / 0.55)";
const STATE_DEFAULT_FILL_ACTIVE = "oklch(0.28 0.07 258 / 0.75)";

const labelVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.18 },
};

type StateLayerProps = {
  state: BrazilStateGeometry;
  index: number;
  status: StageStatus | null;
  hostStages: StageWithStatus[];
  onStateClick: (uf: string) => void;
};

function StateLayer({
  state,
  index,
  status,
  hostStages,
  onStateClick,
}: StateLayerProps) {
  const reduce = useReducedMotion();
  const { hoveredStateUf, setHoveredStateUf, isHighlighted } = useTemporada();
  const isHost = status !== null;
  const isHovered = hoveredStateUf === state.uf;
  const isStageHighlighted = hostStages.some((s) => isHighlighted(s.id));
  const active = isHovered || isStageHighlighted;

  const restFill = isHost
    ? STATE_FILL_BY_STATUS[status]
    : STATE_DEFAULT_FILL;
  const activeFill = isHost
    ? STATE_FILL_ACTIVE_BY_STATUS[status]
    : STATE_DEFAULT_FILL_ACTIVE;
  const currentFill = active ? activeFill : restFill;

  // Tamanho do label adapta ao bbox do estado pra estados pequenos não
  // cuspirem texto fora da silhueta. Limite: max 14, min 7.
  const minSide = Math.min(state.bbox.w, state.bbox.h);
  const labelSize = Math.max(7, Math.min(14, minSide * 0.22));

  // Stagger de entrada: norte → sul (BRAZIL_STATES já vem ordenado).
  const enterDelay = reduce ? 0 : 0.15 + index * 0.025;

  return (
    <motion.g
      onMouseEnter={() => setHoveredStateUf(state.uf)}
      onMouseLeave={() => setHoveredStateUf(null)}
      onFocus={() => setHoveredStateUf(state.uf)}
      onBlur={() => setHoveredStateUf(null)}
      style={{ cursor: isHost ? "pointer" : "default" }}
    >
      {/* Path do estado — preenchimento + borda animada */}
      <motion.path
        d={state.path}
        animate={{
          fill: currentFill,
          stroke: active
            ? "var(--racing-white)"
            : isHost
            ? "oklch(0.62 0.20 252 / 0.55)"
            : "oklch(1 0 0 / 0.10)",
          strokeWidth: active ? 1.4 : isHost ? 1 : 0.7,
          opacity: 1,
          pathLength: 1,
        }}
        initial={
          reduce
            ? { opacity: 0, pathLength: 1, fill: restFill }
            : { opacity: 0, pathLength: 0, fill: restFill }
        }
        transition={{
          opacity: { duration: 0.4, delay: enterDelay },
          pathLength: reduce
            ? { duration: 0 }
            : {
                duration: 0.9,
                ease: [0.65, 0, 0.35, 1],
                delay: enterDelay,
              },
          fill: { duration: 0.25 },
          stroke: { duration: 0.2 },
          strokeWidth: { duration: 0.2 },
        }}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ willChange: "opacity, fill, stroke" }}
        role={isHost ? "button" : "presentation"}
        tabIndex={isHost ? 0 : -1}
        aria-label={
          isHost
            ? `${state.name}, ${state.uf}. ${
                hostStages.length === 1
                  ? `Etapa ${hostStages[0].round} em ${hostStages[0].longDate}.`
                  : `${hostStages.length} etapas: ${hostStages
                      .map((s) => `etapa ${s.round} em ${s.longDate}`)
                      .join("; ")}.`
              }`
            : undefined
        }
        onClick={() => onStateClick(state.uf)}
        onKeyDown={(e) => {
          if (isHost && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onStateClick(state.uf);
          }
        }}
      />

      {/* Glow extra para estados-anfitriões em hover/highlight */}
      {isHost && active ? (
        <motion.path
          d={state.path}
          fill="none"
          stroke={
            status === "next"
              ? "var(--racing-red)"
              : "var(--racing-blue-bright)"
          }
          strokeWidth={1.8}
          strokeLinejoin="round"
          opacity={0.7}
          style={{ filter: "blur(2.5px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.25 }}
          pointerEvents="none"
        />
      ) : null}

      {/* Sigla UF — discreta no centroide */}
      <motion.text
        x={state.centroid.x}
        y={state.centroid.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none font-mono"
        fontSize={labelSize}
        fontWeight={700}
        fill="var(--racing-white)"
        style={{ letterSpacing: "0.1em", pointerEvents: "none" }}
        initial="hidden"
        animate={active ? { opacity: 0.9 } : "visible"}
        variants={reduce ? undefined : labelVariants}
        transition={{
          duration: 0.4,
          delay: reduce ? 0 : enterDelay + 0.5,
        }}
      >
        {state.uf}
      </motion.text>
    </motion.g>
  );
}

// ───────────────────────────────────────────────────────────────
// Mapa principal
// ───────────────────────────────────────────────────────────────

type Props = {
  stages: StageWithStatus[];
};

export function TemporadaMap({ stages }: Props) {
  const reduce = useReducedMotion();
  const { setActiveId } = useTemporada();
  const [emptyStateFlash, setEmptyStateFlash] = useState<string | null>(null);

  const clusters = useMemo(() => groupClusters(stages), [stages]);
  const byState = useMemo(() => groupByState(stages), [stages]);

  const handleStateClick = (uf: string) => {
    const list = byState.get(uf);
    if (list && list.length > 0) {
      // Prioriza a próxima etapa, se houver
      const target =
        list.find((s) => s.status === "next") ??
        list.find((s) => s.status === "upcoming") ??
        list[0];
      setActiveId(target.id);
    }
  };

  // Auto-clear do flash "sem etapa"
  useEffect(() => {
    if (!emptyStateFlash) return;
    const t = setTimeout(() => setEmptyStateFlash(null), 1800);
    return () => clearTimeout(t);
  }, [emptyStateFlash]);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${SVG_VIEWBOX.width} ${SVG_VIEWBOX.height}`}
        role="img"
        aria-label="Mapa do Brasil com 27 estados e 8 etapas do Moto1000GP 2026"
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="temporada-grid"
            width={50}
            height={50}
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="var(--racing-white)"
              strokeOpacity={0.04}
              strokeWidth={1}
            />
          </pattern>

          <radialGradient id="temporada-glow" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="var(--racing-blue)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--racing-blue)" stopOpacity={0} />
          </radialGradient>

          <linearGradient id="temporada-scanline" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--racing-blue-bright)" stopOpacity={0} />
            <stop offset="50%" stopColor="var(--racing-blue-bright)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--racing-blue-bright)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <rect
          width={SVG_VIEWBOX.width}
          height={SVG_VIEWBOX.height}
          fill="url(#temporada-grid)"
        />

        <rect
          width={SVG_VIEWBOX.width}
          height={SVG_VIEWBOX.height}
          fill="url(#temporada-glow)"
        />

        {/* Scanline radar — passa de cima a baixo continuamente */}
        {!reduce ? (
          <motion.rect
            x={0}
            width={SVG_VIEWBOX.width}
            height={120}
            fill="url(#temporada-scanline)"
            opacity={0.6}
            initial={{ y: -120 }}
            animate={{ y: SVG_VIEWBOX.height }}
            transition={{
              duration: 5.2,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 2,
              delay: 2.5,
            }}
            style={{ pointerEvents: "none" }}
          />
        ) : null}

        {/* 27 estados */}
        <g aria-label="Estados">
          {BRAZIL_STATES.map((state, index) => {
            const status = stateStatus(state.uf, byState);
            const hostStages = byState.get(state.uf) ?? [];
            return (
              <StateLayer
                key={state.uf}
                state={state}
                index={index}
                status={status}
                hostStages={hostStages}
                onStateClick={(uf) => {
                  if (byState.has(uf)) {
                    handleStateClick(uf);
                  } else {
                    setEmptyStateFlash(uf);
                  }
                }}
              />
            );
          })}
        </g>

        {/* Arcos de trajetória — round 1 → 2 → ... → 8 */}
        <TrajectoryArcs stages={stages} />

        {/* Pinos sobre os estados */}
        <g aria-label="Etapas">
          {clusters.map((cluster) => (
            <Pin key={cluster.id} cluster={cluster} scale={1} />
          ))}
        </g>
      </svg>

      {/* Toast micro-feedback ao clicar em estado vazio */}
      <AnimatePresence>
        {emptyStateFlash ? (
          <motion.p
            key={emptyStateFlash}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pointer-events-none absolute inset-x-0 bottom-0 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute"
          >
            {emptyStateFlash} · sem etapa em 2026
          </motion.p>
        ) : null}
      </AnimatePresence>

      <p className="sr-only">
        Mapa do Brasil dividido em 27 estados, com pinos para cada uma das 8
        etapas do calendário Moto1000GP 2026.
      </p>
    </div>
  );
}
