"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_HERO_HREF } from "@/lib/links";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Bloco de CTAs do hero com signature hover.
 *
 * Primário (WhatsApp):
 *   - press feedback `whileTap scale 0.97` no toque
 *   - hover: ícone `MessageCircle` morpha para `ArrowRight` (cross-fade
 *     com slide), e o botão ganha um glow racing pulsante (anel vermelho
 *     expandindo)
 *   - sweep diagonal branco percorrendo o botão no hover (shimmer)
 *
 * Secundário (#sobre):
 *   - âncora com ChevronDown em bounce loop
 *   - hover: borda passa de ghost para azul-bright + leve glow
 *
 * `prefers-reduced-motion` colapsa: sem magnetic, sem morph, sem glow.
 */

function WhatsAppCta() {
  const reduceMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  function handleLeave() {
    setHovering(false);
  }

  return (
    <motion.a
      href={WHATSAPP_HERO_HREF}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      className={cn(
        // alvo touch ≥48px (>=44 mínimo). min-w só em sm+ pra não estourar
        // largura útil em iPhone SE (375px - 32px padding = 343px).
        "group relative inline-flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg px-6 sm:w-auto sm:min-w-[15rem]",
        "bg-racing-red text-racing-white",
        "font-heading text-sm font-bold uppercase tracking-[0.22em]",
        "transition-colors duration-300",
        "shadow-[0_8px_24px_-8px_oklch(0.58_0.23_27/0.6)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-blue-bright focus-visible:ring-offset-2 focus-visible:ring-offset-racing-blue-deep",
        !reduceMotion && hovering && "shadow-[0_0_28px_-10px_oklch(0.58_0.23_27/0.9)]",
        reduceMotion &&
          "ring-1 ring-white/10 hover:shadow-[0_0_28px_-10px_oklch(0.58_0.23_27/0.9)] focus-visible:shadow-[0_0_28px_-10px_oklch(0.58_0.23_27/0.9)]"
      )}
    >
      {/* Sweep diagonal — risca branca atravessando no hover (shimmer racing) */}
      {reduceMotion ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-80"
        />
      ) : (
        <motion.span
          aria-hidden
          initial={{ x: "-130%", opacity: 0 }}
          animate={hovering ? { x: "130%", opacity: 0.55 } : { x: "-130%", opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
        />
      )}

      {/* Ícone: MessageCircle ↔ ArrowRight via cross-fade no hover */}
      <span aria-hidden className="relative inline-flex size-5 items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          {hovering && !reduceMotion ? (
            <motion.span
              key="arrow"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute"
            >
              <ArrowRight className="size-5" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute"
            >
              <MessageCircle className="size-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <span className="relative">Falar no WhatsApp</span>
    </motion.a>
  );
}

function SecondaryCta() {
  const reduceMotion = useReducedMotion();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion) return;
    const target = document.getElementById("sobre");
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <a
      href="#sobre"
      onClick={handleClick}
      className={cn(
        "group inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5",
        "border border-white/15 bg-white/0 text-racing-white",
        "font-heading text-sm font-bold uppercase tracking-[0.22em]",
        "transition-[border-color,background-color,color] duration-300",
        "hover:border-racing-blue-bright/60 hover:bg-white/5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-blue-bright focus-visible:ring-offset-2 focus-visible:ring-offset-racing-blue-deep"
      )}
    >
      Conhecer trajetória
      <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden />
    </a>
  );
}

export function HeroCtas() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();
  const skipAll = reduceMotion || skipEntry;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: skipAll ? 0 : 4.05,
        duration: skipAll ? 0.01 : 0.55,
        ease: "easeOut",
      }}
      className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
    >
      <WhatsAppCta />
      <SecondaryCta />
    </motion.div>
  );
}
