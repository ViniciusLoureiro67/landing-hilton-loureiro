"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { AtivacaoPhoto as AtivacaoPhotoData } from "./patrocinio-copy";

/**
 * Foto editorial de uma ativação. Usa metadata vinda do copy
 * (`AtivacaoPhoto`) e aplica:
 *
 *   - Aspect-ratio fixo no wrapper (definido por foto, ex: "3/4")
 *   - object-position custom pra retratos com crop preciso (rosto centrado)
 *   - Reveal animation com `clip-path inset` direcional (L→R ou R→L)
 *   - Ken Burns sutil: scale 1.0 → 1.06 conforme a stage atravessa a viewport
 *   - Overlay com tint azul (mix-blend-multiply) + vinheta diagonal
 *   - Frame editorial: corner brackets, dot vermelho piscando, label de
 *     numeração "01 / 07 · NRT-2026" e label da figura ("FIG. 01 — CAPACETE")
 *
 * Reduced motion: sem reveal, sem Ken Burns. Foto entra estática.
 */

type Props = {
  photo: AtivacaoPhotoData;
  /** Index 0-based da stage. */
  index: number;
  total: number;
  inView: boolean;
  reduce: boolean;
  /** Direção de revelação. left → reveal L→R. right → reveal R→L. */
  revealFrom: "left" | "right";
  /** scrollYProgress da stage pai (0..1 sobre o transit da viewport). */
  scrollYProgress: MotionValue<number>;
};

export function AtivacaoPhoto({
  photo,
  index,
  total,
  inView,
  reduce,
  revealFrom,
  scrollYProgress,
}: Props) {
  // Sempre chamar o hook (regra dos hooks) — o consumo do MotionValue
  // é gated por `reduce` no style abaixo.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const initialClip =
    revealFrom === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

  return (
    <motion.figure
      initial={{ clipPath: initialClip }}
      animate={
        inView ? { clipPath: "inset(0 0 0 0)" } : { clipPath: initialClip }
      }
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.95, ease: [0.65, 0, 0.35, 1], delay: 0.15 }
      }
      style={{ aspectRatio: photo.aspect }}
      className="group relative w-full overflow-hidden rounded-sm border border-racing-white/10 bg-racing-blue-deep"
    >
      <motion.div
        style={reduce ? undefined : { scale }}
        className="absolute inset-0 transform-gpu"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          style={{
            objectFit: "cover",
            objectPosition: photo.objectPosition ?? "center",
          }}
          priority={false}
        />
      </motion.div>

      {/* Tint azul sutil pra unificar paleta entre as 7 fotos. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-racing-blue-deep/15 mix-blend-multiply"
      />

      {/* Vinheta diagonal — escurece cantos opostos pra dar profundidade. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-racing-blue-deep/45 via-transparent to-racing-blue-deep/10"
      />

      {/* Corner brackets */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-2.5 size-3 border-l border-t border-racing-white/45 transition-[border-color] duration-500 group-hover:border-racing-red"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-2.5 size-3 border-r border-t border-racing-white/45 transition-[border-color] duration-500 group-hover:border-racing-red"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2.5 left-2.5 size-3 border-b border-l border-racing-white/45 transition-[border-color] duration-500 group-hover:border-racing-red"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2.5 right-2.5 size-3 border-b border-r border-racing-white/45 transition-[border-color] duration-500 group-hover:border-racing-red"
      />

      {/* Label superior: dot piscando + numerador + NRT */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-racing-white/75">
        <motion.span
          aria-hidden
          className="size-1.5 rounded-full bg-racing-red"
          animate={
            reduce ? { opacity: 1 } : { opacity: [1, 0.3, 1] }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
          }
        />
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        <span className="text-racing-white/40">·</span>
        <span className="text-racing-white/50">NRT-2026</span>
      </div>

      {/* Label inferior: FIG. 0X — TÍTULO */}
      <figcaption className="pointer-events-none absolute bottom-3.5 right-4 font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-racing-white/55">
        {photo.figLabel}
      </figcaption>
    </motion.figure>
  );
}
