"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useHeroEntrySkip } from "./use-hero-entry-skip";
import { useHeroScrollProgress } from "./hero-scroll-context";

/**
 * Labels topo do hero — estilo capa de revista esportiva.
 * Esquerda: edição/número/origem. Direita: status "live" sutil.
 *
 * Aparece logo após a sequência de ignição (delay 1.2s) com fade simples.
 * Sob reduced motion, fade único curto.
 */
export function HeroKicker() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();

  // Casa com `LIGHTS_OUT_AT + 0.1` da sequência de ignição — kicker
  // entra com o flash radial ainda dissolvendo, ancorando o "novo
  // mundo" pós-largada.
  const baseTransition = {
    delay: reduceMotion || skipEntry ? 0 : 3.2,
    duration: reduceMotion || skipEntry ? 0.01 : 0.6,
    ease: "easeOut" as const,
  };

  // Scroll-driven: kicker (labels topo) é o primeiro elemento que sai
  // do hero ao rolar. Fade rápido evita que ele "compita" com a
  // navbar fixa quando o backdrop blur dela entra (~scrollY > 64px).
  const scrollProgress = useHeroScrollProgress();
  const scrollOpacity = useTransform(scrollProgress, [0, 0.18, 0.3], [1, 1, 0]);
  const scrollY = useTransform(scrollProgress, [0, 0.3], [0, -24]);

  // `top-24 sm:top-28` garante folga > navbar (h-16 = 64px) durante o
  // fade (0–64px scroll), evitando que a navbar transparente cubra o
  // kicker antes do `bg-racing-blue-deep/75 backdrop-blur` entrar.
  return (
    <motion.div
      style={reduceMotion ? undefined : { opacity: scrollOpacity, y: scrollY }}
      className="pointer-events-none absolute inset-x-0 top-24 z-20 flex items-start justify-between px-4 sm:top-28 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={baseTransition}
        className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.3em] text-racing-mute/80 sm:text-xs"
      >
        <span className="block text-racing-white/70">Ed. 2026</span>
        <span className="block">Nº 76 · Alagoas / BR</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...baseTransition, delay: baseTransition.delay + 0.1 }}
        className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute/80 sm:flex sm:text-xs"
      >
        <span className="relative inline-flex size-2">
          <span
            aria-hidden
            className={
              reduceMotion
                ? "absolute inset-0 rounded-full bg-racing-red"
                : "absolute inset-0 animate-ping rounded-full bg-racing-red opacity-70"
            }
          />
          <span aria-hidden className="relative inline-block size-2 rounded-full bg-racing-red" />
        </span>
        <span>Moto1000GP · em pista</span>
      </motion.div>
    </motion.div>
  );
}
