# Sprint 4 — Temporada 2026

> **Gate Plan = Livre** ✅

---

## Fase 1 — Scope

### Objetivo

Criar a seção `#temporada` apresentando o **calendário oficial Moto1000GP 2026** (8 etapas) com **mapa do Brasil estilizado em SVG** + **lista editorial** + **counter de etapas restantes** + **scrollytelling pinned** (scroll avança etapas no mapa). Persona-alvo: patrocinador percebendo alcance nacional.

### Contexto

Sprint 4 do brief (`tasks/00-brief.md` §5 e §8). S1–S3 entregues e mergeados em `main`. Padrão técnico já estabelecido pelos componentes de Hero/Sobre (Server orquestrador + Clients pequenos + hooks locais). Esta seção é **comercialmente crítica** porque traduz "alcance" de forma visual pra patrocinador antes do CTA forte do S6 (Patrocínio).

### Escopo

- **Heading** "TEMPORADA 2026" + slash vermelho + subtítulo Moto1000GP (Campeonato Brasileiro de Motovelocidade)
- **Counter** dinâmico: "Próxima etapa: DD/MM — Cidade (UF)" + "N etapas restantes em 2026" (computado via `Date.now()` no client)
- **Mapa SVG estilizado** do Brasil (silhueta minimalista, sem desenhar estados) com 8 pinos posicionados via projeção lon/lat → viewBox
- Pinos: numerados (1–8), com **estado visual** `past` (silenciado) / `next` (pulse vermelho) / `upcoming` (azul claro)
- Pinos sobrepostos (Interlagos 2× e Goiânia 2×) tratados como cluster com badge "×2"
- **Lista editorial** das 8 etapas (round, data, circuito, cidade/UF) com mesmos estados past/next/upcoming
- **Sincronização** mapa ↔ lista: hover/click em pino destaca item da lista (e vice-versa)
- **Scrollytelling pinned** (desktop): mapa fica sticky enquanto a lista é rolada; o pino "ativo" muda conforme o usuário rola pelos cards
- **Mobile fallback**: sem pinning, mapa empilhado acima da lista, interação por tap
- Reuso dos utilitários `racing-number-bg`, `racing-slash`, `[data-reveal]`
- Scroll-reveal staggered + `prefers-reduced-motion` honrado

### Não-escopo

- Galeria de fotos das corridas (Sprint 5)
- CTA de patrocínio (Sprint 6)
- Modal de detalhes da etapa (preço de ingresso, transmissão) — fora do brief
- Dependências novas (`react-simple-maps`, `topojson`, `mapbox-gl`, etc.) — desnecessárias para uma silhueta minimalista
- Mapa geográfico realista com estados desenhados (escolha de design já tomada: estilizado)
- Easter egg Sonic na seção (S8 polish)
- Timeline visual de resultados/pódios por etapa (não tem dados da temporada ainda)

### Critérios de aceite

- [ ] Seção `#temporada` visível e acessível via navbar (link já existe em `Navbar.tsx`)
- [ ] Heading "TEMPORADA 2026" + slash + subtítulo
- [ ] Counter exibe "Próxima etapa" e número de restantes coerentes com `new Date()` no client
- [ ] Mapa SVG renderizado sem dependência externa, viewBox responsivo
- [ ] 8 pinos visíveis (clusters quando sobrepostos), com label do round
- [ ] Estado visual `past` / `next` / `upcoming` correto na data atual
- [ ] Lista das 8 etapas com mesmos estados (round, data formatada pt-BR, cidade/UF, circuito)
- [ ] Hover em pino destaca item correspondente; hover em item destaca pino
- [ ] Scrollytelling pinned no desktop (`lg:` ↑) — mapa sticky, lista rola, pino ativo muda
- [ ] Mobile: empilhado, sem pinning, sem perda de informação
- [ ] Responsivo 375 / 768 / 1024 / 1440
- [ ] `prefers-reduced-motion` desativa pulsação dos pinos e o sync sticky entra com fade simples
- [ ] Contraste WCAG AA em todos os textos (especialmente labels nos pinos)
- [ ] `npm run build` e `npm run lint` zero erros
- [ ] Sem novas dependências em `package.json`

