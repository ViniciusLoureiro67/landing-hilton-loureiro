// Gera src/components/sections/temporada/temporada-states-data.ts a partir do
// GeoJSON oficial de UFs brasileiras (giuliano-macedo/geodata-br-states).
//
// Roda uma vez. Sem dependências externas — Douglas-Peucker e cálculo de
// centroide implementados aqui. Resultado: const tipada com paths SVG já
// projetados pra mesma bbox usada em temporada-data.ts.
//
// Uso: `node scripts/build-states-data.mjs`

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(__dirname, "_br_states_raw.json");
const OUT = resolve(
  ROOT,
  "src/components/sections/temporada/temporada-states-data.ts"
);

// Mesma bbox usada em temporada-data.ts. Mantém em sync se editar.
const BBOX = { latMin: -33.8, latMax: 5.3, lonMin: -74, lonMax: -34 };
const SVG_W = 800;
const SVG_H = 900;

// Tolerância do Douglas-Peucker em graus. Ajusta detalhe x peso.
//   0.10 → silhueta limpa, ~8-15 pts/estado
//   0.05 → mais detalhe, ~20-40 pts/estado
//   0.03 → quase original, ~40-80 pts/estado
const TOLERANCE = 0.08;

// Mínimo de pontos para manter a forma reconhecível. Estados pequenos com
// menos pontos viram retângulos.
const MIN_POINTS = 6;

// ───────────────────────────────────────────────────────────────
// Geo helpers
// ───────────────────────────────────────────────────────────────

function projectLonLat(lon, lat) {
  const x = ((lon - BBOX.lonMin) / (BBOX.lonMax - BBOX.lonMin)) * SVG_W;
  const y = ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * SVG_H;
  return [x, y];
}

/** Distância perpendicular do ponto P à linha AB (em coords lon/lat). */
function perpDist(p, a, b) {
  const [px, py] = p;
  const [ax, ay] = a;
  const [bx, by] = b;
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) {
    return Math.hypot(px - ax, py - ay);
  }
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
  const proj = [ax + t * dx, ay + t * dy];
  return Math.hypot(px - proj[0], py - proj[1]);
}

/** Douglas-Peucker iterativo (sem stack overflow em rings grandes). */
function dpSimplify(points, eps) {
  if (points.length <= 2) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    let maxD = 0;
    let idx = -1;
    for (let k = i + 1; k < j; k++) {
      const d = perpDist(points[k], points[i], points[j]);
      if (d > maxD) {
        maxD = d;
        idx = k;
      }
    }
    if (idx !== -1 && maxD > eps) {
      keep[idx] = 1;
      stack.push([i, idx]);
      stack.push([idx, j]);
    }
  }
  const out = [];
  for (let k = 0; k < points.length; k++) {
    if (keep[k]) out.push(points[k]);
  }
  return out;
}

/** Centroide aproximado do polígono (média ponderada de áreas). */
function polygonCentroid(rings) {
  let sx = 0;
  let sy = 0;
  let sa = 0;
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[i + 1];
      const cross = x1 * y2 - x2 * y1;
      sx += (x1 + x2) * cross;
      sy += (y1 + y2) * cross;
      sa += cross;
    }
  }
  if (sa === 0) {
    // fallback: média simples de todos os pontos
    const all = rings.flat();
    return [
      all.reduce((s, p) => s + p[0], 0) / all.length,
      all.reduce((s, p) => s + p[1], 0) / all.length,
    ];
  }
  sa /= 2;
  return [sx / (6 * sa), sy / (6 * sa)];
}

/** Bbox do polígono. */
function polygonBbox(rings) {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      if (lon < minLon) minLon = lon;
      if (lat < minLat) minLat = lat;
      if (lon > maxLon) maxLon = lon;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return { minLon, minLat, maxLon, maxLat };
}

// ───────────────────────────────────────────────────────────────
// Pipeline
// ───────────────────────────────────────────────────────────────

const STATE_NAMES = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

const raw = JSON.parse(readFileSync(SRC, "utf8"));

const states = [];
let pointsBefore = 0;
let pointsAfter = 0;

