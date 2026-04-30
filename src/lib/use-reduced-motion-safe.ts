"use client";

import { useReducedMotion as useReducedMotionFromFramer } from "framer-motion";
import { useSyncExternalStore } from "react";

/**
 * Versão SSR-safe de `useReducedMotion` da Framer Motion.
 *
 * Por que isso existe? O hook da Framer lê `matchMedia('(prefers-reduced-motion)')`
 * de forma síncrona na primeira render do client. No servidor não há
 * `matchMedia`, então retorna `null` (~falsy). Na primeira render do client,
 * porém, ele já lê o valor real (`true`/`false`) — o que diverge da árvore
 * que o servidor renderizou e quebra a hydration sempre que algum componente
 * usa `useReducedMotion()` para decidir QUAL DOM renderizar (ex.: branch
 * `if (reduce) return <div>...</div>`).
 *
 * Estratégia: gateamos o valor real atrás de um flag "mounted" implementado
 * com `useSyncExternalStore`. Tanto o servidor (`getServerSnapshot`) quanto a
 * primeira render do client antes da hydration (`getSnapshot` retorna `false`
 * inicialmente) veem `false`, então a hydration nunca falha. Logo após a
 * hydration, o snapshot vira `true` e o componente re-renderiza com o valor
 * real do prefers-reduced-motion.
 *
 * Custo: usuários com reduced-motion veem **um único frame** da versão
 * animada antes do switch — imperceptível na prática (≤16ms) e o preço de
 * ter SSR consistente. Para casos críticos (animações disparadas em mount),
 * combine com `initial={false}` ou `MotionConfig`.
 */

function subscribe() {
  return () => {};
}

function getSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const reduce = useReducedMotionFromFramer();
  return mounted ? !!reduce : false;
}
