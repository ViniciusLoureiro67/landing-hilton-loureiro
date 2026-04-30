"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useRef } from "react";
import { PATROCINIO_COPY } from "./patrocinio-copy";

/**
 * PatrocinioPitch — pull-quote editorial gigante + 3 parágrafos em cascata.
 *
 * Replica o padrão de SobreBio:
 *   - Pull-quote com slide-in lateral + barra vermelha vertical (scaleY 0→1)
 *   - Parágrafos entram em cascata (stagger 0.18) com fade + rise
 */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.05 },
  },
};

const quoteVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const quoteBarVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export function PatrocinioPitch() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={reduce ? undefined : containerVariants}
      className="space-y-7"
    >
      <motion.div
        variants={
          reduce
            ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
            : quoteVariants
        }
        className="relative pl-6"
      >
        <motion.span
          aria-hidden
          variants={reduce ? undefined : quoteBarVariants}
          style={{ transformOrigin: "top center", willChange: "transform" }}
          className="absolute left-0 top-0 block h-full w-[3px] bg-racing-red"
        />
        <p className="font-heading text-xl font-bold uppercase leading-[1.1] tracking-tight text-racing-white sm:text-2xl lg:text-3xl">
          {PATROCINIO_COPY.pullQuote.a}{" "}
          <span className="text-racing-blue-bright">
            {PATROCINIO_COPY.pullQuote.b}
          </span>{" "}
          <span className="text-racing-red">
            {PATROCINIO_COPY.pullQuote.c}
          </span>
        </p>
      </motion.div>

      {PATROCINIO_COPY.paragraphs.map((paragraph, idx) => (
        <motion.p
          key={idx}
          variants={
            reduce
              ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
              : paragraphVariants
          }
          className="text-base leading-[1.75] text-racing-white/75 lg:text-lg"
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );
}
