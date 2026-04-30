"use client";

import { useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CharReveal } from "@/components/motion/char-reveal";
import { WHATSAPP_PATROCINIO_HREF } from "@/lib/links";
import { PATROCINIO_COPY } from "./patrocinio-copy";

/**
 * PatrocinioCta — fechamento comercial da seção.
 *
 *   1. Pull-headline gigante "Sua marca cabe aqui." com char-reveal + scale
 *      sutil (0.94 → 1) — diferente do hero (mais quieto e direto)
 *   2. Botão WhatsApp dedicado replicando padrão visual de WhatsAppCta do
 *      hero (sweep + icon morph + glow), porém com WHATSAPP_PATROCINIO_HREF
 *      e texto "Falar sobre patrocínio" — não confunde com o CTA do hero
 *   3. Reassure line abaixo: "Resposta direta com o piloto. Sem intermediário."
 */

function PatrocinioWhatsAppButton() {
  const reduce = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  return (
    <motion.a
      href={WHATSAPP_PATROCINIO_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar sobre patrocínio no WhatsApp — abre em nova aba"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      className={cn(
        "group relative inline-flex h-12 min-w-[15rem] items-center justify-center gap-2.5 overflow-hidden rounded-lg px-7",
        "bg-racing-red text-racing-white",
        "font-heading text-sm font-bold uppercase tracking-[0.22em]",
        "transition-colors duration-300",
        "shadow-[0_8px_24px_-8px_oklch(0.58_0.23_27/0.6)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-racing-blue-bright focus-visible:ring-offset-2 focus-visible:ring-offset-racing-blue-deep",
        !reduce && hovering && "shadow-[0_0_28px_-10px_oklch(0.58_0.23_27/0.9)]"
      )}
    >
      {/* Sweep diagonal */}
      {reduce ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-80"
        />
      ) : (
        <motion.span
          aria-hidden
          initial={{ x: "-130%", opacity: 0 }}
          animate={
            hovering
              ? { x: "130%", opacity: 0.55 }
              : { x: "-130%", opacity: 0 }
          }
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent"
        />
      )}

      {/* Ícone morph */}
      <span
        aria-hidden
        className="relative inline-flex size-5 items-center justify-center"
      >
        <AnimatePresence initial={false} mode="wait">
          {hovering && !reduce ? (
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

      <span className="relative">{PATROCINIO_COPY.cta.button}</span>
    </motion.a>
  );
}

export function PatrocinioCta() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative isolate flex flex-col items-start gap-8 lg:gap-10"
    >
      {/* Pull-headline gigante */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        animate={
          inView
            ? reduce
              ? { opacity: 1 }
              : { opacity: 1, scale: 1 }
            : undefined
        }
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl"
      >
        <h3 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-tight text-racing-white">
          <CharReveal
            text={PATROCINIO_COPY.cta.pullHeadline}
            as="span"
            stagger={0.035}
            viewportAmount={0.3}
          />
        </h3>
      </motion.div>

      {/* Slash decorativo crescendo */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={
          reduce
            ? { duration: 0.2 }
            : { duration: 0.85, ease: [0.85, 0, 0.15, 1], delay: 0.5 }
        }
        style={{ transformOrigin: "left center" }}
        className="block h-[4px] w-20 bg-racing-red sm:w-28 lg:h-[5px] lg:w-36"
      />

      {/* CTA + reassure */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={
          reduce
            ? { duration: 0.2 }
            : { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 }
        }
        className="flex flex-col items-start gap-4"
      >
        <PatrocinioWhatsAppButton />
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-racing-mute">
          {PATROCINIO_COPY.cta.reassure}
        </p>
      </motion.div>
    </div>
  );
}
