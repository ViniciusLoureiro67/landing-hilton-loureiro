"use client";

import { useEffect, useRef, type RefObject } from "react";
import { getImageProps } from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Camadas de fundo do hero com parallax de mouse — o usuário move o
 * cursor e cada camada (foto, 76 gigante, speedlines) se desloca em
 * magnitudes diferentes, criando profundidade.
 *
 * Magnitudes (px máximos a partir do centro):
 *   - speedlines:  4
 *   - foto:        16
 *   - 76 gigante:  32  (camada mais "à frente" → mais reativa)
 *
 * O componente também renderiza:
 *   - dois `<Image>` (portrait mobile / wide desktop) com `priority` para LCP
 *   - overlays de gradient para garantir contraste do texto
 *   - speedlines diagonais ambient (CSS-only, drift contínuo)
 *   - número 76 ENORME do lado direito, sangrando pela borda, com
 *     slash diagonal vermelho atravessando — protagonista visual
 *   - camada de grain SVG (já definida em globals.css)
 *
 * Nota LCP: `next/image` em client component continua emitindo o
 * `<link rel="preload">` no head com `priority`. SSR markup sai inteiro.
 *
 * Sob `prefers-reduced-motion`: parallax desativado (motion values
 * ficam em zero) e o 76 não tem entrada animada — aparece estático.
 */

const SPEEDLINES_STRENGTH = 4;
const PHOTO_STRENGTH = 16;
const NUMBER_STRENGTH = 32;

function useMouseParallax(rootRef: RefObject<HTMLElement | null>) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0); // -1..1
  const y = useMotionValue(0); // -1..1

  // springs suavizam — evita jitter de mouse rápido
  const springConfig = { stiffness: 90, damping: 20, mass: 0.5 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  useEffect(() => {
    if (reduceMotion) return;
    const target = rootRef.current;
    if (!target) return;

    function onMove(event: MouseEvent) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // -1 (esquerda/topo) a +1 (direita/base)
      x.set((event.clientX - w / 2) / (w / 2));
      y.set((event.clientY - h / 2) / (h / 2));
    }

    // IntersectionObserver gate: só registra `mousemove` enquanto o
    // hero está intersectando o viewport. Quando o usuário rola para
    // outras seções, o listener é removido e os springs ficam idle.
    let listenerAttached = false;
    function attach() {
      if (listenerAttached) return;
      window.addEventListener("mousemove", onMove, { passive: true });
      listenerAttached = true;
    }
    function detach() {
      if (!listenerAttached) return;
      window.removeEventListener("mousemove", onMove);
      listenerAttached = false;
      // Voltar para o centro quando o hero sai de vista — evita
      // "snap" quando o usuário rola de volta.
      x.set(0);
      y.set(0);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) attach();
          else detach();
        }
      },
      { rootMargin: "0px", threshold: 0 }
    );
    io.observe(target);

    return () => {
      io.disconnect();
      detach();
    };
  }, [reduceMotion, rootRef, x, y]);

  return { sx, sy, reduceMotion };
}

function useParallaxOffset(
  mvX: MotionValue<number>,
  mvY: MotionValue<number>,
  strength: number
) {
  const tx = useTransform(mvX, [-1, 1], [-strength, strength]);
  const ty = useTransform(mvY, [-1, 1], [-strength, strength]);
  return { tx, ty };
}

/**
 * Foto responsiva via `<picture>` + `<source media>`. O browser escolhe
 * UMA srcset com base na media query antes do download — sem duplo
 * preload, sem `sizes="0px"`. Cada srcset ainda passa pelo otimizador
 * de imagem do Next (formatos AVIF/WebP, quality 75).
 */
function ResponsiveHeroPhoto() {
  const common = {
    alt: "",
    fill: true as const,
    priority: true,
    quality: 75,
    sizes: "100vw",
  };

  const portrait = getImageProps({
    ...common,
    src: "/photos/01-corner-sonic-portrait.jpg",
  });
  const wide = getImageProps({
    ...common,
    src: "/photos/02-corner-sonic-wide.jpg",
  });

  return (
    <picture>
      {/* Desktop ≥640px: foto wide com enquadramento horizontal */}
      <source
        media="(min-width: 640px)"
        srcSet={wide.props.srcSet}
        sizes={wide.props.sizes}
      />
      {/* Fallback mobile: foto portrait, melhor enquadramento do piloto.
          O `style` cobre `inset:0` (equivalente ao `fill` do next/image). */}
      <img
        {...portrait.props}
        alt=""
        className="absolute inset-0 size-full object-cover object-[60%_center] sm:object-[55%_center]"
      />
    </picture>
  );
}

