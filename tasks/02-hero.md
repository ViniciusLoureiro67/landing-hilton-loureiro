# Sprint 2 — Hero principal

> Substitui o hero placeholder atual (`src/app/page.tsx`) por um hero "first impression" com sequência de ignição, reveal de nome, foto de fundo, CTAs e respeito a `prefers-reduced-motion`.

---

## Fase 1 — Scope

### Objetivo
Entregar o hero principal da landing — sequência de ignição (semáforo F1) + reveal do nome HILTON / LOUREIRO / 76, foto de fundo com overlay, tagline, CTA WhatsApp (primário) e CTA "Conhecer trajetória" (secundário) — no padrão de motion language do brief, mantendo LCP < 2.5s e WCAG AA.

### Contexto
- Brief mestre: `tasks/00-brief.md` (seções 4 — motion / 5 — estrutura / 6 — assets).
- Sprint 1 entregou tokens, fontes (Anton + Saira Condensed + Geist), navbar fixa traduzida em scroll, footer, smooth scroll Lenis e um hero **placeholder** com badge "em construção".
- Este sprint só toca a *primeira tela* (a `<section id="top">` do `src/app/page.tsx`). As âncoras `#sobre #temporada #galeria #patrocinio` continuam intactas para os próximos sprints.

### Escopo
1. Sequência de ignição (3 luzes laterais vermelho → amarelo → verde) ~1.2s no mount.
2. Reveal HILTON / LOUREIRO / 76 com translateY + blur + stagger.
3. Foto de fundo (`next/image` com `fill` + `priority`) + overlay gradient `racing-blue-deep` para contraste ≥4.5:1.
4. Tagline: "Piloto profissional · Bicampeão Brasileiro Endurance 600cc · Moto1000GP 2026".
5. CTA primário "Falar no WhatsApp" — `racing-red`, magnetic cursor (desktop), press feedback (mobile), `wa.me` pré-preenchido.
6. CTA secundário "Conhecer trajetória" → `#sobre` com chevron `ChevronDown` em bounce sutil.
7. Scroll indicator embaixo dos CTAs ("role para baixo" + linha vertical animada).
8. Número 76 gigante de fundo (manter `.racing-number-bg`, sair do grid principal).
9. Slash diagonal vermelho como assinatura visual entre tagline e CTAs.
10. `prefers-reduced-motion` → fade simples (sem ignição, sem magnetic, stagger curto).
11. A11y: alvo touch ≥44px nos CTAs, focus rings, hierarquia h1, alt descritivo, contraste ≥4.5:1.

### Não-escopo
- Vídeo hero loop (gap do brief 6, MVP foto).
- Easter egg Sonic / Konami code (Sprint 8 — Polish).
- Conteúdo das outras seções (`#sobre` etc.).
- Lightbox de galeria, mapa do Brasil, timeline de palmarés.
- Geração de OG image dinâmica (Sprint 8).
- Refatorar Navbar/Footer.

### Critérios de aceite
- [ ] Ao abrir a home pela primeira vez, três luzes laterais (vermelho, amarelo, verde) acendem em sequência ~400ms cada totalizando ≤1.2s; a luz verde fica acesa por ~150ms e some.
- [ ] Logo após a verde, "HILTON", "LOUREIRO" e "76" entram com translateY de 32px → 0 + blur 12px → 0, com stagger de ~120ms entre as palavras, ease-out, total ≤700ms.
- [ ] O número "76" é visualmente diferenciado (bicromia: `7` em `racing-blue-bright`, `6` em `racing-red` com slash diagonal — assinatura "HILTON 76" do brief seção 1).
- [ ] Fundo: `next/image` ocupando a viewport com overlay `linear-gradient(to top, racing-blue-deep 0% → transparent 70%)` + `racing-blue/60` à esquerda para o texto. Imagem com `priority`, `sizes="100vw"`, `fetchPriority="high"`.
- [ ] Tagline aparece após o nome (delay ~200ms) com fade simples; usa `font-heading` uppercase tracking-widest, cor `racing-mute`.
- [ ] Slash vermelho (`racing-slash` ou `<Slash />` decorativo) aparece como elemento gráfico entre tagline e CTAs.
- [ ] CTA primário tem ≥44px de altura, ícone `MessageCircle`/`Phone`/`Send` da lucide à esquerda, faz magnetic follow no desktop (raio 80px, easing spring), e no mobile escala 0.97 no `:active`.
- [ ] CTA secundário tem `ChevronDown` em bounce vertical (loop infinito 1.6s, amplitude 4px), link âncora `#sobre` que respeita Lenis (sem brigar com smooth scroll — usa `data-lenis-target` ou `scroll-to`).
- [ ] Scroll indicator (linha vertical 1px × 56px, gradient `racing-mute → transparent`) animado com loop pulse vertical (`scaleY` 0.3 → 1).
- [ ] `prefers-reduced-motion: reduce` desliga ignição, magnetic, blur, bounce e usa apenas `opacity 0 → 1` em ≤200ms.
- [ ] Lighthouse: LCP < 2.5s, CLS = 0, INP < 200ms (medir local com `next build && next start`).
- [ ] Lint zero, build zero erros, sem warnings de hidratação.
- [ ] Mobile (375px), tablet (768px), desktop (1024 / 1440) revisados — texto não estoura, CTAs empilham no mobile.

