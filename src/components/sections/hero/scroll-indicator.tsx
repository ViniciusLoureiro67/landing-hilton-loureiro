"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Indicador de progresso — `01 / 07` em mono.
 *
 * Vive **dentro** da `<section>` do hero (`absolute`, não `fixed`), então
 * desaparece naturalmente ao rolar para a próxima seção. Posição:
 *  - mobile: rodapé centralizado, compacto
 *  - desktop: lateral direita vertical, com linha pulsante
 *
 * Sob `prefers-reduced-motion` o pulso desaparece; o indicador permanece
 * estático.
 */
export function ScrollIndicator() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();
  const skipAll = reduceMotion || skipEntry;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        delay: skipAll ? 0 : 2.4,
        duration: skipAll ? 0.01 : 0.5,
        ease: "easeOut",
      }}
      className="pointer-events-none"
    >
      {/* Mobile/sm: rodapé centralizado, ancorado ao hero (absolute) */}
      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center sm:hidden">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-racing-mute/85">
          01 <span className="mx-2 text-racing-mute/40">/</span> 07
        </span>
      </div>

      {/* Desktop: barra vertical à direita, ancorada ao hero (absolute) */}
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex lg:right-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-racing-white/80">
          01
        </span>
        <span className="relative block h-20 w-px overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-b from-racing-mute/50 to-racing-mute/15" />
          {!reduceMotion && (
            <motion.span
              initial={{ scaleY: 0.2 }}
              animate={{ scaleY: [0.2, 1, 0.2] }}
              transition={{
                repeat: Infinity,
                duration: 2.2,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "top center" }}
              className="absolute inset-0 bg-gradient-to-b from-racing-blue-bright via-racing-blue-bright/60 to-transparent"
            />
          )}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-racing-mute/50">
          07
        </span>
      </div>
    </motion.div>
  );
}