### Premissas ⚠️

- ✅ Calendário fornecido pelo cliente **em 29/04/2026** com 8 etapas. Atualização posterior (mesmo dia) confirmou a etapa 3 (05/07) em **Curvelo (MG)**, então não há mais TBD ativa.
- ℹ️ O type `StageStatus` mantém o variant `tbd` e o card sabe renderizar "A definir", para qualquer alteração futura no calendário (entra naturalmente sem refactor).
- ⚠️ Datas tratadas como `YYYY-MM-DD` em UTC (sem horário) — comparação com `Date.now()` usa timezone do browser, suficiente para o nível "passou × não passou"
- ⚠️ Coordenadas das cidades-sede (Interlagos, Goiânia, Cascavel, Santa Cruz do Sul, Cuiabá, Curvelo) são aproximações geográficas — não é mapa de pista, é mapa nacional

### Bloqueadores / perguntas ao usuário

Nenhum bloqueador hard. Soft:

1. Logo do Moto1000GP — não temos vetorial. **Decisão**: usar apenas tipografia ("MOTO1000GP" em font-heading) na seção, sem logo. Quando o cliente entregar SVG, trocar.

---

## Fase 2 — Evidências

| Arquivo | Por quê |
|---------|---------|
| `src/app/page.tsx` (`<section id="temporada">`) | Placeholder atual a substituir |
| `src/components/sections/sobre/index.tsx` | Padrão de seção (server orquestrador + clients) |
| `src/components/sections/sobre/sobre-stats.tsx` | Pattern de counter animado com `useInView` + spring |
| `src/components/sections/sobre/sobre-timeline.tsx` | Pattern de scrollytelling pinned |
| `src/components/sections/hero/hero-parallax-scene.tsx` | Pattern `useScroll` + `useTransform` |
| `src/app/globals.css` | Tokens racing + utilitários reutilizáveis |
| `src/components/Navbar.tsx` (linha 23) | Confirma âncora `#temporada` |
| `tasks/00-brief.md` §5/§8 | Brief original — calendário + mapa do Brasil |

---

## Fase 3 — Decisões de design

### 3.1 Estilo do mapa

**SVG estilizado, silhueta minimalista do Brasil — desenhada via `<path>` simplificado.**

- Sem dependências (`react-simple-maps`, `topojson`, etc.)
- Sem desenho de estados (escolha do usuário no /plan)
- Path com ~25-35 pontos chave da costa + fronteira oeste
- viewBox = `0 0 800 900` (proporção próxima 8:9 que respeita o Brasil real)
- Stroke `--racing-blue-bright` 1.5px (silhueta), fill `--racing-blue` opacity 12% (massa do país)
- Pinos posicionados via função `project(lat, lon)` com bounding box geográfico real:
  - lon ∈ [-74, -34] → x ∈ [0, 800]
  - lat ∈ [5.3, -33.8] → y ∈ [0, 900]

### 3.2 Pinos

| Estado | Visual | Quando |
|--------|--------|--------|
| `past` | círculo `--racing-mute` 8px + número branco 60% | data já ocorreu |
| `next` | círculo `--racing-red` 14px + ring pulsante + número branco 100% | primeira etapa futura |
| `upcoming` | círculo `--racing-blue-bright` 10px + número branco 90% | etapas futuras (não a próxima) |
| `cluster` | mesmo estilo do estado dominante + badge `×2` no canto superior direito | quando 2+ etapas no mesmo local |

Pinos têm `aria-label` descrevendo round + data + cidade. Estado `next` recebe `aria-current="step"`.

### 3.3 Lista das etapas (cards)

Cada etapa é um card compacto:

