"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import {
  SVG_VIEWBOX,
  clusterStatus,
  groupClusters,
  projectLatLon,
  type StageCluster,
  type StageStatus,
  type StageWithStatus,
} from "./temporada-data";
import { useTemporada } from "./temporada-context";

/**
 * TemporadaMap — SVG estilizado do Brasil com pinos das 8 etapas.
 *
 * Decisões:
 *   - Silhueta minimalista desenhada com path de ~30 pontos chave
 *     da costa e fronteira oeste (sem estados — escolha de design).
 *   - Sem dependência externa (`react-simple-maps`, topojson, etc.)
 *   - Pinos posicionados via `projectLatLon` (mesma projeção do path)
 *   - Etapas no mesmo local viram cluster com badge "×N"
 *   - Etapas TBD (sem coordenadas) NÃO aparecem aqui — só na lista
 *
 * Acessibilidade:
 *   - `role="img"` + `aria-label` no SVG raiz
 *   - Cada pino é `<button>` com `aria-label` descritivo
 *   - Estado `next` recebe `aria-current="step"` e ring pulsante
 */

// Pontos da silhueta do Brasil — todos como [latitude, longitude].
//
// Ordem horária, começando pelo extremo Norte (Cabo Orange/AP) e descendo
// pela costa atlântica, voltando pela fronteira oeste.
//
// Pontos suficientes pra reconhecibilidade (saliência NE, ponta sul, bulbo
// amazônico) sem exagerar em detalhe — a estética é "silhueta editorial",
// não cartográfica.
const SILHOUETTE: Array<[number, number]> = [
  // ── Norte (Amapá → Pará → litoral até Maranhão)
  [4.5, -51.6], // Cabo Orange (AP)
  [4.0, -51.4],
  [2.8, -50.7],
  [1.4, -48.5], // Belém
  [-0.5, -47.6],
  [-1.7, -46.3],
  [-2.5, -44.3], // São Luís

  // ── Nordeste (saliência leste — chave pra reconhecibilidade)
  [-2.9, -41.7], // Parnaíba
  [-3.7, -38.5], // Fortaleza
  [-5.0, -36.4], // Touros
  [-5.8, -35.2], // Natal
  [-7.1, -34.8], // João Pessoa (extremo LESTE)
  [-8.0, -34.9], // Recife
  [-9.7, -35.7], // Maceió
  [-10.9, -37.0], // Aracaju
  [-12.0, -38.5], // Salvador
  [-13.0, -38.9],
  [-14.8, -39.0], // Ilhéus
  [-15.8, -38.9], // Porto Seguro

  // ── Sudeste litoral
  [-18.4, -39.7],
  [-19.5, -39.8],
  [-20.3, -40.3], // Vitória
  [-22.0, -41.5],
  [-22.9, -42.0], // Cabo Frio
  [-22.9, -43.2], // Rio
  [-23.6, -45.4],
  [-23.8, -45.9],
  [-24.5, -46.6], // SP litoral
  [-25.4, -48.5], // Paranaguá
  [-26.2, -48.6],
  [-27.6, -48.5], // Florianópolis
  [-29.0, -49.7],
  [-30.0, -50.2],
  [-31.3, -51.0],
  [-32.0, -52.1], // Rio Grande
  [-33.5, -53.0],
  [-33.8, -53.4], // Chuí (extremo SUL)

  // ── Fronteira sul-sudoeste (Uruguai → Argentina → Paraguai → Bolívia)
  [-31.5, -55.0],
  [-30.2, -57.6], // Uruguaiana
  [-28.0, -56.0],
  [-27.5, -54.6],
  [-25.5, -54.6], // Foz do Iguaçu
  [-23.9, -55.0],
  [-22.2, -57.6],
  [-19.6, -57.7], // Corumbá
  [-17.8, -57.5],
  [-16.4, -58.4],
  [-15.5, -60.0], // Cáceres
  [-13.5, -60.7],
  [-12.5, -64.0],
  [-11.0, -65.3], // RO/Bolívia
  [-10.5, -68.7], // Acre
  [-9.5, -72.0],
  [-8.5, -73.0],
  [-7.5, -73.7], // Cruzeiro do Sul (extremo OESTE)

  // ── Noroeste / Norte (fronteira amazônica)
  [-4.4, -69.9],
  [-2.5, -69.6], // Tabatinga
  [-1.0, -69.5],
  [0.5, -66.8], // São Gabriel da Cachoeira
  [1.6, -65.5],
  [2.5, -64.0],
  [3.5, -62.5],
  [4.0, -60.7], // Roraima
  [4.5, -60.0], // Pacaraima (extremo NORTE)
  [4.0, -59.0],
  [3.6, -58.5], // Tripé Brasil-Venezuela-Guiana
  [3.0, -56.0],
  [2.0, -54.5],
  [3.5, -53.5],
  [4.5, -51.6], // fecha em Cabo Orange
];

