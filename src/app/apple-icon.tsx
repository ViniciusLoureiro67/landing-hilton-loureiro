import { ImageResponse } from "next/og";

/**
 * Apple touch icon — versão 180×180 com mais respiro pra mostrar
 * "HILTON" em cima do "76". Mesmo design do favicon limpo (sem o
 * slash rotacionado que virava artefato em escala pequena).
 *
 * Cores em sRGB (Satori não suporta `oklch()`):
 *   - racing-blue-deep   → #101524
 *   - racing-blue-bright → #3D5BF0
 *   - racing-red         → #D63B26
 *
 * Next 13+: `apple-icon.tsx` substitui `apple-touch-icon.png`,
 * usado quando o usuário adiciona o site à tela inicial em iOS.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 35%, #1F2840 0%, #101524 70%)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: 900,
          textTransform: "uppercase",
          lineHeight: 1,
          padding: 18,
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            color: "#F6F6F6",
            opacity: 0.85,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          Hilton
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 124,
            letterSpacing: -4,
          }}
        >
          <span style={{ display: "flex", color: "#3D5BF0" }}>7</span>
          <span style={{ display: "flex", color: "#D63B26" }}>6</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
