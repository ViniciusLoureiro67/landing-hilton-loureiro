"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useEffect, useRef, useState } from "react";

/**
 * SobreTimeline — palmarés em formato pinned scrollytelling.
 *
 * O container tem altura grande (300vh). Dentro, um filho `position: sticky`
 * fica preso por toda a extensão. `useScroll` no container calcula o
 * progresso 0..1 conforme o usuário rola, e disso derivamos:
 *
 *   - Avanço da linha conectora (largura cresce 0→100%)
 *   - Scrub dos itens (cada ano "ativa" quando atinge sua posição)
 *   - Headline lateral troca conforme o item ativo
 *   - Item atual destacado (yellow) recebe glow extra
 *
 * Como funciona:
 *
 *   [start of section] ────── 0% scrollYProgress
 *                              │  cada item entra em sequência
 *                              │  conforme progress avança
 *   [end of sticky range] ──── 100% scrollYProgress
 *
 * Cada um dos 6 items tem um threshold (ex: item 0 ativa em 0.05,
 * item 1 em 0.20, etc.). Quando `progress > threshold`, item está ativo.
 *
 * Reduced-motion: vira lista vertical estática sem scroll-jack.
 */

type TimelineItem = {
  year: string;
  title: string;
  detail: string;
  current?: boolean;
};

const PALMARES: TimelineItem[] = [
  {
    year: "2016",
    title: "Vice-campeão Pernambucano",
    detail: "Recorde de pista em Caruaru.",
  },
  {
    year: "2018",
    title: "Campeão Nordestino",
    detail: "Primeiro título de campeonato regional.",
  },
  {
    year: "2022",
    title: "Primeiro pódio nacional",
    detail: "Estreia entre os melhores do país.",
  },
  {
    year: "2023",
    title: "Vice-campeão Brasileiro 400cc",
    detail: "Consolidação na categoria nacional.",
  },
  {
    year: "2024",
    title: "Campeão Brasileiro Endurance 600cc",
    detail: "Também 3º na 600cc Master.",
  },
  {
    year: "2025",
    title: "Bicampeão Brasileiro Endurance",
    detail: "Confirmação no topo da categoria.",
    current: true,
  },
];

const TIMELINE_PROGRESS_THRESHOLDS = PALMARES.map(
  (_, idx) => 0.08 + (idx / PALMARES.length) * 0.85
);

