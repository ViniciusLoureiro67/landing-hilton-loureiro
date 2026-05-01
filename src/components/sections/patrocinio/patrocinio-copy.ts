/**
 * Copy centralizada da seção #patrocinio (pt-BR).
 *
 * Itens marcados com TODO(cliente) precisam de validação antes do deploy
 * — números são placeholders plausíveis baseados na temporada Moto1000GP
 * 2026 + estimativas. Substituir quando o cliente confirmar.
 */

export const PATROCINIO_COPY = {
  kicker: "05 / Para sua marca",
  heading: "Para sua marca",
  subtitle:
    "Patrocinar o Hilton 76 é estar em pista nacional, oito vezes em 2026.",
  pullQuote: {
    a: "Oito etapas.",
    b: "Cobertura nacional.",
    c: "Um número.",
  },
  paragraphs: [
    "Hilton Loureiro corre o Campeonato Brasileiro Moto1000GP 2026 com presença em oito etapas distribuídas entre São Paulo, Goiânia, Curvelo, Cascavel, Santa Cruz do Sul e Cuiabá. Todas com transmissão ao vivo e cobertura editorial.",
    "Patrocinar é mais que estar na livery. É aparecer em capacete, macacão, moto, transmissão ao vivo, redes sociais, paddock e conteúdo editorial — em oito fins de semana de circuito ao longo do ano.",
    "Um portfólio enxuto de marcas-parceiras já está na temporada atual.",
  ],
  sponsorsLabel: "Quem já está na livery 2026",
  // Todos os 4 sponsors com logo real. `aspect` = largura/altura intrínseca.
  // `widthPct` = % da largura do card que o logo ocupa (tuning visual:
  // logos com letras "thick" precisam de menos largura que letras "thin",
  // pra todos terem peso visual similar).
  sponsors: [
    {
      name: "Garagem 57",
      logoSrc: "/sponsors/garagem-57.svg",
      href: "https://www.instagram.com/garagem57mcz/",
      // Wordmark sem bandeira: viewBox cropado 1740×220, aspect ~7.9
      aspect: 1740 / 220,
      widthPct: 90,
    },
    {
      name: "Formafit",
      logoSrc: "/sponsors/formafit-clean.png",
      href: "https://www.instagram.com/formafitmaceio/",
      // Portrait — limite de altura é o constraint (não largura)
      aspect: 495 / 616,
      widthPct: 50,
    },
    {
      name: "AC Vitha Clinic",
      logoSrc: "/sponsors/vitha-clinic.svg",
      href: "https://www.instagram.com/draanaclaudialoureiro/",
      aspect: 740 / 502,
      // Letras "thin" elegantes — pode ser maior pra ter presença
      widthPct: 80,
    },
    {
      name: "Brasil da Sorte",
      logoSrc: "/sponsors/brasil-da-sorte.svg",
      href: "https://www.instagram.com/brasildasortebet/",
      aspect: 481.89 / 226.772,
      // Letras "thick" e "B" denso — não precisa ser tão grande
      widthPct: 78,
    },
  ],
  cta: {
    pullHeadline: "Sua marca cabe aqui.",
    button: "Falar sobre patrocínio",
    reassure: "Resposta direta com o piloto. Sem intermediário.",
  },
};

export type AtivacaoIcon =
  | "shield"
  | "shirt"
  | "bike"
  | "tv"
  | "megaphone"
  | "map-pin"
  | "clapperboard";

export type Ativacao = {
  index: string;
  icon: AtivacaoIcon;
  title: string;
  description: string;
};

export const ATIVACOES: Ativacao[] = [
  {
    index: "01",
    icon: "shield",
    title: "Capacete",
    description:
      "Slot premium em close de câmera no grid, na largada e na premiação. A peça mais filmada do fim de semana.",
  },
  {
    index: "02",
    icon: "shirt",
    title: "Macacão esportivo",
    description:
      "Logos no peito, ombro e costas. Pódio, entrevistas pós-corrida e foto oficial da equipe.",
  },
  {
    index: "03",
    icon: "bike",
    title: "Carenagem da moto #76",
    description:
      "Adesivagem em carenagem, rabeta e sub-frame. Posições por cota e plano de mídia.",
  },
  {
    index: "04",
    icon: "tv",
    title: "Transmissão ao vivo",
    description:
      "Visibilidade nos broadcasts oficiais das 8 etapas — TV aberta, canais esportivos e streaming.",
  },
  {
    index: "05",
    icon: "megaphone",
    title: "Redes sociais",
    description:
      "Instagram do piloto + cobertura de bastidores em Reels e Stories durante toda a semana de corrida.",
  },
  {
    index: "06",
    icon: "map-pin",
    title: "Box e paddock",
    description:
      "Hospitalidade no box, ações com clientes e relacionamento com a imprensa em até 2 etapas/ano.",
  },
  {
    index: "07",
    icon: "clapperboard",
    title: "Conteúdo de bastidores",
    description:
      "Vídeos pós-corrida, entrevistas e foto-conteúdo editorial co-assinados com a marca patrocinadora.",
  },
];

/**
 * 3 stats massivos. TODO(cliente): confirmar valores reais.
 *
 * - 8 etapas em 2026 (já confirmado via temporada-data.ts)
 * - 2.000.000 impressões previstas — TODO(cliente)
 * - 50.000 audiência em redes — TODO(cliente)
 *
 * displaySuffix é renderizado fora do FlipCounter (que só anima dígitos).
 */
export type PatrocinioStat = {
  index: string;
  value: number;
  displayPrefix?: string;
  displaySuffix?: string;
  label: string;
  ariaLabel: string;
};

export const PATROCINIO_STATS: PatrocinioStat[] = [
  {
    index: "01",
    value: 8,
    label: "Etapas em 2026",
    ariaLabel: "8 etapas no Campeonato Brasileiro Moto1000GP 2026",
  },
  {
    index: "02",
    value: 2,
    displaySuffix: "M+",
    label: "Impressões previstas",
    ariaLabel: "Mais de 2 milhões de impressões previstas na temporada",
  },
  {
    index: "03",
    value: 50,
    displaySuffix: "K+",
    label: "Audiência em redes",
    ariaLabel: "Mais de 50 mil seguidores agregados em redes sociais",
  },
];
