"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type StatItem = {
  value: number;
  label: string;
  ariaLabel: string;
};

const STATS: StatItem[] = [
  { value: 49, label: "anos", ariaLabel: "49 anos de idade" },
  { value: 13, label: "temporadas", ariaLabel: "13 temporadas consecutivas" },
  { value: 6, label: "títulos", ariaLabel: "6 títulos conquistados" },
  { value: 76, label: "número", ariaLabel: "Número 76 de corrida" },
];

function AnimatedCounter({ value, inView, reduceMotion }: { value: number; inView: boolean; reduceMotion: boolean | null }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, {
    stiffness: 80,
    damping: 20,
    mass: 1,
  });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      motionVal.set(reduceMotion ? value : value);
    }
  }, [inView, motionVal, value, reduceMotion]);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      motionVal.jump(value);
    } else {
      motionVal.set(value);
    }
  }, [inView, reduceMotion, motionVal, value]);

  return <motion.span>{display}</motion.span>;
}

export function SobreStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 gap-6 lg:grid-cols-4"
    >
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          aria-label={stat.ariaLabel}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
          }
          className="flex flex-col items-center gap-1 lg:items-start"
        >
          <span className="font-mono text-[2.5rem] font-bold leading-none text-racing-white lg:text-[3.5rem]">
            <AnimatedCounter
              value={stat.value}
              inView={inView}
              reduceMotion={reduceMotion}
            />
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-racing-mute">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
