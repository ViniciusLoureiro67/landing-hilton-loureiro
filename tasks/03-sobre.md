# Sprint 3 — Seção Sobre + Palmarés

> **Gate Plan = Livre** ✅

---

## Fase 1 — Scope

### Objetivo

Criar a seção `#sobre` com bio editorial em 3ª pessoa, foto principal com parallax leve, stats animados e timeline de palmarés — respeitando o contraste editorial com o hero (mais calmo, mais respirável).

### Contexto

Sprint 3 do brief (`tasks/00-brief.md`). O hero (S2) está completo e serviu de referência técnica para padrão de componentes, Framer Motion, responsividade e acessibilidade.

### Escopo

- Bio de Hilton (3 parágrafos, 3ª pessoa, pt-BR)
- Foto principal (`06-curb-brasil-flag.jpg`) com parallax de scroll + clip diagonal
- Stats animados (3–4 indicadores)
- Palmarés em timeline visual (2016–2025)
- Número 76 como grafismo de fundo (reutilizar utility `racing-number-bg`)
- Slash diagonal vermelho como separador
- Scroll-reveal animado + contadores

### Não-escopo

- Galeria de fotos (Sprint 5)
- Vídeo embutido
- CTA de patrocínio (Sprint 6)
- Novas dependências npm
- Alteração de tokens globais

### Critérios de aceite

- [ ] Seção `#sobre` visível e acessível via navbar
- [ ] Bio em 3 parágrafos sem palavras banidas (ver lista abaixo)
- [ ] Foto renderizada com `next/image`, `priority: false`, aspect ratio mantido
- [ ] Stats (4 números) animam de 0 ao valor real on viewport entry
- [ ] Timeline de palmarés legível e esteticamente consistente
- [ ] Responsivo: 375px / 768px / 1024px / 1440px
- [ ] `prefers-reduced-motion` desativa animações (fade simples)
- [ ] Contraste WCAG AA em todos os textos
- [ ] `npm run build` passa sem erros
- [ ] LCP da seção ≤ 2.5s (foto carrega lazy, não disputa com hero)

### Premissas ⚠️

- ⚠️ Bio em 3ª pessoa (confirmado parcialmente no brief, mas sem aprovação final)
- ⚠️ Foto `06-curb-brasil-flag.jpg` é a definitiva (cliente pode trocar depois)
- ⚠️ Dados do piloto atualizados conforme fornecido agora (NRT, Kawasaki ZX6R, 600cc Master)

### Bloqueadores / perguntas ao usuário

Nenhum bloqueador hard. Perguntas soft (não impedem execução):

1. O Sonic aparece como easter egg sutil na seção Sobre (capacete na foto já resolve)?
2. Preferência por "NRT" ou nome completo da equipe?

---

## Fase 2 — Evidências

| Arquivo | Linhas-âncora | Por quê |
|---------|--------------|---------|
| `src/app/page.tsx` | L9 (`<section id="sobre">`) | Placeholder atual — será substituído pelo componente |
| `src/app/globals.css` | `racing-number-bg`, `racing-slash`, `clip-diagonal-*`, `[data-reveal]` | Utilities reutilizáveis |
| `src/components/sections/hero/index.tsx` | Estrutura inteira | Referência de padrão (server component orquestrador + sub-componentes client) |
| `src/components/sections/hero/hero-parallax-scene.tsx` | L1-40 | Referência de parallax com `useReducedMotion` + `useScroll` |
| `public/photos/06-curb-brasil-flag.jpg` | — | Foto principal |

---

## Fase 3 — Decisões de design

### 3.1 Estilo visual

**Editorial calmo com tensão racing.** Diferente do hero (denso, cinematográfico), a seção Sobre usa:
- Mais espaço em branco (relativamente — fundo continua escuro)
- Tipografia editorial com hierarquia clara
- Grid assimétrico foto/texto
- 76 gigantesco no fundo a ~3% opacity (mais sutil que no hero)
- Um único slash diagonal vermelho como divisor/acento

### 3.2 Paleta + tokens usados

