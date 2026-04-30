"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook que retorna `Date.now()` no client após hidratação, e `0` no SSR.
 *
 * Usar `useSyncExternalStore` é o padrão idiomático em React 19+ pra
 * sincronizar com fontes externas (como o relógio do sistema) sem cair
 * no anti-pattern de `setState` dentro de `useEffect`. Também garante
 * que SSR e hidratação inicial concordem (`getServerSnapshot` → `0`),
 * e o client recebe o valor real após o primeiro commit.
 *
 * Não emite atualizações periódicas: só queremos saber se já passou ou
 * não da data de cada etapa, e o usuário não fica horas na seção.
 */
export function useTemporadaNow(): number {
  return useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
}

function subscribe(): () => void {
  return () => {};
}

function getClientSnapshot(): number {
  return Date.now();
}

function getServerSnapshot(): number {
  return 0;
}
