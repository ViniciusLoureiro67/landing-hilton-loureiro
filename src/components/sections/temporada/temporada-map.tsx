"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
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
import { CIRCUITS, STAGE_TO_CIRCUIT } from "./temporada-circuits";
import { CircuitMap } from "./temporada-circuit-map";

type StateActivationEvent =
  | ReactMouseEvent<SVGPathElement>
  | ReactKeyboardEvent<SVGPathElement>;

type StatePopover = {
  uf: string;
  name: string;
  status: StageStatus;
  stages: StageWithStatus[];
  x: number;
  y: number;
  /** Largura calculada em px (proporcional ao container, não ao viewport). */
  width: number;
  /** "top" = renderiza acima do ponto; "bottom" = abaixo. */
  placement: "top" | "bottom";
};

// Largura do popover é proporcional ao container do mapa (não ao viewport),
// porque o mapa pode ocupar metade da tela em layout multi-coluna. Sem isso,
// um mapa de 600px ganhava popover de 280px (47% — visualmente sufocante).
const POPOVER_MIN_WIDTH = 170;
const POPOVER_MAX_WIDTH = 240;
const POPOVER_WIDTH_RATIO = 0.4;
// Estimativa de altura — varia com nº de etapas, mas usamos um valor médio
// só pra escolher placement (top vs bottom). Não impacta render real.
// 280 ≈ minimapa (~80) + cabeçalho (~60) + 1-2 etapas (~140).
const POPOVER_HEIGHT = 280;
const POPOVER_GAP = 14;

function computePopoverWidth(containerWidth: number) {
  return clamp(
    Math.round(containerWidth * POPOVER_WIDTH_RATIO),
    POPOVER_MIN_WIDTH,
    POPOVER_MAX_WIDTH
  );
}

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

type TrajectoryArcsProps = Readonly<{
  stages: StageWithStatus[];
}>;

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
        delay: 2 + i * 0.18,
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
  const stateSuffix = cluster.state === "—" ? "" : `, ${cluster.state}`;

  return `${cluster.city}${stateSuffix}. ${rounds}. ${statusLabel}.`;
}

function stageStatusTextClass(status: StageStatus): string {
  switch (status) {
    case "next":
      return "text-racing-red";
    case "past":
      return "text-racing-mute";
    case "upcoming":
    case "tbd":
      return "text-racing-blue-bright";
  }
}

