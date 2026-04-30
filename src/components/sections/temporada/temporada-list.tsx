"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { TemporadaStageCard } from "./temporada-stage-card";
import { useTemporada } from "./temporada-context";
import type { StageWithStatus } from "./temporada-data";

/**
 * TemporadaList — lista das 8 etapas + scrollytelling em desktop.
 *
 * Scrollytelling:
 *   - IntersectionObserver com `rootMargin -40% 0px -40% 0px`: dispara quando
 *     o card entra na faixa central de 20% da viewport.
 *   - Apenas em telas ≥ 1024px (lg).
 *   - Em reduced-motion, não dispara — mantemos só hover/click pra sync.
 *
 * Reveal: stagger de cima pra baixo dos cards na primeira entrada na seção.
 */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

type Props = {
  stages: StageWithStatus[];
};

export function TemporadaList({ stages }: Props) {
  const reduce = useReducedMotion();
  const { setActiveId } = useTemporada();
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (reduce) return;

    const mql = window.matchMedia("(min-width: 1024px)");
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (!mql.matches || !listRef.current) return;

      observer = new IntersectionObserver(
        (entries) => {
          // Card mais centralizado entre os visíveis no momento.
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort(
              (a, b) =>
                Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - window.innerHeight / 2) -
                Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - window.innerHeight / 2)
            )[0];
          if (!visible) return;
          const id = (visible.target as HTMLElement).dataset.stageId;
          if (id) setActiveId(id);
        },
        {
          rootMargin: "-40% 0px -40% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      const cards = listRef.current.querySelectorAll<HTMLElement>("[data-stage-id]");
      cards.forEach((c) => observer!.observe(c));
    };

    setup();
    mql.addEventListener("change", setup);
    return () => {
      mql.removeEventListener("change", setup);
      observer?.disconnect();
      setActiveId(null);
    };
  }, [reduce, setActiveId, stages.length]);

  return (
    <motion.ol
      ref={listRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      variants={reduce ? undefined : containerVariants}
      aria-label="Calendário Moto1000GP 2026 — 8 etapas"
      className="flex flex-col gap-4 sm:gap-5"
    >
      {stages.map((stage) => (
        <TemporadaStageCard key={stage.id} stage={stage} />
      ))}
    </motion.ol>
  );
}
