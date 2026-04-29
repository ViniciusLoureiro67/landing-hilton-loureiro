"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/**
 * SectionDivider — divisor animado entre seções.
 *
 * Ancorado entre duas `<section>` consecutivas, atua como "ponte" visual
 * que conecta a saída de uma com a entrada da outra. Não é só um
 * separador estético — é um momento de cinema entre cenas.
 *
 * Variantes:
 *   - "slash"  → slash diagonal vermelho que cresce 0→100% width com scroll
 *   - "76"     → mini "76" tipográfico que aparece no centro como íris
 *   - "ticker" → ticker tape com texto deslizando + numerador "01 → 02"
 *
 * Reduced-motion: vira uma linha estática + label pequena, sem animação.
 */

type DividerVariant = "slash" | "76" | "ticker";

type Props = {
  variant?: DividerVariant;
  /** Texto pra ticker tape ou label da slash. */
  label?: string;
  /** Numerador editorial "from → to". Ex: ["01", "02"]. */
  numerator?: [string, string];
  className?: string;
};

export function SectionDivider({
  variant = "slash",
  label = "Próxima",
  numerator,
  className,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // IMPORTANTE: todos os useTransform DEVEM ser chamados em todas as
  // renders (rules-of-hooks) — não podem ficar dentro de blocos
  // condicionais por variant. Calculamos todos de uma vez aqui no topo
  // e usamos somente o que cada variant precisa.
  const slashProgress = useTransform(scrollYProgress, [0.3, 0.7], ["0%", "100%"]);
  const numberOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.4, 0.7, 0.9],
    [0, 1, 1, 0.4]
  );
  const numberScale = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [0.8, 1.2, 0.95]
  );
  const tickerX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  if (reduce) {
    return (
      <div
        ref={ref}
        aria-hidden
        className={`relative my-12 flex items-center justify-center gap-4 px-4 ${className ?? ""}`}
      >
        <span aria-hidden className="block h-px flex-1 bg-racing-red/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-racing-mute">
          {label}
        </span>
        <span aria-hidden className="block h-px flex-1 bg-racing-red/40" />
      </div>
    );
  }

  if (variant === "76") {
    return (
      <div
        ref={ref}
        aria-hidden
        className={`relative flex h-[40vh] items-center justify-center overflow-hidden ${className ?? ""}`}
      >
        <motion.span
          style={{ opacity: numberOpacity, scale: numberScale }}
          className="font-display text-[20vw] leading-none tracking-tight text-racing-white/[0.06]"
        >
          76
        </motion.span>
      </div>
    );
  }

  if (variant === "ticker") {
    return (
      <div
        ref={ref}
        aria-hidden
        className={`relative overflow-hidden border-y border-white/5 bg-racing-blue-deep py-4 ${className ?? ""}`}
      >
        <div className="flex items-center gap-12 whitespace-nowrap font-mono text-xs uppercase tracking-[0.4em] text-racing-white/40">
          <motion.span
            style={{ x: tickerX }}
            className="flex shrink-0 items-center gap-12"
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <span key={idx} className="flex items-center gap-12">
                <span className="text-racing-red">/</span>
                <span>HILTON 76</span>
                <span className="text-racing-red">/</span>
                <span>{label}</span>
                <span className="text-racing-red">/</span>
                <span>NRT</span>
              </span>
            ))}
          </motion.span>
        </div>
      </div>
    );
  }

  // variant === "slash" (default)
  return (
    <div
      ref={ref}
      aria-hidden
      className={`relative flex items-center justify-center gap-6 py-12 ${className ?? ""}`}
    >
      {/* Numerador editorial à esquerda */}
      {numerator ? (
        <span className="flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-racing-mute">
          <span className="text-racing-red">{numerator[0]}</span>
          <span aria-hidden className="block h-px w-6 bg-racing-mute/40" />
          <span>→</span>
          <span aria-hidden className="block h-px w-6 bg-racing-mute/40" />
          <span className="text-racing-blue-bright">{numerator[1]}</span>
        </span>
      ) : null}

      {/* Slash que cresce com scroll */}
      <div className="relative flex-1 overflow-hidden">
        <span aria-hidden className="block h-px w-full bg-racing-white/10" />
        <motion.span
          aria-hidden
          style={{ width: slashProgress, transformOrigin: "left center" }}
          className="absolute left-0 top-0 block h-px bg-gradient-to-r from-racing-red via-racing-red to-racing-blue-bright"
        />
      </div>

      {/* Label à direita */}
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.4em] text-racing-mute">
        {label}
      </span>
    </div>
  );
}
