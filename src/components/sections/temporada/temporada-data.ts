/**
 * Temporada 2026 — fonte única de verdade do calendário Moto1000GP.
 *
 * Datas e locais oficiais fornecidos pelo cliente em 29/04/2026.
 * Etapa 3 (05/07) tem circuito a definir — exibida na lista, sem pino no mapa.
 *
 * Coordenadas das cidades-sede são aproximações geográficas (não da pista).
 */

export type StageStatus = "past" | "next" | "upcoming" | "tbd";

export type Stage = {
  id: string;
  round: number;
  /** ISO `YYYY-MM-DD` — comparado contra `Date.now()` no client. */
  date: string;
  city: string;
  /** Sigla UF ou "—" se TBD. */
  state: string;
  circuit: string;
  /** `null` quando o circuito ainda não está definido. */
  lat: number | null;
  lon: number | null;
};

export type StageWithStatus = Stage & {
  status: StageStatus;
  /** Ex.: "12 ABR" — pt-BR, uppercase. */
  formattedDate: string;
  /** Ex.: "12 de abril" — pt-BR, lowercase. */
  longDate: string;
};

/**
 * 8 etapas oficiais Moto1000GP 2026.
 * Não reordenar: a posição do array casa com `round`.
 */
export const STAGES: Stage[] = [
  {
    id: "round-01",
    round: 1,
    date: "2026-04-12",
    city: "São Paulo",
    state: "SP",
    circuit: "Autódromo José Carlos Pace (Interlagos)",
    lat: -23.7014,
    lon: -46.6969,
  },
  {
    id: "round-02",
    round: 2,
    date: "2026-05-24",
    city: "Goiânia",
    state: "GO",
    circuit: "Autódromo Internacional de Goiânia",
    lat: -16.7016,
    lon: -49.2532,
  },
  {
    id: "round-03",
    round: 3,
    date: "2026-07-05",
    city: "A definir",
    state: "—",
    circuit: "Circuito a definir",
    lat: null,
    lon: null,
  },
  {
    id: "round-04",
    round: 4,
    date: "2026-08-02",
    city: "Cascavel",
    state: "PR",
    circuit: "Autódromo de Cascavel",
    lat: -24.9555,
    lon: -53.4552,
  },
  {
    id: "round-05",
    round: 5,
    date: "2026-08-22",
    city: "São Paulo",
    state: "SP",
    circuit: "Autódromo José Carlos Pace (Interlagos)",
    lat: -23.7014,
    lon: -46.6969,
  },
  {
    id: "round-06",
    round: 6,
    date: "2026-09-27",
    city: "Santa Cruz do Sul",
    state: "RS",
    circuit: "Autódromo Internacional de Santa Cruz do Sul",
    lat: -29.7178,
    lon: -52.4258,
  },
  {
    id: "round-07",
    round: 7,
    date: "2026-11-08",
    city: "Cuiabá",
    state: "MT",
    circuit: "Autódromo Internacional de Cuiabá",
    lat: -15.6014,
    lon: -56.0979,
  },
  {
    id: "round-08",
    round: 8,
    date: "2026-12-06",
    city: "Goiânia",
    state: "GO",
    circuit: "Autódromo Internacional de Goiânia",
    lat: -16.7016,
    lon: -49.2532,
  },
];

// ───────────────────────────────────────────────────────────────
// Projeção lat/lon → coordenadas SVG
// ───────────────────────────────────────────────────────────────

/**
 * Bounding box geográfico do Brasil (com folga visual nas bordas).
 * Usado tanto pra projetar pinos quanto pra desenhar a silhueta.
 */
export const SVG_BBOX = {
  latMin: -33.8,
  latMax: 5.3,
  lonMin: -74,
  lonMax: -34,
} as const;

export const SVG_VIEWBOX = { width: 800, height: 900 } as const;

export function projectLatLon(
  lat: number,
  lon: number
): { x: number; y: number } {
  const x =
    ((lon - SVG_BBOX.lonMin) / (SVG_BBOX.lonMax - SVG_BBOX.lonMin)) *
    SVG_VIEWBOX.width;
  const y =
    ((SVG_BBOX.latMax - lat) / (SVG_BBOX.latMax - SVG_BBOX.latMin)) *
    SVG_VIEWBOX.height;
  return { x, y };
}

// ───────────────────────────────────────────────────────────────
// Status & formatação
// ───────────────────────────────────────────────────────────────

