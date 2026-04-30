"use client";

import { useMemo } from "react";
import { TemporadaProvider } from "./temporada-context";
import { TemporadaMap } from "./temporada-map";
import { TemporadaList } from "./temporada-list";
import { computeStages } from "./temporada-data";
import { useTemporadaNow } from "./use-temporada-now";

/**
 * TemporadaGrid — wrapper client que combina mapa + lista com o Provider
 * de sincronização e calcula os status das etapas no client (evita
 * mismatch de hidratação por timezone/data).
 *
 * Layout:
 *   - Mobile/tablet: vertical (mapa em cima, lista embaixo)
 *   - Desktop (lg ↑): grid 12-col, mapa sticky 5 cols à esquerda + lista 7
 *     cols rolando à direita (scrollytelling).
 *
 * `useTemporadaNow()` retorna 0 no SSR e `Date.now()` no client (via
 * `useSyncExternalStore`), evitando o anti-pattern de `setState` em
 * `useEffect` e mantendo SSR estável.
 */
export function TemporadaGrid() {
  const now = useTemporadaNow();
  const stages = useMemo(() => computeStages(now), [now]);

  return (
    <TemporadaProvider>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto max-w-md lg:max-w-none">
            <TemporadaMap stages={stages} />
            <MapLegend />
          </div>
        </div>

        <div className="lg:col-span-7">
          <TemporadaList stages={stages} />
        </div>
      </div>
    </TemporadaProvider>
  );
}

function MapLegend() {
  return (
    <ul
      aria-label="Legenda do mapa"
      className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute"
    >
      <li className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block size-3 rounded-full bg-racing-red"
        />
        Próxima
      </li>
      <li className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block size-3 rounded-full bg-racing-blue-bright"
        />
        Futura
      </li>
      <li className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block size-3 rounded-full bg-racing-mute"
        />
        Realizada
      </li>
    </ul>
  );
}
