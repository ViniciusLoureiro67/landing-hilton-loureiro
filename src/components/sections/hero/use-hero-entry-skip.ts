"use client";

import { useEffect, useSyncExternalStore } from "react";

/**
 * Hook compartilhado entre os 8 client components do hero. Responde:
 * "devo pular a sequência de entrada (ignição + reveal + stagger longo)?"
 *
 * Regra: pula se a sessão atual já viu o hero rodar ao menos uma vez.
 * Persistido em `sessionStorage.hero-played` (não em `localStorage` — a
 * primeira visita do dia merece a entrada cinematográfica).
 *
 * SSR: retorna `false` (anima sempre na primeira renderização).
 * Client mount: `useSyncExternalStore` lê `sessionStorage` sincronamente
 * antes do paint, então já no primeiro render do client a flag está
 * correta — sem flicker entre "começou a animar → snap final".
 *
 * Após 3s do mount (tempo da sequência inteira ~2.7s + folga), marca
 * `sessionStorage.hero-played = 1`. Se o usuário recarregar dentro da
 * mesma aba, próxima passada do hook retorna `true` e os componentes
 * pulam delays/animações de entrada.
 */

const STORAGE_KEY = "hero-played";

const subscribe = () => () => {};

function getClientSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Acesso a sessionStorage pode falhar em modo privado / iframe sandbox
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function useHeroEntrySkip(): boolean {
  const skip = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (skip) return;
    const id = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* noop */
      }
    }, 3000);
    return () => window.clearTimeout(id);
  }, [skip]);

  return skip;
}
