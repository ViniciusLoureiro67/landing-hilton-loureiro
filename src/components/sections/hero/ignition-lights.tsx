"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useHeroEntrySkip } from "./use-hero-entry-skip";

/**
 * Sequência de "luzes da largada" estilo Fórmula 1 — 5 luzes vermelhas
 * que acendem uma a uma, seguram a tensão por meio segundo, e então
 * apagam todas de uma vez ("LIGHTS OUT") disparando o flash radial e
 * o resto da landing.
 *
 * Linha do tempo (segundos):
 *
 *   0.00 — painel das luzes aparece (escuro, dim)
 *   0.40 — luz 1 acende
 *   0.95 — luz 2 acende
 *   1.50 — luz 3 acende
 *   2.05 — luz 4 acende
 *   2.60 — luz 5 acende ............................. todas acesas
 *   2.60 → 3.10 — HOLD (tensão; texto "STAND BY")
 *   3.10 — todas apagam ao mesmo tempo (corte seco)
 *   3.10 → 3.50 — flash radial vermelho/amarelo expande
 *   3.50 — painel inteiro dissolve, hero fica calmo
 *
 * Total: ~3.5s. Suficiente pra criar memória cinematográfica sem
 * irritar o visitante recorrente (que pode usar bfcache pra pular).
 *
 * Sob `prefers-reduced-motion`: a sequência inteira é descartada.
 */

const LIGHT_COUNT = 5;

const STAGGER = 0.55;
const LIGHT_LIT_DURATION = 0.18;
const LIGHTS_OUT_AT = 0.4 + STAGGER * (LIGHT_COUNT - 1) + 0.5; // 3.10
const FLASH_END = LIGHTS_OUT_AT + 0.4; // 3.50
const TOTAL = FLASH_END + 0.05; // 3.55s — buffer mínimo pra não cortar o flash

