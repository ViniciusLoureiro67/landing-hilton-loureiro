<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Landing — Hilton Loureiro

Site oficial do piloto **Hilton Loureiro** (Campeonato Brasileiro Moto1000GP). Repositório público pessoal, deploy na Vercel.

## Stack

- **Next.js 16** (App Router, Turbopack, src dir)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (config-in-CSS, sem `tailwind.config.js`)
- **shadcn/ui** (`src/components/ui/`) com tokens em `src/app/globals.css`
- **Framer Motion** para animações
- **Lucide React** para ícones (sem emojis como ícones)
- Deploy: **Vercel**

## Comandos

```bash
npm run dev      # dev server (Turbopack)
npm run build    # build produção
npm run start    # serve build local
npm run lint     # ESLint
```

Adicionar componentes shadcn: `npx shadcn@latest add <component>`.

## Convenções

- **Idioma do site:** pt-BR. Toda copy em português.
- **Tema:** dark por padrão (classe `dark` no `<html>` em `src/app/layout.tsx`); preparar variantes light se necessário.
- **Imagens:** sempre `next/image` com `width`/`height` ou `fill` + container com `aspect-ratio`. Para fotos de moto/pista, priorizar AVIF/WebP.
- **Tipografia:** Geist Sans (corpo) e Geist Mono (código/números). Importadas via `next/font/google` em `layout.tsx`.
- **Cores:** tokens semânticos do shadcn (`bg-background`, `text-foreground`, `text-muted-foreground` etc.). **Nunca** hex direto em componentes.
- **Acessibilidade:** alvo touch ≥44×44, contraste ≥4.5:1, focus rings visíveis, `alt` descritivo, hierarquia de heading sequencial.
- **SEO:** `metadata` em `layout.tsx` é o default; sobrescrever por rota via `export const metadata`. JSON-LD `Person`/`Athlete` quando aplicável.

## Estrutura

```
src/
  app/
    layout.tsx        # metadata global, fontes, html lang=pt-BR
    page.tsx          # home
    globals.css       # tokens shadcn (Tailwind v4)
  components/
    ui/               # shadcn primitives (button, card, badge, etc.)
  lib/
    utils.ts          # cn() helper
public/                # estáticos (imagens, og)
.claude/
  agents/             # subagents do projeto
  commands/           # slash commands
  settings.json       # perms compartilhadas
```

## Workflow recomendado

1. `/plan` (subagent **plan**) — estrutura a feature/seção em `tasks/<slug>.md`
2. `/exec` (subagent **exec**) — implementa seguindo o checklist
3. `/walkthrough` (subagent **walkthrough**) — revisa acessibilidade, perf, SEO
4. `/commit` (subagent **commit**) — microcommits emoji+conventional
5. `/pr` (subagent **pr**) — abre PR para `main` com template

Para UI/cópia, usar `/ui`, `/ui-ux-pro-max`, `/copy`, `/seo` conforme o caso.

## 🎬 Motion Philosophy — leitura OBRIGATÓRIA

**Esta landing tem que ser awwwards-tier. Não é opcional.** Toda seção implementada por qualquer agente (`exec`, `ui`, principal) DEVE seguir as regras de animação documentadas em [`docs/MOTION_PHILOSOPHY.md`](./docs/MOTION_PHILOSOPHY.md).

Princípios resumidos:

- A landing inteira parece um **vídeo dirigido por scroll**, não uma página com "alguns componentes animados"
- **Pinned scrollytelling** em seções importantes (sticky + scroll progress)
- **Reveals dramáticos**: char-by-char, mask reveals (clip-path), curtain effects — nunca fade genérico
- **Múltiplas camadas com parallax assimétrico**
- **Microinteractions premium** (3D tilt, hover scale, mix-blend-mode) — porém SEMPRE no elemento, nunca no cursor
- **Counters elaborados** (airport-flip / split-flap / spring complexo)
- **Transitions entre seções** sempre (slash crescendo, 76 morphing, etc.)
- **Cursor nativo SEMPRE** — cliente recusou cursor customizado (sensação de lag). NÃO implementar `MagneticCursor`, `cursor: none`, ou hooks que arrastem elementos pro cursor
- **Reduced-motion** sempre respeitado (degrada pra fade simples)

**Anti-padrões proibidos** (qualquer um destes = seção não está pronta):
- Fade-in genérico de 0→1 sem direção
- Scroll-reveal só com `translateY: 16` + opacity ("landing genérica")
- Counter que muda instantaneamente
- Texto que aparece todo de uma vez
- Imagem que aparece só com `opacity 0→1`
- Section que entra "do nada" sem conectar com a anterior

Antes de implementar qualquer seção nova, **leia `docs/MOTION_PHILOSOPHY.md`**. Se a seção que você está construindo parece "uma landing comum", **pare e refaça**.

## ⛔ Regra dura — NUNCA commitar sem pedido explícito

Esta é uma regra **inviolável** que se aplica a **todo agente do projeto** (incluindo `exec`, `plan`, `ui`, e qualquer agente principal):

- **NUNCA** rode `git commit`, `git add` seguido de `git commit`, ou qualquer fluxo que finalize commits **sem o usuário ter pedido explicitamente**.
- "Pedido explícito" = o usuário usar palavras como **"commita"**, **"faça commit"**, **"micro-commits"**, **"/commit"**, ou similar — em uma mensagem direta, não interpretado a partir de fluxos genéricos como "implemente isso" ou "execute o plano".
- Mesmo que o plano em `tasks/<slug>.md` mencione commits, **NÃO commitar sem confirmação direta** do usuário naquele turno.
- Após implementar, o agente deve **listar as mudanças, rodar build/lint, e parar** — deixando o usuário inspecionar e decidir quando commitar (ou rodar `/commit`).
- Se o usuário pedir explicitamente, aí sim usar o agent `commit` ou rodar `git commit` direto — seguindo o padrão emoji + conventional commits do projeto.

Violar essa regra é considerado erro grave. Quando em dúvida, **PERGUNTAR antes de commitar.**

## Deploy

- Push em `main` → deploy automático na Vercel (após `vercel link` inicial).
- Variáveis de ambiente: configurar `NEXT_PUBLIC_SITE_URL` no Vercel para a URL canônica.
- Preview por PR habilitado por default na Vercel.

## Idioma das respostas dos agentes

**Sempre pt-BR.**