for (const f of raw.features) {
  const uf = f.id;
  const name = STATE_NAMES[uf] ?? uf;
  const geo = f.geometry;
  if (!geo) continue;

  // Normaliza para Polygon[] (cada um sendo array de rings)
  const polygons =
    geo.type === "Polygon"
      ? [geo.coordinates]
      : geo.type === "MultiPolygon"
      ? geo.coordinates
      : [];

  if (polygons.length === 0) continue;

  // Simplifica cada ring em coords lon/lat
  const simplifiedPolys = polygons.map((rings) =>
    rings.map((ring) => {
      pointsBefore += ring.length;
      let s = dpSimplify(ring, TOLERANCE);
      if (s.length < MIN_POINTS) {
        s = dpSimplify(ring, TOLERANCE / 2);
      }
      // Garante fechamento
      const first = s[0];
      const last = s[s.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) s.push(first);
      pointsAfter += s.length;
      return s;
    })
  );

  // Centroide pra label (no maior polygon)
  const main = simplifiedPolys.reduce((acc, cur) =>
    cur[0].length > acc[0].length ? cur : acc
  );
  const [cLon, cLat] = polygonCentroid(main);
  const [cx, cy] = projectLonLat(cLon, cLat);

  // Bbox (em coords SVG) — usado pra resize do label se o estado for pequeno
  const { minLon, minLat, maxLon, maxLat } = polygonBbox(main);
  const [x1, y1] = projectLonLat(minLon, maxLat);
  const [x2, y2] = projectLonLat(maxLon, minLat);
  const bbox = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };

  // SVG path string (M x y L x y ... Z para cada ring)
  const pathParts = [];
  for (const rings of simplifiedPolys) {
    for (const ring of rings) {
      const [first, ...rest] = ring;
      const [fx, fy] = projectLonLat(first[0], first[1]);
      pathParts.push(`M${fx.toFixed(1)} ${fy.toFixed(1)}`);
      for (const p of rest) {
        const [x, y] = projectLonLat(p[0], p[1]);
        pathParts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      pathParts.push("Z");
    }
  }

  states.push({
    uf,
    name,
    path: pathParts.join(" "),
    centroid: { x: +cx.toFixed(1), y: +cy.toFixed(1) },
    bbox: {
      x: +bbox.x.toFixed(1),
      y: +bbox.y.toFixed(1),
      w: +bbox.w.toFixed(1),
      h: +bbox.h.toFixed(1),
    },
  });
}

// Ordena por latitude do centroide (Norte → Sul) — usado pra stagger de
// entrada do mapa (o reveal escorre top-to-bottom).
states.sort((a, b) => a.centroid.y - b.centroid.y);

const ts = `// Gerado por scripts/build-states-data.mjs — não editar manualmente.
// Fonte: giuliano-macedo/geodata-br-states (GeoJSON oficial), simplificado
// via Douglas-Peucker (epsilon=${TOLERANCE}°). Coordenadas SVG já projetadas
// na bbox geográfica de \`temporada-data.ts\` (lon ∈ [-74,-34], lat ∈ [-33.8,5.3]),
// viewBox 800×900.
//
// Para regenerar: \`node scripts/build-states-data.mjs\` (com o GeoJSON em
// scripts/_br_states_raw.json).

export type BrazilStateGeometry = {
  /** Sigla UF (ex.: "SP", "MG"). */
  uf: string;
  /** Nome longo do estado. */
  name: string;
  /** SVG path string ("M x y L x y ... Z"). */
  path: string;
  /** Centroide em coords SVG — usado para posicionar a sigla. */
  centroid: { x: number; y: number };
  /** Bounding box em coords SVG — usado para redimensionar a sigla quando
   *  o estado é pequeno (ex.: AL, SE, RJ, DF). */
  bbox: { x: number; y: number; w: number; h: number };
};

/**
 * 27 unidades federativas em ordem norte → sul (centroide y crescente).
 * Esta ordem é usada para stagger de entrada do mapa.
 */
export const BRAZIL_STATES: ReadonlyArray<BrazilStateGeometry> = ${JSON.stringify(
  states,
  null,
  2
)};
`;

writeFileSync(OUT, ts);

console.log(
  `OK: ${states.length} estados gerados (${pointsBefore} → ${pointsAfter} pontos, ${(
    (1 - pointsAfter / pointsBefore) *
    100
  ).toFixed(1)}% de redução).`
);
console.log(`Output: ${OUT}`);
