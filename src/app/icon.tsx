import { ImageResponse } from "next/og";

/**
 * Favicon dinâmico — gerado em build time via `next/og` (Satori).
 *
 * Design: "76" centralizado em fundo azul-deep, com slash vermelho
 * atravessando o "7" — versão miniatura do wordmark do hero. Sem
 * dependência de font externa (usa system stack pra resolução
 * confiável em 32×32).
 *
 * Cores em sRGB (Satori não suporta `oklch()`), aproximando os
 * tokens de `globals.css`:
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
          color: "#3D5BF0",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: 900,
          fontSize: 22,
          letterSpacing: -1,
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          7
          <span
            style={{
              position: "absolute",
              left: "42%",
              top: 1,
              bottom: 1,
              width: 3,
              background: "#D63B26",
              transform: "rotate(18deg)",
              transformOrigin: "center",
              borderRadius: 1,
            }}
          />
        </span>
        <span style={{ color: "#D63B26", display: "flex" }}>6</span>
      </div>
    ),
    { ...size }
  );
}