function buildSilhouettePath(): string {
  const points = SILHOUETTE.map(([lat, lon]) => projectLatLon(lat, lon));
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  const cmds = [`M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`];
  for (const p of rest) {
    cmds.push(`L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
  }
  cmds.push("Z");
  return cmds.join(" ");
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
    size: 9,
    label: "Já realizada",
  },
  next: {
    fill: "var(--racing-red)",
    stroke: "var(--racing-red)",
    size: 13,
    label: "Próxima etapa",
  },
  upcoming: {
    fill: "var(--racing-blue-bright)",
    stroke: "var(--racing-blue-bright)",
    size: 10,
    label: "Etapa futura",
  },
  // tbd não chega no mapa, mas o type pede a chave
  tbd: {
    fill: "var(--racing-mute)",
    stroke: "var(--racing-mute)",
    size: 9,
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

type PinProps = {
  cluster: StageCluster;
  scale: number;
};

function Pin({ cluster, scale }: PinProps) {
  const reduce = useReducedMotion();
  const { setHoveredId, setActiveId, isHighlighted } = useTemporada();
  const status = clusterStatus(cluster);
  const visual = STATUS_VISUALS[status];

  const { x, y } = projectLatLon(cluster.lat, cluster.lon);
  const radius = visual.size * scale;
  const primaryStage = cluster.stages.find((s) => s.status === "next") ?? cluster.stages[0];
  const isClusterMulti = cluster.stages.length > 1;
  const highlighted = cluster.stages.some((s) => isHighlighted(s.id));

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setHoveredId(primaryStage.id)}
      onMouseLeave={() => setHoveredId(null)}
      onFocus={() => setHoveredId(primaryStage.id)}
      onBlur={() => setHoveredId(null)}
    >
      {/* Ring pulsante para a próxima etapa (CSS animation no globals.css) */}
      {status === "next" && !reduce ? (
        <circle
          cx={0}
          cy={0}
          r={radius + 6}
          fill="none"
          stroke={visual.stroke}
          strokeWidth={1.5}
          opacity={0.8}
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
          r={radius + 10}
          fill="none"
          stroke="var(--racing-white)"
          strokeWidth={1.5}
          opacity={0.5}
        />
      ) : null}

      {/* Pino — corpo */}
      <motion.circle
        cx={0}
        cy={0}
        r={radius}
        fill={visual.fill}
        animate={highlighted ? { scale: 1.15 } : { scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ transformOrigin: "center", transformBox: "fill-box" }}
      />

      {/* Anel branco fino */}
      <circle
        cx={0}
        cy={0}
        r={radius}
        fill="none"
        stroke="var(--racing-white)"
        strokeWidth={1.5}
        opacity={0.9}
      />

      {/* Round number (visível só nos pinos maiores) */}
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

      {/* Badge de cluster ×N */}
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

      {/* Botão clicável invisível por cima — pra a11y e click target */}
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
    </g>
  );
}

// ───────────────────────────────────────────────────────────────
// Mapa
// ───────────────────────────────────────────────────────────────

type Props = {
  stages: StageWithStatus[];
};

export function TemporadaMap({ stages }: Props) {
  const silhouettePath = useMemo(() => buildSilhouettePath(), []);
  const clusters = useMemo(() => groupClusters(stages), [stages]);

  // Scale aplicado nos pinos. O viewBox é responsivo via CSS,
  // então o scale serve só pra ajuste fino de proporção.
  const pinScale = 1;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${SVG_VIEWBOX.width} ${SVG_VIEWBOX.height}`}
        role="img"
        aria-label="Mapa do Brasil com 8 etapas do Moto1000GP 2026"
        className="h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid sutil ao fundo (linhas verticais) */}
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
            <stop offset="0%" stopColor="var(--racing-blue)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--racing-blue)" stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect
          width={SVG_VIEWBOX.width}
          height={SVG_VIEWBOX.height}
          fill="url(#temporada-grid)"
        />

        {/* Glow radial atrás do continente */}
        <rect
          width={SVG_VIEWBOX.width}
          height={SVG_VIEWBOX.height}
          fill="url(#temporada-glow)"
        />

        {/* Silhueta do Brasil */}
        <path
          d={silhouettePath}
          fill="oklch(0.28 0.12 254 / 0.18)"
          stroke="var(--racing-blue-bright)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Pinos */}
        <g aria-label="Etapas">
          {clusters.map((cluster) => (
            <Pin key={cluster.id} cluster={cluster} scale={pinScale} />
          ))}
        </g>
      </svg>

      <p className="sr-only">
        Mapa estilizado do Brasil com pinos para cada uma das 8 etapas do
        calendário Moto1000GP 2026.
      </p>
    </div>
  );
}
