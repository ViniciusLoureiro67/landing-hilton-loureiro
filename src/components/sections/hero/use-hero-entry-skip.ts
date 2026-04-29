"use client";

import { useEffect, useState } from "react";

/**
 * Hook compartilhado entre os 8 client components do hero. Responde:
 * "devo pular a sequência cinematográfica de entrada (semáforo de
 * largada + reveal do nome + stagger longo)?"
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

export function useHeroEntrySkip(): boolean {
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    // bfcache: páginas restauradas do back/forward cache disparam
    // `pageshow` com `event.persisted === true`. O DOM já está montado
    // como antes, então não faz sentido refazer a sequência.
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
