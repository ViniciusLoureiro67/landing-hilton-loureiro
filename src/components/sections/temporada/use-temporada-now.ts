"use client";

import { useEffect, useState } from "react";

/**
 * Hook que retorna `Date.now()` no client após hidratação, e `0` no SSR.
 *
 * Estratégia: `useState(0)` na render inicial (server e client primeiro
 * passe concordam → zero hydration mismatch), e `useEffect` empurra o
 * timestamp real após o commit. Não atualiza periodicamente — só
 * precisamos saber se o usuário está antes/depois de cada etapa, e o
 * relógio não muda relevantemente enquanto rola a página.
 *
 * Sobre o lint: `react-hooks/set-state-in-effect` é genericamente correto
 * (evitar cascading renders), mas para "detectar mount client-side" essa
 * É a forma idiomática. Tentamos `useSyncExternalStore` antes; em prod
 * minificado o microtask de notificação não estava trocando do server
 * snapshot pro client snapshot de forma confiável. Voltamos pro padrão
 * comprovado e desativamos a regra apenas neste ponto.
 */
export function useTemporadaNow(): number {
  const [now, setNow] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
  }, []);

  return now;
}
