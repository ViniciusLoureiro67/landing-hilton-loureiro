"use client";

import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useEffect, useRef } from "react";
import { ATIVACOES } from "./patrocinio-copy";
import { PatrocinioAtivacaoStage } from "./patrocinio-ativacao-stage";
import { PatrocinioProgressRail } from "./patrocinio-progress-rail";

/**
 * PatrocinioAtivacoes — sequência de stages editoriais.
 *
 * Cada ativação é um "spread" de tela inteira (full-width, ~85vh em lg)
 * com tipografia massiva e parallax leve. Saímos do formato "card grid"
 * — visualmente cansado e pesado pra animar — pra storytelling vertical
 * típico de portfólios premium.
 *
 * Side alterna por índice pra criar ritmo:
 *   idx 0 → number à esquerda  (left)
 *   idx 1 → number à direita   (right)
 *   idx 2 → left, idx 3 → right, …
 *
 * Header: kicker + linha decorativa que cresce no in-view (mantido).
 * Rail sticky lateral: lg+ apenas, mostra progresso pelos 7 itens.
 *
 * Performance: sem 3D tilts, sem spotlight cursor-tracking, sem múltiplos
 * springs. Cada stage tem APENAS 2 motion values scroll-driven (numberY,
 * iconY) — total da seção: 14 valores. Antes (card grid): 7 cards × 6
 * motion values = 42 valores rodando em paralelo. Bem mais leve.
 */
