import { ImageResponse } from "next/og";

/**
 * Apple touch icon — versão 180×180 do favicon, com mais respiro
 * para a sigla "76" e o wordmark mini "HILTON" em cima.
 *
 * Cores em sRGB (Satori não suporta `oklch()`).
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
          color: "#3D5BF0",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: -2,
          lineHeight: 1,
          padding: 18,
        }}
      >
        <span
          style={{
            fontSize: 22,
            letterSpacing: 8,
            color: "#F6F6F6",
            opacity: 0.85,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Hilton
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 124,
          }}
        >
          <span style={{ position: "relative", display: "flex" }}>
            7
            <span
              style={{
                position: "absolute",
                left: "44%",
                top: 6,
                bottom: 6,
                width: 12,
                background: "#D63B26",
                transform: "rotate(18deg)",
                transformOrigin: "center",
                borderRadius: 2,
                boxShadow: "0 0 18px 2px #D63B26",
              }}
            />
          </span>
          <span style={{ color: "#D63B26", display: "flex" }}>6</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
