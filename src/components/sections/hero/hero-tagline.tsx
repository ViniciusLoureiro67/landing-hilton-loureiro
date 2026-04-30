"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Tagline pós-nome com termos-chave em amarelo Pirelli — replica o
 * "highlight de palavras-chave" da identidade.
 *
 * Estrutura: linha de stats em mono (categoria · status · ano) +
 * frase de posicionamento em heading. Entra logo após o reveal do
 * nome (delay ~1.85s), fade suave.
 */
export function HeroTagline() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();
  const skipAll = reduceMotion || skipEntry;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: skipAll ? 0 : 3.85,
        duration: skipAll ? 0.01 : 0.55,
        ease: "easeOut",
      }}
      className="mt-6 flex flex-col gap-3 sm:mt-8"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-racing-mute sm:text-xs">
        Piloto profissional
        <span className="mx-2 text-racing-red">/</span>
        600cc Master 2026
        <span className="mx-2 text-racing-red">/</span>
        Kawasaki ZX6R
      </p>

      <p className="max-w-xl font-heading text-base uppercase leading-snug tracking-[0.04em] text-racing-white/90 sm:text-lg lg:text-xl">
        <span className="text-racing-yellow">Bicampeão</span> Brasileiro
        Endurance{" "}
        <span className="font-mono text-racing-yellow">600cc</span>.
        <br className="hidden sm:block" />
        Em 2026 defende o título pela equipe{" "}
        <span className="text-racing-yellow">NRT</span>.
      </p>
    </motion.div>
  );
}