const MONTHS_SHORT_PT = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

const MONTHS_LONG_PT = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/**
 * Formata "2026-04-12" → "12 ABR" (uppercase, pt-BR).
 * Parse manual pra evitar timezone shift de `new Date(iso)`.
 */
export function formatShortDate(iso: string): string {
  const [, monthStr, dayStr] = iso.split("-");
  const day = Number.parseInt(dayStr, 10);
  const month = Number.parseInt(monthStr, 10);
  return `${day.toString().padStart(2, "0")} ${MONTHS_SHORT_PT[month - 1]}`;
}

/**
 * Formata "2026-04-12" → "12 de abril" (pt-BR).
 */
export function formatLongDate(iso: string): string {
  const [, monthStr, dayStr] = iso.split("-");
  const day = Number.parseInt(dayStr, 10);
  const month = Number.parseInt(monthStr, 10);
  return `${day} de ${MONTHS_LONG_PT[month - 1]}`;
}

/**
 * Retorna timestamp da meia-noite UTC do ISO date — base estável de comparação.
 */
function isoToTimestamp(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`);
}

/**
 * Computa status de cada etapa baseado em `now`.
 *
 * - `past`: data anterior ao dia atual
 * - `next`: primeira etapa cuja data é hoje ou futura
 * - `upcoming`: demais etapas futuras
 * - `tbd`: etapas com circuito a definir (sobrescreve qualquer coisa exceto past)
 *
 * `now` injetável pra estabilidade em SSR/testes.
 */
export function computeStages(now: number = Date.now()): StageWithStatus[] {
  const todayUtc = (() => {
    const d = new Date(now);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  })();

  // Identifica a primeira etapa não-passada e não-TBD com data válida.
  const nextRoundId = STAGES.find(
    (s) => isoToTimestamp(s.date) >= todayUtc && s.lat !== null
  )?.id;

  return STAGES.map((stage) => {
    const ts = isoToTimestamp(stage.date);
    let status: StageStatus;
    if (ts < todayUtc) {
      status = "past";
    } else if (stage.lat === null) {
      status = "tbd";
    } else if (stage.id === nextRoundId) {
      status = "next";
    } else {
      status = "upcoming";
    }
    return {
      ...stage,
      status,
      formattedDate: formatShortDate(stage.date),
      longDate: formatLongDate(stage.date),
    };
  });
}

/**
 * Quantidade de etapas que ainda não aconteceram (inclui TBD futuras).
 */
export function countRemainingStages(stages: StageWithStatus[]): number {
  return stages.filter((s) => s.status !== "past").length;
}

// ───────────────────────────────────────────────────────────────
// Clusters (etapas com mesma cidade-sede)
// ───────────────────────────────────────────────────────────────

export type StageCluster = {
  /** ID composto a partir das coordenadas. */
  id: string;
  lat: number;
  lon: number;
  city: string;
  state: string;
  /** Etapas no mesmo local, ordenadas por round. */
  stages: StageWithStatus[];
};

/**
 * Agrupa etapas que dividem a mesma cidade-sede (mesma lat/lon).
 * Etapas TBD (sem coordenadas) são ignoradas — entram só na lista.
 */
export function groupClusters(stages: StageWithStatus[]): StageCluster[] {
  const map = new Map<string, StageCluster>();
  for (const stage of stages) {
    if (stage.lat === null || stage.lon === null) continue;
    const key = `${stage.lat.toFixed(3)}|${stage.lon.toFixed(3)}`;
    const existing = map.get(key);
    if (existing) {
      existing.stages.push(stage);
    } else {
      map.set(key, {
        id: key,
        lat: stage.lat,
        lon: stage.lon,
        city: stage.city,
        state: stage.state,
        stages: [stage],
      });
    }
  }
  return Array.from(map.values()).map((c) => ({
    ...c,
    stages: [...c.stages].sort((a, b) => a.round - b.round),
  }));
}

/**
 * Status agregado de um cluster — prioridade: next > upcoming > past.
 * Determina a cor dominante do pino quando há mais de uma etapa no mesmo local.
 */
export function clusterStatus(cluster: StageCluster): StageStatus {
  if (cluster.stages.some((s) => s.status === "next")) return "next";
  if (cluster.stages.some((s) => s.status === "upcoming")) return "upcoming";
  return "past";
}
