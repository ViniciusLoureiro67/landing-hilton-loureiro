"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useMemo } from "react";

/**
 * CharReveal — revela texto caracter-por-caracter.
 *
 * Cada char é um <span inline-block> animado via stagger. Suporta dois
 * modos de trigger:
 *   - `whileInView` (default): anima quando entra no viewport
 *   - `animate`: controlado externamente (ex: ligado a uma timeline maior)
 *
 * Animação default: clip-path mask reveal de baixo pra cima + slight Y.
 * Premium awwwards-tier — não é fade genérico.
 *
 * Reduced-motion: degrada pra fade simples instantâneo (sem stagger).
 */

type CharRevealProps = {
  text: string;
  /** Atraso antes da primeira letra (em segundos). */
  delay?: number;
  /** Stagger entre letras (default 0.025s = ~40 chars/seg). */
  stagger?: number;
  /** Tag HTML do container (default "span"). */
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  /** Trigger mode. */
  trigger?: "viewport" | "mount";
  /** Margin do `whileInView` quando trigger="viewport". */
  viewportMargin?: string;
  /**
   * Fração do elemento que precisa estar visível (0..1) para disparar.
   * Quando informado, sobrescreve `viewportMargin`. Mais robusto em
   * telas pequenas — recomendado.
   */
  viewportAmount?: number;
  /** Permitir quebra de linha entre palavras (default true). */
  breakWords?: boolean;
  className?: string;
};

const charVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export function CharReveal({
  text,
  delay = 0,
  stagger = 0.025,
  as = "span",
  trigger = "viewport",
  viewportMargin = "-80px",
  viewportAmount,
  breakWords = true,
  className,
}: CharRevealProps) {
  const reduce = useReducedMotion();

  const tokens = useMemo(() => {
    if (!breakWords) return [{ word: text, chars: [...text] }];
    return text.split(" ").map((word) => ({ word, chars: [...word] }));
  }, [text, breakWords]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: reduce ? 0 : stagger,
      },
    },
  };

  const MotionTag = motion[as] as typeof motion.span;
  const variants = reduce ? reducedVariants : charVariants;

  const animateProp =
    trigger === "viewport"
      ? {
          whileInView: "visible",
          viewport:
            viewportAmount !== undefined
              ? { once: true, amount: viewportAmount }
              : { once: true, margin: viewportMargin },
        }
      : { animate: "visible" };

  return (
    <MotionTag
      initial="hidden"
      variants={containerVariants}
      className={className}
      aria-label={text}
      {...animateProp}
    >
      {tokens.map((token, wIdx) => (
        <span
          key={`w-${wIdx}`}
          aria-hidden
          className="inline-flex overflow-hidden align-baseline"
          style={{ marginRight: breakWords && wIdx < tokens.length - 1 ? "0.25em" : 0 }}
        >
          {token.chars.map((char, cIdx) => (
            <motion.span
              key={`c-${wIdx}-${cIdx}`}
              variants={variants}
              className="inline-block"
              style={{ willChange: "transform, opacity" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}
