"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * FlipCounter — split-flap counter (airport board) que conta de 0 → value
 * com flip 3D em cada dígito.
 *
 * Comportamento:
 * - Cada dígito é um <span> que rotaciona em rotateX para "girar" entre
 *   números, usando transform-style preserve-3d.
 * - O contador roda de 0 ao valor final em ~1.4s (configurável), com
 *   easing customizada que desacelera ao chegar.
 *
 * Trigger via `inView` (passado pelo parent que controla `useInView`).
 *
 * Reduced-motion: renderiza o valor final direto, sem state nem RAF
 * (componente estático separado pra evitar setState síncrono em effect).
 */

type FlipCounterProps = {
  value: number;
  inView: boolean;
  /** Duração total da contagem em segundos. Default 1.4s. */
  duration?: number;
  /** Largura mínima de dígitos (zero-padded). Ex: 3 → "049". */
  minDigits?: number;
  className?: string;
};

export function FlipCounter(props: FlipCounterProps) {
  const reduce = useReducedMotion();
  if (reduce) return <FlipCounterStatic {...props} />;
  return <FlipCounterAnimated {...props} />;
}

function FlipCounterStatic({
  value,
  minDigits = 0,
  className,
}: FlipCounterProps) {
  const padded = useMemo(() => {
    const str = String(value);
    return str.length >= minDigits ? str : str.padStart(minDigits, "0");
  }, [value, minDigits]);

  return (
    <span
      className={className}
      style={{ display: "inline-flex" }}
      aria-label={String(value)}
    >
      {padded}
    </span>
  );
}

function FlipCounterAnimated({
  value,
  inView,
  duration = 1.4,
  minDigits = 0,
  className,
}: FlipCounterProps) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    function tick(t: number) {
      if (startRef.current === null) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      // setState aqui é OK: roda dentro de callback de requestAnimationFrame
      // (async), não no body síncrono do effect.
      setCurrent(Math.round(value * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [inView, value, duration]);

  const padded = useMemo(() => {
    const str = String(current);
    return str.length >= minDigits ? str : str.padStart(minDigits, "0");
  }, [current, minDigits]);

  return (
    <span
      className={className}
      style={{ display: "inline-flex", perspective: 600 }}
      aria-label={String(value)}
    >
      {padded.split("").map((digit, idx) => (
        <FlipDigit key={`${idx}-${digit}`} digit={digit} />
      ))}
    </span>
  );
}

function FlipDigit({ digit }: { digit: string }) {
  return (
    <motion.span
      key={digit}
      initial={{ rotateX: 90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        display: "inline-block",
        transformStyle: "preserve-3d",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {digit}
    </motion.span>
  );
}
