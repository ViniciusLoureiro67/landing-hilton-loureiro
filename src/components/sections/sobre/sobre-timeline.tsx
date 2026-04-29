"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type TimelineItem = {
  year: string;
  title: string;
  current?: boolean;
};

const PALMARES: TimelineItem[] = [
  { year: "2016", title: "Vice-campeão Pernambucano 600cc" },
  { year: "2018", title: "Campeão Nordestino 600cc" },
  { year: "2022", title: "Vice-campeão Paraibano 600cc" },
  { year: "2023", title: "Vice-campeão Brasileiro Endurance 600cc" },
  { year: "2024", title: "3º lugar + Campeão Brasileiro Endurance 600cc" },
  { year: "2025", title: "Bicampeão Brasileiro Endurance 600cc", current: true },
];

export function SobreTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(containerRef, { once: true, margin: "-60px" });

  return (
    <div ref={containerRef}>
      <h3 className="mb-8 font-heading text-sm font-bold uppercase tracking-widest text-racing-mute">
        Palmarés
      </h3>

      {/* Desktop: horizontal */}
      <ol
        aria-label="Palmarés — conquistas de 2016 a 2025"
        className="relative hidden lg:flex lg:items-start lg:justify-between"
      >
        {/* Linha conectora */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[7px] h-px bg-racing-blue-bright/30"
        />

        {PALMARES.map((item, i) => (
          <motion.li
            key={item.year}
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { delay: i * 0.08, duration: 0.4, ease: "easeOut" }
            }
            className="relative flex flex-col items-center gap-2"
          >
            {/* Dot */}
            <span
              className={`relative z-10 rounded-full ${
                item.current
                  ? "h-3 w-3 bg-racing-yellow shadow-[0_0_12px_2px] shadow-racing-yellow/50"
                  : "h-2 w-2 bg-racing-blue-bright"
              }`}
            />
            {/* Ano */}
            <span
              className={`font-mono text-sm font-semibold ${
                item.current ? "text-racing-yellow" : "text-racing-blue-bright"
              }`}
            >
              {item.year}
            </span>
            {/* Conquista */}
            <span className="max-w-[140px] text-center text-xs leading-tight text-racing-white/80">
              {item.title}
            </span>
            {/* Badge "atual" */}
            {item.current && (
              <span className="mt-1 rounded-full bg-racing-yellow/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-racing-yellow">
                atual
              </span>
            )}
          </motion.li>
        ))}
      </ol>

      {/* Mobile: vertical timeline */}
      <ol
        aria-label="Palmarés — conquistas de 2016 a 2025"
        className="relative space-y-6 pl-6 lg:hidden"
      >
        {/* Linha vertical */}
        <div
          aria-hidden
          className="absolute bottom-0 left-[7px] top-0 w-px bg-racing-blue-bright/30"
        />

        {PALMARES.map((item, i) => (
          <motion.li
            key={item.year}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { delay: i * 0.08, duration: 0.4, ease: "easeOut" }
            }
            className="relative flex items-start gap-3"
          >
            {/* Dot */}
            <span
              className={`absolute -left-6 top-1 rounded-full ${
                item.current
                  ? "h-3 w-3 bg-racing-yellow shadow-[0_0_12px_2px] shadow-racing-yellow/50"
                  : "h-2 w-2 bg-racing-blue-bright"
              }`}
            />
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-sm font-semibold ${
                    item.current ? "text-racing-yellow" : "text-racing-blue-bright"
                  }`}
                >
                  {item.year}
                </span>
                {item.current && (
                  <span className="rounded-full bg-racing-yellow/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-racing-yellow">
                    atual
                  </span>
                )}
              </div>
              <span className="text-sm leading-snug text-racing-white/80">
                {item.title}
              </span>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
