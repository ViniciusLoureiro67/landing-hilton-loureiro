"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import type { GaleriaPhoto } from "./galeria-photos";

/**
 * Card editorial da galeria. Cada um:
 *   - Aspect-ratio fixo (definido pelo span/aspect do photo).
 *   - Reveal por clip-path direcional (alterna L→R / R→L por index).
 *   - Ken Burns subtle no scroll (scale 1 → 1.05).
 *   - Hover: brightness up + zoom-in pequeno + corner brackets virando vermelhos.
 *   - Frame editorial sobreposto (bracket nos 4 cantos, FIG label, gradient overlay).
 *   - Caption "display + mono" no canto inferior, sempre visível.
 *
 * Animação: usamos `whileInView` + `viewport` direto na motion.figure
 * (mais confiável que `useInView` em ref próprio + `animate` condicional —
 * essa combinação tava bugando, cards ficavam stuck em opacity:0).
 */

type Props = {
  photo: GaleriaPhoto;
  index: number;
  /** Direção do clip-path reveal. */
  revealFrom: "left" | "right";
};

export function GaleriaCard({ photo, index, revealFrom: _revealFrom }: Readonly<Props>) {
  const reduce = useReducedMotion();
  // Ref tipada como HTMLElement (figure é HTMLElement).
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Ken Burns sutil — nada exagerado.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  // Stagger por row: card direito (idx ímpar) entra 0.4s depois do
  // esquerdo. Cascata mais espaçada pra dar sensação de "uau" sequencial.
  const rowDelay = index % 2 === 0 ? 0 : 0.4;

  return (
    <motion.figure
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1 + rowDelay,
            }
      }
      style={{ aspectRatio: photo.aspect }}
      className={cn(
        "group relative w-full overflow-hidden rounded-sm border border-racing-white/10 bg-racing-blue-deep transition-[border-color] duration-500 hover:border-racing-red/55",
        photo.span === "wide" ? "lg:col-span-8" : "lg:col-span-4"
      )}
    >
      {/* Zoom-out + blur reveal cinematográfico — câmera "fecha" e foca:
          scale 1.25 → 1 (zoom out longo, ~2.4s) e filter blur 8px → 0
          (desfoca → foca, como câmera ajustando lente). Composição de
          transforms permite que Ken Burns interno funcione por cima. */}
      <motion.div
        initial={
          reduce ? false : { scale: 1.25, filter: "blur(8px)" }
        }
        whileInView={{ scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.15 }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                scale: {
                  duration: 2.4,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1 + rowDelay,
                },
                filter: {
                  duration: 1.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1 + rowDelay,
                },
              }
        }
        className="absolute inset-0 transform-gpu"
      >
        {/* Ken Burns scroll-tied — sutil, conforme stage atravessa viewport. */}
        <motion.div
          style={reduce ? undefined : { scale }}
          className="absolute inset-0 transform-gpu transition-[filter] duration-500 group-hover:brightness-[1.08]"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={
              photo.span === "wide"
                ? "(min-width: 1024px) 800px, 100vw"
                : "(min-width: 1024px) 400px, 100vw"
            }
            style={{
              objectFit: "cover",
              objectPosition: photo.objectPosition ?? "center",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Vinheta de baixo pra cima — garante legibilidade da caption. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-racing-blue-deep/85 via-racing-blue-deep/15 to-transparent"
      />

      {/* Tint sutil pra unificar paleta entre fotos com tons diferentes. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-racing-blue-deep/10"
      />

      {/* Corner brackets — viram vermelhos no hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 size-3 border-l border-t border-racing-white/40 transition-[border-color] duration-500 group-hover:border-racing-red"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 size-3 border-r border-t border-racing-white/40 transition-[border-color] duration-500 group-hover:border-racing-red"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 size-3 border-b border-l border-racing-white/40 transition-[border-color] duration-500 group-hover:border-racing-red"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 right-3 size-3 border-b border-r border-racing-white/40 transition-[border-color] duration-500 group-hover:border-racing-red"
      />

      {/* Sweep diagonal vermelho — passa no hover (efeito "scanner"). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-racing-red/20 to-transparent opacity-0 transition-[opacity,transform] duration-700 group-hover:translate-x-[400%] group-hover:opacity-100"
      />

      {/* Top label — dot vermelho + FIG. 0X */}
      <div
        className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-racing-white/75"
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
      >
        <span
          aria-hidden
          className="block size-1.5 rounded-full bg-racing-red"
        />
        {photo.figLabel}
      </div>

      {/* Bottom-right indicator — pequena setinha indicadora. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 font-mono text-[9px] uppercase tracking-[0.35em] text-racing-white/55"
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(6).padStart(2, "0")}
      </span>

      {/* Caption — display + mono, drop-shadow pra legibilidade sobre a foto. */}
      <figcaption className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-col gap-1.5">
        <span
          className="font-display text-2xl uppercase leading-[0.9] tracking-tight text-racing-white sm:text-3xl"
          style={{
            textShadow: "0 2px 12px rgba(0,0,0,0.55)",
          }}
        >
          {photo.caption}
        </span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-racing-white/70"
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
          }}
        >
          {photo.context}
        </span>
      </figcaption>
    </motion.figure>
  );
}
