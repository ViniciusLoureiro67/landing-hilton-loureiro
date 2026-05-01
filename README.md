# landing-hilton-loureiro

Site oficial do piloto **Hilton Loureiro** — Campeonato Brasileiro **Moto1000GP 2026**, bicampeão Brasileiro Endurance 600cc (2024–2025).

> **Barra de qualidade:** Awwwards Site of the Day-tier. Não é template, não é boilerplate de SaaS. Detalhe em [`docs/QUALITY_BAR.md`](./docs/QUALITY_BAR.md).

---

## Stack

Next.js 16 (App Router · Turbopack · src dir) · React 19 · TypeScript · Tailwind CSS v4 (config-in-CSS) · shadcn/ui · Framer Motion · GSAP + ScrollTrigger · Lenis · Lucide React · Vercel.

---

## Status

| Sprint | Escopo | Status |
|---|---|---|
| S1 | Foundation — tokens, fontes, layout, navbar, footer, smooth scroll | ✅ no `main` |
| S2 | Hero — ignição F1 + clip-path reveal + 76 protagonista + parallax + marquee | ✅ [PR #1](https://github.com/ViniciusLoureiro67/landing-hilton-loureiro/pull/1) |
| S3 | Sobre + Palmarés — bio + timeline horizontal scroll-locked (vertical em <md) | ✅ |
| S4 | Temporada 2026 — mapa do Brasil + 8 etapas + circuit cards com popover | ✅ |
| S5 | Patrocínio — pitch + stats + 7 ativações com foto editorial + LED line zigue-zague | ✅ [PR #5](https://github.com/ViniciusLoureiro67/landing-hilton-loureiro/pull/5) |
| S6 | Galeria + Contato + responsividade — grid editorial asymétrico, char-reveal, form WhatsApp + press kit | ✅ [PR #6](https://github.com/ViniciusLoureiro67/landing-hilton-loureiro/pull/6) |
| S7 | OG image + favicon cleanup — `next/og` 1200×630 com photo + brand stack | ✅ [PR #7](https://github.com/ViniciusLoureiro67/landing-hilton-loureiro/pull/7) |
| S8 | Polish + créditos — footer com link WhatsApp do dev | ✅ [PR #8](https://github.com/ViniciusLoureiro67/landing-hilton-loureiro/pull/8) |

Detalhamento de cada sprint em [`tasks/00-brief.md`](./tasks/00-brief.md).

---

## Desenvolvimento

```bash
npm install
npm run dev
```

App em [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Serve do build local |
| `npm run lint` | ESLint |

Adicionar componentes shadcn: `npx shadcn@latest add <component>`.

---

## Documentação

| Arquivo | Para quê |
|---|---|
| [`HANDOFF.md`](./HANDOFF.md) | Snapshot completo do projeto. **Toda LLM/dev novo na sessão começa por aqui.** |
| [`docs/QUALITY_BAR.md`](./docs/QUALITY_BAR.md) | Barra de qualidade visual e de motion. **Permanente, não-negociável.** |
| [`tasks/00-brief.md`](./tasks/00-brief.md) | Brief mestre — produto, persona, paleta, copy, motion language |
| [`tasks/02-hero.md`](./tasks/02-hero.md) | Plano + walkthrough do Sprint 2 (referência de como organizar futuros sprints) |
| [`AGENTS.md`](./AGENTS.md) | Convenções gerais (idioma, tokens, a11y, fontes, deploy) |

---

## Workflow de desenvolvimento

Cada sprint passa por um pipeline de 6 etapas com subagents Claude Code:

```
/plan → /exec → /walkthrough → (ajustes) → /commit → /pr
```

Subagents auxiliares: `/ui` (componentes), `/copy` (texto pt-BR), `/seo` (metadata), `/ui-ux-pro-max` (decisões de design).

Detalhamento em [`HANDOFF.md`](./HANDOFF.md) §3.

---

## Convenções (resumo)

- **Idioma do site:** pt-BR
- **Tema:** dark por padrão (light mode não é prioridade)
- **Cores:** tokens semânticos em `src/app/globals.css` — **nunca hex direto** em componentes
- **Imagens:** `next/image` com `priority` no LCP; `getImageProps` + `<picture>` para responsividade real
- **Acessibilidade:** alvo touch ≥ 44px (preferimos 48px), contraste ≥ 4.5:1, focus rings visíveis, `prefers-reduced-motion` honrado em todo componente animado
- **Motion:** Framer Motion default; GSAP reservado para timelines com pinning; CSS keyframes para loops simples
- **Performance:** LCP < 2.5s · CLS < 0.1 · INP < 200ms

---

## Deploy

Push em `main` aciona deploy automático na Vercel.
Preview por PR é gerado pelo bot Vercel automaticamente.

Variáveis de ambiente: configurar `NEXT_PUBLIC_SITE_URL` no Vercel para a URL canônica.

---

## Estrutura

```
src/
  app/
    layout.tsx                # metadata SEO, fontes, providers
    page.tsx                  # composição das 6 seções + dividers
    icon.tsx                  # favicon dinâmico via next/og
    apple-icon.tsx            # apple touch icon 180×180
    opengraph-image.tsx       # OG image 1200×630 (preview WhatsApp/Twitter)
    globals.css               # tokens em @theme + utilitários
  components/
    sections/
      hero/                   # ignição F1, name reveal, parallax, marquee
      sobre/                  # bio + timeline scroll-locked
      temporada/              # mapa BR + 8 etapas + circuit cards
      patrocinio/             # pitch + stats + 7 ativações + sponsors + CTA
      galeria/                # grid editorial asymétrico (6 cards)
      contato/                # form WhatsApp + canais + press kit
    motion/
      char-reveal.tsx         # text reveal char-by-char
      scroll-video.tsx        # scroll-driven video (não usado atualmente)
      section-divider.tsx     # ticker / slash entre seções
    ui/                       # shadcn primitives
    Navbar.tsx, Footer.tsx, SmoothScrollProvider.tsx, Hilton76Logo.tsx
  lib/
    links.ts                  # WhatsApp/Instagram/Email + builder de wa.me
    utils.ts                  # cn() helper
    use-reduced-motion-safe.ts
public/
  photos/
    ativacoes/                # 7 fotos das ativações de patrocínio
    galeria/                  # 6 fotos da galeria editorial
  press/
    hilton76-press-kit.pdf    # press kit comprimido (~7 MB)
  sponsors/                   # logos dos patrocinadores
docs/                         # quality bar e docs persistentes
tasks/                        # brief + plans de sprints
.claude/                      # subagents, slash commands, settings
```

---

## Licença

Repositório pessoal, não publicado em registry. Contato em `src/lib/links.ts`.
