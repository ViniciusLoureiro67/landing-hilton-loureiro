"use client";

import { motion, useInView, useScroll } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useRef } from "react";
import { ATIVACOES } from "./patrocinio-copy";
import { PatrocinioAtivacaoStage } from "./patrocinio-ativacao-stage";
import { PatrocinioProgressRail } from "./patrocinio-progress-rail";

/**
 * PatrocinioAtivacoes — sequência de stages editoriais.
 *
 * Cada ativação é um "spread" de tela inteira (full-width, ~85vh em lg)
 * com tipografia massiva e parallax leve. Saímos do formato "card grid"
 * — visualmente cansado e pesado pra animar — pra storytelling vertical
 * típico de portfólios premium.
 *
 * Side alterna por índice pra criar ritmo:
 *   idx 0 → number à esquerda  (left)
 *   idx 1 → number à direita   (right)
 *   idx 2 → left, idx 3 → right, …
 *
 * Header: kicker + linha decorativa que cresce no in-view (mantido).
 * Rail sticky lateral: lg+ apenas, mostra progresso pelos 7 itens.
 *
 * Performance: sem 3D tilts, sem spotlight cursor-tracking, sem múltiplos
 * springs. Cada stage tem APENAS 2 motion values scroll-driven (numberY,
 * iconY) — total da seção: 14 valores. Antes (card grid): 7 cards × 6
 * motion values = 42 valores rodando em paralelo. Bem mais leve.
 */
export function PatrocinioAtivacoes() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  // Scroll progress da seção inteira (0 → 1 enquanto a seção atravessa
  // a viewport). Alimenta o progress rail lateral.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Header — em mobile esconde "07 ativações" do lado direito pra
          não apertar a linha decorativa contra o kicker */}
      <div ref={headerRef} className="flex items-baseline gap-3 sm:gap-4">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={headerInView ? { opacity: 1, x: 0 } : undefined}
          transition={
            reduce
              ? { duration: 0.2 }
              : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }
          className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute sm:text-xs"
        >
          <span className="text-racing-red">·</span>O que sua marca recebe
        </motion.span>
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ transformOrigin: "left center" }}
          className="block h-px min-w-0 flex-1 bg-racing-white/15"
        />
        <motion.span
          aria-hidden
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute/60 sm:inline"
        >
          07 ativações
        </motion.span>
      </div>

      {/* Stages container — espaço lateral pro rail em lg+. Reduzido vs
          versão anterior (24/28) pra não apertar conteúdo em laptop 13". */}
      <div ref={sectionRef} className="relative lg:pl-16 xl:pl-20">
        <PatrocinioProgressRail
          items={ATIVACOES}
          progress={scrollYProgress}
        />

        <div className="flex flex-col">
          {ATIVACOES.map((ativacao, idx) => (
            <PatrocinioAtivacaoStage
              key={ativacao.index}
              ativacao={ativacao}
              index={idx}
              total={ATIVACOES.length}
              side={idx % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