| Elemento | Token |
|----------|-------|
| Background da seção | `--racing-blue-deep` (continuidade) |
| Título "SOBRE" | `--racing-white` + font-heading (Saira Condensed 900) |
| Body text (bio) | `--racing-white` opacity 90% + font-sans (Geist Sans) |
| Números nos stats | `--racing-white` + font-mono (Geist Mono) |
| Labels dos stats | `--racing-mute` |
| Slash acento | `--racing-red` |
| Highlights pontuais | `--racing-yellow` (ano do título mais recente na timeline) |
| Timeline dots/line | `--racing-blue-bright` |
| Card de título na timeline | `--racing-asphalt` border + subtle glass |

### 3.3 Componentes shadcn necessários

Nenhum novo. Os existentes (`badge`, `card`, `separator`) cobrem se necessário, mas o design é custom pra manter a identidade racing.

### 3.4 Animações

- **Framer Motion** (já instalado v12) — `useInView`, `useScroll`, `useTransform`
- CSS keyframes apenas para fallback de reduced-motion
- Sem dependência nova

### 3.5 Responsividade

| Breakpoint | Layout |
|------------|--------|
| **375px** (mobile) | Stack vertical: título → foto full-width → stats (2×2 grid) → bio → palmarés (vertical) |
| **768px** (tablet) | Foto 60% width + stats overlay no canto inferior → bio abaixo → palmarés (horizontal scroll) |
| **1024px** (desktop) | Grid 12-col: foto em 5 cols à esquerda (sticky scroll) + bio/stats em 7 cols à direita → palmarés full-width abaixo |
| **1440px** | Mesmo que 1024 com max-width contido + espaço lateral generoso |

---

## Fase 4 — Checklist de execução (10 itens, em ordem)

1. **Criar estrutura de pasta** — `src/components/sections/sobre/` com `index.tsx` (server component orquestrador)
2. **Componente `SobrePhoto`** — `next/image` com parallax de scroll (translateY leve), `clip-diagonal-br`, lazy loading
3. **Componente `SobreStats`** — 4 contadores animados (client component com `useInView` + counter spring)
4. **Componente `SobreBio`** — parágrafos com scroll-reveal staggered (client component)
5. **Componente `SobreTimeline`** — palmarés visual (client component com reveal)
6. **Compor `index.tsx`** — orquestrar sub-componentes, definir grid, 76 background, slash
7. **Integrar em `page.tsx`** — substituir `<section id="sobre">` placeholder pelo `<Sobre />`
8. **Acessibilidade** — alt texts, aria-labels, contraste, focus visible, reduced-motion
9. **Validação responsiva** — testar 375/768/1024/1440, ajustar se necessário
10. **`npm run build`** — garantir zero erros

---

## Fase 5 — Detalhamento de design + conteúdo

### 5.1 Estrutura de arquivos

```
src/components/sections/sobre/
├── index.tsx              # Server component orquestrador
├── sobre-photo.tsx        # Client — parallax da foto + clip
├── sobre-stats.tsx        # Client — contadores animados
├── sobre-bio.tsx          # Client — parágrafos com scroll-reveal
└── sobre-timeline.tsx     # Client — timeline de palmarés
```

### 5.2 Layout proposto (ASCII)

**Desktop (≥1024px):**

