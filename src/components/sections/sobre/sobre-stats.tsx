"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
import { FlipCounter } from "@/components/motion/flip-counter";

/**
 * SobreStats — 4 contadores massivos com tratamento racing premium:
 *
 *   1. Cascata orquestrada via `staggerChildren` no parent
 *   2. Linha vermelha cresce de 0→100% acima de cada número (drawn line)
 *   3. FlipCounter conta de 0 → valor com flip 3D nos dígitos
 *   4. O último stat ("76") tem pulse infinito sutil — assinatura do piloto
 *   5. Cada item entra com clip-path mask reveal vertical
 *   6. Index "01–04" pequenino acima de cada label, em mono
 *
 * Reduced-motion: pula direto pro valor final, sem cascata, sem pulse.
 */

type StatItem = {
  index: string;
  value: number;
  label: string;
  ariaLabel: string;
  signature?: boolean;
};

const STATS: StatItem[] = [
  { index: "01", value: 49, label: "Anos", ariaLabel: "49 anos de idade" },
  {
    index: "02",
    value: 13,
    label: "Temporadas",
    ariaLabel: "13 temporadas consecutivas",
  },
  {
    index: "03",
    value: 6,
    label: "Títulos",
    ariaLabel: "6 títulos conquistados",
  },
  {
    index: "04",
    value: 76,
    label: "Número",
    ariaLabel: "Número 76 de corrida",
    signature: true,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
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

export function SobreStats() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={reduce ? undefined : containerVariants}
      className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 sm:gap-x-8"
    >
      {STATS.map((stat) => (
        <motion.div
          key={stat.label}
          aria-label={stat.ariaLabel}
          variants={reduce ? undefined : itemVariants}
          style={{ willChange: "clip-path, opacity, transform" }}
          className="relative flex flex-col"
        >
          {/* Index — "01" / "02" etc. acima do bar */}
          <span className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-racing-red/80">
            {stat.index}
          </span>

          {/* Bar vermelha — cresce horizontal */}
          <motion.span
            aria-hidden
            variants={reduce ? undefined : barVariants}
            style={{ transformOrigin: "left center", willChange: "transform" }}
            className="mb-3 block h-[2px] w-full bg-racing-red"
          />

          {/* Número — FlipCounter + pulse sutil no signature ("76") */}
          <motion.span
            animate={
              reduce || !stat.signature || !inView
                ? undefined
                : {
                    textShadow: [
                      "0 0 0px rgba(217,57,71,0)",
                      "0 0 24px rgba(217,57,71,0.5)",
                      "0 0 0px rgba(217,57,71,0)",
                    ],
                  }
            }
            transition={
              stat.signature
                ? {
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }
                : undefined
            }
            className={`font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.85] tracking-tight ${
              stat.signature ? "text-racing-white" : "text-racing-white"
            }`}
          >
            <FlipCounter
              value={stat.value}
              inView={inView}
              duration={stat.signature ? 1.9 : 1.5}
            />
          </motion.span>

          {/* Label */}
          <span className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-racing-mute">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