export function SobreTimeline() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // < md (768px) → grid de 6 colunas esmaga títulos longos como
  // "Bicampeão Brasileiro Endurance" em colunas de ~50px no iPhone.
  // Cai pra mesma lista vertical do reduced-motion. SSR-safe: arranca
  // como `false`, atualiza no mount.
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mql = globalThis.matchMedia("(max-width: 767px)");
    setIsNarrow(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Largura da linha conectora horizontal — vai de 0 a 100% conforme
  // o scroll avança no range principal (0.1 → 0.9)
  const lineProgress = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  // Reduced motion ou viewport estreito → lista vertical estática
  if (reduce || isNarrow) {
    return (
      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-racing-mute">
            <span className="text-racing-red">02</span>
            <span aria-hidden className="mx-3 inline-block h-px w-8 align-middle bg-racing-mute/40" />
            Palmarés
          </p>
          <h3 className="mt-3 font-heading text-3xl font-black uppercase text-racing-white lg:text-5xl">
            Conquistas 2016 — 2025
          </h3>
        </header>
        <ol aria-label="Palmarés — conquistas de 2016 a 2025" className="space-y-6 border-l-2 border-racing-blue-bright/40 pl-6">
          {PALMARES.map((item) => (
            <li key={item.year} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[31px] top-1 size-3 rounded-full ${
                  item.current ? "bg-racing-yellow" : "bg-racing-blue-bright"
                }`}
              />
              <div className="flex flex-col gap-1">
                <span
                  className={`font-mono text-sm font-bold ${
                    item.current ? "text-racing-yellow" : "text-racing-blue-bright"
                  }`}
                >
                  {item.year}
                </span>
                <span className="text-base font-medium text-racing-white">{item.title}</span>
                <span className="text-sm text-racing-white/70">{item.detail}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: "300vh" }}
      aria-label="Palmarés — conquistas de 2016 a 2025"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header com kicker editorial */}
          <header className="mb-12 lg:mb-20">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-racing-mute">
              <span className="text-racing-red">02</span>
              <span aria-hidden className="mx-3 inline-block h-px w-8 align-middle bg-racing-mute/40" />
              Palmarés
            </p>
            <h3 className="mt-3 font-heading text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.9] text-racing-white">
              Conquistas{" "}
              <span className="text-racing-blue-bright">2016</span>
              {" — "}
              <span className="text-racing-yellow">2025</span>
            </h3>
          </header>

          {/* Timeline horizontal — barra base + barra de progresso + items */}
          <div className="relative pb-20">
            {/* Linha base */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-[14px] h-px bg-racing-white/10"
            />
            {/* Linha de progresso (cresce com scroll) */}
            <motion.div
              aria-hidden
              style={{ width: lineProgress }}
              className="absolute left-0 top-[14px] h-px bg-gradient-to-r from-racing-blue-bright via-racing-blue-bright to-racing-yellow"
            />

            <ol className="relative grid grid-cols-6 gap-2">
              {PALMARES.map((item, i) => (
                <TimelineItem
                  key={item.year}
                  item={item}
                  index={i}
                  scrollYProgress={scrollYProgress}
                  threshold={TIMELINE_PROGRESS_THRESHOLDS[i]}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  item,
  index,
  scrollYProgress,
  threshold,
}: {
  item: TimelineItem;
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  threshold: number;
}) {
  // Cada item tem uma janela 0..1 que vai de (threshold - 0.06) a (threshold + 0.06)
  const opacity = useTransform(
    scrollYProgress,
    [threshold - 0.08, threshold, 1],
    [0.25, 1, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [threshold - 0.08, threshold],
    [16, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [threshold - 0.08, threshold, threshold + 0.06, 1],
    [0.7, 1.4, 1, 1]
  );

  const yearOpacity = useTransform(
    scrollYProgress,
    [threshold - 0.05, threshold],
    [0.4, 1]
  );

  return (
    <motion.li
      style={{ opacity, y }}
      tabIndex={0}
      aria-label={`${item.year} — ${item.title}${item.current ? " (conquista mais recente)" : ""}`}
      className="relative flex flex-col items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-racing-blue-bright focus-visible:ring-offset-4 focus-visible:ring-offset-racing-blue-deep"
    >
      {/* Dot escala pra fora quando item ativa */}
      <motion.span
        aria-hidden
        style={{ scale }}
        className={`relative z-10 flex size-7 items-center justify-center rounded-full ${
          item.current
            ? "bg-racing-yellow shadow-[0_0_24px_4px] shadow-racing-yellow/60"
            : "bg-racing-blue-bright shadow-[0_0_18px_2px] shadow-racing-blue-bright/40"
        }`}
      >
        <span
          aria-hidden
          className={`size-2 rounded-full ${
            item.current ? "bg-racing-blue-deep" : "bg-racing-blue-deep"
          }`}
        />
      </motion.span>

      {/* Ano */}
      <motion.span
        style={{ opacity: yearOpacity }}
        className={`font-mono text-base font-bold tracking-wider ${
          item.current ? "text-racing-yellow" : "text-racing-blue-bright"
        } lg:text-lg`}
      >
        {item.year}
      </motion.span>

      {/* Título */}
      <span className="text-center text-xs font-semibold leading-tight text-racing-white lg:text-sm">
        {item.title}
      </span>

      {/* Detalhe (escondido em mobile pra não quebrar layout) */}
      <span className="hidden text-center text-[11px] leading-snug text-racing-white/60 lg:block">
        {item.detail}
      </span>

      {/* Badge "atual" pro item destacado */}
      {item.current && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="rounded-full bg-racing-yellow/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-racing-yellow"
        >
          atual
        </motion.span>
      )}

      {/* Marca posicional vertical sob o dot */}
      <span
        aria-hidden
        className={`absolute -top-2 left-1/2 h-px w-px ${
          index % 2 === 0 ? "bg-racing-red" : "bg-racing-blue-bright"
        }`}
      />
    </motion.li>
  );
}
