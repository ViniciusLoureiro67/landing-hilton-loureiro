"use client";

/**
 * Hook de preferência de movimento reduzido — DESATIVADO por decisão do
 * cliente.
 *
 * A landing depende do timing cinematográfico (sequência da largada F1,
 * char-reveals do nome, mask-reveals da foto Sobre, flip counters, switch
 * points do mapa Temporada etc.) pra entregar a sensação de "vídeo dirigido
 * por scroll". O fallback estático que existia (entrada via fade simples,
 * counters em valor final, sem cortina/stripes etc.) descaracterizava a
 * página de forma considerada inaceitável pelo cliente em testes lado-a-lado.
 *
 * Decisão (registrada em código): a landing IGNORA o `prefers-reduced-motion`
 * do SO. Todos os usuários — Windows, mobile, com a flag ligada ou não —
 * recebem a versão animada. Os componentes ainda chamam este hook (sem
 * remover branches), mas o resultado é sempre `false`, então o caminho
 * animado é o único exercitado.
 *
 * Trade-off de a11y: usuários com `prefers-reduced-motion: reduce` no
 * SO verão as animações mesmo assim. Mantemos os outros eixos de
 * acessibilidade (contraste >= 4.5:1, focus visíveis, alt descritivo,
 * hierarquia de heading, alvos touch >= 44px). Apenas a preferência de
 * motion é desconsiderada nesta landing.
 *
 * Para reativar (ex.: aplicar a outras rotas no futuro), restaure a
 * versão SSR-safe original:
 *
 *   import { useReducedMotion as useReducedMotionFromFramer } from "framer-motion";
 *   import { useEffect, useState } from "react";
 *
 *   export function useReducedMotion(): boolean {
 *     const [mounted, setMounted] = useState(false);
 *     const reduce = useReducedMotionFromFramer();
 *     useEffect(() => { setMounted(true); }, []);
 *     return mounted ? !!reduce : false;
 *   }
 */
export function useReducedMotion(): boolean {
  return false;
}