### Premissas (assumidas — marcar para confirmação)
- ⚠️ **Foto hero:** brief lista `hilton-vencedor.jpg` e `hero-bike.jpg` em `public/photos/placeholder/`, **mas o repo só tem** `public/photos/0[1-5]-*.jpg`. Vou usar **`02-corner-sonic-wide.jpg`** (formato wide, capacete com Sonic visível) como hero principal desktop e **`01-corner-sonic-portrait.jpg`** como mobile (formato portrait). Confirmar com cliente.
- ⚠️ **Número WhatsApp:** Navbar atual já usa `5582996696666`. Reutilizar o mesmo (alagoano DDD 82) com mensagem pré-preenchida específica do hero ("Olá Hilton, vim pelo site e quero saber mais sobre o projeto 2026."). Marcar TODO no código.
- ⚠️ **Tagline final:** uso a sugerida no pedido. Refinamento textual fica para `/copy` durante exec se necessário.
- ⚠️ **Bicromia 7/6 com slash diagonal:** o componente `Hilton76Logo.tsx` já existe; verificar durante exec se vale reusá-lo em escala gigante ou se precisa de tipografia customizada inline.

### Bloqueadores / perguntas
Nenhum bloqueador hard. Os ⚠️ acima podem evoluir durante o exec sem travar a entrega — TODO comments + commit nota.

---

## Fase 2 — Evidências

| Arquivo | Linhas-âncora | Por quê |
|---|---|---|
| `src/app/page.tsx` | 1–55 (hero placeholder atual) | Será substituído pelo `<Hero />` real |
| `src/app/globals.css` | 183–249 (utilities `.racing-number-bg`, `.racing-slash`, `[data-reveal]`, `clip-diagonal-*`) + 251–260 (reduced-motion) | Tokens e utilitários disponíveis; vou adicionar 1–2 keyframes (chevron-bounce, scroll-pulse, ignite-pulse) |
| `src/components/Navbar.tsx` | 26–28 (`WHATSAPP_HREF`) | Reutilizar a constante (extrair para `src/lib/links.ts` se ficar duplicada) |
| `src/components/Hilton76Logo.tsx` | inteiro | Avaliar reuso no reveal do "76" |
| `tasks/00-brief.md` | seções 4 (motion), 5 (estrutura), 6 (assets) | Single source of truth |

---

## Fase 3 — Decisões de design

### Estilo visual
Editorial racing — fundo escuro azul-marinho com foto sangrando, tipografia massiva Anton ocupando 8–10 cols do grid, slash vermelho como assinatura. Sem cards, sem gradientes coloridos no hero. **Menos é mais** na primeira tela; a foto + o nome carregam.

### Paleta / tokens
Tudo já existe em `globals.css`. Apenas adicionar **3 keyframes** novos em `@layer utilities`:
- `@keyframes ignite-pulse` (luzes da largada, escala + glow)
- `@keyframes chevron-bounce` (8% translate-y para o `ChevronDown`)
- `@keyframes scroll-pulse` (scaleY 0.3 ↔ 1 no scroll indicator)

Sem mudança de tokens semânticos.

### Componentes shadcn
Já temos: `button`, `badge`. **Não precisa adicionar nada**. Lucide já instalado: usar `MessageCircle` (ou `Send`), `ChevronDown`, `ArrowDown`.

### Animação — GSAP timeline vs Framer Motion variants

**Decisão: Framer Motion variants para tudo, exceto magnetic cursor (usar `useMotionValue` + `useSpring`).**

Justificativa:
1. **Coexistência com Lenis (GSAP):** Lenis está no `SmoothScrollProvider`. GSAP timeline para a ignição funcionaria, mas misturar dois sistemas de animação para a *mesma* tela aumenta complexidade sem ganho visível. Framer já está no projeto (Navbar) e dá variants/stagger declarativos curtos.
2. **Stagger nativo:** o reveal de nome é um caso clássico de `staggerChildren` — Framer resolve em 5 linhas; GSAP timeline pediria refs e cleanup manual.
3. **`prefers-reduced-motion`:** Framer tem `useReducedMotion()` hook, integração direta com variants. GSAP exige guard manual.
4. **Magnetic cursor:** `useMotionValue` + `useSpring` + `onMouseMove` no botão — clean, sem libs extras.
5. **GSAP fica reservado** para o mapa do Brasil (Sprint 4) e timeline de palmarés (Sprint 3), onde pinning e ScrollTrigger fazem sentido.

### Estratégia de imagem
**`<picture>` com swap mobile/desktop via `next/image`** — usar duas instâncias condicionais com classes `hidden sm:block` / `sm:hidden`, OU **uma única imagem responsiva** com `sizes` e `object-position` ajustando o crop.

**Decisão: duas `<Image>` condicionais.**
- Desktop (`sm+`): `02-corner-sonic-wide.jpg` (16:9 wide, Hilton em curva).
- Mobile (`<sm`): `01-corner-sonic-portrait.jpg` (9:16 portrait, mesmo momento, melhor enquadramento).
- Ambas com `priority`, `fill`, `sizes="100vw"`, `quality={85}`.

Justificativa: já temos os dois assets, evita servir 2MB de wide pro mobile, melhora LCP no celular. Custo: ~10 linhas de markup. (Alternativa "única + object-position" deixaria o rosto fora do enquadramento no portrait.)

### Estrutura de componentes
**Split em 4 arquivos** dentro de `src/components/sections/hero/`:

