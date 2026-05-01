/**
 * Metadata da galeria. Cada foto tem um span ("wide" / "narrow") que
 * controla a largura no grid 12-col em lg+, e um aspect-ratio que
 * controla a altura visual.
 *
 * Ordem das fotos é deliberada pra criar layout asymétrico:
 *   Row 1: WIDE  + NARROW
 *   Row 2: NARROW + WIDE
 *   Row 3: WIDE  + NARROW
 *
 * Essa alternância evita o "grid uniforme cansado" e cria ritmo visual.
 *
 * Pra que altura das duas fotos numa mesma row case visualmente:
 *   - WIDE col-span-8 com aspect 3/2  (h ≈ 67% da largura)
 *   - NARROW col-span-4 com aspect 3/4 (h ≈ 133% da largura)
 *   8/12 * 3/2 ≈ 0.5    →  altura proporcional à row width
 *   4/12 * 3/4 ≈ 0.5    →  mesma! por isso casam.
 */

export type GaleriaPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Largura no grid 12-col lg+. */
  span: "wide" | "narrow";
  /** Aspect ratio do card (não da foto). Default: "3/2" pra wide, "3/4" pra narrow. */
  aspect: string;
  objectPosition?: string;
  /** Título curto exibido no canto inferior. */
  caption: string;
  /** Subtexto editorial — local, etapa, evento. */
  context: string;
  /** Etiqueta técnica no canto superior. */
  figLabel: string;
};

export const GALERIA_PHOTOS: GaleriaPhoto[] = [
  // Row 1: WIDE + NARROW
  {
    src: "/photos/galeria/01-panning.jpg",
    alt: "Hilton Loureiro com a moto #76 em alta velocidade — panning shot",
    width: 4747,
    height: 3165,
    span: "wide",
    aspect: "3/2",
    objectPosition: "center 45%",
    caption: "Velocidade",
    context: "Pista — frame curto",
    figLabel: "FIG. 01",
  },
  {
    src: "/photos/galeria/02-podium-evo.jpg",
    alt: "Hilton no pódio do EVO CUP com o punho erguido segurando bandeira",
    width: 2300,
    height: 3243,
    span: "narrow",
    aspect: "8/11",
    objectPosition: "center 25%",
    caption: "Pódio",
    context: "EVO CUP — PB & Nordeste",
    figLabel: "FIG. 02",
  },

  // Row 2: NARROW + WIDE
  {
    src: "/photos/galeria/06-box-nrt.jpg",
    alt: "Hilton ao lado da moto #76 no box NRT, segurando o capacete Sonic",
    width: 900,
    height: 1600,
    span: "narrow",
    aspect: "8/11",
    objectPosition: "center 35%",
    caption: "Box",
    context: "NRT — apoio Brasil da Sorte",
    figLabel: "FIG. 03",
  },
  {
    src: "/photos/galeria/03-pack-corner.jpg",
    alt: "Hilton liderando pack de pilotos numa curva fechada, joelho no chão",
    width: 4234,
    height: 2823,
    span: "wide",
    aspect: "3/2",
    objectPosition: "center 60%",
    caption: "Disputa",
    context: "Curva — pack-leading",
    figLabel: "FIG. 04",
  },

  // Row 3: WIDE + NARROW
  {
    src: "/photos/galeria/04-podium-moto1000.jpg",
    alt: "Hilton no pódio do Moto 1000 GP com troféu, Sonic e bandeira de Alagoas",
    width: 1600,
    height: 1065,
    span: "wide",
    aspect: "3/2",
    objectPosition: "center 30%",
    caption: "Moto 1000 GP",
    context: "Pódio — bandeira de Alagoas",
    figLabel: "FIG. 05",
  },
  {
    src: "/photos/galeria/05-wheelie-alt.jpg",
    alt: "Hilton empinando a moto #76 em pista — outro ângulo",
    width: 1536,
    height: 1024,
    span: "narrow",
    aspect: "8/11",
    objectPosition: "40% 50%",
    caption: "Front-up",
    context: "Pista — empinando",
    figLabel: "FIG. 06",
  },
];
