"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis (smooth scroll) sempre ativo, independente do `prefers-reduced-motion`
 * do SO. Ver decisão e trade-off de a11y em `src/lib/use-reduced-motion-safe.ts`.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      // Intercepta cliques em <a href="#..."> e anima o scroll. Offset
      // negativo compensa a altura do navbar fixo (h-16 = 64px) pra
      // o título da seção alvo não ficar escondido atrás dele.
      anchors: { offset: -64 },
    });

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
