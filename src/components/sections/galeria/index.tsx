"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { CharReveal } from "@/components/motion/char-reveal";
import { GALERIA_PHOTOS } from "./galeria-photos";
import { GaleriaCard } from "./galeria-card";

/**
 * Seção Galeria (#galeria) — showcase editorial das fotos selecionadas.
 *
 * Layout em grid asymétrico (lg+): cards alternam wide/narrow por linha,
 * criando ritmo visual estilo magazine. Em mobile, todos viram coluna
 * única full-width.
 *
 * Performance:
 *   - Cada card tem useInView { once: true } pra animar só uma vez.
 *   - Fotos usam Next/Image com sizes responsivos pra otimizar bandwidth.
 *   - Apenas as 2 primeiras (acima da fold em mobile) são `priority`.
 */
export function Galeria() {
  const reduce = useReducedMotion();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  return (
    <section
      id="galeria"
      aria-labelledby="galeria-heading"
      className="relative isolate overflow-x-clip bg-racing-blue-deep py-24 lg:py-32"
    >
      {/* "76" gigante assimétrico — assinatura visual recorrente */}
      <span
        aria-hidden
        className="racing-number-bg pointer-events-none absolute -right-32 top-1/4 select-none opacity-100"
      >
        76
      </span>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-12 lg:mb-20">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : undefined}
            transition={
              reduce
                ? { duration: 0.2 }
                : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
            }
            className="font-mono text-xs uppercase tracking-[0.3em] text-racing-mute"
          >
            <span className="text-racing-red">06</span>
            <span
              aria-hidden
              className="mx-3 inline-block h-px w-8 align-middle bg-racing-mute/40"
            />
            Galeria
          </motion.p>

          <h2
            id="galeria-heading"
            className="mt-3 font-display uppercase leading-[0.88] tracking-tight text-racing-white"
            style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
          >
            <CharReveal
              as="span"
              text="Em pista."
              stagger={0.07}
              delay={0.25}
              viewportAmount={0.3}
            />{" "}
            <CharReveal
              as="span"
              text="Em foco."
              stagger={0.07}
              delay={0.85}
              viewportAmount={0.3}
              className="text-racing-blue-bright"
            />
          </h2>

          <div className="mt-6 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-x-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={headerInView ? { opacity: 1, y: 0 } : undefined}
              transition={
                reduce
                  ? { duration: 0.2 }
                  : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }
              }
              className="text-base leading-[1.7] text-racing-white/65 lg:col-span-7 lg:text-lg"
            >
              Frames das corridas, dos pódios e dos bastidores. Cobertura
              editorial das etapas mais marcantes da temporada — capturadas
              por fotógrafos da pista.
            </motion.p>

            {/* Counter editorial à direita — metadata da galeria */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={headerInView ? { opacity: 1, x: 0 } : undefined}
              transition={
                reduce
                  ? { duration: 0.2 }
                  : { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }
              }
              className="hidden flex-col items-end gap-1 font-mono text-xs uppercase tracking-[0.3em] text-racing-mute lg:col-span-5 lg:col-start-9 lg:flex"
            >
              <span className="flex items-center gap-3">
                <span aria-hidden className="block h-px w-10 bg-racing-mute/40" />
                <span>{String(GALERIA_PHOTOS.length).padStart(2, "0")} frames</span>
              </span>
              <span className="text-racing-mute/55">
                Temporada 2025 · NRT-2026
              </span>
            </motion.div>
          </div>
        </div>

        {/* Grid asymétrico — em lg+ usa 12-col com cards span 8 (wide) ou
            4 (narrow). Em mobile vira 1-col full-width. */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          {GALERIA_PHOTOS.map((photo, idx) => (
            <GaleriaCard
              key={photo.src}
              photo={photo}
              index={idx}
              revealFrom={idx % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