export function IgnitionLights() {
  const reduceMotion = useReducedMotion();
  const skipEntry = useHeroEntrySkip();

  if (reduceMotion || skipEntry) {
    return null;
  }

  return (
    <>
      {/* Painel das luzes — barra horizontal central, top da viewport.
          O container fica visível 0..LIGHTS_OUT_AT, depois dissolve. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [-8, 0, 0, -16] }}
        transition={{
          duration: TOTAL,
          times: [0, 0.08, LIGHTS_OUT_AT / TOTAL, 1],
          ease: [0.4, 0, 0.2, 1],
        }}
        className="pointer-events-none absolute left-1/2 top-[26%] z-30 -translate-x-1/2 sm:top-[22%]"
      >
        {/* Wrapper que recebe o halo radial circular atrás do painel.
            O halo é separado das luzes individuais (que tinham um
            `box-shadow` enorme — blur 36 + spread 10 — vazando do painel
            `rounded-full` em formato meio retangular pelo grid de 5
            luzes alinhadas; box-shadow não respeita o `overflow:hidden`
            do pai). Aqui o halo é UMA camada radial circular dedicada,
            atrás de tudo, com intensidade subindo conforme as luzes
            acendem. Resultado: glow orgânico arredondado, não retangular. */}
        <div className="relative">
          {/* Halo radial — camada negativa atrás do painel.
              `rounded-full` + `blur-2xl` garantem o formato circular suave.
              `mix-blend-screen` faz o vermelho clarear (não "pintar
              vermelho") sobre a foto/overlay azul de fundo. */}
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: [0, 0, 0.55, 0.7, 0],
              scale: [0.6, 0.7, 1.0, 1.15, 0.8],
            }}
            transition={{
              duration: TOTAL,
              times: [
                0,
                0.4 / TOTAL, // antes da 1a luz acender
                (0.4 + STAGGER * 2) / TOTAL, // 3a luz acende, halo cresce
                LIGHTS_OUT_AT / TOTAL, // todas acesas, halo no pico
                (LIGHTS_OUT_AT + 0.15) / TOTAL, // dissolve com lights-out
              ],
              ease: "easeOut",
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.58_0.23_27_/_0.7)_0%,oklch(0.58_0.23_27_/_0.35)_35%,transparent_70%)] blur-2xl sm:size-[320px] lg:size-[380px]"
            style={{ mixBlendMode: "screen" }}
          />

          {/* Painel oficial — frame escuro com borda e backdrop blur */}
          <motion.ul
            initial="dim"
            animate="lit"
            variants={{
              lit: {
                transition: { staggerChildren: STAGGER, delayChildren: 0.4 },
              },
            }}
            className="relative flex items-center gap-3 rounded-full border border-white/10 bg-racing-blue-deep/90 px-5 py-4 shadow-[0_24px_72px_-16px_oklch(0_0_0_/_0.7)] backdrop-blur-md sm:gap-4 sm:px-7 sm:py-5"
          >
            {Array.from({ length: LIGHT_COUNT }).map((_, idx) => (
              <motion.li
                key={idx}
                variants={{
                  dim: {
                    opacity: 0.14,
                    scale: 0.82,
                    boxShadow: "0 0 0 0 rgba(0,0,0,0)",
                  },
                  lit: {
                    // Acende → segura → DROP a 0 simultaneamente em LIGHTS_OUT_AT.
                    // Box-shadow contido (blur 16, sem spread) — o "halo
                    // grande" agora vem da camada radial circular dedicada
                    // acima, então a luz só precisa do glow imediato pra
                    // parecer LED aceso.
                    opacity: [0, 1, 1, 0],
                    scale: [0.82, 1.05, 1, 0.92],
                    boxShadow: [
                      "0 0 0 0 oklch(0.58 0.23 27 / 0)",
                      "0 0 16px 0 oklch(0.58 0.23 27 / 0.9), inset 0 0 12px 2px oklch(0.86 0.18 95 / 0.55)",
                      "0 0 12px 0 oklch(0.58 0.23 27 / 0.8), inset 0 0 10px 2px oklch(0.86 0.18 95 / 0.4)",
                      "0 0 0 0 oklch(0.58 0.23 27 / 0)",
                    ],
                    transition: {
                      // tempo total = duração do "lit" da luz mais nova
                      // (que ainda precisa segurar o hold).
                      // tempos: [acende, pico, hold-stable, drop]
                      duration:
                        LIGHTS_OUT_AT - (0.4 + idx * STAGGER) + 0.3,
                      times: [
                        0,
                        LIGHT_LIT_DURATION /
                          (LIGHTS_OUT_AT - (0.4 + idx * STAGGER) + 0.3),
                        Math.min(
                          0.95,
                          (LIGHT_LIT_DURATION + 0.05) /
                            (LIGHTS_OUT_AT - (0.4 + idx * STAGGER) + 0.3)
                        ),
                        Math.min(
                          0.999,
                          (LIGHTS_OUT_AT - (0.4 + idx * STAGGER)) /
                            (LIGHTS_OUT_AT - (0.4 + idx * STAGGER) + 0.3)
                        ),
                      ],
                      ease: "easeOut",
                    },
                  },
                }}
                style={{ backgroundColor: "var(--racing-red)" }}
                className="size-4 rounded-full sm:size-5 lg:size-6"
              />
            ))}

            {/* Reflexo sutil no topo do painel — vidro */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-1 h-1/3 rounded-full bg-gradient-to-b from-white/10 to-transparent"
            />
          </motion.ul>
        </div>

        {/* Subtítulo dinâmico — alterna "STAND BY" → "LIGHTS OUT" */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <motion.span
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: TOTAL,
              times: [
                0,
                0.18,
                (LIGHTS_OUT_AT - 0.05) / TOTAL,
                LIGHTS_OUT_AT / TOTAL,
              ],
              ease: "easeOut",
            }}
            className="block font-mono text-[10px] uppercase tracking-[0.55em] text-racing-white/70"
          >
            Stand by
          </motion.span>
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: [0, 0, 1, 0], scale: [0.92, 0.92, 1.05, 1.1] }}
            transition={{
              duration: TOTAL,
              times: [
                0,
                LIGHTS_OUT_AT / TOTAL,
                (LIGHTS_OUT_AT + 0.05) / TOTAL,
                FLASH_END / TOTAL,
              ],
              ease: "easeOut",
            }}
            className="absolute block font-display text-base uppercase tracking-[0.4em] text-racing-yellow drop-shadow-[0_0_12px_oklch(0.86_0.18_95_/_0.6)] sm:text-lg"
          >
            Lights out
          </motion.span>
        </div>
      </motion.div>

      {/* Flash radial — dispara EXATAMENTE quando as luzes apagam.
          Vermelho-amarelo, expande do centro/top para fora. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0, 1, 0], scale: [0.7, 0.7, 1.3, 2] }}
        transition={{
          duration: TOTAL,
          times: [
            0,
            (LIGHTS_OUT_AT - 0.02) / TOTAL,
            (LIGHTS_OUT_AT + 0.1) / TOTAL,
            FLASH_END / TOTAL,
          ],
          ease: [0.16, 1, 0.3, 1],
        }}
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, oklch(0.92 0.18 95 / 0.65) 0%, oklch(0.58 0.23 27 / 0.45) 28%, transparent 62%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Flash secundário — onda branca rápida (clarão) que assina o
          momento exato do "lights out". Mais curto que o radial. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.55, 0] }}
        transition={{
          duration: TOTAL,
          times: [
            0,
            (LIGHTS_OUT_AT - 0.01) / TOTAL,
            (LIGHTS_OUT_AT + 0.06) / TOTAL,
            (LIGHTS_OUT_AT + 0.22) / TOTAL,
          ],
          ease: "easeOut",
        }}
        className="pointer-events-none absolute inset-0 z-20 bg-racing-white"
        style={{ mixBlendMode: "screen" }}
      />
    </>
  );
}