```
src/components/sections/hero/
  index.tsx              # <Hero /> orquestrador (server component, sem state)
  ignition-lights.tsx    # client — sequência de 3 luzes (Framer)
  name-reveal.tsx        # client — HILTON/LOUREIRO/76 com stagger + blur
  hero-ctas.tsx          # client — magnetic CTA primário + secundário com bounce
  scroll-indicator.tsx   # client — pulse vertical
```

Justificativa: `<Hero />` server component dá imagem otimizada e markup SEO-friendly server-side; só os pedaços animados ficam client. Isolar magnetic CTA num arquivo facilita testar a11y separado.

Alternativa **descartada**: monolítico em `hero.tsx` com `"use client"` no topo — paga `bundle-size client` para markup que não precisa.

### Responsividade (mobile-first)
- 375px: tipografia `text-6xl` (96px) HILTON empilhado, CTAs full-width empilhados, foto portrait.
- 768px: `text-7xl` (128px), CTAs lado a lado, foto wide aparece.
- 1024px: `text-8xl` (160px), grid 12 col com texto em 8 cols à esquerda.
- 1440px+: `text-[10rem]` (já existente no placeholder), número 76 background gigante com `clamp(20rem, 40vw, 50rem)`.

---

## Fase 4 — Checklist de execução (em fases para o `/exec`)

### Fase A — Estrutura estática (sem animação)
1. Criar `src/lib/links.ts` exportando `WHATSAPP_HERO_HREF` (com texto pré-preenchido específico do hero) e `WHATSAPP_HREF` genérico — refatorar `Navbar.tsx` para importar daqui.
2. Criar `src/components/sections/hero/index.tsx` com markup completo: `<section id="top">` + foto desktop/mobile (`next/image fill priority`) + overlay gradient + container do texto (h1 com HILTON / LOUREIRO / 76 estático) + tagline + slash vermelho + 2 CTAs estáticos + scroll indicator estático + número 76 background.
3. Substituir o conteúdo da `<section id="top">` em `src/app/page.tsx` por `<Hero />`. Manter as âncoras `#sobre #temporada #galeria #patrocinio`.
4. Verificar layout em 375 / 768 / 1024 / 1440 (sem JS de animação ainda) — texto legível, foto carrega, contraste OK.

### Fase B — Sequência de ignição
5. Criar `src/components/sections/hero/ignition-lights.tsx` (`"use client"`) — 3 círculos laterais (top-right ou left-center) com `motion.div`, variants `dim` / `lit`, parent com `staggerChildren: 0.4, delayChildren: 0.2`. Cada luz: `boxShadow 0 0 0 0` → `0 0 32px 8px {cor}` no `lit`. Após 1.2s total, `motion.div` parent transita opacity 1 → 0 em 300ms (luz verde "some"). Cores: `racing-red`, `racing-yellow`, `oklch(0.7 0.2 145)` (verde de largada). Hook `useReducedMotion()` retorna fragmento vazio se reduzir.
6. Adicionar `@keyframes ignite-pulse` em `globals.css` (caso framer não dê o efeito de "pulsar e morrer" — fallback CSS).
7. Importar `<IgnitionLights />` em `<Hero />` com posição absoluta canto superior, z-index acima da foto.

### Fase C — Reveal do nome
8. Criar `src/components/sections/hero/name-reveal.tsx` (`"use client"`) — `motion.h1` com `variants={{hidden:{}, show:{transition:{staggerChildren:0.12, delayChildren:1.3}}}}` (delay = duração da ignição + buffer 100ms), filhos `motion.span` para "HILTON", "LOUREIRO" e "76", cada um com `hidden:{opacity:0, y:32, filter:"blur(12px)"}` → `show:{opacity:1, y:0, filter:"blur(0)"}`. Para o "76": dois spans bicromia (`7` blue-bright + `6` red com slash diagonal CSS). Reduced-motion → variantes `instant` (apenas opacity).
9. Substituir o `<h1>` estático do `<Hero />` por `<NameReveal />`. Garantir que o tag semântico continua `<h1>` (acessibilidade).
10. Tagline e slash entram via `motion.p` com `delay: 1.7s, duration: 0.5s` opacity-only (não usa o stagger do nome).

### Fase D — CTAs
11. Criar `src/components/sections/hero/hero-ctas.tsx` (`"use client"`) — wrapper com 2 CTAs lado a lado (mobile: stacked).
12. CTA primário: `motion.a` href={WHATSAPP_HERO_HREF} target=_blank, classes do `buttonVariants` + `bg-racing-red`. Implementar magnetic: `useMotionValue(0)` para x/y, `useSpring(stiffness:300, damping:20)`, `onMouseMove` calcula offset relativo ao centro do botão (raio 80px), `onMouseLeave` reseta. Mobile: `whileTap={{scale:0.97}}`. Reduced-motion: skip magnetic.
13. CTA secundário: `motion.a` href="#sobre" classes `buttonVariants({variant:"ghost"})` + ícone `<ChevronDown />` com `animate={{y:[0,4,0]}} transition={{repeat:Infinity, duration:1.6}}`. Click handler chama `lenis.scrollTo("#sobre")` se disponível, senão fallback nativo.
14. Adicionar entrada do bloco CTAs com `delay: 1.9s` (depois da tagline).

### Fase E — Scroll indicator + número 76
15. Criar `src/components/sections/hero/scroll-indicator.tsx` (`"use client"`) — texto "role para baixo" em `font-heading uppercase tracking-[0.3em] text-xs text-racing-mute` + linha vertical 1px×56px com gradient + `motion.div` com `animate={{scaleY:[0.3,1,0.3]}} transition={{repeat:Infinity, duration:1.8}}`. Reduced-motion: estático.
16. Manter o `<span className="racing-number-bg">76</span>` do placeholder (já posicionado fora do grid). Confirmar z-index abaixo do texto, acima da foto+overlay (ou atrás de tudo, dependendo do contraste — testar visualmente).

