# Handoff — Landing Hilton Loureiro

> **Documento de transferência de contexto.** Cole isto (ou aponte para ele) ao iniciar uma nova sessão de LLM neste projeto. Atualize quando algo material mudar.

**Última atualização:** após o Sprint 2 (Hero) ser pushed e PR aberto.

---

## TL;DR em 30 segundos

- **Projeto:** site oficial do piloto Hilton Loureiro (Moto1000GP 2026, Bicampeão Brasileiro Endurance 600cc 2024–2025)
- **Stack:** Next.js 16 (App Router, Turbopack, src dir) + React 19 + TS + Tailwind v4 (config-in-CSS) + shadcn/ui + Framer Motion + GSAP + Lenis + Vercel
- **Idioma do site e dos agentes:** **pt-BR**
- **Repositório:** `ViniciusLoureiro67/landing-hilton-loureiro` (público, pessoal)
- **Branch atual:** `main` recebe deploys; trabalho corrente em `claude/musing-kalam-38139f`
- **PR aberto:** [PR #1](https://github.com/ViniciusLoureiro67/landing-hilton-loureiro/pull/1) — Sprint 2 (Hero), aguardando review/merge do owner
- **Status de sprints:** S1 ✅ Foundation · S2 ✅ Hero · **S3 ⏳ Sobre + Palmarés (próximo)** · S4–S8 pendentes
- **Barra de qualidade:** **Awwwards SOTD-tier**, não template. Detalhe em [`docs/QUALITY_BAR.md`](./docs/QUALITY_BAR.md)
- **Brief mestre:** [`tasks/00-brief.md`](./tasks/00-brief.md) — paleta, tipografia, motion language, estrutura de seções, copy
- **Regra ABSOLUTA de commit:** **nunca incluir `Co-Authored-By: Claude`** (ou qualquer trailer Anthropic) em mensagens de commit

---

## 1. Contexto do produto

### 1.1 Quem é o piloto

**Hilton Loureiro** — alagoano (DDD 82), número de corrida **76**, mascote **Sonic the Hedgehog** (capacete + adesivo). Equipe: PRT Racing + parceria Garagem 53. Stack de marcas na livery: Yamaha · Pirelli · LS2 · Alpinestars · Motul.

**Palmarés (cronológico):**

| Ano | Conquista |
|---|---|
| 2016 | Vice-campeão Pernambucano + recorde da pista de Caruaru |
| 2018 | Campeão Nordestino |
| 2022 | Vice-campeão Paraibano |
| 2023 | Vice-campeão Brasileiro 600cc |
| 2024 | 3º Brasileiro 600cc Master + Campeão Brasileiro Endurance 600cc |
| **2025** | **Bicampeão Brasileiro Endurance 600cc** |

Em **2026** sobe para o **Moto1000GP** (Campeonato Brasileiro de Motovelocidade — homologação CBM + FIM Latin América).

### 1.2 Persona-alvo (em ordem de prioridade)

1. **Patrocinador** (CMO de marca regional, dono de empresa) → CTA: "Receber projeto completo via WhatsApp"
2. **Mídia / imprensa** → CTA: "Baixar press kit / agendar entrevista"
3. **Torcida / fã** → CTA: "Seguir no Instagram"

Uma única landing serve as 3 — a hierarquia visual prioriza #1 sem alienar #2/#3.

### 1.3 Marca pessoal

- Logo "**HILTON 76**" — `7` azul + `6` vermelho com slash diagonal
- Mascote Sonic visível no capacete e adesivo da moto
- Tom: direto, confiante, peso esportivo, sem clichê motivacional

---

## 2. Stack e convenções

### 2.1 Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, src dir) |
| UI | React 19 + TypeScript |
| CSS | Tailwind CSS v4 (config-in-CSS, **sem** `tailwind.config.js`) |
| Componentes | shadcn/ui em `src/components/ui/` |
| Tokens | `src/app/globals.css` (variáveis racing + utilitários) |
| Animação | Framer Motion (default), GSAP + ScrollTrigger (timelines com pinning), Lenis (smooth scroll global) |
| Ícones | Lucide React (sem emojis como ícones) |
| Fontes | Anton (display), Saira Condensed (heading), Geist Sans (body), Geist Mono (números) — todas via `next/font/google` em `layout.tsx` |
| Deploy | Vercel (push em `main` → deploy automático) |

### 2.2 Convenções não-negociáveis

- **Idioma:** pt-BR em copy do site e em respostas de agentes
- **Tema:** dark por padrão (classe `dark` no `<html>`); light mode não é prioridade
- **Imagens:** sempre `next/image` (ou `getImageProps` para `<picture>` responsivo). Priorizar AVIF/WebP. Nunca quality acima do configurado em `next.config.ts` (default: 75)
- **Cores:** tokens semânticos (`bg-racing-blue-deep`, `text-racing-mute`, etc). **Nunca hex direto em componentes.** Lista de tokens em `src/app/globals.css:64–98`
- **Acessibilidade:** alvo touch ≥ 44px (preferimos 48px = `h-12`), contraste ≥ 4.5:1, focus rings visíveis, `alt` descritivo, hierarquia de heading sequencial
- **SEO:** `metadata` global em `layout.tsx`; sobrescrever por rota via `export const metadata`. JSON-LD `Person`/`Athlete` adiado para Sprint 8
- **`prefers-reduced-motion`:** todo componente animado deve usar `useReducedMotion()` de framer-motion + degradar para fade simples ≤ 200ms

### 2.3 Estrutura de pastas

```
src/
  app/
    layout.tsx          # metadata global, fontes, html lang=pt-BR
    page.tsx            # home (monta Hero + âncoras das próximas seções)
    globals.css         # tokens shadcn + custom racing tokens (Tailwind v4)
  components/
    ui/                 # shadcn primitives
    sections/
      hero/              # Sprint 2 — completo
        index.tsx        # SERVER orquestrador
        hero-parallax-scene.tsx, ignition-lights.tsx, name-reveal.tsx,
        hero-tagline.tsx, hero-ctas.tsx, hero-kicker.tsx,
        hero-marquee.tsx, scroll-indicator.tsx
        use-hero-entry-skip.ts
      about/             # Sprint 3 (próximo) — vai aqui
      season/            # Sprint 4 (Temporada 2026)
      gallery/           # Sprint 5
      sponsorship/       # Sprint 6
      brands/            # Sprint 7
    Navbar.tsx, Footer.tsx, Hilton76Logo.tsx
  lib/
    links.ts            # WhatsApp/Instagram/Email centralizados
    utils.ts            # cn() helper
public/
  photos/               # 5 fotos placeholder (numeradas 01-05)
.claude/
  agents/               # subagents do projeto (plan, exec, walkthrough, commit, pr, ui, copy, seo)
  commands/             # slash commands
  settings.json         # perms compartilhadas
  launch.json           # config preview tooling
docs/
  QUALITY_BAR.md        # barra de qualidade permanente — LEIA ISTO
tasks/
  00-brief.md           # brief mestre — produto/copy/identidade
  02-hero.md            # plano + walkthrough do Sprint 2
HANDOFF.md              # este arquivo
README.md
AGENTS.md               # convenções do projeto (referenciado por CLAUDE.md)
CLAUDE.md               # → AGENTS.md
```

---

## 3. Workflow — como o trabalho avança

### 3.1 Sprint cycle

Cada sprint corresponde a uma seção (ou bloco transversal). Roteiro:

| Etapa | Slash command | Subagent | Saída |
|---|---|---|---|
| 1 | `/plan` | `plan` | `tasks/<NN>-<slug>.md` com checklist em fases |
| 2 | `/exec` | `exec` | implementação seguindo o plan |
| 3 | `/walkthrough` | `walkthrough` | auditoria a11y/perf/SEO/responsivo + Fase 8 no plan |
| 4 | (ajustes) | direto | corrige issues do walkthrough |
| 5 | `/commit` | `commit` | microcommits emoji + conventional + push |
| 6 | `/pr` | `pr` | PR para `main` com template |

Outros subagents auxiliares: `/ui` (componentes), `/copy` (texto pt-BR), `/seo` (metadata/JSON-LD), `/ui-ux-pro-max` (decisões de design quando estamos em dúvida).

### 3.2 Regras de microcommit

- Subject ≤ 72 chars, ideal 6 palavras + emoji + scope
- Formato: `<emoji> <type>(<scope>): <imperative subject>`
- Emojis: ✨ feat · 🐛 fix · 🎨 ui · ♻️ refactor · ⚡ perf · ♿ a11y · 📝 docs · 🔧 chore · ➕ build · 📚 docs
- Scopes válidos: `hero`, `home`, `globals`, `links`, `plan`, `claude`, `assets`, `theme`, `layout`, `seo`, `about`, `season`, `gallery`, `sponsorship`, `brands`
- Subject em inglês (alinha com histórico), body em pt-BR se houver
- **NUNCA `Co-Authored-By: Claude` ou qualquer trailer Anthropic** — preferência permanente do owner

### 3.3 Como continuar de onde paramos

A primeira pergunta que toda LLM nova deve responder ao iniciar uma sessão:

```
git log --oneline -15
git status
ls tasks/
```

E ler:

1. Este `HANDOFF.md`
2. `docs/QUALITY_BAR.md`
3. `tasks/00-brief.md`
4. O plan do sprint mais recente em `tasks/<NN>-...`

---

## 4. Status atual (snapshot)

### 4.1 O que está no ar / pronto

#### Sprint 1 — Foundation (mergeado em `main`)

- Tokens racing em `src/app/globals.css` (paleta blue-dominant, fontes display, utilitários `.racing-number-bg`, `.racing-grain`, `.racing-speed-lines`, `.clip-diagonal-*`, `.racing-slash`, keyframes ignite/chevron/scroll)
- Layout global: navbar fixa com scroll-translucent + footer + Lenis smooth scroll (`src/app/layout.tsx` + `src/components/{Navbar,Footer,Hilton76Logo}.tsx`)
- 5 fotos reais em `public/photos/` (01–05)

#### Sprint 2 — Hero (PR #1, aguardando merge)

Branch `claude/musing-kalam-38139f`. **14 microcommits**. Componentes em `src/components/sections/hero/`:

- `index.tsx` — server orquestrador (timeline da entrada documentada nos comentários)
- `hero-parallax-scene.tsx` — foto via `<picture>` + `getImageProps`, overlays gradient, número 76 gigante (sangrando direita), grain noise, mouse parallax 3 camadas com `IntersectionObserver` gate
- `ignition-lights.tsx` — semáforo F1 (V·V·A·V) + flash radial vermelho-amarelo
- `name-reveal.tsx` — clip-path mask por linha (HILTON outline + LOUREIRO sólido + sublinha vermelha)
- `hero-tagline.tsx` — mono micro + frase com highlight Pirelli amarelo
- `hero-ctas.tsx` — magnetic cursor + sweep diagonal + ícone morph (MessageCircle → ArrowRight) + glow racing pulsante
- `hero-kicker.tsx` — labels editoriais topo (ED. 2026 / Nº 76 / ALAGOAS · BR + status live)
- `hero-marquee.tsx` — palmarés/marcas em loop infinito 42s
- `scroll-indicator.tsx` — progress index 01/07
- `use-hero-entry-skip.ts` — hook compartilhado: `useSyncExternalStore` + `sessionStorage.hero-played` para pular entrada em retorno

**Linha do tempo da entrada (sem reduced-motion / primeira visita):**

```
0.0s  — ignição acende V·V·A·V
1.0s  — luz verde + flash radial
1.2s  — kicker labels entram
1.3s  — clip-path reveal do nome
1.55s — 76 gigante anima entrada
1.85s — tagline aparece
2.0s  — CTAs aparecem
2.3s  — marquee bottom aparece
2.4s  — progress index aparece
~2.7s — hero está calmo
```

Em retorno na mesma sessão (`sessionStorage.hero-played === "1"`), tudo entra em ~10ms.

### 4.2 Próximos sprints (do brief)

| Sprint | Escopo | Status |
|---|---|---|
| S3 | Sobre + Palmarés (bio + timeline visual 16→25 + foto retrato) | ⏳ próximo |
| S4 | Temporada 2026 (mapa do Brasil + 8 etapas) | ⏳ |
| S5 | Galeria (grid editorial 4–8 fotos + lightbox) | ⏳ |
| S6 | Patrocínio (pilares + propriedades + CTA forte) | ⏳ |
| S7 | Marcas + Imprensa (logos + contato + press kit) | ⏳ |
| S8 | Polish (Sonic Konami, audit a11y/perf, OG image, JSON-LD) | ⏳ |

### 4.3 Riscos / TODOs vivos

Marcados como TODO no código ou anotados em `tasks/02-hero.md`:

- **Foto hero limpa do Moto1000GP** — placeholder atual (`02-corner-sonic-wide.jpg`) é uma foto de pista 900×630, 101KB. O brief promete uma foto definitiva 16:9 + 9:16 do cliente
- **Número WhatsApp** — `5582996696666` em `src/lib/links.ts` ainda não confirmado pelo cliente
- **Logos vetoriais** PRT Racing e Garagem 53 — pendentes
- **OG image dedicada** 1200×630 — vai entrar no Sprint 8
- **JSON-LD `Person`/`Athlete`** — adiado para Sprint 8
- **Bio em 1ª ou 3ª pessoa?** — recomendação: 3ª pessoa (mais oficial pra patrocinador). A confirmar com cliente antes do S3
- **Easter egg Sonic (Konami code)** — confirmar com cliente; default é manter sutil, não dominante

### 4.4 Decisões já tomadas

- **Sem valores monetários na landing** ✅
- **Site em pt-BR** ✅
- **Tema escuro com identidade racing (blue + red + yellow Pirelli accent)** ✅
- **Domínio inicial:** `landing-hilton-loureiro.vercel.app`; mais tarde apontar `hiltonloureiro.com.br` se cliente comprar
- **Bibliotecas de motion:** Framer Motion default; GSAP+ScrollTrigger reservado para timelines com pinning (S3 e S4); Lenis para smooth scroll global

---

## 5. Como pedir trabalho a uma LLM neste projeto

### 5.1 Para começar uma nova sessão fria

```
Estou trabalhando na landing-hilton-loureiro.

Leia, nesta ordem:
1. HANDOFF.md (raiz) — contexto completo
2. docs/QUALITY_BAR.md — barra de qualidade (Awwwards-tier, não template)
3. tasks/00-brief.md — brief mestre do produto
4. CLAUDE.md / AGENTS.md — convenções

Depois disso, faça `git log --oneline -10` e `git status` pra saber onde paramos.

Idioma das suas respostas: pt-BR.

Estamos prontos pro próximo sprint? (ou: ajude com X)
```

### 5.2 Quando pedir uma seção nova

- Sempre rodar `/plan` antes de implementar (gera `tasks/<NN>-<slug>.md` com decisões técnicas + checklist em fases)
- Aprovar o plan antes de `/exec`
- Toda seção complexa segue o padrão de arquitetura do hero (server `index.tsx` + clients pequenos isolados + hooks no diretório da seção)
- Antes de marcar pronto: rodar **o teste do screenshot** descrito em `docs/QUALITY_BAR.md` §8

### 5.3 Quando algo estiver "OK mas faltando"

Sintoma do `docs/QUALITY_BAR.md` §9 — **a entrega virou template**. Volte ao código e amplie a ousadia:

- Tipografia maior (display em vez de heading)
- Pelo menos um elemento gráfico não-tipográfico dominante
- Pelo menos uma signature de motion na seção
- Camadas de profundidade (background → mid → foreground)

### 5.4 Quando a UX precisar de polimento

- A11y: rodar `/walkthrough` ou checar manualmente §6 da quality bar
- Performance: alvos LCP <2.5s, CLS <0.1, INP <200ms (§7 quality bar)
- Motion: nunca quebrar `prefers-reduced-motion` (§4.3 quality bar)

---

## 6. Arquivos críticos para LLM consultar

| Arquivo | Quando |
|---|---|
| [`HANDOFF.md`](./HANDOFF.md) | Sempre, na primeira mensagem da sessão |
| [`docs/QUALITY_BAR.md`](./docs/QUALITY_BAR.md) | Antes de qualquer trabalho de UI |
| [`tasks/00-brief.md`](./tasks/00-brief.md) | Antes de qualquer decisão de copy/identidade |
| [`tasks/02-hero.md`](./tasks/02-hero.md) | Quando precisar do padrão de plan/walkthrough |
| [`AGENTS.md`](./AGENTS.md) | Convenções gerais, comandos, deploy |
| [`src/app/globals.css`](./src/app/globals.css) | Lista de tokens, utilitários e keyframes disponíveis |
| [`src/components/sections/hero/`](./src/components/sections/hero/) | Padrão de arquitetura de seção |

---

## 7. Memória persistente do owner (preferências confirmadas)

- **Idioma:** pt-BR sempre
- **Commits:** zero `Co-Authored-By: Claude`, zero trailer Anthropic
- **Barra de qualidade:** Awwwards SOTD-tier; template = inaceitável
- **Fluxo:** plan → exec → walkthrough → commit → pr (não pular etapas em sprint complexo)
- **Animação:** detalhe importa — preferência por motion cinematográfica, mouse parallax, signature hovers, sequências de entrada com narrativa

---

## 8. Recados curtos pra próxima LLM

- Quando o owner falar "não tá foda o suficiente" — releia §9 da quality bar e amplifique 2x: tipografia maior, mais camadas, motion mais ousado
- Quando ele falar "não quero que apareça Claude como co-autor nunca" — já está em memória persistente, mas confirme antes de qualquer commit
- Quando ele pedir "máximo de microcommits" — fatie por mudança lógica (1 arquivo novo = 1 commit; 1 fix de walkthrough = 1 commit; 1 bloco de keyframes em globals = 1 commit)
- Quando o screenshot do preview não ajudar (Preview tool às vezes trava ou clipa) — use `mcp__Claude_Preview__preview_eval` com `getBoundingClientRect()` + `getComputedStyle()` para validar layout. Mais confiável que screenshot.
- Quando algo não fechar com o brief — re-leia o brief antes de chutar; se ainda em dúvida, pergunte ao owner em vez de assumir

---

**Fim do handoff.**

Pra atualizar: rodar isto após cada sprint mergeado em `main` ou após decisão material que mude o status do projeto.
