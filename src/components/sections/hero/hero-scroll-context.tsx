"use client";

import { createContext, useContext, useRef } from "react";
import { useScroll, type MotionValue } from "framer-motion";

/**
 * Provider que cria a `<section id="top">` do hero, captura sua ref e
 * expõe o `scrollYProgress` (MotionValue 0..1) via Context para todos
 * os filhos client que precisam reagir ao scroll do hero.
 *
 * Antes essa lógica estava num hook compartilhado que usava
 * `document.getElementById`. O `useScroll` do framer-motion exige
 * uma ref do React (criada via `useRef`) apontando para um elemento
 * já hidratado — ler do DOM diretamente quebra com:
 *   "Target ref is defined but not hydrated"
 *
 * Centralizar via Context resolve isso e elimina o overhead de cada
 * filho criar seu próprio `useScroll` (pode haver até 6 instâncias).
 */

const HeroScrollContext = createContext<MotionValue<number> | null>(null);

export function useHeroScrollProgress(): MotionValue<number> {
  const value = useContext(HeroScrollContext);
  if (!value) {
    throw new Error(
      "useHeroScrollProgress() precisa estar dentro de <HeroScrollProvider>."
    );
  }
  return value;
}

type HeroScrollProviderProps = {
  className?: string;
  /**
   * Atributos da `<section>` raiz do hero — o provider cria a tag
   * internamente para poder anexar a ref do React.
   */
  ariaLabel?: string;
  ariaDescribedBy?: string;
  children: React.ReactNode;
};

export function HeroScrollProvider({
  className,
  ariaLabel,
  ariaDescribedBy,
  children,
}: HeroScrollProviderProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  return (
    <HeroScrollContext.Provider value={scrollYProgress}>
      <section
        ref={sectionRef}
        id="top"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={className}
      >
        {children}
      </section>
    </HeroScrollContext.Provider>
  );
}