```
┌─────────────────────────────────────────────────────────────────┐
│  [76 gigantesco, opacity 3%, posição absoluta, sangra à direita]│
│                                                                 │
│  ┌─────────────┐   ┌───────────────────────────────────────┐   │
│  │             │   │  SOBRE ────── (slash vermelho)         │   │
│  │   FOTO      │   │                                       │   │
│  │   parallax  │   │  Bio parágrafo 1                      │   │
│  │   clip-     │   │  Bio parágrafo 2                      │   │
│  │   diagonal  │   │  Bio parágrafo 3                      │   │
│  │   (5 cols)  │   │                                       │   │
│  │             │   │  ┌──────┬──────┬──────┬──────┐        │   │
│  │             │   │  │ 50   │ 13   │  6   │ 76   │        │   │
│  │             │   │  │ anos │ temp.│ títs │  nº   │        │   │
│  │             │   │  └──────┴──────┴──────┴──────┘        │   │
│  └─────────────┘   └───────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  PALMARÉS (timeline horizontal)                          │   │
│  │  2016 ──── 2018 ──── 2022 ──── 2023 ──── 2024 ──── 2025│   │
│  │  Vice PE   Camp NE   Vice PB   Vice BR   3º+Camp  Bi    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Mobile (375px):**

```
┌───────────────────────┐
│  SOBRE ── slash       │
│                       │
│  ┌───────────────────┐│
│  │  FOTO full-width  ││
│  │  clip-diagonal    ││
│  └───────────────────┘│
│                       │
│  ┌────┬────┐          │
│  │ 50 │ 13 │  stats   │
│  │anos│temp│  grid    │
│  ├────┼────┤  2x2     │
│  │  6 │ 76 │          │
│  │títs│ nº │          │
│  └────┴────┘          │
│                       │
│  Bio parágrafo 1      │
│  Bio parágrafo 2      │
│  Bio parágrafo 3      │
│                       │
│  PALMARÉS (vertical)  │
│  ● 2025 — Bi...      │
│  ● 2024 — 3º...      │
│  ● 2023 — Vice...    │
│  ● ...                │
└───────────────────────┘
```

### 5.3 Copy proposta (pt-BR — bio em 3ª pessoa)

> **SOBRE**

**Parágrafo 1:**
> Hilton Loureiro compete no motociclismo brasileiro desde 2013. Aos 49 anos, acumula seis títulos regionais e nacionais, incluindo o bicampeonato do Brasileiro Endurance 600cc em 2024 e 2025. Natural de Maceió, Alagoas, corre atualmente pela equipe NRT na categoria 600cc Master do Campeonato Brasileiro.

**Parágrafo 2:**
> Sua moto é uma Kawasaki ZX6R — reconhecível pelo número 76 e pelo capacete com a marca registrada do Sonic. Em 13 temporadas consecutivas, construiu um retrospecto que inclui recordes de pista, títulos nordestinos e pódios nacionais, sempre na classe 600cc.

**Parágrafo 3:**
> Fora da pista, Hilton conecta marcas ao público do motociclismo através de uma presença constante em campeonatos com cobertura nacional e audiência digital em crescimento. Garagem 57, Formafit, AC Vitha Clinic e Brasil da Sorte são os parceiros da temporada atual.

**Palavras BANIDAS (não usar em nenhum texto da seção):**
- garra, raça, sangue (nas veias), paixão (por velocidade), contra todos, nunca desistir, superação, guerreiro, incansável, sonho, motivação, inspiração (como adjetivo), alma, fogo, determinação inabalável

### 5.4 Tipografia / cor / espaçamento

| Elemento | Font | Weight | Size (desktop / mobile) | Color |
|----------|------|--------|------------------------|-------|
| Heading "SOBRE" | Saira Condensed | 900 | 4rem / 2.5rem | `--racing-white` |
| Slash decorativo ao lado | — | — | 4px width × 40px | `--racing-red` |
| Bio paragraphs | Geist Sans | 400 | 1.125rem / 1rem (leading 1.7) | `--racing-white` 88% opacity |
| Stat número | Geist Mono | 700 | 3.5rem / 2.5rem | `--racing-white` |
| Stat label | Geist Sans | 500 | 0.75rem uppercase tracking-wider | `--racing-mute` |
| Timeline ano | Geist Mono | 600 | 0.875rem | `--racing-blue-bright` |
| Timeline conquista | Geist Sans | 400 | 0.875rem | `--racing-white` 80% |
| 76 background | Anton (font-display) | — | clamp(18rem, 35vw, 45rem) | white 3% opacity |

**Espaçamento:**
- Padding vertical da seção: `py-24 lg:py-32` (96px / 128px)
- Gap entre foto e conteúdo: `gap-12 lg:gap-16`
- Gap entre stats: `gap-6`
- Margem entre bio e stats: `mt-10`
- Margem do palmarés ao bloco acima: `mt-16 lg:mt-24`

### 5.5 Motion timeline

| Timing | Elemento | Animação | Reduced-motion |
|--------|----------|----------|----------------|
| Scroll entry (0%) | 76 background | Já visível, parallax lento (translateY -20px → +20px ao longo do scroll) | Estático |
| Scroll entry (10%) | Heading "SOBRE" + slash | translateY 24px → 0, opacity 0→1, 400ms ease-out | Fade 200ms |
| Scroll entry (20%) | Foto | translateY 32px → 0 + leve parallax contínuo (5px range) | Fade 200ms |
| Scroll entry (35%) | Stats | stagger 100ms cada, contadores de 0 → valor (1.2s spring) | Valor final instantâneo |
| Scroll entry (45%) | Bio §1 | translateY 20px → 0, opacity, 400ms | Fade |
| +150ms | Bio §2 | idem | Fade |
| +300ms | Bio §3 | idem | Fade |
| Scroll entry (70%) | Timeline | items stagger 80ms, translateX -16px → 0 (desktop) ou translateY 16px → 0 (mobile) | Fade |

**Princípio:** nenhuma animação aqui dura mais que 600ms individual. Não deve competir com o hero — tudo é sutil.

### 5.6 Stats (4 números)

| Número | Label | Nota |
|--------|-------|------|
| **49** | anos | idade em abr/2026 (nasceu 25/10/1976; faz 50 em out/2026) |
| **13** | temporadas | 2013→2025 consecutivas |
| **6** | títulos | somatório de campeonatos ganhos |
| **76** | número de corrida | identidade (exibir como dado + reforço da marca) |

Formato: número grande em `font-mono` + label pequeno abaixo. Grid `2×2` em mobile, `4×1` inline em desktop.

Animação: spring counter com `useSpring` + `useTransform` (como já feito no hero — pattern consistente). Trigger: `useInView` com `once: true` e `margin: "-100px"`.

### 5.7 Palmarés — formato e argumentação

**Formato escolhido: Timeline horizontal (desktop) / vertical (mobile)**

**Por quê:**
- ✅ Comunica progressão temporal (evolução do piloto ao longo dos anos)
- ✅ Escala bem — 6 items cabe sem scroll horizontal em 1024px+
- ✅ Visual diferenciado vs lista simples — mais editorial, tipo awwwards
- ✅ Permite destaque visual no item mais recente (2025) com cor diferente
- ❌ Não cards empilhados — perde a noção de cronologia
- ❌ Não tabela — muito corporativo pra landing

**Estrutura:**
- Linha horizontal com dots nos nós (circles `8px`, `--racing-blue-bright`)
- Ano em `font-mono` acima do dot
- Conquista em text pequeno abaixo do dot
- Item 2025 (mais recente) com dot maior (12px), cor `--racing-yellow`, badge "atual"
- Mobile: vira lista vertical com linha à esquerda (timeline clássica)

### 5.8 Acessibilidade

| Item | Implementação |
|------|---------------|
| Alt da foto | `"Hilton Loureiro em curva sobre zebra com bandeira do Brasil na pista, pilotando Kawasaki ZX6R azul número 76, traje vermelho e preto, capacete azul com Sonic"` |
| Contraste | Texto branco 88% sobre `--racing-blue-deep` = ratio ~14:1 ✅ |
| Stats | `aria-label="50 anos de idade"` em cada stat container |
| Timeline | `<ol>` semântico com `aria-label="Palmarés — conquistas de 2016 a 2025"` |
| Reduced motion | Todos os `motion.*` wrappers usam `useReducedMotion()` pra degradar para fade/opacity simples |
| Focus | Timeline items focáveis com `focus-visible:ring-2 ring-racing-blue-bright` |
| Heading hierarchy | `<h2>` para "Sobre", nenhum skip de nível |
| Landmark | `<section id="sobre" aria-labelledby="sobre-heading">` |

### 5.9 Foto — tratamento técnico

- **Componente:** `next/image` com `sizes="(max-width: 768px) 100vw, 42vw"`
- **Loading:** `lazy` (não compete com LCP do hero)
- **Aspect ratio:** container com `aspect-[3/4]` em desktop, `aspect-[4/3]` em mobile (crop via `object-cover` + `object-position: center 30%`)
- **Clip path:** `clip-diagonal-br` (canto inferior direito cortado — velocidade)
- **Parallax:** `useScroll` no container + `useTransform` para translateY range [-20px, +20px] — intensidade baixa, mais editorial que hero
- **Overlay:** gradient sutil `from-racing-blue-deep/20 to-transparent` no bottom pra separar da seção se necessário

---

## Verificação do plano

- [x] Todos os critérios de aceite têm passo correspondente no checklist?  ✅
- [x] Componentes shadcn listados? ✅ (nenhum novo necessário)
- [x] Decisão de imagem clara? ✅ (`06-curb-brasil-flag.jpg`, lazy, parallax leve)
- [x] Copy aprovada ou placeholder explícito? ✅ (proposta completa — precisa OK do usuário)
- [x] Sem mistura feature+refactor? ✅ (escopo limpo)
- [x] Plano cabe em 1 dia de trabalho? ✅ (~4-6h de exec)

---

## Riscos / decisões pendentes

| # | Item | Impacto | Recomendação |
|---|------|---------|--------------|
| 1 | Bio precisa aprovação final do cliente | Pode atrasar merge | Executar com a copy proposta, ajustar depois |
| 2 | Foto pode ser substituída | Leve retrabalho de crop/position | Usar `object-position` configurável |
| 3 | Equipe é "NRT" — nome completo desconhecido | Copy pode parecer incompleta | Usar "NRT" como está |
| 4 | 6 títulos contabilizados: Nordestino 2018, Endurance 2024, Endurance 2025 = 3 campeonatos + 3 vices/3º lugar. Precisa confirmar se conta só "campeão" | Stat "6 títulos" pode estar inflado | Confirmar: se só campeão = 3 títulos. Recomendo exibir como "3 títulos nacionais" ou ajustar |
| 5 | Brief antigo menciona PRT Racing e Yamaha YZF-R1 — precisa atualizar `tasks/00-brief.md` | Inconsistência documental | Atualizar brief na exec |

---

## Atualização necessária no brief (`tasks/00-brief.md`)

Na execução, atualizar seção 1 com:
- Equipe: NRT (não PRT Racing)
- Moto: Kawasaki ZX6R (não Yamaha YZF-R1)
- Categoria atual: 600cc Master — Brasileiro
- Início de carreira: 2013
- Nascimento: 25/10/1976 (49 anos em abr/2026; completa 50 em out/2026)
- Patrocinadores atuais: Garagem 57, Formafit, AC Vitha Clinic, Brasil da Sorte

---

**Gate Plan = Livre** — pronto para execução via agent `exec`.

---

## Fase 6 — Implementação

| Arquivo | Ação | Status |
|---------|------|--------|
| `tasks/03-sobre.md` | criado | ✅ |
| `public/photos/06-curb-brasil-flag.jpg` | adicionado | ✅ |
| `src/components/sections/sobre/sobre-photo.tsx` | criado | ✅ |
| `src/components/sections/sobre/sobre-stats.tsx` | criado | ✅ |
| `src/components/sections/sobre/sobre-bio.tsx` | criado | ✅ |
| `src/components/sections/sobre/sobre-timeline.tsx` | criado | ✅ |
| `src/components/sections/sobre/index.tsx` | criado | ✅ |
| `src/app/page.tsx` | modificado (placeholder → `<Sobre />`) | ✅ |

---

## Fase 7 — Verificação

```
$ npm run lint
✓ ESLint — sem erros

$ npm run build
▲ Next.js 16.2.4 (Turbopack)
✓ Compiled successfully in 1694ms
✓ TypeScript passed
✓ Generating static pages (6/6)
○ (Static) prerendered as static content
```

### Desvios do plano

- **SobreStats**: simplificado para 1 `useEffect` com `motionVal.jump()` para reduced-motion em vez de 2 efeitos separados (resultado final idêntico).
- **Commits**: feitos como micro-commits semânticos (6 commits) em vez de um único monolítico. Incluiu commit extra para o plano (`chore(brief)`).
- **76 background**: usa `style` inline com `oklch(1 0 0 / 0.03)` para o 3% de opacidade (sem classe utilitária extra — consistente com o `racing-number-bg` existente mas com valor mais baixo conforme plano).

---

## Próximo passo

→ Rodar agent `walkthrough` para validação de acessibilidade, performance e responsividade antes do PR.
