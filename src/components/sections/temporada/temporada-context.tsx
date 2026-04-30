"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Contexto local da seção Temporada.
 *
 * - `hoveredId`: cursor sobre pino do mapa OU sobre card da lista
 * - `activeId`: card centralizado pelo scrollytelling (ou clique em pino)
 *
 * Visual: o "destaque" é o OR dos dois (qualquer um dispara highlight).
 * Semântica: `aria-current="step"` continua só na próxima etapa real
 * (não nesse highlight de UX).
 */
type TemporadaContextValue = {
  hoveredId: string | null;
  activeId: string | null;
  setHoveredId: (id: string | null) => void;
  setActiveId: (id: string | null) => void;
  /** Helper: retorna `true` se este id é o destacado no momento. */
  isHighlighted: (id: string) => boolean;
};

const TemporadaContext = createContext<TemporadaContextValue | null>(null);

export function TemporadaProvider({ children }: { children: ReactNode }) {
  const [hoveredId, setHoveredIdState] = useState<string | null>(null);
  const [activeId, setActiveIdState] = useState<string | null>(null);

  const setHoveredId = useCallback((id: string | null) => {
    setHoveredIdState(id);
  }, []);

  const setActiveId = useCallback((id: string | null) => {
    setActiveIdState(id);
  }, []);

  const value = useMemo<TemporadaContextValue>(
    () => ({
      hoveredId,
      activeId,
      setHoveredId,
      setActiveId,
      isHighlighted: (id) => hoveredId === id || activeId === id,
    }),
    [hoveredId, activeId, setHoveredId, setActiveId]
  );

  return (
    <TemporadaContext.Provider value={value}>
      {children}
    </TemporadaContext.Provider>
  );
}

export function useTemporada(): TemporadaContextValue {
  const ctx = useContext(TemporadaContext);
  if (!ctx) {
    throw new Error("useTemporada deve ser usado dentro de <TemporadaProvider>");
  }
  return ctx;
}
