"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Shirt,
  Bike,
  Tv,
  Megaphone,
  MapPin,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";
import { CharReveal } from "@/components/motion/char-reveal";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import type { Ativacao, AtivacaoIcon } from "./patrocinio-copy";

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

const ICONS: Record<AtivacaoIcon, LucideIcon> = {
  shield: Shield,
  shirt: Shirt,
  bike: Bike,
  tv: Tv,
  megaphone: Megaphone,
  "map-pin": MapPin,
  clapperboard: Clapperboard,
};

type Props = Readonly<{
  ativacao: Ativacao;
  index: number;
  total: number;
  /** "left" = número à esquerda, conteúdo à direita. "right" = espelhado. */
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
  const inView = useInView(stageRef, { once: true, amount: 0.3 });
  const Icon = ICONS[ativacao.icon];
  const isLeft = side === "left";
  const titleId = `ativacao-${ativacao.index}-title`;

  // Scroll progress local pro stage (entra → sai). Usado pra parallax leve.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });

  // Parallax discreto — magnitudes reduzidas vs versão anterior pra não
  // forçar GPU em mobile. Magnitudes em px (não vh) pra serem consistentes.
  const numberY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const iconY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={stageRef}
      aria-labelledby={titleId}
      // min-h com clamp: floor 520px (cabe landscape mobile), teto 880px
      // (não estica em ultra-wide). Padding também escalona suave.
      className="relative isolate flex items-center py-16 sm:py-20 lg:py-28"
      style={{ minHeight: "clamp(520px, 70vh, 880px)" }}
    >
      {/* Linha vertical vermelha decorativa marcando o lado ativo (lg+) */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-racing-red/40 to-transparent lg:block",
          isLeft ? "left-0" : "right-0"
        )}
      />

      <div className="grid w-full grid-cols-12 items-center gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-10">
        {/* Número gigante — fluid sizing, parallax Y. transform-gpu força
            compositing GPU pra reduzir trabalho na CPU durante scroll. */}
        <motion.div
          style={reduce ? undefined : { y: numberY, willChange: "transform" }}
          className={cn(
            "relative col-span-12 overflow-hidden transform-gpu lg:col-span-5",
            isLeft ? "lg:col-start-1" : "lg:col-start-8 lg:row-start-1"
          )}
        >
          <span
            aria-hidden
            // clamp viewport-aware: 6rem (96px) mínimo em mobile small,
            // até 22rem (352px) em ultra-wide. 22vw escalona com largura.
            // text-racing-white/[0.07] sólido — sem gradient invisível.
            className={cn(
              "block select-none font-display leading-[0.78] tracking-tighter text-racing-white/[0.07]",
              !isLeft && "lg:text-right"
            )}
            style={{
              fontSize: "clamp(6rem, 22vw, 22rem)",
            }}
          >
            {ativacao.index}
          </span>
          {/* Subline numérica em vermelho — pequena, indicando progresso */}
          <span
            className={cn(
              "absolute bottom-1 font-mono text-[9px] uppercase tracking-[0.4em] text-racing-red/70 sm:bottom-2 sm:text-[10px]",
              isLeft ? "left-1" : "right-1"
            )}
          >
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Coluna de conteúdo — kicker, título, descrição, ícone */}
        <div
          className={cn(
            "col-span-12 flex flex-col gap-5 sm:gap-7 lg:col-span-6 lg:gap-9",
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
            Ativação · {String(index + 1).padStart(2, "0")}
          </motion.div>

          {/* Título — char reveal char-by-char. text-balance ajuda a quebrar
              palavras longas (Carenagem, Transmissão) de forma estética. */}
          <h3
            id={titleId}
            className="font-display uppercase leading-[0.95] tracking-tight text-racing-white"
            style={{
              fontSize: "clamp(2rem, 7vw, 5.5rem)",
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
            className="text-base leading-[1.7] text-racing-white/70 lg:max-w-[55ch] lg:text-lg"
          >
            {ativacao.description}
          </motion.p>

          {/* Ícone — pedestal com parallax inverso. transform-gpu força GPU.
              Cantos com transição específica (não `all`) — bem mais leve. */}
          <motion.div
            style={
              reduce ? undefined : { y: iconY, willChange: "transform" }
            }
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={
              inView ? { opacity: 1, scale: 1, rotate: 0 } : undefined
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.35,
                  }
            }
            className={cn(
              "group relative inline-flex size-16 transform-gpu items-center justify-center border border-racing-white/15 bg-racing-blue-deep/40 text-racing-red transition-[border-color,background-color] duration-500 hover:border-racing-red/70 hover:bg-racing-blue-deep/70 sm:size-20 lg:size-28",
              isLeft ? "lg:self-end" : "lg:self-start"
            )}
          >
            <Icon
              className="size-7 transition-transform duration-500 group-hover:scale-110 sm:size-9 lg:size-12"
              strokeWidth={1.2}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-1 -top-1 size-3 border-r border-t border-racing-red/70 transition-[border-color,width,height] duration-500 group-hover:size-4 group-hover:border-racing-red"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-1 -left-1 size-3 border-b border-l border-racing-red/70 transition-[border-color,width,height] duration-500 group-hover:size-4 group-hover:border-racing-red"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