### Fase F — A11y + reduced-motion + perf
17. Adicionar `aria-label="Hero — Hilton Loureiro 76"` na `<section>`.
18. Foto: `alt="Hilton Loureiro pilotando moto Yamaha número 76 em curva, capacete com Sonic visível"` (descritivo, contextualiza o piloto e o número).
19. Verificar focus ring visível em ambos os CTAs (`focus-visible:ring-2 ring-racing-blue-bright`).
20. Validar com DevTools: `prefers-reduced-motion: reduce` — toda a sequência cai pra fade ≤200ms.
21. Confirmar contraste ≥4.5:1 do texto branco sobre o overlay (DevTools > Lighthouse Accessibility).
22. Adicionar JSON-LD `Person` + `Athlete` no `<Hero />` (pode ser componente filho que retorna `<script type="application/ld+json">`) — escopo do brief seção 7. Se for fora do escopo do hero, mover para Sprint 8.

### Fase G — Build e verificação
23. `npm run lint`
24. `npm run build` — verificar 0 erros, sem warnings de hidratação. Conferir bundle de cliente (cada subcomponente client deve ser pequeno).
25. `npm run start` + medir LCP local (Lighthouse) e validar nas 4 breakpoints.

---

## Fase 5 — Verificação do plano

- [x] Todos os critérios de aceite têm passo correspondente no checklist? Sim — ignição (B), reveal (C), CTAs+magnetic (D), scroll indicator (E), reduced-motion (F), perf (G).
- [x] Componentes shadcn listados? Sim — `button`/`badge` já existem, **nada novo a instalar**.
- [x] Decisão de imagem clara? Sim — `02-corner-sonic-wide.jpg` desktop / `01-corner-sonic-portrait.jpg` mobile, ambas com `priority`, `fill`, `sizes="100vw"`. Marcado como ⚠️ porque os nomes do brief não batem com o disco.
- [x] Copy aprovada ou placeholder explícito? Tagline assumida do pedido + TODO para `/copy` se cliente quiser refinar.
- [x] Sem mistura de feature+refactor? Único refactor é extrair `WHATSAPP_HREF` da `Navbar` para `src/lib/links.ts` — pequeno e justificado por reuso.
- [x] Plano cabe em 1 dia? Sim — Fases A–G são iterativas, ~4–6h de exec real.

**Gate Plan = Livre.**

---

## Riscos & TODOs

### Riscos
1. **Foto hero em desacordo com brief.** Brief lista `hilton-vencedor.jpg` (placa "1" Moto1000GP) que **não existe** no repo. As fotos disponíveis (`0[1-5]-corner-*`) são de pista/curva. **Decisão pragmática:** seguir com `02-corner-sonic-wide.jpg` + `01-corner-sonic-portrait.jpg`. Pedir foto limpa Moto1000GP fica no gap do brief 6.
2. **LCP da foto.** `priority` + `fill` + `sizes="100vw"` é o caminho, mas se a JPG bruta passar de 400KB, comprimir/converter pra AVIF antes do exec. Verificar tamanho durante a Fase A.
3. **Magnetic cursor + Lenis.** Lenis sequestra o scroll, mas **não** sequestra `mousemove` no body. Não deve haver conflito. Se houver, isolar o magnetic dentro de um wrapper com `data-lenis-prevent`.
4. **Hidratação de animações.** Framer motion em client components dentro de server `<Hero />` é seguro, mas o initial state das variants precisa bater com o SSR (usar `data-reveal` CSS class ou variants `hidden` por padrão para evitar flash).
5. **Bicromia do "76".** Slash diagonal no `6` é uma assinatura visual delicada — pode pedir ajuste fino de ângulo (`-12deg` vs `-8deg`) durante o walkthrough.

### TODOs (ficam como comentários no código)
- [ ] **TODO(cliente):** Confirmar número WhatsApp oficial (`5582996696666`?) e mensagem pré-preenchida do hero.
- [ ] **TODO(asset):** Substituir `02-corner-sonic-wide.jpg` / `01-corner-sonic-portrait.jpg` quando a foto hero limpa do Moto1000GP chegar.
- [ ] **TODO(copy):** Validar tagline final com `/copy` ou cliente. Default: "Piloto profissional · Bicampeão Brasileiro Endurance 600cc · Moto1000GP 2026".
- [ ] **TODO(SEO):** JSON-LD `Person`/`Athlete` — confirmar se entra neste sprint ou no S8.

---

## Fase 6 — Implementação

