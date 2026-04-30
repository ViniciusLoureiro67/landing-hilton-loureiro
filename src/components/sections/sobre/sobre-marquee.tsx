"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion-safe";

/**
 * SobreMarquee — marquee VERTICAL infinito com texto editorial racing.
 *
 * Renderizado entre a foto e a bio em desktop, como elemento decorativo
 * que atravessa o "miolo" da seção. Em mobile, é exibido horizontalmente.
 *
 * Texto: "HILTON LOUREIRO · 76 · NRT · ZX6R · ENDURANCE · 600CC · MASTER"
 *
 * Implementação:
 *   - Wrapper com `overflow-hidden` e altura/largura controlada
 *   - Conteúdo duplicado pra criar loop seamless
 *   - CSS animation no eixo horizontal para evitar RAF do Framer
 *
 * Reduced-motion: vira lista estática vertical sem animação.
 */

const TOKENS = [
  "HILTON LOUREIRO",
  "76",
  "NRT",
  "ZX6R",
  "ENDURANCE",
  "600CC MASTER",
];

const SEPARATOR = "·";

export function SobreMarquee({
  orientation = "vertical",
  className = "",
}: {
  orientation?: "vertical" | "horizontal";
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Tokens duplicados pra loop seamless
  const items = [...TOKENS, ...TOKENS];

  if (reduce) {
    // Reduced-motion: lista estática centralizada
    return (
      <div
        aria-hidden
        className={`flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-[0.35em] text-racing-mute/50 ${className}`}
      >
        {TOKENS.map((token, i) => (
          <span key={i}>
            {token}
            {i < TOKENS.length - 1 && (
              <span className="ml-4 text-racing-red">{SEPARATOR}</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  if (orientation === "vertical") {
    return (
      <div
        aria-hidden
        className={`pointer-events-none relative flex h-full overflow-hidden ${className}`}
      >
        <div
          className="flex flex-col items-center gap-8 font-mono text-xs uppercase tracking-[0.5em] text-racing-mute/40"
        >
          {items.map((token, i) => (
            <span key={i} className="flex flex-col items-center gap-8">
              <span style={{ writingMode: "vertical-rl" }}>{token}</span>
              <span className="text-racing-red">{SEPARATOR}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative flex w-full overflow-hidden ${className}`}
    >
      <div
        className="flex shrink-0 items-center gap-8 whitespace-nowrap font-mono text-xs uppercase tracking-[0.5em] text-racing-mute/40 [animation:marquee-x_44s_linear_infinite]"
      >
        {items.map((token, i) => (
          <span key={i} className="flex items-center gap-8">
            <span>{token}</span>
            <span className="text-racing-red">{SEPARATOR}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