```
┌──────────────────────────────────────────────┐
│  [Round 03]                          12 ABR  │
│  INTERLAGOS                          São Paulo · SP
│  ─── Autódromo José Carlos Pace             │
└──────────────────────────────────────────────┘
```

- Round em font-mono pequeno + estado (`past` strike-through suave / `next` borda vermelha + chevron)
- Data em `DD MMM` (português) + ano implícito
- Cidade em font-heading uppercase
- Circuito em font-sans regular (subtítulo)
- Estado `past`: opacity 50%, sem hover
- Estado `next`: borda esquerda 2px vermelha + label "PRÓXIMA"
- Estado `upcoming`: hover com slash diagonal vermelho (decoração de canto)
- Card com `data-stage-id={id}` para sincronizar com mapa

### 3.4 Etapa "a definir" (variant `tbd`)

- Atualmente **nenhuma etapa** está em status `tbd` — a etapa 3 foi confirmada em Curvelo (MG) na atualização do cliente
- O variant `tbd` continua suportado no código:
  - **Não renderiza pino no mapa** (sem `lat/lon`)
  - **Aparece na lista** com badge amarelo "A definir" + circuito em itálico
  - Quando o cliente confirmar uma futura mudança, basta editar `temporada-data.ts` (lat/lon + city/state/circuit)

### 3.5 Counter "etapas restantes"

- Computa no client (`useEffect` ou hook `useNextStage()`) baseado em `Date.now()`
- Mostra: **"Próxima: DD/MM · Cidade · UF"** + **"N de 8 etapas restantes"**
- Number em font-mono, label em font-heading uppercase
- Em `prefers-reduced-motion`, mostra valor final direto sem contagem

### 3.6 Scrollytelling pinned

- **Desktop (`lg:` ↑)**: usa `position: sticky` no container do mapa + `IntersectionObserver` em cada card da lista (com `rootMargin` calibrado pra ativar no centro da viewport)
- O pino correspondente ao card ativo recebe destaque (anel maior + brilho)
- **Mobile/tablet**: `position: relative` (sem pinning), interação só por tap
- **Reduced motion**: sem pinning visual (mapa relativo e bem posicionado), sync por click apenas

### 3.7 Tokens / paleta

| Elemento | Token |
|----------|-------|
| Background da seção | `--racing-blue-deep` (continuidade) |
| Silhueta do mapa (stroke) | `--racing-blue-bright` |
| Fill do país | `--racing-blue` opacity 12% |
| Pino past | `--racing-mute` |
| Pino next | `--racing-red` (com ring pulsante) |
| Pino upcoming | `--racing-blue-bright` |
| Linha de conexão entre pinos (cronologia) | `--racing-white` opacity 8% |
| Card past | borda `--racing-white` 5%, opacity 50% |
| Card next | borda esquerda `--racing-red` 2px |
| Card upcoming | borda `--racing-white` 8% |
| Slash header | `--racing-red` |

### 3.8 Animações (Framer Motion + CSS keyframes)

| Timing | Elemento | Animação | Reduced-motion |
|--------|----------|----------|----------------|
| Scroll entry | Heading + slash | translateY 24px → 0, 400ms ease-out | Fade 200ms |
| Scroll entry | Counter | translateY 16px → 0 + spring counter (1.2s) | Valor final direto |
| Scroll entry | Mapa | scale 0.96 → 1 + opacity 0 → 1, 600ms | Fade |
| Pinos (loop) | next | ring pulse 1.6s ease-in-out infinite (CSS) | Estático |
| Hover pino | qualquer | scale 1.15 + raised z-index, 200ms | Sem efeito |
| Card ativo (scrolly) | upcoming | borda `--racing-blue-bright` glow, 300ms | Estático |

### 3.9 Responsividade

