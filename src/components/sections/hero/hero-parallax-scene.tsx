"use client";

import { getImageProps } from "next/image";
import { motion, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion-safe";
import { useHeroEntrySkip } from "./use-hero-entry-skip";
import { useHeroScrollProgress } from "./hero-scroll-context";

/**
 * Camadas de fundo do hero com parallax de scroll — foto, 76 gigante
 * e speedlines se deslocam em magnitudes diferentes sem listener de mouse.
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
 * Sob `prefers-reduced-motion`: parallax desativado e o 76 não tem
 * entrada animada — aparece estático.
 */

/**
 * Foto responsiva via `<picture>` + `<source media>`. O browser escolhe
 * UMA srcset com base na media query antes do download — sem duplo
 * preload, sem `sizes="0px"`. Cada srcset ainda passa pelo otimizador
 * de imagem do Next (formatos AVIF/WebP, quality 95).
 */
function ResponsiveHeroPhoto() {
  const common = {
    alt: "",
    fill: true as const,
    priority: true,
    quality: 95,
    sizes: "100vw",
  };

  const portrait = getImageProps({
    ...common,
    src: "/photos/01-corner-sonic-portrait.jpg",
  });
  const wide = getImageProps({
    ...common,
    src: "/photos/06-curb-brasil-flag.jpg",
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
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();
  const skipAll = reduceMotion || skipEntry;

  // Scroll-driven: enquanto o usuário rola o hero pra fora, o "76"
  // sobe mais rápido que a foto (parallax invertido) e fade — sai com
  // peso, não some. Sem scale (re-rasterização cara em texto gigante).
  const scrollProgress = useHeroScrollProgress();
  const numberScrollY = useTransform(scrollProgress, [0, 1], [0, -160]);
  const numberScrollOpacity = useTransform(scrollProgress, [0, 0.55, 0.9], [1, 0.7, 0]);
  // Foto sobe mais lento que o restante — parallax clássico (sem scale
  // pra poupar repaint da camada da foto em scroll).
  const photoScrollY = useTransform(scrollProgress, [0, 1], [0, -90]);

  return (
    <>
      {/* Camada 1 — foto (mais ao fundo).
          `<picture>` com `<source media>` resolve responsividade num único
          `<img>` no DOM: o browser escolhe a srcset correta antes de
          baixar. Evita o trick `sizes="0px"` e o duplo preload. Cada
          srcset ainda passa pelo otimizador do next/image em quality 95.
          Scroll-driven: parallax leve e zoom progressivo. */}
      <motion.div
        aria-hidden
        style={
          reduceMotion
            ? { scale: 1.06 }
            : { y: photoScrollY, scale: 1.06 }
        }
        className="absolute inset-0 -z-30 will-change-transform"
      >
        <ResponsiveHeroPhoto />
      </motion.div>

      {/* Camada 2 — overlays de gradient (não param-laxam, ficam fixos) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-t from-racing-blue-deep via-racing-blue-deep/78 to-racing-blue-deep/22"
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

      {/* Camada 3 — speedlines diagonais ambient (estáticas, sem
          parallax — eram repaint contínuo do gradient repetido). */}
      <div
        aria-hidden
        className="hero-speedlines pointer-events-none absolute inset-0 -z-10 opacity-80"
      />

      {/* Camada 4 — número 76 ENORME no lado direito.
          Em mobile vira marca d'água atrás de tudo (ainda visível); em
          desktop sangra pela borda direita e domina ~60% da viewport.

          Estrutura em 2 camadas pra evitar conflito entre `initial/animate`
          (entry) e `style` com motion values (scroll-driven):
            - outer: posição + scale/opacity do scroll. Persistente.
            - inner: entry one-shot (opacity 0→1, scale 1.06→1) que
                     dispara após o flash da largada (delay 3.55s). */}
      <motion.div
        aria-hidden
        style={
          reduceMotion
            ? undefined
            : {
                y: numberScrollY,
                opacity: numberScrollOpacity,
              }
        }
        className="pointer-events-none absolute -bottom-[12vw] right-[-10vw] -z-10 select-none will-change-transform sm:-bottom-[8vw] sm:right-[-6vw] lg:-bottom-[6vw] lg:right-[-4vw]"
      >
        <motion.span
          className="relative inline-block"
          initial={skipAll ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            skipAll
              ? { duration: 0.01 }
              : { delay: 3.55, duration: 1.1, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {/* 7 — outline em azul-bright forte, com slash vermelho diagonal
              atravessando (assinatura do logo HILTON76). Stroke grosso
              compete com a foto/overlay sem text-shadow (era paint
              extremamente caro em texto desse tamanho). */}
          <span
            aria-hidden
            className="font-display leading-[0.78] tracking-[-0.04em]"
            style={{
              fontSize: "clamp(22rem, 48vw, 56rem)",
              color: "transparent",
              WebkitTextStroke: "5px oklch(0.62 0.20 252 / 0.85)",
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
                "0 0 24px 2px oklch(0.58 0.23 27 / 0.45)",
            }}
          />
          {/* 6 — sólido em vermelho (acento dominante). Sem drop-shadow
              (era paint pesado em texto desse tamanho); o overlay já
              segura contraste. */}
          <span
            aria-hidden
            className="font-display leading-[0.78] tracking-[-0.04em] text-racing-red"
            style={{
              fontSize: "clamp(22rem, 48vw, 56rem)",
            }}
          >
            6
          </span>
        </motion.span>
      </motion.div>

      {/* Camada 5 — grain de filme sobre tudo, com opacidade baixa. */}
      <div aria-hidden className="racing-grain pointer-events-none absolute inset-0" />
    </>
  );
}
