# landing-hilton-loureiro

Site oficial do piloto **Hilton Loureiro** — Campeonato Brasileiro Moto1000GP.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion · Vercel.

## Desenvolvimento

```bash
npm install
npm run dev
```

App em [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Serve do build local |
| `npm run lint` | ESLint |

Adicionar componentes shadcn: `npx shadcn@latest add <component>`.

## Estrutura

Veja [`AGENTS.md`](./AGENTS.md) para convenções, workflow e detalhes do stack.

## Deploy

Push em `main` aciona deploy automático na Vercel.
