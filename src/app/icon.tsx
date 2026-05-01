import { ImageResponse } from "next/og";

/**
 * Favicon dinâmico — gerado em build time via `next/og` (Satori).
 *
 * Design: "76" centralizado em fundo azul-deep, com "7" em azul-bright
 * e "6" em vermelho — espelhando o wordmark do navbar (HILTON 76 com
 * o "76" partido em duas cores). Limpo, sem ornamentos que viram
 * artefato em 32×32.
 *
 * Cores em sRGB (Satori não suporta `oklch()`):
 *   - racing-blue-deep   → #101524
 *   - racing-blue-bright → #3D5BF0
 *   - racing-red         → #D63B26
 *
 * Next 13+: `icon.tsx` substitui o favicon padrão e injeta
 * `<link rel="icon">` no head automaticamente.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#101524",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: 900,
          fontSize: 24,
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        <span style={{ display: "flex", color: "#3D5BF0" }}>7</span>
        <span style={{ display: "flex", color: "#D63B26" }}>6</span>
      </div>
    ),
    { ...size }
  );
}