export function PatrocinioAtivacoes() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.4 });

  // Scroll progress da seção inteira (0 → 1 enquanto a seção atravessa
  // a viewport). Alimenta o progress rail lateral.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Header — em mobile esconde "07 ativações" do lado direito pra
          não apertar a linha decorativa contra o kicker. Indentação
          `lg:pl-16 xl:pl-20` casa com o `sectionRef` abaixo: o rail
          vertical absoluto ocupa esse gutter à esquerda no lg+, então
          o kicker precisa começar depois pra não ser atropelado. */}
      <div
        ref={headerRef}
        className="flex items-baseline gap-3 sm:gap-4 lg:pl-16 xl:pl-20"
      >
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={headerInView ? { opacity: 1, x: 0 } : undefined}
          transition={
            reduce
              ? { duration: 0.2 }
              : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }
          className="flex shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute sm:text-xs"
        >
          <span className="text-racing-red">·</span>O que sua marca recebe
        </motion.span>
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ transformOrigin: "left center" }}
          className="block h-px min-w-0 flex-1 bg-racing-white/15"
        />
        <motion.span
          aria-hidden
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-racing-mute/60 sm:inline"
        >
          07 ativações
        </motion.span>
      </div>

      {/* Stages container — espaço lateral pro rail em lg+. Reduzido vs
          versão anterior (24/28) pra não apertar conteúdo em laptop 13". */}
      <div ref={sectionRef} className="relative lg:pl-16 xl:pl-20">
        <PatrocinioProgressRail
          items={ATIVACOES}
          progress={scrollYProgress}
        />

        {/* Inner flex isolado — cria stacking context próprio. ZigzagLine
            fica em z=-10 dentro desse contexto pra paintar atrás dos
            stages mas alinhada com a coluna de conteúdo (sem incluir o
            gutter do rail). */}
        <div className="relative isolate flex flex-col">
          <ZigzagLine
            stages={ATIVACOES.length}
            scrollYProgress={scrollYProgress}
          />

          {ATIVACOES.map((ativacao, idx) => (
            <PatrocinioAtivacaoStage
              key={ativacao.index}
              ativacao={ativacao}
              index={idx}
              total={ATIVACOES.length}
              // Z pattern: idx 0 → foto direita; idx 1 → esquerda; alterna.
              side={idx % 2 === 0 ? "right" : "left"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Linha LED em zigue-zague conectando as fotos das ativações.
 *
 * Implementação técnica:
 *   - SVG com `preserveAspectRatio="none"` estica horizontal/vertical pra
 *     cobrir o container dos stages (cada stage = 100 viewBox units de
 *     altura).
 *   - `pathLength={1}` normaliza o comprimento do path pra 1 unidade,
 *     `strokeDasharray="1"` cria um dash do tamanho exato do path, e
 *     `strokeDashoffset` anima de 1 (escondido) → 0 (revelado) ligado ao
 *     scrollYProgress. Truque clássico de "drawing path on scroll" — bem
 *     mais confiável que `style.pathLength` direto.
 *   - 3 camadas sobrepostas: outer glow (largo, blur forte), mid glow,
 *     core sharp. Todas com gradiente vermelho ↔ azul.
 *   - `vector-effect="non-scaling-stroke"` mantém espessuras em pixel
 *     literal independente do stretch do SVG.
 *
 * Head dot:
 *   - Div HTML absoluto, position calculada via `getPointAtLength` em cada
 *     mudança do scroll. Segue a "ponta" da linha enquanto o usuário
 *     scrolla — efeito de scanner / laser leading.
 *
 * Nodes nos vértices:
 *   - Divs HTML absolutos (não SVG circles, pra ficarem perfeitamente
 *     redondos sem distorção do `preserveAspectRatio="none"`).
 *   - Cada um acende com opacity + scale conforme a linha passa.
 */
function ZigzagLine({
  stages,
  scrollYProgress,
}: {
  stages: number;
  scrollYProgress: MotionValue<number>;
}) {
  const STAGE_VB_HEIGHT = 100;
  const totalHeight = stages * STAGE_VB_HEIGHT;

  const points = Array.from({ length: stages }, (_, idx) => ({
    x: idx % 2 === 0 ? 80 : 20,
    y: idx * STAGE_VB_HEIGHT + STAGE_VB_HEIGHT / 2,
  }));

  const pathData =
    "M " + points.map((p) => `${p.x} ${p.y}`).join(" L ");

  // Comprimento do path em viewBox units. Cada segmento é
  // `sqrt(60² + 100²) ≈ 116.62`. Com 6 segmentos: ~700 units.
  // Calculado analiticamente pra não depender de DOM measurement.
  const pathLengthVB = points.reduce((acc, p, idx) => {
    if (idx === 0) return 0;
    const prev = points[idx - 1];
    return acc + Math.hypot(p.x - prev.x, p.y - prev.y);
  }, 0);

  // SYNC FIX: a `scrollYProgress` da seção (offset "start end" → "end start")
  // cobre o transit completo da seção pelo viewport. Mas o usuário sente
  // o tempo das **fotos centralizadas no viewport**, não o transit todo.
  //
  // Com 7 stages de min-h ~70vh num viewport ~100vh:
  //   - foto 0 centralizada → rawProgress ≈ 0.144
  //   - foto 6 centralizada → rawProgress ≈ 0.856
  //
  // Sem remap, na foto 0 a linha já estaria 14% desenhada, e na foto 6
  // só 85%. Aqui remapeamos pra que progresso 0 = "foto 0 centralizada"
  // e progresso 1 = "foto 6 centralizada". Resultado: o head dot bate
  // exatamente no ponto da foto que o usuário está vendo.
  const linearProgress = useTransform(
    scrollYProgress,
    [0.14, 0.86],
    [0, 1],
    { clamp: true }
  );

  // strokeDashoffset anima de pathLength (escondido) → 0 (revelado).
  const dashOffset = useTransform(
    linearProgress,
    [0, 1],
    [pathLengthVB, 0]
  );

  // Head dot que segue a ponta da linha — usa getPointAtLength.
  const pathRef = useRef<SVGPathElement>(null);
  const totalLengthRef = useRef(pathLengthVB);
  const headLeftPct = useMotionValue(points[0].x);
  const headTopPct = useMotionValue((points[0].y / totalHeight) * 100);
  const headOpacity = useMotionValue(0);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    if (len > 0) {
      totalLengthRef.current = len;
    }
  }, []);

  useMotionValueEvent(linearProgress, "change", (progress) => {
    if (!pathRef.current) return;
    const point = pathRef.current.getPointAtLength(
      progress * totalLengthRef.current
    );
    headLeftPct.set(point.x);
    headTopPct.set((point.y / totalHeight) * 100);
    // Esconde nas duas pontas (clampadas a 0 e 1) — fora do range útil
    // o head dot fica parado e melhor não exibir.
    headOpacity.set(progress > 0.001 && progress < 0.999 ? 1 : 0);
  });

  const headLeft = useMotionTemplate`${headLeftPct}%`;
  const headTop = useMotionTemplate`${headTopPct}%`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox={`0 0 100 ${totalHeight}`}
      >
        <defs>
          <linearGradient
            id="led-line-grad"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={totalHeight}
          >
            <stop offset="0%" stopColor="oklch(0.58 0.23 27)" />
            <stop offset="33%" stopColor="oklch(0.62 0.20 252)" />
            <stop offset="66%" stopColor="oklch(0.58 0.23 27)" />
            <stop offset="100%" stopColor="oklch(0.62 0.20 252)" />
          </linearGradient>
        </defs>

        {/* Path invisível usado como referência pra getPointAtLength. */}
        <path
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke="transparent"
          strokeWidth={0}
        />

        {/* Base — sempre visível, faint. Stroke em viewBox units; com
            preserveAspectRatio=none o stroke fica geometricamente
            estendido (mais espesso na direção do eixo mais "comprimido"),
            mas pra um path com diagonais consistentes isso é uniforme. */}
        <path
          d={pathData}
          stroke="oklch(0.97 0 0 / 0.18)"
          strokeWidth={0.4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Outer glow — strokeWidth ~2.5 viewBox units (~25-30px renderizado). */}
        <motion.path
          d={pathData}
          stroke="url(#led-line-grad)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.45}
          strokeDasharray={pathLengthVB}
          style={{
            strokeDashoffset: dashOffset,
            filter: "blur(8px)",
          }}
        />

        {/* Mid glow */}
        <motion.path
          d={pathData}
          stroke="url(#led-line-grad)"
          strokeWidth={1.1}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.75}
          strokeDasharray={pathLengthVB}
          style={{
            strokeDashoffset: dashOffset,
            filter: "blur(2.5px)",
          }}
        />

        {/* Core — sharp, sem blur. */}
        <motion.path
          d={pathData}
          stroke="url(#led-line-grad)"
          strokeWidth={0.35}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLengthVB}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>

      {/* Nodes nos vértices — divs HTML pra ficarem perfeitamente
          redondos (SVG circles distorceriam com preserveAspectRatio=none).
          Recebem `linearProgress` (não rawProgress) pra acenderem em sync
          com o LED e o head dot. */}
      {points.map((p, idx) => (
        <ZigzagNode
          key={`${p.x}-${p.y}`}
          leftPct={p.x}
          topPct={(p.y / totalHeight) * 100}
          threshold={idx / Math.max(stages - 1, 1)}
          scrollYProgress={linearProgress}
        />
      ))}

      {/* Head dot — segue a ponta da linha enquanto o usuário scrolla.
          Pulsa sutilmente pra dar sensação de "scanner laser". */}
      <motion.div
        className="absolute"
        style={{
          left: headLeft,
          top: headTop,
          opacity: headOpacity,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="relative size-3">
          {/* Outer pulse glow */}
          <motion.span
            aria-hidden
            className="absolute -inset-3 rounded-full bg-racing-red"
            style={{ filter: "blur(8px)" }}
            animate={{ opacity: [0.55, 0.2, 0.55], scale: [1, 1.3, 1] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Mid glow */}
          <span
            aria-hidden
            className="absolute -inset-1 rounded-full bg-racing-red"
            style={{ filter: "blur(3px)" }}
          />
          {/* Core white */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-white"
            style={{
              boxShadow:
                "0 0 6px 1px var(--racing-red), 0 0 12px 3px var(--racing-red)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ZigzagNode({
  leftPct,
  topPct,
  threshold,
  scrollYProgress,
}: {
  leftPct: number;
  topPct: number;
  threshold: number;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.04), threshold],
    [0.2, 1]
  );
  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.04), threshold],
    [0.5, 1]
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        opacity,
        scale,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div className="relative size-2.5">
        {/* Outer glow */}
        <span
          aria-hidden
          className="absolute -inset-3 rounded-full bg-racing-red opacity-50"
          style={{ filter: "blur(6px)" }}
        />
        {/* Mid glow azul */}
        <span
          aria-hidden
          className="absolute -inset-1 rounded-full bg-racing-blue-bright opacity-70"
          style={{ filter: "blur(2px)", mixBlendMode: "screen" }}
        />
        {/* Core white */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-white"
          style={{
            boxShadow:
              "0 0 4px 1px var(--racing-red), 0 0 8px 2px var(--racing-red)",
          }}
        />
      </div>
    </motion.div>
  );
}
