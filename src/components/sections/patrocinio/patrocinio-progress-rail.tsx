"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { Ativacao } from "./patrocinio-copy";

/**
 * PatrocinioProgressRail — rail vertical sticky listando as 7 ativações,
 * estilo dashboard de jogo / track indicator de player. O item ativo
 * (baseado no scrollProgress da seção) ganha:
 *
 *   - traço vermelho expandido (12 → 32px)
 *   - opacity 1 (vs 0.35 inativo)
 *   - escala leve 1.05
 *
 * Visível apenas em lg+ (mobile fica visualmente poluído com 7 marcas).
 * Todo `pointer-events-none` — é puramente decorativo/orientacional.
 */
type Props = Readonly<{
  items: Ativacao[];
  /** scrollYProgress da seção pai (0 → 1 conforme scrolla pela seção). */
  progress: MotionValue<number>;
}>;

export function PatrocinioProgressRail({ items, progress }: Props) {
  const total = items.length;

  return (
    <aside
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 hidden h-full lg:block"
    >
      <div className="sticky top-1/2 -translate-y-1/2 pl-1">
        <div className="flex items-center gap-3 pb-4 font-mono text-[9px] uppercase tracking-[0.4em] text-racing-red">
          <span className="block h-px w-4 bg-racing-red" />
          07 ativações
        </div>
        <ol className="flex flex-col gap-3">
          {items.map((item, i) => (
            <RailItem
              key={item.index}
              item={item}
              index={i}
              total={total}
              progress={progress}
            />
          ))}
        </ol>
      </div>
    </aside>
  );
}

function RailItem({
  item,
  index,
  total,
  progress,
}: {
  item: Ativacao;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Cada item ocupa um "trecho" de progress = 1/total. O item ativo é
  // aquele em que progress está dentro do seu trecho. Retorna número
  // (não union) pra encadear `useTransform` na sequência.
  const activeWeight = useTransform(progress, (v): number => {
    const target = (index + 0.5) / total;
    const distance = Math.abs(v - target);
    return distance < 0.5 / total ? 1 : 0;
  });

  const opacity = useTransform(activeWeight, [0, 1], [0.32, 1]);
  const lineWidth = useTransform(activeWeight, [0, 1], [12, 32]);

  return (
    <li className="flex items-center gap-3">
      <motion.span
        aria-hidden
        style={{ width: lineWidth, opacity }}
        className="block h-[2px] bg-racing-red"
      />
      <motion.span
        style={{ opacity }}
        className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-racing-white"
      >
        {item.index}
      </motion.span>
    </li>
  );
}
