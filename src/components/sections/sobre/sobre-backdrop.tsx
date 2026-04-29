"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/**
 * SobreBackdrop — backdrop fixo da seção Sobre, com 76 gigantesco que
 * faz parallax e morpha de escala/opacidade conforme o scroll.
 *
 * Implementação:
 * - Container `position: absolute inset-0` cobrindo toda a section.
 * - 76 com `position: sticky top-1/2` pra ficar "preso" verticalmente
 *   enquanto a section rola atrás dele — efeito de parallax sem usar
 *   `background-attachment` (que tem bugs no iOS).
 * - `useScroll` no parent rastreia 0..1 do progresso do scroll DA SEÇÃO,
 *   e disso derivamos translação horizontal, escala e opacidade.
 *
 * Reduced-motion: estático, opacidade ~3%, sem transformação.
 */
export function SobreBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 76 entra grande à direita, vem pro centro, e sai pra esquerda
  const x = useTransform(scrollYProgress, [0, 1], ["10vw", "-30vw"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.95]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.025, 0.06, 0.06, 0.02]
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.span
        className="absolute left-1/2 top-1/2 select-none font-display leading-[0.78] tracking-[-0.04em] text-racing-white"
        style={
          reduce
            ? {
                fontSize: "clamp(18rem, 35vw, 45rem)",
                color: "oklch(1 0 0 / 0.03)",
                transform: "translate(-50%, -50%)",
                position: "sticky",
                top: "50%",
              }
            : {
                fontSize: "clamp(18rem, 35vw, 45rem)",
                position: "sticky",
                top: "50%",
                x,
                scale,
                opacity,
                translateY: "-50%",
                willChange: "transform, opacity",
              }
        }
      >
        76
      </motion.span>

      {/* Speedlines diagonais sutis — reforço editorial */}
      <div
        aria-hidden
        className="hero-speedlines pointer-events-none absolute inset-0 opacity-40"
      />

      {/* Vinheta sutil topo/baixo pra integrar com o hero acima e a próxima
          seção abaixo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-racing-blue-deep to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-racing-blue-deep to-transparent"
      />
    </div>
  );
}
