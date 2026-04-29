"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

/**
 * MaskReveal — wrapper que revela qualquer conteúdo com clip-path animado.
 *
 * Direções suportadas:
 *   - "up": revela de baixo pra cima (default — cinematográfico)
 *   - "down": revela de cima pra baixo
 *   - "left": revela da esquerda pra direita
 *   - "right": revela da direita pra esquerda
 *   - "diagonal": revela em diagonal (canto inferior-esquerdo → topo-direito)
 *
 * Trigger via viewport (default) ou controlado externamente via animate.
 *
 * Reduced-motion: degrada pra fade simples (clip-path some).
 */

type Direction = "up" | "down" | "left" | "right" | "diagonal";

type MaskRevealProps = {
  children: ReactNode;
  direction?: Direction;
  duration?: number;
  delay?: number;
  /** Quando trigger="viewport", o margin do useInView. */
  viewportMargin?: string;
  /** "viewport" anima quando entra; "mount" anima na montagem. */
  trigger?: "viewport" | "mount";
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "figure" | "li" | "span";
};

const CLIP_PATHS: Record<Direction, { hidden: string; visible: string }> = {
  up: {
    hidden: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  down: {
    hidden: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  left: {
    hidden: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  right: {
    hidden: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  diagonal: {
    hidden: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)",
    visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export function MaskReveal({
  children,
  direction = "up",
  duration = 0.9,
  delay = 0,
  viewportMargin = "-80px",
  trigger = "viewport",
  className,
  style,
  as = "div",
}: MaskRevealProps) {
  const reduce = useReducedMotion();
  const paths = CLIP_PATHS[direction];

  const variants: Variants = reduce
    ? reducedVariants
    : {
        hidden: { clipPath: paths.hidden },
        visible: {
          clipPath: paths.visible,
          transition: {
            duration,
            delay,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          },
        },
      };

  const animateProp =
    trigger === "viewport"
      ? {
          whileInView: "visible",
          viewport: { once: true, margin: viewportMargin },
        }
      : { animate: "visible" };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      style={{ ...style, willChange: "clip-path" }}
      initial="hidden"
      variants={variants}
      {...animateProp}
    >
      {children}
    </MotionTag>
  );
}