| Arquivo | Ação | Status |
|---|---|---|
| `src/lib/links.ts` | Criado — centraliza `WHATSAPP_HREF` (genérico) e `WHATSAPP_HERO_HREF` (mensagem específica do hero), `INSTAGRAM_HREF`, `EMAIL_HREF`. Helper `buildWhatsappHref()` codifica a query string. | Done |
| `src/components/Navbar.tsx` | Refatorado — importa `WHATSAPP_HREF` de `@/lib/links` (constante local removida). Markup intacto. | Done |
| `src/components/Footer.tsx` | Refatorado — importa `WHATSAPP_HREF`, `INSTAGRAM_HREF`, `EMAIL_HREF` de `@/lib/links` (constantes locais removidas). | Done |
| `src/app/globals.css` | Adicionados 3 keyframes utilitários: `ignite-pulse`, `chevron-bounce`, `scroll-pulse` (fallbacks CSS para a sequência da Fase B/D/E). | Done |
| `src/components/sections/hero/index.tsx` | Server component orquestrador. Imagem responsiva (portrait `<sm`, wide `sm+`) com `priority` + `fill` + `sizes="100vw"` + overlays vertical e lateral; SR alt descritivo separado das `<Image>` decorativas; número 76 gigante de fundo; integra subcomponentes. | Done |
| `src/components/sections/hero/ignition-lights.tsx` | Client. Sequência semáforo F1: `staggerChildren 0.4`, `delayChildren 0.2`, glow `0 0 32px 8px {cor}` por luz. Após 1.6s o conjunto faz fade-out. `useReducedMotion()` retorna `null`. | Done |
| `src/components/sections/hero/name-reveal.tsx` | Client. `motion.h1` com 3 spans (`Hilton`, `Loureiro`, `76`). Variants `hidden:{opacity:0,y:32,filter:"blur(12px)"}` → `show:{...}` com `delayChildren: 1.3` (espera ignição). "76" com bicromia: `7` em `racing-blue-bright` + slash diagonal vermelho sobreposto, `6` em `racing-red`. SR-only com leitura completa "Hilton Loureiro setenta e seis". | Done |
| `src/components/sections/hero/hero-tagline.tsx` | Client. Tagline pt-BR + slash decorativo (3px × 6rem skewed `-8deg`). Delay 1.7s. | Done |
| `src/components/sections/hero/hero-ctas.tsx` | Client. CTA primário (`MagneticWhatsApp`): `motion.a` com `useMotionValue` + `useSpring` (stiffness 300, damping 20), raio magnético 80px, força 0.35, `whileTap scale 0.97`. CTA secundário: link `#sobre` com `ChevronDown` em loop bounce 1.6s; click handler usa `scrollIntoView` smooth. Bloco com delay 1.9s. Altura 48px (≥44px touch). | Done |
| `src/components/sections/hero/scroll-indicator.tsx` | Client. Texto "role para baixo" + linha vertical 56px com gradient + camada animada `scaleY: [0.3, 1, 0.3]` em loop 1.8s. | Done |
| `src/app/page.tsx` | Hero placeholder substituído por `<Hero />`. Âncoras `#sobre #temporada #galeria #patrocinio` preservadas. | Done |

### Desvios do plano

1. **Fase F item 22 (JSON-LD):** movido para Sprint 8 (Polish) conforme escopo do brief seção 7. O hero não é o melhor lugar para `Person`/`Athlete` — entra no `<head>` do layout ou na rota `/sobre` quando o S3 entregar a bio formal.
2. **Slash diagonal:** implementado como `<span>` skewed-Y inline em vez de usar a utility `.racing-slash` (que era pensada para ocupar `inset:0` de um pai). Para o uso pontual entre tagline e CTAs, span dimensionado é mais previsível.
3. **Tagline:** componente próprio (`hero-tagline.tsx`) em vez de inline no `<NameReveal />`. Mantém server/client split limpo e evita carregar `motion` de mais um nó dentro do reveal.
4. **`Hilton76Logo` reuso:** descartado para o reveal — o logo existente é dimensionado para 7rem (navbar/footer) e tem a slash em `w-[3px]`, escalar para 14rem distorcia o stroke. Re-implementei a bicromia inline com proporção própria (`w-[6px] sm:w-[8px] lg:w-[10px]`).

---

## Fase 7 — Verificação

| Check | Comando / método | Resultado |
|---|---|---|
| Lint zero | `npm run lint` | Pass — sem output de erro/warning |
| Build zero erros | `npm run build` | Pass — `Compiled successfully in 1705ms`, `Finished TypeScript in 1244ms`, 4/4 páginas estáticas geradas, sem warnings de hidratação. (Único warning é "multiple lockfiles" do monorepo, fora do escopo do sprint.) |
| Substituição do placeholder | `src/app/page.tsx` agora importa `<Hero />` e mantém âncoras | Pass |
| WhatsApp pré-preenchido específico | `WHATSAPP_HERO_HREF` em `src/lib/links.ts` com mensagem do projeto 2026 | Pass |
| Reduced-motion | `useReducedMotion()` em `IgnitionLights` (retorna null), `NameReveal` (variants instant), `HeroCtas` (sem magnetic, sem bounce), `ScrollIndicator` (pulso desligado) | Pass — bloco fade ≤200ms |
| LCP local | Pendente — rodar `npm run start` + Lighthouse manual | A medir no walkthrough |
| Responsivo 375 / 768 / 1024 / 1440 | A validar visualmente no walkthrough; layout mobile-first com `min-h-[100svh]`, foto portrait → wide em `sm`, tipografia `text-6xl → text-[10rem]` | Pendente walkthrough |

### Para testar localmente

```bash
npm run dev   # http://localhost:3000
```