function Pin({
  cluster,
  scale,
}: Readonly<{ cluster: StageCluster; scale: number }>) {
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
    <g transform={`translate(${x}, ${y})`}>
      <motion.g
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
          outline: "none",
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
        opacity={0.28}
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
            transformBox: "fill-box",
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
    </g>
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

const STATUS_LABELS: Record<StageStatus, string> = {
  past: "Realizada",
  next: "Próxima",
  upcoming: "Futura",
  tbd: "A definir",
};

type StateLayerProps = Readonly<{
  state: BrazilStateGeometry;
  index: number;
  status: StageStatus | null;
  hostStages: StageWithStatus[];
  onStateClick: (
    state: BrazilStateGeometry,
    event: StateActivationEvent
  ) => void;
}>;

function stateStroke(active: boolean, isHost: boolean): string {
  if (active) {
    return "var(--racing-white)";
  }

  if (isHost) {
    return "oklch(0.62 0.20 252 / 0.55)";
  }

  return "oklch(1 0 0 / 0.10)";
}

function stateStrokeWidth(active: boolean, isHost: boolean): number {
  if (active) {
    return 1.4;
  }

  if (isHost) {
    return 1;
  }

  return 0.7;
}

function hostStateAriaLabel(
  state: BrazilStateGeometry,
  hostStages: StageWithStatus[]
): string {
  if (hostStages.length === 1) {
    return `${state.name}, ${state.uf}. Etapa ${hostStages[0].round} em ${hostStages[0].longDate}.`;
  }

  const stages = hostStages
    .map((s) => `etapa ${s.round} em ${s.longDate}`)
    .join("; ");

  return `${state.name}, ${state.uf}. ${hostStages.length} etapas: ${stages}.`;
}

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
  const restStroke = stateStroke(false, isHost);
  const restStrokeWidth = stateStrokeWidth(false, isHost);

  // Tamanho do label adapta ao bbox do estado pra estados pequenos não
  // cuspirem texto fora da silhueta. Limite: max 14, min 7.
  const minSide = Math.min(state.bbox.w, state.bbox.h);
  const labelSize = Math.max(7, Math.min(14, minSide * 0.22));
  const labelY = isHost
    ? state.centroid.y - Math.max(14, labelSize * 1.8)
    : state.centroid.y;
  const labelOpacity = isHost ? 0.08 : 0.18;
  const activeLabelOpacity = isHost ? 0.45 : 0.9;

  // Stagger de entrada: norte → sul (BRAZIL_STATES já vem ordenado).
  const enterDelay = reduce ? 0 : 0.15 + index * 0.025;

  return (
    <motion.g
      onMouseEnter={() => setHoveredStateUf(state.uf)}
      onMouseLeave={() => setHoveredStateUf(null)}
      onFocus={() => setHoveredStateUf(state.uf)}
      onBlur={() => setHoveredStateUf(null)}
      style={{ cursor: isHost ? "pointer" : "default", outline: "none" }}
    >
      {/* Path do estado — preenchimento + borda animada */}
      <motion.path
        data-uf={state.uf}
        d={state.path}
        animate={{
          fill: currentFill,
          stroke: stateStroke(active, isHost),
          strokeWidth: stateStrokeWidth(active, isHost),
          opacity: 1,
          pathLength: 1,
        }}
        initial={
          reduce
            ? {
                opacity: 0,
                pathLength: 1,
                fill: restFill,
                stroke: restStroke,
                strokeWidth: restStrokeWidth,
              }
            : {
                opacity: 0,
                pathLength: 0,
                fill: restFill,
                stroke: restStroke,
                strokeWidth: restStrokeWidth,
              }
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
        style={{ outline: "none", willChange: "opacity, fill, stroke" }}
        role={isHost ? "button" : "presentation"}
        tabIndex={isHost ? 0 : -1}
        aria-label={isHost ? hostStateAriaLabel(state, hostStages) : undefined}
        onClick={(e) => onStateClick(state, e)}
        onKeyDown={(e) => {
          if (isHost && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onStateClick(state, e);
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
          opacity={0.55}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.25 }}
          pointerEvents="none"
        />
      ) : null}

      {/* Sigla UF — discreta no centroide */}
      <motion.text
        x={state.centroid.x}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="select-none font-mono"
        fontSize={labelSize}
        fontWeight={700}
        fill="var(--racing-white)"
        style={{ letterSpacing: "0.1em", pointerEvents: "none" }}
        initial={{ opacity: 0 }}
        animate={
          active
            ? { opacity: activeLabelOpacity }
            : { opacity: labelOpacity }
        }
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPopoverPoint(
  event: StateActivationEvent,
  container: HTMLDivElement | null
) {
  if (!container)
    return { x: 0, y: 0, width: POPOVER_MIN_WIDTH, placement: "top" as const };

  const containerRect = container.getBoundingClientRect();
  const targetRect = event.currentTarget.getBoundingClientRect();
  const isPointerEvent = "clientX" in event;
  const rawX = isPointerEvent
    ? event.clientX - containerRect.left
    : targetRect.left + targetRect.width / 2 - containerRect.left;
  const rawY = isPointerEvent
    ? event.clientY - containerRect.top
    : targetRect.top + targetRect.height / 2 - containerRect.top;

  return computePopoverPosition(rawX, rawY, containerRect);
}

/**
 * Decide onde colar o popover dado um ponto âncora no container:
 *  - X é clampado pra metade da largura estimada não vazar nas bordas.
 *  - Placement vira "bottom" quando não cabe acima do ponto (mapa baixo
 *    ou clique perto do topo); fica "top" como default.
 */
function computePopoverPosition(
  rawX: number,
  rawY: number,
  containerRect: { width: number; height: number }
) {
  const width = computePopoverWidth(containerRect.width);
  const halfWidth = width / 2;
  const minX = Math.min(halfWidth + 4, containerRect.width / 2);
  const x = clamp(rawX, minX, Math.max(minX, containerRect.width - minX));

  const fitsAbove = rawY - POPOVER_GAP - POPOVER_HEIGHT >= 8;
  const placement: "top" | "bottom" = fitsAbove ? "top" : "bottom";

  const minY = placement === "top" ? POPOVER_HEIGHT + POPOVER_GAP : 8;
  const maxY =
    placement === "top"
      ? Math.max(minY, containerRect.height - 8)
      : Math.max(minY, containerRect.height - POPOVER_HEIGHT - POPOVER_GAP);
  const y = clamp(rawY, minY, maxY);

  return { x, y, width, placement };
}

function StateStagePopover({
  popover,
  onClose,
}: Readonly<{
  popover: StatePopover;
  onClose: () => void;
}>) {
  const isBottom = popover.placement === "bottom";
  // Todas as etapas do mesmo UF rodam no mesmo circuito — pega da primeira.
  const firstStageId = popover.stages[0]?.id;
  const circuitKey = firstStageId
    ? STAGE_TO_CIRCUIT[firstStageId as keyof typeof STAGE_TO_CIRCUIT]
    : undefined;
  const circuit = circuitKey ? CIRCUITS[circuitKey] : null;
  // top: popover sobe a partir da âncora (translate -100% - gap)
  // bottom: popover desce a partir da âncora (translate 0 + gap)
  const wrapperTransform = isBottom
    ? `translate(-50%, ${POPOVER_GAP}px)`
    : `translate(-50%, calc(-100% - ${POPOVER_GAP}px))`;

  return (
    <div
      key={popover.uf}
      data-temporada-popover
      style={{
        left: popover.x,
        top: popover.y,
        width: popover.width,
        transform: wrapperTransform,
      }}
      className="pointer-events-auto absolute z-30"
    >
      <motion.aside
        initial={{ opacity: 0, y: isBottom ? -8 : 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: isBottom ? -6 : 8, scale: 0.97 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-sm border border-racing-white/15 bg-racing-blue-deep/96 p-3 text-left shadow-[0_18px_56px_-30px_oklch(0_0_0/0.95)]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-racing-blue-bright to-transparent"
        />
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-racing-red">
              {popover.uf} · {STATUS_LABELS[popover.status]}
            </p>
            <h3 className="mt-1.5 truncate font-display text-lg uppercase leading-none tracking-tight text-racing-white">
              {popover.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar informações da etapa"
            className="grid size-6 shrink-0 place-items-center rounded-full border border-white/10 text-racing-mute transition-colors hover:border-racing-red/50 hover:text-racing-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-blue-bright"
          >
            ×
          </button>
        </div>

        {circuit ? (
          <div className="mt-2.5 aspect-[100/60] w-full">
            <CircuitMap circuit={circuit} />
          </div>
        ) : null}

        <ol className="mt-2.5 space-y-2 border-t border-white/10 pt-2.5">
          {popover.stages.map((stage) => (
            <li
              key={stage.id}
              className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-0.5"
            >
              <span
                className={`mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${stageStatusTextClass(stage.status)}`}
              >
                R{stage.round.toString().padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-racing-white">
                  {stage.longDate}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-racing-white/65">
                  {stage.city} · {stage.circuit}
                </p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-racing-mute">
                  {STATUS_LABELS[stage.status]}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Setinha-âncora — em "top" aponta pra baixo (no rodapé do popover);
            em "bottom" aponta pra cima (no topo do popover). */}
        <span
          aria-hidden
          className={cn(
            "absolute left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-racing-blue-deep/90",
            isBottom
              ? "top-0 -translate-y-1/2 border-l border-t border-racing-white/15"
              : "top-full -translate-y-1/2 border-b border-r border-racing-white/15"
          )}
        />
      </motion.aside>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Mapa principal
// ───────────────────────────────────────────────────────────────

type Props = Readonly<{
  stages: StageWithStatus[];
  className?: string;
}>;

export function TemporadaMap({ stages, className }: Props) {
  const reduce = useReducedMotion();
  const { setActiveId, popoverRequest, requestPopoverFor } = useTemporada();
  const containerRef = useRef<HTMLDivElement>(null);
  const [emptyStateFlash, setEmptyStateFlash] = useState<string | null>(null);
  const [statePopover, setStatePopover] = useState<StatePopover | null>(null);

  const clusters = useMemo(() => groupClusters(stages), [stages]);
  const byState = useMemo(() => groupByState(stages), [stages]);

  // Abre o popover programaticamente quando um card da lista é clicado.
  // Posicionamento: usa o bbox do <path data-uf=...> renderizado em
  // coordenadas de container — assim reaproveita o mesmo clamp do clique
  // direto no estado e fica imune a zoom/responsividade.
  useEffect(() => {
    if (!popoverRequest) return;
    const container = containerRef.current;
    if (!container) return;

    const stagesForUf = byState.get(popoverRequest.uf);
    if (!stagesForUf || stagesForUf.length === 0) {
      requestPopoverFor(null);
      return;
    }

    const stateGeom = BRAZIL_STATES.find((s) => s.uf === popoverRequest.uf);
    if (!stateGeom) {
      requestPopoverFor(null);
      return;
    }

    // Rola o mapa pra dentro do viewport (importante no mobile, onde a
    // lista fica muito abaixo do mapa) — depois abre o popover sobre o
    // estado já visível.
    container.scrollIntoView({ block: "center", behavior: "smooth" });

    // Espera 1 frame pro scroll/layout estabilizar antes de medir o path.
    const rafId = requestAnimationFrame(() => {
      const pathEl = container.querySelector<SVGPathElement>(
        `path[data-uf="${popoverRequest.uf}"]`
      );
      if (!pathEl) return;
      const containerRect = container.getBoundingClientRect();
      const pathRect = pathEl.getBoundingClientRect();
      const rawX = pathRect.left + pathRect.width / 2 - containerRect.left;
      const rawY = pathRect.top + pathRect.height / 2 - containerRect.top;
      const { x, y, width, placement } = computePopoverPosition(
        rawX,
        rawY,
        containerRect
      );

      setEmptyStateFlash(null);
      setStatePopover({
        uf: stateGeom.uf,
        name: stateGeom.name,
        status:
          stateStatus(stateGeom.uf, byState) ?? stagesForUf[0].status,
        stages: stagesForUf,
        x,
        y,
        width,
        placement,
      });
      requestPopoverFor(null);
    });

    return () => cancelAnimationFrame(rafId);
  }, [popoverRequest, byState, requestPopoverFor]);

  const handleStateClick = (
    state: BrazilStateGeometry,
    event: StateActivationEvent
  ) => {
    const list = byState.get(state.uf);
    if (list && list.length > 0) {
      // Prioriza a próxima etapa, se houver
      const target =
        list.find((s) => s.status === "next") ??
        list.find((s) => s.status === "upcoming") ??
        list[0];
      setActiveId(target.id);
      setEmptyStateFlash(null);
      setStatePopover({
        uf: state.uf,
        name: state.name,
        status: stateStatus(state.uf, byState) ?? target.status,
        stages: list,
        ...getPopoverPoint(event, containerRef.current),
      });
    }
  };

  useEffect(() => {
    if (!statePopover) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setStatePopover(null);
      }
    }

    // Click-outside: fecha o popover se o usuário clicar em qualquer
    // lugar que não seja (a) o próprio popover, (b) um <path data-uf>
    // — o último impede que o click no estado dispare close+open
    // imediato e quebre a UX.
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Element | null;
      if (!target) return;
      if (target.closest("[data-temporada-popover]")) return;
      if (target.closest("[data-uf]")) return;
      if (target.closest("[data-stage-id]")) return;
      setStatePopover(null);
    }

    globalThis.addEventListener("keydown", onKeyDown);
    // Usar capture pra rodar antes do handler do path (que faria reabrir)
    globalThis.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      globalThis.removeEventListener("keydown", onKeyDown);
      globalThis.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [statePopover]);

  // Auto-clear do flash "sem etapa"
  useEffect(() => {
    if (!emptyStateFlash) return;
    const t = setTimeout(() => setEmptyStateFlash(null), 1800);
    return () => clearTimeout(t);
  }, [emptyStateFlash]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${SVG_VIEWBOX.width} ${SVG_VIEWBOX.height}`}
        role="img"
        aria-label="Mapa do Brasil com 27 estados e 8 etapas do Moto1000GP 2026"
        className="h-[52svh] min-h-[20rem] w-full sm:h-[min(62svh,42rem)] sm:min-h-[24rem] lg:h-[min(78svh,54rem)] lg:min-h-[34rem]"
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
        {reduce ? null : (
          <motion.rect
            x={0}
            width={SVG_VIEWBOX.width}
            height={120}
            fill="url(#temporada-scanline)"
            opacity={0.6}
            initial={{ y: -120 }}
            animate={{ y: SVG_VIEWBOX.height }}
            transition={{
              duration: 5.8,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 5,
              delay: 2.5,
            }}
            style={{ pointerEvents: "none" }}
          />
        )}

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
                onStateClick={(state, event) => {
                  if (byState.has(state.uf)) {
                    handleStateClick(state, event);
                  } else {
                    setStatePopover(null);
                    setEmptyStateFlash(state.uf);
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

      <AnimatePresence>
        {statePopover ? (
          <StateStagePopover
            popover={statePopover}
            onClose={() => setStatePopover(null)}
          />
        ) : null}
      </AnimatePresence>

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