export function HeroParallaxScene() {
  // Ref para a `<section id="top">` pai — usado pelo IntersectionObserver
  // do parallax para gateá-lo só quando o hero está visível.
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    sectionRef.current = document.getElementById("top");
  }, []);

  const { sx, sy, reduceMotion } = useMouseParallax(sectionRef);
  const skipEntry = useHeroEntrySkip();
  const skipAll = reduceMotion || skipEntry;
  const photo = useParallaxOffset(sx, sy, PHOTO_STRENGTH);
  const number = useParallaxOffset(sx, sy, NUMBER_STRENGTH);
  const lines = useParallaxOffset(sx, sy, SPEEDLINES_STRENGTH);
  const numberRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Camada 1 — foto (mais ao fundo).
          `<picture>` com `<source media>` resolve responsividade num único
          `<img>` no DOM: o browser escolhe a srcset correta antes de
          baixar. Evita o trick `sizes="0px"` e o duplo preload. Cada
          srcset ainda passa pelo otimizador do next/image (AVIF/WebP). */}
      <motion.div
        aria-hidden
        style={
          reduceMotion
            ? undefined
            : { x: photo.tx, y: photo.ty, scale: 1.06 }
        }
        className="absolute inset-0 -z-30"
      >
        <ResponsiveHeroPhoto />
      </motion.div>

      {/* Camada 2 — overlays de gradient (não param-laxam, ficam fixos) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-t from-racing-blue-deep via-racing-blue-deep/85 to-racing-blue-deep/30"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-20 hidden w-3/5 bg-gradient-to-r from-racing-blue-deep via-racing-blue-deep/75 to-transparent sm:block"
      />
      {/* Vinheta direita sutil para forçar contraste do "76" sobre a foto */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 -z-20 hidden w-1/2 bg-gradient-to-l from-racing-blue-deep/60 via-transparent to-transparent sm:block"
      />

      {/* Camada 3 — speedlines diagonais ambient */}
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { x: lines.tx, y: lines.ty }}
        className="hero-speedlines pointer-events-none absolute inset-0 -z-10 opacity-80"
      />

      {/* Camada 4 — número 76 ENORME no lado direito.
          Em mobile vira marca d'água atrás de tudo (ainda visível); em
          desktop sangra pela borda direita e domina ~60% da viewport. */}
      <motion.div
        ref={numberRef}
        aria-hidden
        initial={skipAll ? { opacity: 1 } : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          skipAll
            ? { duration: 0.01 }
            : { delay: 1.55, duration: 1.1, ease: [0.16, 1, 0.3, 1] }
        }
        style={
          reduceMotion ? undefined : { x: number.tx, y: number.ty }
        }
        className="pointer-events-none absolute -bottom-[12vw] right-[-10vw] -z-10 select-none sm:-bottom-[8vw] sm:right-[-6vw] lg:-bottom-[6vw] lg:right-[-4vw]"
      >
        <span className="relative inline-block">
          {/* 7 — outline em azul-bright forte, com slash vermelho diagonal
              atravessando (assinatura do logo HILTON76). Stroke grosso e
              opacity alta para competir com a foto/overlay. */}
          <span
            aria-hidden
            className="font-display leading-[0.78] tracking-[-0.04em]"
            style={{
              fontSize: "clamp(22rem, 48vw, 56rem)",
              color: "transparent",
              WebkitTextStroke: "5px oklch(0.62 0.20 252 / 0.85)",
              filter:
                "drop-shadow(0 0 32px oklch(0.62 0.20 252 / 0.35))",
            }}
          >
            7
          </span>
          {/* Slash diagonal vermelho — atravessa o "7", elemento gráfico
              dominante. Posição percentual relativa ao bbox do "7". */}
          <span
            aria-hidden
            className="absolute left-[42%] top-[2%] h-[96%] w-[14px] origin-center rotate-[18deg] bg-racing-red sm:w-[20px] lg:w-[28px]"
            style={{
              boxShadow:
                "0 0 28px 4px oklch(0.58 0.23 27 / 0.55), 0 0 64px 12px oklch(0.58 0.23 27 / 0.25)",
            }}
          />
          {/* 6 — sólido em vermelho (acento dominante). Drop-shadow para
              destacar do overlay. */}
          <span
            aria-hidden
            className="font-display leading-[0.78] tracking-[-0.04em] text-racing-red"
            style={{
              fontSize: "clamp(22rem, 48vw, 56rem)",
              filter:
                "drop-shadow(0 12px 48px oklch(0 0 0 / 0.45))",
            }}
          >
            6
          </span>
        </span>
      </motion.div>

      {/* Camada 5 — grain de filme sobre tudo, mix-blend overlay */}
      <div aria-hidden className="racing-grain pointer-events-none absolute inset-0" />
    </>
  );
}
