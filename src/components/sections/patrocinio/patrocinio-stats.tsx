"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useRef } from "react";
import { FlipCounter } from "@/components/motion/flip-counter";
import { PATROCINIO_STATS } from "./patrocinio-copy";

/**
 * PatrocinioStats — 3 contadores massivos (replica o padrão de SobreStats).
 *
 *   1. Cascata orquestrada via `staggerChildren` no parent
 *   2. Linha vermelha cresce 0→100% acima do número (drawn line)
 *   3. FlipCounter conta de 0 → valor com flip 3D nos dígitos
 *   4. Cada item entra com clip-path mask reveal vertical
 *   5. Index "01–03" em mono acima da barra vermelha
 *   6. Suffix "M+" / "K+" renderizado fora do FlipCounter (estilizado)
 */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.16, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const barVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.85, ease: [0.85, 0, 0.15, 1], delay: 0.1 },
  },
};

export function PatrocinioStats() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={reduce ? undefined : containerVariants}
      className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-10"
    >
      {PATROCINIO_STATS.map((stat) => (
        <motion.div
          key={stat.label}
          aria-label={stat.ariaLabel}
          variants={reduce ? undefined : itemVariants}
          style={{ willChange: "clip-path, opacity, transform" }}
          className="relative flex flex-col"
        >
          <span className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-racing-red/80">
            {stat.index}
          </span>

          <motion.span
            aria-hidden
            variants={reduce ? undefined : barVariants}
            style={{ transformOrigin: "left center", willChange: "transform" }}
            className="mb-3 block h-[2px] w-full bg-racing-red"
          />

          <span
            className="flex items-baseline gap-1 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.85] tracking-tight text-racing-white"
          >
            {stat.displayPrefix ? (
              <span aria-hidden className="text-racing-white/70">
                {stat.displayPrefix}
              </span>
            ) : null}
            <FlipCounter value={stat.value} inView={inView} duration={1.6} />
            {stat.displaySuffix ? (
              <span
                aria-hidden
                className="text-[0.55em] font-bold text-racing-red"
              >
                {stat.displaySuffix}
              </span>
            ) : null}
          </span>

          <span className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-racing-mute">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
