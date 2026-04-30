"use client";

import { useReducedMotion as useReducedMotionFromFramer } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Versão SSR-safe de `useReducedMotion` da Framer Motion.
 *
 * Por que isso existe? O hook original lê `matchMedia('(prefers-reduced-motion)')`
 * de forma síncrona na primeira render do client. No servidor não há
 * `matchMedia`, então retorna `null` (~falsy). Na primeira render do client,
 * porém, ele já lê o valor real (`true`/`false`) — o que diverge da árvore
 * que o servidor renderizou e quebra a hydration sempre que algum componente
 * usa `useReducedMotion()` para decidir QUAL DOM renderizar (ex.: branch
 * `if (reduce) return <div>...</div>`).
 *
 * Estratégia: gateamos o valor real atrás de um flag `mounted` (state
 * inicializado como `false` no SSR e na primeira render do client; flipa
 * pra `true` no `useEffect` pós-hidratação). Antes de mounted, retornamos
 * `false` — animações tocam em ambos os lados, hydration nunca falha.
 * Depois do commit, retornamos o valor real do prefers-reduced-motion;
 * componentes que branham por `reduce` trocam pra versão estática então.
 *
 * Custo: usuários com reduced-motion veem **um único frame** da versão
 * animada antes do switch — imperceptível na prática (≤16ms) e o preço
 * de ter SSR consistente. Para casos críticos (animações disparadas em
 * mount), combine com `initial={false}` ou um `MotionConfig` no root.
 *
 * Sobre o lint: `react-hooks/set-state-in-effect` é genericamente bom,
 * mas pra "detectar mount client-side" é o padrão idiomático. Desativamos
 * só nesta linha; tentamos `useSyncExternalStore` primeiro mas em prod
 * minificado o microtask de subscribe não estava notificando React de
 * forma confiável.
 */
export function useReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotionFromFramer();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return mounted ? !!reduce : false;
}
