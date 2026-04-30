"use client";

import { motion, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useHeroEntrySkip } from "./use-hero-entry-skip";
import { useHeroScrollProgress } from "./hero-scroll-context";

/**
 * Indicador de progresso — `01 / 07` em mono, com linha vertical que
 * **preenche conforme o usuário rola o hero**. Vive dentro da
 * `<section>` do hero (`absolute`), então some naturalmente ao sair.
 *
 * Comportamento:
 *
 *   - **Antes do scroll**: linha pulsa (idle) sob a label "01" — chama
 *     atenção pra rolar.
 *   - **Durante o scroll do hero**: pulso para; linha preenche de cima
 *     pra baixo via `scaleY` proporcional ao `useHeroScrollProgress()`.
 *   - **Final do hero**: indicador fade-out + leve translate-y, ancorado
 *     ao fim da seção.
 *
 * Sob `prefers-reduced-motion`: estática, sem pulso, sem fill animado.
 */
export function ScrollIndicator() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();
  const skipAll = reduceMotion || skipEntry;

  const scrollProgress = useHeroScrollProgress();
  // Linha preenche conforme a seção sai do viewport.
  const fillScaleY = useTransform(scrollProgress, [0, 0.85], [0, 1]);
  // Indicador fade-out no fim.
  const containerOpacity = useTransform(scrollProgress, [0, 0.6, 0.9], [1, 1, 0]);
  const containerY = useTransform(scrollProgress, [0, 0.9], [0, 24]);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: skipAll ? 0 : 4.45,
        duration: skipAll ? 0.01 : 0.5,
        ease: "easeOut",
      }}
      className="pointer-events-none"
    >
      {/* Camada externa controla o fade-out conforme o usuário rola */}
      <motion.div
        style={reduceMotion ? undefined : { opacity: containerOpacity, y: containerY }}
      >
        {/* Mobile/sm: rodapé centralizado, ancorado ao hero (absolute) */}
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center sm:hidden">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-racing-mute/85">
            01 <span className="mx-2 text-racing-mute/40">/</span> 07
          </span>
        </div>

        {/* Desktop: barra vertical à direita, ancorada ao hero (absolute) */}
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex lg:right-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-racing-white/85">
            01
          </span>
          <span className="relative block h-24 w-px overflow-hidden">
            {/* Fundo da régua — gradiente sutil */}
            <span className="absolute inset-0 bg-gradient-to-b from-racing-mute/45 to-racing-mute/10" />

            {/* Fill — preenche conforme rola, top-down. Vermelho racing
                pra ecoar o slash do logo "76". */}
            {reduceMotion ? (
              <span
                className="absolute inset-0 bg-gradient-to-b from-racing-red via-racing-red/85 to-racing-blue-bright/60 opacity-80"
              />
            ) : (
              <motion.span
                style={{ scaleY: fillScaleY, transformOrigin: "top center" }}
                className="absolute inset-0 bg-gradient-to-b from-racing-red via-racing-red/85 to-racing-blue-bright/60"
              />
            )}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-racing-mute/55">
            07
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