| Breakpoint | Layout |
|------------|--------|
| **375px** | Vertical: heading → counter → mapa full-width (max h-80) → lista vertical |
| **768px** | Heading + counter inline, mapa centralizado (max-w-md), lista 2 colunas |
| **1024px** | Grid 12-col: mapa 6 cols sticky à esquerda + lista 6 cols rolando à direita (scrollytelling) |
| **1440px** | Idem 1024 com max-w-7xl + gutters generosos |

### 3.10 Acessibilidade

| Item | Implementação |
|------|---------------|
| Mapa | `<svg role="img" aria-label="Mapa do Brasil com 8 etapas do Moto1000GP 2026">` |
| Lista | `<ol>` semântico com `aria-label="Calendário Moto1000GP 2026"` |
| Pino | `<button>` (não `<g>` clicável) com `aria-label="Etapa 1, 12 de abril, Interlagos, São Paulo. Já realizada."` |
| Estado `next` | `aria-current="step"` no pino e no card |
| Focus visible | ring `--racing-blue-bright` em todos os botões de pino e card |
| Contraste | `--racing-white` 90% sobre `--racing-blue-deep` ≈ 14:1 ✅; pino `--racing-red` sobre fundo escuro ≈ 5:1 ✅ |
| `prefers-reduced-motion` | Desliga pulse do pino, scrollytelling reduz a sync simples |

---

## Fase 4 — Checklist de execução (em ordem)

1. **Data layer** — `temporada-data.ts` exporta `STAGES` (8 etapas) + helpers (`projectLatLon`, `getStageStatus`, `useNextStage`, agrupamento de clusters)
2. **Server orquestrador** — `src/components/sections/temporada/index.tsx`
3. **Heading** — `temporada-heading.tsx` (título + slash + subtítulo)
4. **Counter** — `temporada-counter.tsx` (próxima etapa + N restantes, client com data dinâmica)
5. **Mapa SVG + pinos** — `temporada-map.tsx` (silhueta + projeção + pinos client com estado e hover)
6. **Lista** — `temporada-list.tsx` + `temporada-stage-card.tsx` (cards com estado past/next/upcoming)
7. **Sincronização** — `use-temporada-sync.ts` (hook que conecta hover/active state mapa ↔ lista via React Context local)
8. **Scrollytelling** — `temporada-scrolly.tsx` (IntersectionObserver com `rootMargin` ajustado, atualiza activeStageId)
9. **Integração** — substituir `<section id="temporada">` placeholder em `src/app/page.tsx`
10. **A11y + responsivo** — alt/aria + breakpoints + reduced-motion
11. **Validação** — `npm run lint` + `npm run build` zero erros
12. **Commits atômicos** — um por componente lógico, mensagens em pt-BR, sem `Co-Authored-By`
13. **Push + PR** — branch `feat/temporada-2026` para `main`

---

## Fase 5 — Detalhamento

### 5.1 Estrutura de arquivos

```
src/components/sections/temporada/
├── index.tsx                     # Server orquestrador
├── temporada-data.ts             # 8 etapas + helpers
├── temporada-heading.tsx         # Client — título + slash + subtítulo
├── temporada-counter.tsx         # Client — próxima etapa + restantes
├── temporada-map.tsx             # Client — SVG Brasil + pinos
├── temporada-list.tsx            # Client — wraps cards
├── temporada-stage-card.tsx      # Client — card individual
├── temporada-scrolly.tsx         # Client — pinning + sync de scroll
├── temporada-context.tsx         # Client — Context para active/hovered stage
└── use-temporada-sync.ts         # Client — hook utilitário
```

### 5.2 Data shape

```ts
type StageStatus = "past" | "next" | "upcoming" | "tbd";

type Stage = {
  id: string;             // "round-01", "round-02", ...
  round: number;          // 1..8
  date: string;           // "2026-04-12"
  city: string;           // "São Paulo" / "A definir"
  state: string;          // "SP" / "—"
  circuit: string;        // "Autódromo José Carlos Pace (Interlagos)"
  lat: number | null;     // null se TBD
  lon: number | null;     // null se TBD
};

type StageWithStatus = Stage & {
  status: StageStatus;
  formattedDate: string;  // "12 ABR" pt-BR
};
```

