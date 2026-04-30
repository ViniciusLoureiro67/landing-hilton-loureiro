"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * TemporadaHeading — título "TEMPORADA 2026" com tratamento editorial.
 *
 * Camadas:
 *   1. Eyebrow "/04" + "MOTO1000GP" em mono — peso de seção
 *   2. Título massivo em font-display com slash diagonal vermelho
 *   3. Subtítulo descritivo em pt-BR
 *
 * Reveal: clip-path mask vertical + translateY no eyebrow/subtítulo.
 */

const titleVariants: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const slashVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.85, 0, 0.15, 1], delay: 0.25 },
  },
};

export function TemporadaHeading() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: reduce ? 0 : 0.12 }}
      className="relative"
    >
      <motion.p
        variants={reduce ? undefined : lineVariants}
        className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-racing-red"
      >
        <span aria-hidden className="inline-block h-px w-8 bg-racing-red" />
        /04 · Moto1000GP
      </motion.p>

      <motion.h2
        id="temporada-heading"
        variants={reduce ? undefined : titleVariants}
        style={{ willChange: "clip-path, opacity" }}
        className="mt-4 font-display text-[clamp(3.25rem,9vw,7.5rem)] uppercase leading-[0.85] tracking-tight text-racing-white"
      >
        Temporada{" "}
        <span className="text-racing-blue-bright">2026</span>
      </motion.h2>

      <motion.span
        aria-hidden
        variants={reduce ? undefined : slashVariants}
        style={{ transformOrigin: "left center", willChange: "transform" }}
        className="mt-6 block h-[3px] w-32 bg-racing-red"
      />

      <motion.p
        variants={reduce ? undefined : lineVariants}
        className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-racing-white/75 sm:text-lg"
      >
        Oito etapas no Campeonato Brasileiro de Motovelocidade.
        De Interlagos a Cuiabá, a estreia de Hilton Loureiro na categoria
        máxima do motociclismo nacional, com homologação CBM e FIM Latin
        América.
      </motion.p>
    </motion.div>
  );
}
