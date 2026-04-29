"use client";

import { useEffect, useState } from "react";

/**
 * Hook compartilhado pelos componentes que participam da entrada
 * cinematográfica do site (hero + navbar).
 *
 * Responde: "devo pular a sequência de entrada (semáforo de largada
 * + reveal do nome + cascata)?".
 *
 * Política (descrita por intenção, não por implementação):
 *
 *   - Visita inicial / nova aba .................. SEMPRE TOCA
 *   - F5 / Cmd-R / hard refresh .................. SEMPRE TOCA
 *   - Botão voltar ou bfcache (`pageshow.persisted`) PULA
 *   - `prefers-reduced-motion` ................... PULA (componente decide)
 *
 * Implementação: o estado padrão é `false` (= não pula = toca a animação).
 * O único momento em que o hook retorna `true` é quando a página foi
 * restaurada do bfcache do browser (usuário voltou via histórico). Isso
 * preserva a ideia: o gesto deliberado de F5 sempre repete o show.
 *
 * SSR: retorna `false` (anima sempre na primeira renderização).
 */
export function useCinematicEntrySkip(): boolean {
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        setSkip(true);
      }
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return skip;
}