### 5.3 Calendário Moto1000GP 2026 (fornecido pelo cliente)

| Round | Data | Circuito | Cidade | UF | Lat | Lon |
|-------|------|----------|--------|----|----|----|
| 1 | 12/04 | Autódromo José Carlos Pace (Interlagos) | São Paulo | SP | -23.7014 | -46.6969 |
| 2 | 24/05 | Autódromo Internacional de Goiânia | Goiânia | GO | -16.7016 | -49.2532 |
| 3 | 05/07 | Autódromo Internacional de Curvelo | Curvelo | MG | -18.7569 | -44.4314 |
| 4 | 02/08 | Autódromo de Cascavel | Cascavel | PR | -24.9555 | -53.4552 |
| 5 | 22/08 | Autódromo José Carlos Pace (Interlagos) | São Paulo | SP | -23.7014 | -46.6969 |
| 6 | 27/09 | Autódromo Internacional de Santa Cruz do Sul | Santa Cruz do Sul | RS | -29.7178 | -52.4258 |
| 7 | 08/11 | Autódromo Internacional de Cuiabá | Cuiabá | MT | -15.6014 | -56.0979 |
| 8 | 06/12 | Autódromo Internacional de Goiânia | Goiânia | GO | -16.7016 | -49.2532 |

**Clusters automáticos:**
- Interlagos = round 1 + round 5 (cluster ×2)
- Goiânia = round 2 + round 8 (cluster ×2)
- Curvelo, Cascavel, Santa Cruz do Sul, Cuiabá = pinos individuais

### 5.4 Projeção lat/lon → SVG

```ts
const BBOX = { latMin: -33.8, latMax: 5.3, lonMin: -74, lonMax: -34 };
const SVG = { width: 800, height: 900 };

function projectLatLon(lat: number, lon: number) {
  const x = ((lon - BBOX.lonMin) / (BBOX.lonMax - BBOX.lonMin)) * SVG.width;
  const y = ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * SVG.height;
  return { x, y };
}
```

Verificações rápidas com os 5 locais:
- Interlagos (-23.7, -46.7) → (~546, ~669) ✅ (sudeste, centro-leste)
- Goiânia (-16.7, -49.3) → (~494, ~507) ✅ (centro)
- Cascavel (-25.0, -53.5) → (~410, ~700) ✅ (sul)
- Santa Cruz do Sul (-29.7, -52.4) → (~432, ~810) ✅ (extremo sul)
- Cuiabá (-15.6, -56.1) → (~358, ~482) ✅ (centro-oeste)

### 5.5 Path simplificado do Brasil (silhueta)

Path com 30+ pontos significativos da costa e fronteira (Norte → NE → E → SE → S → SO → O → NO). Renderizado como:

```svg
<path
  d="M ..."
  fill="oklch(0.28 0.12 254 / 0.12)"
  stroke="var(--racing-blue-bright)"
  stroke-width="1.5"
  stroke-linejoin="round"
/>
```

Os pontos são gerados a partir de coordenadas reais conhecidas, projetadas pela mesma `projectLatLon`. Lista de pontos (lat, lon) aproximados:

