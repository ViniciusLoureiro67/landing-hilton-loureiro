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
 * Contexto local da seção Temporada — sincroniza highlight entre mapa e lista.
 *
 * Estados:
 *   - `hoveredId`: cursor sobre pino do mapa OU sobre card da lista
 *   - `activeId`: card centralizado pelo scrollytelling (ou clique em pino/estado)
 *   - `hoveredStateUf`: cursor sobre um estado do mapa — usado para destacar
 *     o estado em si E o(s) card(s) anfitrião(es)
 *
 * Visual: o "destaque" do card é o OR dos três (qualquer um dispara highlight).
 * Semântica: `aria-current="step"` continua só na próxima etapa real, não nesse
 * highlight de UX.
 */
type TemporadaContextValue = {
  hoveredId: string | null;
  activeId: string | null;
  hoveredStateUf: string | null;
  /**
   * Token pra requisitar abertura do popover do mapa numa UF — incrementa
   * a cada chamada pra disparar mesmo se o UF for o mesmo da última vez.
   */
  popoverRequest: { uf: string; token: number } | null;
  setHoveredId: (id: string | null) => void;
  setActiveId: (id: string | null) => void;
  setHoveredStateUf: (uf: string | null) => void;
  requestPopoverFor: (uf: string | null) => void;
  /** Helper: retorna `true` se este id é o destacado no momento. */
  isHighlighted: (id: string) => boolean;
};

const TemporadaContext = createContext<TemporadaContextValue | null>(null);

export function TemporadaProvider({ children }: { children: ReactNode }) {
  const [hoveredId, setHoveredIdState] = useState<string | null>(null);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [hoveredStateUf, setHoveredStateUfState] = useState<string | null>(
    null
  );
  const [popoverRequest, setPopoverRequest] = useState<{
    uf: string;
    token: number;
  } | null>(null);

  const setHoveredId = useCallback((id: string | null) => {
    setHoveredIdState(id);
  }, []);

  const setActiveId = useCallback((id: string | null) => {
    setActiveIdState(id);
  }, []);

  const setHoveredStateUf = useCallback((uf: string | null) => {
    setHoveredStateUfState(uf);
  }, []);

  const requestPopoverFor = useCallback((uf: string | null) => {
    if (uf === null) {
      setPopoverRequest(null);
      return;
    }
    // Token incremental — força o efeito do mapa a re-disparar mesmo se o
    // usuário clicar em dois cards do mesmo estado em sequência.
    setPopoverRequest((prev) => ({ uf, token: (prev?.token ?? 0) + 1 }));
  }, []);

  const value = useMemo<TemporadaContextValue>(
    () => ({
      hoveredId,
      activeId,
      hoveredStateUf,
      popoverRequest,
      setHoveredId,
      setActiveId,
      setHoveredStateUf,
      requestPopoverFor,
      isHighlighted: (id) => hoveredId === id || activeId === id,
    }),
    [
      hoveredId,
      activeId,
      hoveredStateUf,
      popoverRequest,
      setHoveredId,
      setActiveId,
      setHoveredStateUf,
      requestPopoverFor,
    ]
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
