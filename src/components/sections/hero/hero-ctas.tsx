"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WHATSAPP_HERO_HREF } from "@/lib/links";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Bloco de CTAs do hero com signature hover.
 *
 * Primário (WhatsApp):
 *   - magnetic cursor desktop (raio 80px, força 0.35) com spring
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

const MAGNET_RADIUS = 80;
const MAGNET_STRENGTH = 0.35;

function MagneticWhatsApp() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  function handleMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (reduceMotion) return;
    const target = ref.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const distance = Math.hypot(dx, dy);
    if (distance > MAGNET_RADIUS * 1.6) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * MAGNET_STRENGTH);
    y.set(dy * MAGNET_STRENGTH);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
    setHovering(false);
  }

  return (
    <motion.a
      ref={ref}
      href={WHATSAPP_HERO_HREF}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovering(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      className={cn(
        // alvo touch ≥48px (>=44 mínimo)
        "group relative inline-flex h-12 min-w-[15rem] items-center justify-center gap-2.5 overflow-hidden rounded-lg px-6",
        "bg-racing-red text-racing-white",
        "font-heading text-sm font-bold uppercase tracking-[0.22em]",
        "transition-colors duration-300",
        "shadow-[0_8px_24px_-8px_oklch(0.58_0.23_27/0.6)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-blue-bright focus-visible:ring-offset-2 focus-visible:ring-offset-racing-blue-deep",
        // glow racing pulsante apenas no hover/focus, somente sem reduced-motion
        !reduceMotion && hovering && "[animation:racing-glow-pulse_1.4s_ease-in-out_infinite]"
      )}
    >
      {/* Sweep diagonal — risca branca atravessando no hover (shimmer racing) */}
      {!reduceMotion && (
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
        "transition-all duration-300",
        "hover:border-racing-blue-bright/60 hover:bg-white/5 hover:shadow-[0_0_24px_-8px_oklch(0.62_0.20_252/0.6)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-blue-bright focus-visible:ring-offset-2 focus-visible:ring-offset-racing-blue-deep"
      )}
    >
      Conhecer trajetória
      {reduceMotion ? (
        <ChevronDown className="size-4" aria-hidden />
      ) : (
        <motion.span
          aria-hidden
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ChevronDown className="size-4" />
        </motion.span>
      )}
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
        delay: skipAll ? 0 : 2.0,
        duration: skipAll ? 0.01 : 0.55,
        ease: "easeOut",
      }}
      className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
    >
      <MagneticWhatsApp />
      <SecondaryCta />
    </motion.div>
  );
}
