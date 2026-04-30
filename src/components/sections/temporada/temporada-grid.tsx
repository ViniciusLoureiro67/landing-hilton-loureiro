"use client";

import { useMemo } from "react";
import { MousePointerClick } from "lucide-react";
import { TemporadaProvider } from "./temporada-context";
import { TemporadaMap } from "./temporada-map";
import { TemporadaList } from "./temporada-list";
import { computeStages } from "./temporada-data";
import { useTemporadaNow } from "./use-temporada-now";

const MAP_LEGEND_ITEMS = [
  { label: "Próxima", className: "bg-racing-red" },
  { label: "Futura", className: "bg-racing-blue-bright" },
  { label: "Realizada", className: "bg-racing-mute" },
];

/**
 * TemporadaGrid — wrapper client que combina mapa + lista com o Provider
 * de sincronização e calcula os status das etapas no client (evita
 * mismatch de hidratação por timezone/data).
 *
 * Layout:
 *   - Mobile/tablet: mapa sticky protagonista no topo + lista rolando abaixo.
 *   - Desktop (lg ↑): mapa sticky maior (7 cols) + trilho de etapas (5 cols).
 *
 * `useTemporadaNow()` retorna 0 no SSR e `Date.now()` no client depois do
 * mount, mantendo o HTML inicial estável para hidratação.
 */
export function TemporadaGrid() {
  const now = useTemporadaNow();
  const stages = useMemo(() => computeStages(now), [now]);

  return (
    <TemporadaProvider>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
        {/*
          Sticky apenas em lg+. Em mobile/tablet o mapa fluiria no topo
          em coluna única e cobriria os cards (z-20 > z-10), por isso
          desligamos o sticky abaixo de lg. Em lg+, o container vira
          h-screen com flex items-center, mantendo o mapa verticalmente
          centralizado conforme a lista (mais alta) rola — padrão de
          scrollytelling, evita o "espaço vazio embaixo do mapa".
        */}
        <div className="self-start lg:sticky lg:top-0 lg:z-20 lg:col-span-7 lg:flex lg:h-screen lg:items-center">
          <div className="relative -mx-4 w-full overflow-hidden border-y border-racing-white/5 bg-racing-blue-deep/96 px-4 py-4 shadow-[0_20px_60px_-36px_oklch(0_0_0/0.9)] sm:mx-0 sm:rounded-sm sm:border sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-racing-blue-bright/70 to-transparent"
            />
            <TemporadaMap stages={stages} className="mx-auto w-full max-w-[44rem] lg:max-w-none" />
            <MapLegend />
          </div>
        </div>

        <div className="relative z-10 lg:col-span-5 lg:pt-[8svh]">
          <TemporadaList stages={stages} />
        </div>
      </div>
    </TemporadaProvider>
  );
}

function MapLegend() {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <ul
        aria-label="Legenda do mapa"
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute"
      >
        {MAP_LEGEND_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className={`inline-block size-3 rounded-full ${item.className}`}
            />
            {item.label}
          </li>
        ))}
      </ul>

      {/* Hint de interatividade — afordância textual de que estados
          são clicáveis. Sem isso, usuário (sobretudo mobile) não tem
          como adivinhar que o mapa abre detalhes. Mesma família
          tipográfica da legenda, alpha 60% pra não competir com ela. */}
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute/60">
        <MousePointerClick aria-hidden className="size-3" />
        <span>Clique nos estados pra ver as etapas</span>
      </p>
    </div>
  );
}
