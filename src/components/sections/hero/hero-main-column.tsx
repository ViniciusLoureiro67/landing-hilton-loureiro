"use client";

import type { ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useHeroScrollProgress } from "./hero-scroll-context";

type HeroMainColumnProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Wrapper do conteúdo central do hero (NameReveal + Tagline + CTAs).
 *
 * Aplica fade-out + leve rise conforme o usuário
 * rola o hero pra fora — o conteúdo "se desmaterializa" enquanto a foto
 * e o número 76 ficam, deixando o handoff para a próxima seção macio.
 *
 * Magnitudes pensadas pra serem perceptíveis sem competir com o scroll:
 *   progresso 0.00–0.20 → tudo intacto (textos legíveis durante a leitura)
 *   progresso 0.20–0.55 → opacidade cai até zero, conteúdo sobe ~64px
 *   progresso > 0.55    → totalmente invisível, sem custo de pintura
 *
 * Sob `prefers-reduced-motion`: nada — children renderizam estáticos.
 */
export function HeroMainColumn({ children }: HeroMainColumnProps) {
  const reduceMotion = useReducedMotion();
  const progress = useHeroScrollProgress();

  const opacity = useTransform(progress, [0, 0.2, 0.55], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.55], [0, -64]);

  if (reduceMotion) {
    return <div className="max-w-3xl">{children}</div>;
  }

  return (
    <motion.div
      style={{ opacity, y }}
      className="max-w-3xl will-change-transform"
    >
      {children}
    </motion.div>
  );
}
