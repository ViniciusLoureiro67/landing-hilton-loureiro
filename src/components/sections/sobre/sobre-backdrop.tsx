"use client";

import { useRef } from "react";

/**
 * SobreBackdrop — backdrop fixo da seção Sobre, com totem tipográfico.
 *
 * Composição vertical (descobre-se conforme o usuário scrolla a seção):
 *
 *   topo da section ─────────────────────────────
 *                            ┊
 *                          ╔═══╗
 *                          ║76 ║   ← centro (50%)
 *                          ╚═══╝
 *                            ┊
 *                        HILTON       ← ~75% (durante a Timeline,
 *                       LOUREIRO         depois do 76 sair do viewport)
 *                            ┊
 *   fim da section ──────────────────────────────
 *
 * Tudo em `position: absolute` dentro do container que cobre `inset:0` da
 * section. Como a section é alta (~500vh por causa do `SobreTimeline`
 * 300vh), os elementos ficam distribuídos verticalmente e cada um aparece
 * no viewport em momentos diferentes do scroll.
 *
 * Estilo: display font, uppercase, alpha baixíssimo (white/0.04-0.05) —
 * funcionam como textura de fundo, não como elementos de leitura.
 *
 * Estático de propósito: esta seção já possui várias entradas animadas, então
 * o fundo não precisa consumir scroll updates contínuos.
 */
export function SobreBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* "76" gigante — centro vertical da section */}
      <span
        className="absolute left-1/2 top-1/2 select-none font-display leading-[0.78] tracking-[-0.04em] text-racing-white/[0.05]"
        style={{
          fontSize: "clamp(18rem, 35vw, 45rem)",
          transform: "translate(-50%, -50%)",
        }}
      >
        76
      </span>

      {/* "HILTON LOUREIRO" empilhado em 2 linhas — preenche o espaço de
          scroll após o 76 sair do viewport, durante a SobreTimeline.
          Posicionado em ~76% da section pra cair entre o final visível
          do 76 e o fim do scroll.

          `leading-[0.95]`: o 76 usa `leading-[0.78]` por ser linha única,
          mas pra empilhamento real precisa de >= 0.9 senão os caps da
          linha de cima colidem com os caps da linha de baixo (uppercase
          praticamente preenche o em-square inteiro). 0.95 dá respiro
          mínimo sem afastar demais — ainda parece totem denso. */}
      <div
        className="absolute left-1/2 select-none whitespace-nowrap text-center"
        style={{
          top: "76%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <span
          className="block font-display uppercase leading-[0.95] tracking-[-0.03em] text-racing-white/[0.05]"
          style={{ fontSize: "clamp(5.5rem, 13vw, 17rem)" }}
        >
          Hilton
        </span>
        <span
          className="block font-display uppercase leading-[0.95] tracking-[-0.03em] text-racing-white/[0.04]"
          style={{ fontSize: "clamp(5.5rem, 13vw, 17rem)" }}
        >
          Loureiro
        </span>
      </div>

      {/* Speedlines diagonais sutis — reforço editorial */}
      <div
        aria-hidden
        className="hero-speedlines pointer-events-none absolute inset-0 opacity-40"
      />

      {/* Vinheta sutil topo/baixo pra integrar com o hero acima e a próxima
          seção abaixo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-racing-blue-deep to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-racing-blue-deep to-transparent"
      />
    </div>
  );
}
