"use client";

import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import Image from "next/image";
import { useRef, useState } from "react";

/**
 * SobrePhoto — entrada cinematográfica multi-camada.
 *
 * Stack de camadas (z-index ascendente):
 *   z-0   foto (sempre visível, scale leve estático)
 *   z-10  vinheta inferior + borda lateral vermelha + caption
 *   z-20  3 stripes verticais que "abrem" a cortina (efeito flag racing)
 *   z-30  cortina vermelha que se retira por cima de tudo
 *   z-40  spotlight cinematográfico no hover
 *
 * Princípios:
 *   - CSS-first: a foto SEMPRE existe no DOM, nunca depende de JS.
 *   - Stripes/cortina são desmontados após a entry pra liberar layers GPU.
 *   - Hover: zoom leve sem filter (saturate é paint-expensive).
 *   - Sem parallax scroll-driven aqui — a entrada já é dramática e o
 *     custo de listener contínuo + recomposite de uma foto 4:5 grande
 *     era pesado em Windows.
 *
 * Reduced-motion: tudo estático. Cortina e stripes nunca renderizam.
 */
export function SobrePhoto() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  // Quando a entry termina, removemos stripes + cortina do DOM. Isso
  // libera 4 layers GPU permanentes (3 stripes + cortina) que ficavam
  // composited em ±101% / scaleY 0 mesmo sem repintar.
  const [entryDone, setEntryDone] = useState(false);

  return (
    <motion.figure
      ref={ref}
      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : undefined}
      transition={
        reduce
          ? { duration: 0.3 }
          : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
      }
      onAnimationComplete={() => setEntryDone(true)}
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-racing-asphalt lg:aspect-[3/4]"
    >
      {/* Camada da foto — scale estático leve (sem listener de scroll) */}
      <div className="absolute inset-0 z-0" style={reduce ? undefined : { transform: "scale(1.06)" }}>
        <Image
          src="/photos/07-grid-largada-frontal.jpg"
          alt="Hilton Loureiro de pé no grid de largada ao lado da Kawasaki ZX6R número 76, capacete azul com adesivo 76, traje vermelho, preto e branco, gesto de positivo com a mão"
          fill
          sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 54vw, 820px"
          quality={95}
          priority={false}
          className="object-cover object-[center_28%] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
        />
      </div>

      {/* Vinheta inferior — integra com bg + ancora caption */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-racing-blue-deep via-racing-blue-deep/60 to-transparent"
      />

      {/* Borda lateral vermelha + barra superior — moldura racing */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-[3px] bg-racing-red"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 h-[3px] w-1/3 bg-racing-red"
      />

      {/* Marca tipográfica gigante de fundo, dentro da figura — "76" sutil */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-2 z-10 select-none font-display text-[14rem] leading-none text-racing-white/[0.04] lg:text-[18rem]"
      >
        76
      </span>

      {/* Caption — peso editorial */}
      <figcaption className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-4 lg:inset-x-7 lg:bottom-7">
        <div className="flex flex-col">
          <motion.span
            initial={reduce ? { opacity: 1 } : { opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-racing-blue-bright"
          >
            No grid
          </motion.span>
          <motion.span
            initial={reduce ? { opacity: 1 } : { opacity: 0, x: -8 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, ease: "easeOut", delay: 1.3 }}
            className="mt-1 font-heading text-sm font-bold uppercase tracking-widest text-racing-white lg:text-base"
          >
            Brasileiro 600cc Master
          </motion.span>
        </div>
        <motion.span
          aria-hidden
          initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: 1.4,
          }}
          className="font-display text-3xl leading-none lg:text-4xl"
        >
          <span className="text-racing-blue-bright">7</span>
          <span className="text-racing-red">6</span>
        </motion.span>
      </figcaption>

      {/* 3 stripes verticais — efeito "starting flag" se afastando.
          Desmontadas após a entry pra liberar GPU layers. */}
      {!reduce && !entryDone && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`stripe-${i}`}
              aria-hidden
              initial={{ y: "0%" }}
              animate={inView ? { y: i % 2 === 0 ? "-101%" : "101%" } : undefined}
              transition={{
                duration: 0.85,
                ease: [0.85, 0, 0.15, 1],
                delay: 0.2 + i * 0.06,
              }}
              style={{
                left: `${i * 33.34}%`,
                width: "33.34%",
              }}
              className="pointer-events-none absolute top-0 z-20 h-full bg-racing-blue-deep"
            />
          ))}
        </>
      )}

      {/* Cortina vermelha — desliza de baixo pra cima por cima das
          stripes. Desmontada após a entry. */}
      {!reduce && !entryDone && (
        <motion.div
          aria-hidden
          initial={{ scaleY: 1 }}
          animate={inView ? { scaleY: 0 } : undefined}
          transition={{
            duration: 0.7,
            ease: [0.85, 0, 0.15, 1],
            delay: 0.55,
          }}
          style={{ transformOrigin: "top center" }}
          className="pointer-events-none absolute inset-0 z-30 bg-racing-red"
        />
      )}

      {/* Spotlight no hover — radial gradient com transition de opacity. */}
      {reduce ? null : (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_50%_42%,oklch(0.68_0.18_252/0.16),transparent_44%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-40 opacity-0 ring-1 ring-inset ring-racing-blue-bright/15 transition-opacity duration-500 group-hover:opacity-100"
          />
        </>
      )}
    </motion.figure>
  );
}
