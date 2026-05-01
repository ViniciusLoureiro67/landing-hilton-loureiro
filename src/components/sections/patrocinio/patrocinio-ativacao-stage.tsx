"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { CharReveal } from "@/components/motion/char-reveal";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import type { Ativacao } from "./patrocinio-copy";
import { AtivacaoPhoto } from "./patrocinio-ativacao-photo";

/**
 * PatrocinioAtivacaoStage — uma ativação como momento editorial full-width.
 *
 * Saímos do formato "card grid" (visualmente cansado) pra um spread por
 * ativação. Layout alterna lado par/ímpar em lg+; abaixo de lg empilha.
 *
 * Responsivo:
 *   - Tipografia em `clamp()` viewport-aware — não quebra em mobile/tablet
 *     nem fica pequena em desktop ultra-wide
 *   - Section `min-h: clamp(540px, 70vh, 900px)` — mesmo em landscape
 *     mobile (~390px alto) o stage cabe, e em ultra-wide não estica
 *     desnecessariamente
 *   - Description `max-w` só em lg+ (em mobile usa largura natural)
 *
 * Performance:
 *   - 2 motion values scroll-driven (numberY, iconY)
 *   - `transform-gpu` força compositing GPU dos elementos animados
 *   - Entrance gated em `useInView { once: true }`
 */

type Props = Readonly<{
  ativacao: Ativacao;
  index: number;
  total: number;
  /**
   * Lado da foto. "left" = foto na coluna esquerda, conteúdo à direita.
   * "right" = espelhado. O conteúdo (kicker/título/descrição) fica
   * sempre na coluna oposta pra título e foto caberem no mesmo viewport.
   */
  side: "left" | "right";
}>;

export function PatrocinioAtivacaoStage({
  ativacao,
  index,
  total,
  side,
}: Props) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLElement>(null);
  // Trigger mais tardio (50% do stage visível) pra não disparar tão cedo.
  const inView = useInView(stageRef, { once: true, amount: 0.5 });
  const isLeft = side === "left";
  const titleId = `ativacao-${ativacao.index}-title`;

  // Scroll progress local pro stage (entra → sai). Alimenta parallax e
  // o Ken Burns interno do `<AtivacaoPhoto>`.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  // Parallax sutil em Y na foto — deslocamento em px pra ser consistente
  // independente da altura do stage.
  const photoY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <section
      ref={stageRef}
      aria-labelledby={titleId}
      // min-h com clamp: floor 520px (cabe landscape mobile), teto 880px
      // (não estica em ultra-wide).
      className="relative isolate flex items-center py-16 sm:py-20 lg:py-28"
      style={{ minHeight: "clamp(520px, 70vh, 880px)" }}
    >
      {/* Linha vertical vermelha decorativa do lado da foto (lg+) */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-racing-red/40 to-transparent lg:block",
          isLeft ? "left-0" : "right-0"
        )}
      />

      <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-10">
        {/* Foto editorial — col-span-5 no lg+, full-width abaixo. */}
        <motion.div
          style={reduce ? undefined : { y: photoY, willChange: "transform" }}
          className={cn(
            "col-span-12 transform-gpu lg:col-span-5",
            isLeft
              ? "lg:col-start-1 lg:justify-self-start"
              : "lg:col-start-8 lg:row-start-1 lg:justify-self-end"
          )}
        >
          {/* Em mobile: full-width até 440px. Em sm/md (tablet portrait):
              centralizado pra não ficar solto na esquerda. Em lg+: aplica
              o sizing 32vw e o pai cuida do alinhamento via justify-self. */}
          <div className="mx-auto w-full max-w-[440px] lg:mx-0 lg:w-[32vw] lg:max-w-[440px] lg:min-w-[300px]">
            <AtivacaoPhoto
              photo={ativacao.photo}
              index={index}
              total={total}
              inView={inView}
              reduce={reduce}
              revealFrom={isLeft ? "left" : "right"}
              scrollYProgress={scrollYProgress}
            />
          </div>
        </motion.div>

        {/* Coluna de conteúdo — kicker, título, descrição. */}
        <div
          className={cn(
            "col-span-12 flex flex-col gap-5 sm:gap-7 lg:col-span-6 lg:gap-7",
            isLeft ? "lg:col-start-7" : "lg:col-start-1 lg:row-start-1"
          )}
        >
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={
              reduce ? undefined : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }
            }
            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-racing-mute"
          >
            <span className="block h-px w-6 bg-racing-red sm:w-8" />
            Ativação · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </motion.div>

          {/* Título — char reveal char-by-char. text-balance ajuda a quebrar
              palavras longas (Carenagem, Transmissão) de forma estética. */}
          <h3
            id={titleId}
            className="font-display uppercase leading-[0.95] tracking-tight text-racing-white"
            style={{
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              textWrap: "balance",
            }}
          >
            {inView ? (
              <CharReveal text={ativacao.title} delay={0.15} />
            ) : (
              <span aria-hidden style={{ opacity: 0 }}>
                {ativacao.title}
              </span>
            )}
          </h3>

          {/* Descrição — max-w só em lg+, em mobile usa largura natural */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={
              reduce
                ? undefined
                : {
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.45,
                  }
            }
            className="text-base leading-[1.7] text-racing-white/70 lg:max-w-[52ch] lg:text-lg"
          >
            {ativacao.description}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
