"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { TemporadaStageCard } from "./temporada-stage-card";
import { useTemporada } from "./temporada-context";
import type { StageWithStatus } from "./temporada-data";

/**
 * TemporadaList — lista das 8 etapas + scrollytelling em desktop.
 *
 * Scrollytelling (algoritmo de switch-points + histerese):
 *
 *   1. Pré-calcula a posição absoluta do CENTRO de cada card no documento.
 *   2. Entre cada par de cards adjacentes existe um "switch point" — o
 *      ponto médio entre os centros. É a fronteira de troca de active.
 *   3. Em cada scroll (rAF-throttled), comparamos a posição do MEIO da
 *      viewport contra os switch points. Active = card cuja "territory"
 *      contém o centro da viewport.
 *   4. **Histerese de 40px** (zona morta): pra trocar de card A → B é
 *      preciso que a viewport-mid cruze `switchPoint(A,B) + 40px`. Pra
 *      voltar, precisa cruzar `switchPoint(A,B) - 40px`. Entre os dois
 *      thresholds, NADA muda. Isso absorve os micro-bouncings de scroll
 *      (trackpad inertia, wheel rebound) que tipicamente ficam em 5-20px
 *      e causavam o pisca de troca-volta-troca.
 *
 * Por que não usamos IntersectionObserver: IO dispara a cada cruzamento
 * de borda, então qualquer pixel de scroll-up briefly após a troca
 * disparava o evento de volta. Switch-points + histerese resolvem isso
 * matematicamente em vez de tentar filtrar eventos.
 *
 * Apenas em telas ≥ 1024px (lg). Em reduced-motion, não dispara —
 * mantemos só hover/click pra sync.
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

    const mql = globalThis.matchMedia("(min-width: 1024px)");

    // Histerese de 40px: pra trocar de card é preciso ultrapassar o
    // switch point por mais de 40px. Trackpad bounce/wheel rebound
    // ficam tipicamente em 5-20px → caem dentro da zona morta.
    const HYSTERESIS = 40;

    let cardData: Array<{ id: string; centerY: number }> = [];
    let switchPoints: number[] = [];
    let currentIdx = -1;
    let rafId: number | null = null;

    const measure = () => {
      if (!mql.matches || !listRef.current) {
        cardData = [];
        switchPoints = [];
        return;
      }
      const cards =
        listRef.current.querySelectorAll<HTMLElement>("[data-stage-id]");
      cardData = Array.from(cards).map((c) => {
        const rect = c.getBoundingClientRect();
        return {
          id: c.dataset.stageId ?? "",
          centerY: rect.top + globalThis.scrollY + rect.height / 2,
        };
      });
      switchPoints = [];
      for (let i = 0; i < cardData.length - 1; i++) {
        switchPoints.push((cardData[i].centerY + cardData[i + 1].centerY) / 2);
      }
    };

    const update = () => {
      rafId = null;
      if (!cardData.length) return;

      const viewportMid = globalThis.scrollY + globalThis.innerHeight / 2;

      let newIdx: number;
      if (currentIdx === -1) {
        // Primeira leitura: posiciona sem histerese.
        newIdx = 0;
        for (let i = 0; i < switchPoints.length; i++) {
          if (viewportMid >= switchPoints[i]) newIdx = i + 1;
        }
      } else {
        // Steady-state: só avança/retrocede além da zona morta.
        newIdx = currentIdx;
        while (
          newIdx < switchPoints.length &&
          viewportMid >= switchPoints[newIdx] + HYSTERESIS
        ) {
          newIdx++;
        }
        while (
          newIdx > 0 &&
          viewportMid < switchPoints[newIdx - 1] - HYSTERESIS
        ) {
          newIdx--;
        }
      }

      if (newIdx !== currentIdx) {
        currentIdx = newIdx;
        setActiveId(cardData[newIdx].id);
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      rafId ??= requestAnimationFrame(update);
    };

    measure();
    update();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    globalThis.addEventListener("resize", onResize);
    mql.addEventListener("change", onResize);

    return () => {
      globalThis.removeEventListener("scroll", onScroll);
      globalThis.removeEventListener("resize", onResize);
      mql.removeEventListener("change", onResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
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