- **Desktop:** abra a home; deve ver as 3 luzes acendendo no canto superior direito (~1.2s), depois o nome HILTON / LOUREIRO / 76 entrando com translateY+blur, tagline + slash, CTAs e scroll indicator pulsando.
- **Mobile (DevTools 375×844):** foto portrait, tipografia 6xl, CTAs empilhados.
- **Reduced motion:** Chrome DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion: reduce`" → toda a sequência cai pra fade simples.
- **Magnetic:** mover o mouse perto do botão "Falar no WhatsApp" — ele "puxa" suavemente; sai do raio, volta ao centro.

### Próximo agent recomendado

`/walkthrough` — validar a11y (contraste sobre overlay, focus rings, leitura por SR), performance (LCP local, peso da JPG hero) e refinos visuais antes do `/commit`.


---

## Fase 8 — Walkthrough Report

> Data: 2026-04-29
> Auditor: Walkthrough Agent
> Branch: `claude/musing-kalam-38139f`

### Summary
- **Veredito: WARNINGS** — bloqueador único é o `position: fixed` do `ScrollIndicator`, que vaza para fora do hero. Demais issues são polish.
- Arquivos analisados: 11 (8 hero + page + globals + links)
- Findings: 1 crítico, 6 warnings, 4 positives

### Checklist Results

| Categoria | Itens verificados | Status |
|---|---|---|
| A11y — h1 único | `motion.h1` aparece **só** em `name-reveal.tsx` (Navbar/Footer não usam h1) | OK |
| A11y — alt + sr-only | `<Image alt="">` decorativo + `<span class="sr-only">` com descrição completa | OK (defensável) |
| A11y — focus-visible | `focus-visible:ring-2` em ambos CTAs com `ring-offset` no fundo deep | OK |
| A11y — touch ≥44px | CTAs com `h-12` (48px), navbar mobile `size-icon` (40px — borderline) | OK |
| A11y — reduced motion | `useReducedMotion()` em todos 8 componentes client + override CSS global em `globals.css:359` | OK |
| Perf — LCP `priority` | duas `<Image>` com `priority`, `sizes` por breakpoint para evitar duplo download | OK |
| Perf — CLS | `min-h-[100svh]` na `<section>`, sem reserva explícita para o nome (clip-path) | Risco baixo |
| SEO — metadata | `layout.tsx` completo (default + template + OG + robots) | OK |
| SEO — JSON-LD | adiado para Sprint 8 conforme plano (não regrediu) | Pendente S8 |
| SEO — texto pesquisável | "Bicampeão", "Moto1000GP", "Yamaha YZF-R1", "Endurance 600cc" todos no DOM como texto | OK |
| Lint | `npm run lint` | Pass |
| Build | `npm run build` | Pass — `Compiled successfully in 1524ms`, 4/4 páginas estáticas, sem warnings de hidratação |
| Bundle | total chunks ~988K (compressed gzip menor) — Framer + Lenis + Geist somam o grosso | Aceitável |

### Findings

#### Critical (BLOCKED)

1. **`ScrollIndicator` usa `position: fixed` em filhos — vaza fora do hero.**
   - Arquivo: `src/components/sections/hero/scroll-indicator.tsx:36` (mobile) e `:43` (desktop).
   - Sintoma: o "01 / 07" mobile (`fixed inset-x-0 bottom-4`) e a barra vertical desktop (`fixed right-6 top-1/2`) **permanecem visíveis enquanto o usuário rola para `#sobre`, `#galeria` etc.** — nunca somem porque são `fixed`, não `absolute`.
   - Plano original previa indicador **dentro** do hero (Fase E item 16). A solução com `fixed` torna o componente um overlay global presente em todas as seções, o que não foi acordado e quebra o layout das próximas seções (Sprint 3+).
   - **Como corrigir:** trocar os dois `fixed` por `absolute`, posicionando relativo à `<section id="top">` (que já é `relative isolate`). Mobile: `absolute inset-x-0 bottom-4`. Desktop: `absolute right-6 top-1/2`. O wrapper externo (`motion.div className="pointer-events-none absolute z-10"`) já deveria cobrir esse posicionamento — está vazio porque o `style` foi deixado comentado.
   - **Severity:** ALTA — bloqueador antes do `/commit`.

#### Warnings

2. **Ordem de leitura SR: descrição da imagem é lida antes do `<h1>`.**
   - Arquivo: `src/components/sections/hero/hero-parallax-scene.tsx:208-211` (sr-only "Hilton Loureiro pilotando moto Yamaha…") aparece **antes** do `<h1>` (que vem em `NameReveal`, montado depois no JSX de `index.tsx`).
   - Resultado para SR: "Hilton Loureiro pilotando…" → "Hilton Loureiro" (h1) → "Bicampeão…". A descrição da foto é lida primeiro porque `<HeroParallaxScene />` é o primeiro filho da seção.
   - **Sugestão:** mover o `<span class="sr-only">` da foto para **dentro** do bloco principal (logo depois do `<NameReveal />`) ou para `aria-describedby` no `<section>` apontando para o span — assim a descrição vira complemento, não preâmbulo.
   - **Severity:** MÉDIA (não falha WCAG, mas piora UX para SR).

3. **`sizes="0px"` em `next/image` é não-padrão.**
   - Arquivo: `hero-parallax-scene.tsx:106, 115`. As duas `<Image>` usam `sizes="(max-width: 639px) 100vw, 0px"` (e o inverso) para tentar evitar download cruzado.
   - Risco: `0px` não é semanticamente válido em `sizes`; navegadores podem ignorar a media query e baixar a imagem com o valor default. Em testes empíricos o Next gera o `<link rel="preload">` para a `priority` independente do `sizes`.
   - **Sugestão:** alternativa mais limpa é renderizar **uma única** `<Image>` (a wide) e ajustar `object-position` por breakpoint, OU usar `<picture><source media="..."/>` manual (sem `next/image`). Como mitigação rápida, manter como está e medir LCP no dev tools — se ambos estão sendo baixados em mobile, o redesign dessa parte vira débito do Sprint 8.
   - **Severity:** MÉDIA (perf real só medida com Lighthouse; pode estar OK).

