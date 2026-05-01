"use client";

import { motion, useInView, type Variants } from "framer-motion";
import Image from "next/image";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useRef } from "react";
import { PATROCINIO_COPY } from "./patrocinio-copy";

/**
 * PatrocinioSponsors — showcase com cards individuais por marca.
 *
 * Layout:
 *   - mobile: 2 cols
 *   - tablet/desktop: 4 cols
 *
 * Cada card:
 *   - aspect 5/3 mobile, 16/9 tablet+
 *   - Border + bg discreto, hover border vermelha + lift sutil
 *   - Logo centralizado preenchendo melhor o espaço (max-w 90%)
 *   - Numeração 01..04 mono no canto superior esquerdo
 *
 * Motion:
 *   - clip-path mask reveal vertical com stagger 0.12s entre cards
 *   - Logo escala de 0.92 → 1 com delay
 *   - Sweep diagonal vermelho on hover
 *
 * Wordmarks (Garagem 57, Brasil da Sorte): tipografia editorial sem
 * badges/círculos. Substituir por SVG real quando o cliente passar.
 */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const logoInnerVariants: Variants = {
  hidden: { scale: 0.92, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
};

const labelVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

export function PatrocinioSponsors() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const sponsors = PATROCINIO_COPY.sponsors;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="space-y-8 lg:space-y-10"
    >
      {/* Header */}
      <div className="flex items-baseline gap-3 sm:gap-4">
        <motion.span
          variants={reduce ? undefined : labelVariants}
          className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute sm:text-xs"
        >
          <span className="text-racing-red">·</span>
          {PATROCINIO_COPY.sponsorsLabel}
        </motion.span>
        <motion.span
          aria-hidden
          variants={reduce ? undefined : lineVariants}
          style={{ transformOrigin: "left center" }}
          className="block h-px min-w-0 flex-1 bg-racing-white/15"
        />
        <motion.span
          aria-hidden
          variants={reduce ? undefined : labelVariants}
          className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute/60 sm:inline"
        >
          {String(sponsors.length).padStart(2, "0")} marcas
        </motion.span>
      </div>

      {/* Grid */}
      <motion.ul
        variants={reduce ? undefined : containerVariants}
        aria-label="Patrocinadores oficiais 2026"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
      >
        {sponsors.map((sponsor, idx) => (
          <SponsorCard
            key={sponsor.name}
            sponsor={sponsor}
            index={idx}
            reduce={reduce}
          />
        ))}
      </motion.ul>
    </motion.div>
  );
}

type Sponsor = (typeof PATROCINIO_COPY)["sponsors"][number];

function SponsorCard({
  sponsor,
  index,
  reduce,
}: {
  sponsor: Sponsor;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.li
      variants={reduce ? undefined : cardVariants}
      className="group relative isolate flex aspect-[5/3] items-center justify-center overflow-hidden rounded-sm border border-racing-white/10 bg-racing-blue-deep/40 transition-[border-color,background-color] duration-500 hover:border-racing-red/60 hover:bg-racing-blue-deep/60 focus-within:border-racing-red/60 sm:aspect-[16/9]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 z-10 font-mono text-[9px] uppercase tracking-[0.35em] text-racing-mute/60 transition-colors duration-500 group-hover:text-racing-red"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 z-10 size-3 border-r border-t border-racing-white/15 transition-colors duration-500 group-hover:border-racing-red"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-2 z-10 size-3 border-b border-l border-racing-white/15 transition-colors duration-500 group-hover:border-racing-red"
      />

      {!reduce ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 z-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-racing-red/20 to-transparent opacity-0 transition-[opacity,transform] duration-700 group-hover:translate-x-[400%] group-hover:opacity-100"
        />
      ) : null}

      <motion.div
        variants={reduce ? undefined : logoInnerVariants}
        className="relative z-10 flex h-full w-full items-center justify-center px-3 py-4 sm:px-4 sm:py-5"
      >
        <SponsorLogo sponsor={sponsor} />
      </motion.div>

      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${sponsor.name} — abrir Instagram em nova aba`}
        className="absolute inset-0 z-20 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-racing-red focus-visible:ring-offset-2 focus-visible:ring-offset-racing-blue-deep"
      >
        <span className="sr-only">{sponsor.name}</span>
      </a>
    </motion.li>
  );
}

/**
 * SponsorLogo — usa `widthPct` declarado pelo copy pra balancear
 * visualmente. `object-contain` garante que portrait não overflow em
 * altura mesmo com width%, mas o limite real é definido pelo copy.
 */
function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Image
      src={sponsor.logoSrc}
      alt={sponsor.name}
      width={400}
      height={Math.round(400 / sponsor.aspect)}
      style={{ maxWidth: `${sponsor.widthPct}%` }}
      className="h-auto w-full object-contain transition-transform duration-700 group-hover:scale-[1.05]"
      priority={false}
    />
  );
}
