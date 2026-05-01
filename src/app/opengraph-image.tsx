import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Open Graph image — preview que aparece em WhatsApp, Twitter, Discord,
 * Slack e qualquer plataforma que use og:image. Gerado em build time
 * via `next/og` (Satori) com a foto de panning shot + brand stack
 * "HILTON LOUREIRO 76" + tagline.
 *
 * Tamanho 1200×630 (proporção 1.91:1) — formato Open Graph padrão.
 * Plataformas que cropam pra quadrado (WhatsApp) pegam o centro, então
 * `objectPosition: 60% 45%` mantém o piloto+moto visível na crop.
 *
 * Cores em sRGB (Satori não suporta `oklch()`):
 *   - racing-blue-deep   → #101524
 *   - racing-blue-bright → #3D5BF0
 *   - racing-red         → #D63B26
 *
 * Next 13+: o arquivo `app/opengraph-image.tsx` injeta automaticamente
 * `<meta property="og:image">` e `<meta name="twitter:image">` no head.
 */

export const alt =
  "Hilton Loureiro 76 — Piloto profissional, Bicampeão Brasileiro Endurance 600cc";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // Carrega a foto como base64 — embutida na imagem gerada, sem
  // dependência de URL externa em runtime (importante pra deploy).
  const photoBuffer = readFileSync(
    join(process.cwd(), "public/photos/galeria/01-panning.jpg")
  );
  const photoSrc = `data:image/jpeg;base64,${photoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          background: "#101524",
        }}
      >
        {/* Foto de fundo — panning shot. objectPosition 65% 45% mantém
            o piloto+moto visíveis mesmo em crops quadradas. */}
        <img
          src={photoSrc}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "65% 45%",
          }}
        />

        {/* Vinheta de baixo pra cima — escurece pra dar legibilidade ao texto. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, rgba(16,21,36,0.2) 25%, rgba(16,21,36,0.6) 65%, rgba(16,21,36,0.97) 100%)",
          }}
        />

        {/* Tint vermelho leve do canto direito superior — acento racing. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            width: "45%",
            height: "100%",
            background:
              "linear-gradient(225deg, rgba(214,59,38,0.18) 0%, rgba(16,21,36,0) 60%)",
          }}
        />

        {/* Content stack — kicker no topo, título + subtítulo no rodapé. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            padding: "72px",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* Kicker editorial */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#D63B26",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 48,
                height: 2,
                background: "#D63B26",
              }}
            />
            <div style={{ display: "flex" }}>
              NRT-2026 · Moto1000GP · 600cc Master
            </div>
          </div>

          {/* Headline + subtitle */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontSize: 112,
                fontWeight: 900,
                letterSpacing: -4,
                textTransform: "uppercase",
                color: "#FFFFFF",
                lineHeight: 0.88,
              }}
            >
              <span style={{ display: "flex", marginRight: 24 }}>
                Hilton Loureiro
              </span>
              <span style={{ display: "flex", color: "#3D5BF0" }}>76</span>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 500,
                color: "rgba(255,255,255,0.82)",
                marginTop: 28,
                letterSpacing: -0.5,
              }}
            >
              Bicampeão Brasileiro Endurance · Próxima largada 2026
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