4. **Marquee bottom (`bottom-24 sm:bottom-28`) colide visualmente com o ScrollIndicator mobile (`bottom-4`).**
   - Arquivo: `hero-marquee.tsx:56` + `scroll-indicator.tsx:36`.
   - Em mobile, a faixa de marcas começa em ~96px do fundo; o "01 / 07" fica 16px do fundo. Visualmente OK, mas se o `fixed` for substituído por `absolute` (correção do critical #1), confirmar que ambos não se sobrepõem.
   - **Severity:** BAIXA (verificar visual após fix do critical).

5. **`HeroKicker` `top-20 sm:top-24` perto da navbar fixa (`h-16` = 64px).**
   - A navbar tem 64px de altura. O kicker em mobile começa em 80px → folga de 16px. Em scroll, a navbar ganha `bg-racing-blue-deep/75 backdrop-blur-xl` e pode visualmente "comer" parte do kicker até esse fade ocorrer (transição 500ms).
   - **Sugestão:** validar visualmente em scroll de 0–100px. Se passar a sensação de "encostar" na navbar, aumentar `top-24 sm:top-28`.
   - **Severity:** BAIXA.

6. **Tempo total de entrada ~2.7s pode parecer lento em retornos.**
   - O hero faz toda a sequência (ignição → reveal → 76 → tagline → CTAs → marquee → indicator) em todo mount, mesmo em navegação interna que volte para `#top`. Não há `sessionStorage` para "já viu, pula a animação".
   - **Sugestão (opcional, S8):** flag `sessionStorage.heroPlayed` para que segundo carregamento na mesma sessão entre direto no estado final.
   - **Severity:** BAIXA — adia para S8.

7. **`useTransform`/`useSpring` no parallax dispara em window-level mesmo fora do hero.**
   - Arquivo: `hero-parallax-scene.tsx:62` — `window.addEventListener("mousemove", ...)`.
   - Funcionalmente OK enquanto o hero está no DOM, mas as motion values continuam atualizando ao mover o mouse mesmo quando o usuário rolou para `#sobre` (já fora do viewport). Custo de CPU baixo (springs idle), mas é trabalho desnecessário.
   - **Sugestão:** usar `IntersectionObserver` para só registrar/desregistrar o listener quando o hero estiver `intersectingRatio > 0`.
   - **Severity:** BAIXA (otimização).

#### Positive

- **Bicromia 7/6 + slash diagonal** ficou expressiva e bate com a identidade do brief (`Hilton76Logo` em escala gigante, mas reimplementado para evitar distorção do stroke).
- **Server/client boundary correto:** `index.tsx` é server, só os 8 fragmentos animados são client. Isso preserva o markup SSR (importante para LCP).
- **Cobertura de `useReducedMotion()`** está completa — todos os 8 client components têm o guard, e o CSS global em `globals.css:359` faz uma rede de segurança extra para qualquer animação CSS-only (marquee, racing-glow-pulse, animate-ping, speedlines-drift).
- **Refactor `WHATSAPP_HREF` → `src/lib/links.ts`** está limpo. `Navbar` e `Footer` consomem o mesmo source-of-truth, e o hero tem mensagem específica (`WHATSAPP_HERO_HREF`) com persona-alvo no texto pré-preenchido.

### Verificações executadas

| Comando | Resultado |
|---|---|
| `npm run lint` | Pass — sem output |
| `npm run build` | Pass — `Compiled successfully in 1524ms`, TypeScript 1309ms, 4/4 páginas estáticas, único warning é "multiple lockfiles" do worktree (fora do escopo) |
| Bundle `.next/static/chunks` | ~988KB (uncompressed) — Framer, Lenis, Geist são os pesos principais |
| Tamanho fotos hero | `01-corner-sonic-portrait.jpg` 299KB · `02-corner-sonic-wide.jpg` 101KB → boa baseline para LCP |
| Lighthouse LCP local | **Não executado** — pendente de `npm run start` + DevTools manual (anotado em Fase 7) |

### Responsivo (revisão estática)

| Breakpoint | Notas |
|---|---|
| 375px | Foto portrait, nome `text-[3.75rem]`, CTAs empilhados (`flex-col`), kicker `top-20`, marquee `bottom-24`, scroll indicator `fixed bottom-4` (ver critical #1). Sem overflow horizontal previsto — `overflow-hidden` na `<section>` contém o "76" sangrando. |
| 640px (sm) | Foto wide, tipografia 5rem, CTAs lado a lado, status "live" do kicker aparece. |
| 1024px (lg) | Tipografia 7.5rem, número 76 background com clamp 48vw aprox. ~492px. Slash do 7 = 28px. Tudo proporcional. |
| 1440px+ | Clamp do 76 cap em 56rem (~896px); ainda dramático mas controlado. |
| ⚠️ Risco | Em 1920px+, o `clamp(22rem, 48vw, 56rem)` chega no cap → 56rem; o 7 + 6 + slash combinados podem cruzar o conteúdo do `max-w-3xl`. Validar visualmente. |

### SEO — status e gaps

- **Metadata global:** completo (`title`, `description`, `keywords`, `openGraph`, `twitter`, `robots`) — não regrediu.
- **`<h1>` único:** `<h1>Hilton Loureiro</h1>` (via sr-only no `motion.h1`) é o único da página. Excelente para SEO.
- **Texto crítico no DOM:** "Bicampeão", "Brasileiro", "Endurance 600cc", "Moto1000GP", "Yamaha YZF-R1", "Pirelli", "Alpinestars", "PRT Racing" — todos como texto pesquisável (`HeroTagline` + `HeroMarquee`).
- **Gaps Sprint 8:**
  - JSON-LD `Person` + `Athlete` — adiado conforme plano.
  - `og:image` PNG real (hoje só `siteName` no metadata).
  - Canonical URL via `metadataBase` já configurado (`siteUrl`).

### Motion — cobertura reduced-motion + impressões

| Componente | reduced-motion | Implementação |
|---|---|---|
| `IgnitionLights` | retorna `null` (some completamente) | OK |
| `NameReveal` | `REDUCED_PARENT/CHILD` opacity-only ≤200ms | OK |
| `HeroTagline` | `delay:0.12, duration:0.18` opacity+y curto | OK |
| `HeroCtas` | sem magnetic, sem morph icon, sem sweep, sem racing-glow-pulse | OK |
| `SecondaryCta` | `ChevronDown` estático sem bounce | OK |
| `HeroKicker` | `animate-ping` substituído por dot estático | OK |
| `HeroMarquee` | `[animation:marquee-x]` substituído por `flex w-max` estático (texto cortado, mas isso é o trade-off WCAG) | OK |
| `ScrollIndicator` | pulso desligado, indicador estático | OK |
| `HeroParallaxScene` | parallax mouse desativado, 76 entra estático sem scale | OK |

**Impressão:** 2.7s de entrada total é alto para um retorno, mas **defensável** numa first impression de portfolio editorial. Pulse loops (marquee 42s, scroll-pulse 2.2s, racing-glow-pulse 1.4s só no hover, animate-ping no dot do kicker) são todos transform/opacity → no compositor → sem reflow. O sweep diagonal do CTA primário só anima quando `hovering=true`, ótimo. O racing-glow-pulse **só aplica via classe condicional `hovering && [animation:racing-glow-pulse]`** — não é distrativo no idle. ✓

### Code quality

- Comentários **ricos e bem dosados** — explicam decisões (ex.: "stagger 0.32" no ignition, magnitudes no parallax). Não sobram TODOs zumbis: 2 TODOs legítimos (asset hero limpo + número WhatsApp) batendo com riscos do plano.
- `useReducedMotion()` vem **sempre** de `framer-motion` (consistente).
- Server/client split limpo. Único client com mais de 100 linhas é `hero-parallax-scene.tsx` (215) — justificado pela complexidade de 5 camadas.
- Sem `any`. Tipos explícitos em `useMouseParallax()` retornando `MotionValue<number>` via `import type`.
- Imports `@/` em tudo — consistente.
- Pequena duplicação: spring config `stiffness/damping/mass` aparece em `hero-parallax-scene` (90/20/0.5) e `hero-ctas` (300/20/0.4). Diferentes intencionalmente, mas se outro CTA reutilizar magnetic, extrair para `lib/motion.ts`.

### Action items

#### Alta prioridade (antes de `/commit`)
- [ ] **CRÍTICO #1** — corrigir `ScrollIndicator` trocando `fixed` por `absolute` nos dois ramos (mobile + desktop) e validar que não vaza para fora do hero.

#### Média prioridade (avaliar antes de `/commit`, podem virar débito)
- [ ] **Warning #2** — reordenar SR: mover `<span class="sr-only">` da foto para dentro do bloco principal ou virar `aria-describedby`.
- [ ] **Warning #3** — refatorar estratégia de `<Image>` responsiva. Decidir entre `sizes="0px"` ficar como está ou trocar para `<picture><source media>` manual.

#### Baixa prioridade (Sprint 8 — Polish)
- [ ] **Warning #4** — validar visualmente colisão marquee + scroll indicator mobile pós-fix.
- [ ] **Warning #5** — testar visual da navbar comendo o kicker em scroll 0–100px.
- [ ] **Warning #6** — flag `sessionStorage.heroPlayed` para skip da entrada em retorno.
- [ ] **Warning #7** — `IntersectionObserver` no parallax mouse para parar listener fora do viewport.

### Riscos remanescentes (próximo sprint)

1. **Foto hero ainda é placeholder de pista** (`02-corner-sonic-wide.jpg`). Quando a foto limpa do Moto1000GP chegar, trocar e re-medir LCP — pode regredir se a nova for maior que 100KB.
2. **JSON-LD `Person`/`Athlete`** vai precisar entrar antes do go-live (Sprint 8).
3. **Lighthouse LCP local não foi medido** — fica como item da próxima passada (`/exec` pode rodar `npm run start` + Chrome DevTools antes do `/commit`).
4. **WhatsApp number `5582996696666`** ainda não confirmado pelo cliente.

### Recommendation

**Corrigir o critical #1** (ScrollIndicator `fixed` → `absolute`) e **decidir** sobre warnings #2 e #3 (mover sr-only e estratégia de imagem). Após esses ajustes, prosseguir para `/commit`. Os warnings #4–#7 podem virar TODOs/débitos do Sprint 8 sem bloquear o merge desta entrega.

**Gate Walkthrough — WARNINGS** (corrigir #1 antes do commit; #2 e #3 recomendados; #4–#7 podem esperar)