```
NORTE/NE
( 4.5, -51.6)  Cabo Orange (AP)
( 1.4, -48.5)  Belém (PA)
(-2.5, -44.3)  São Luís (MA)
(-5.0, -36.4)  RN costa
(-7.1, -34.8)  João Pessoa
(-8.0, -34.9)  Recife
(-12.0, -38.5) Salvador
(-15.8, -38.9) Porto Seguro
(-20.3, -40.3) Vitória
(-22.9, -43.2) Rio de Janeiro
(-23.6, -46.6) Santos/SP litoral
SUL
(-25.4, -48.5) Paranaguá
(-27.6, -48.5) Florianópolis
(-29.0, -49.7) RS litoral
(-32.0, -52.1) Rio Grande
(-33.8, -53.4) Chuí (extremo sul)
SO/O (fronteira)
(-30.0, -57.6) Uruguaiana (RS)
(-25.5, -54.6) Foz do Iguaçu (PR)
(-23.9, -55.0) MS-PY
(-19.6, -57.7) Corumbá (MS)
(-15.5, -60.0) Cáceres (MT)
(-11.0, -68.7) AC (extremo oeste)
( -7.5, -73.7) Cruzeiro do Sul (AC)
NW/N
( -2.5, -69.6) Tabatinga (AM)
(  0.5, -66.8) São Gabriel da Cachoeira
(  2.5, -60.7) Boa Vista (RR)
(  4.5, -60.0) Pacaraima (RR)
(  3.0, -55.5) Norte AP
(  4.5, -51.6) volta Cabo Orange
```

### 5.6 Sync mapa ↔ lista (Context)

```tsx
type TemporadaContextValue = {
  hoveredId: string | null;
  activeId: string | null;
  setHoveredId: (id: string | null) => void;
  setActiveId: (id: string | null) => void;
};
```

- `hoveredId`: vem de hover/focus em pino ou card → highlight visual no outro lado
- `activeId`: vem do `IntersectionObserver` no scrollytelling (desktop) ou click (mobile)
- Pino "ativo" tem prioridade visual sobre `next` (mas não muda o estado semântico)

### 5.7 Scrollytelling (IntersectionObserver)

```tsx
useEffect(() => {
  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveId(visible.target.dataset.stageId ?? null);
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
  );
  cards.forEach((c) => obs.observe(c));
  return () => obs.disconnect();
}, []);
```

- `rootMargin: -40% 0px -40% 0px` cria uma "faixa central" de 20% da viewport — só dispara quando o card está nessa faixa
- Apenas em desktop (`window.matchMedia("(min-width: 1024px)")`); em mobile o sticky/sync passa a ser por click

### 5.8 Mensagens de commit (sem Co-Authored-By)

Seguir o estilo dos commits anteriores (`✨ feat(...): ...`):

1. `✨ feat(temporada): data layer e calendário Moto1000GP 2026`
2. `✨ feat(temporada): heading com slash e subtítulo`
3. `✨ feat(temporada): counter de próxima etapa e restantes`
4. `✨ feat(temporada): mapa SVG estilizado do Brasil com pinos`
5. `✨ feat(temporada): lista editorial das 8 etapas`
6. `✨ feat(temporada): sincronização mapa ↔ lista via Context`
7. `✨ feat(temporada): scrollytelling pinned em desktop`
8. `✨ feat(temporada): integrar seção em page.tsx`

(Posso consolidar em commits maiores se ficar repetitivo — manter atomicidade sem fragmentar demais.)

---

## Fase 6 — Riscos

| Risco | Mitigação |
|-------|-----------|
| Path do Brasil ficar feio/distorcido | Iterar sobre o path em incrementos visuais; preferir under-detail (silhueta mais simples) a over-detail bagunçado |
| Pinos sobrepostos (Interlagos/Goiânia) ilegíveis | Cluster com badge "×2" + tooltip listando os 2 rounds |
| Scrollytelling causar jank em mobile | Não habilitar sticky em mobile; só desktop (`lg:` ↑) |
| Etapa "a definir" quebrar layout do mapa | Não renderiza pino; aparece só na lista com nota visual |
| `Date.now()` no SSR causar hydration mismatch | Hook `useNextStage` no client com `useState`+`useEffect`, render inicial sem assumir data |
| `prefers-reduced-motion` não cobrir tudo | `useReducedMotion()` no Counter, no pulse e no scrolly |

---

**Próximo passo:** executar Fase 4 em ordem, commitando em pontos lógicos.
