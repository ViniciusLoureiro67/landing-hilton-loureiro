"use client";

import {
  motion,
  useInView,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useRef } from "react";
import { CharReveal } from "@/components/motion/char-reveal";

/**
 * SobreHeading — heading "SOBRE" com:
 *
 *   1. "01" gigante de fundo (z=0), estático e leve
 *   2. Kicker editorial slide-in lateral
 *   3. Heading "SOBRE" char-by-char clip-path mask reveal
 *   4. Slash vermelho cresce horizontal em sequência
 *   5. Subtítulo entra com fade + slight rise
 *   6. Linha decorativa horizontal abaixo, desenhando 0→100%
 *
 * Reduced-motion: tudo estático, sem char reveal.
 */
export function SobreHeading() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="relative isolate">
      {/* "01" gigantesco de fundo — parallax horizontal no scroll */}
      <motion.span
        aria-hidden
        style={{ fontSize: "clamp(14rem, 25vw, 28rem)" }}
        className="pointer-events-none absolute -left-4 -top-12 z-0 select-none font-display leading-[0.78] tracking-[-0.04em] text-racing-white/[0.055] lg:-top-16"
      >
        01
      </motion.span>

      {/* Kicker editorial — "01 / Trajetória" */}
      <motion.div
        initial={{ opacity: 0, x: -28 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={
          reduce
            ? { duration: 0.2 }
            : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
        }
        className="relative z-10 mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-racing-mute"
      >
        <span className="text-racing-red">01</span>
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ transformOrigin: "left" }}
          className="block h-px w-12 bg-racing-mute"
        />
        <span>Trajetória</span>
      </motion.div>

      {/* Heading principal + slash crescente */}
      <div className="relative z-10 flex flex-wrap items-end gap-x-4 gap-y-3 lg:gap-x-6">
        <h2
          id="sobre-heading"
          className="font-heading text-[clamp(3.5rem,9vw,7.5rem)] font-black uppercase leading-[0.85] text-racing-white"
        >
          <CharReveal
            text="Sobre"
            as="span"
            stagger={0.05}
            viewportAmount={0.3}
          />
        </h2>

        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : undefined}
          transition={
            reduce
              ? { duration: 0.2 }
              : { duration: 0.9, ease: [0.85, 0, 0.15, 1], delay: 0.5 }
          }
          style={{ transformOrigin: "left center", willChange: "transform" }}
          className="mb-3 block h-[6px] w-24 bg-racing-red sm:w-32 lg:mb-5 lg:h-[8px] lg:w-48"
        />
      </div>

      {/* Subtítulo */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={
          reduce
            ? { duration: 0.2 }
            : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.95 }
        }
        className="relative z-10 mt-6 max-w-xl font-heading text-base font-medium uppercase tracking-[0.2em] text-racing-blue-bright lg:text-lg"
      >
        Hilton Loureiro <span className="text-racing-red">·</span> Piloto
        profissional
      </motion.p>

      {/* Linha decorativa horizontal abaixo, desenhando — fecha a header */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={
          reduce
            ? { duration: 0.2 }
            : { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 1.2 }
        }
        style={{ transformOrigin: "left", willChange: "transform" }}
        className="relative z-10 mt-8 block h-px w-full bg-racing-white/15"
      />
    </div>
  );
}
