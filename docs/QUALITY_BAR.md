# Quality Bar — Landing Hilton Loureiro

> **Documento permanente.** Toda LLM ou desenvolvedor que tocar neste projeto deve ler isto antes de implementar UI.
> A barra aqui é **alta de propósito** — esta landing não pode parecer um template. Tem que parecer Awwwards SOTD.

---

## 1. O que estamos construindo

Site oficial de **piloto profissional brasileiro** (Hilton Loureiro · Moto1000GP 2026 · Bicampeão Brasileiro Endurance 600cc 2024–2025) cuja persona-alvo número 1 é **patrocinador** (CMO de marca regional, dono de empresa). A landing existe para **fechar conversas comerciais**, não para entreter.

Mas ela tem que **parecer cinema**. Patrocinador profissional bate o olho e percebe na primeira fração de segundo: "este projeto tem nível, eu quero meu logo aqui".

---

## 2. Vibe-check rápido — referências mentais

A landing tem que dar **uma dessas sensações**:

- ✅ **Capa de revista esportiva** (estilo *Red Bulletin*, *MotoGP Magazine*, *The Players' Tribune*) — tipografia gigante, números massivos, hierarquia editorial
- ✅ **Site de piloto F1/MotoGP profissional** (Marc Márquez, Pecco Bagnaia, Lewis Hamilton) — preto/dark dominante, foto cinemática, identidade gráfica forte
- ✅ **Awwwards Site of the Day em motoesporte / lifestyle premium** — animação cinematográfica, mouse parallax, scroll storytelling, signature moments
- ✅ **Pôster esportivo Nike/Adidas em movimento** — dois ou três elementos GIGANTES dominando a tela, contraste violento entre escala micro (mono labels) e macro (display tipografia)

E **não pode dar** essas sensações:

- ❌ Template Tailwind UI / Vercel boilerplate / "create-next-app deluxe"
- ❌ Site institucional de academia / startup / SaaS B2B
- ❌ Site pessoal "olá, sou desenvolvedor" / portfólio genérico
- ❌ Hero centralizado com headline 48px + subtitle + 2 botões pastel
- ❌ Animações de entrada genéricas (fade-up, stagger 0.1s) sem assinatura visual

Se ao olhar uma seção pronta você consegue dizer "isso poderia estar em qualquer landing" — **refaça**.

---

## 3. Pilares de qualidade visual

### 3.1 Tipografia em camadas

- **Display** (Anton, Bebas-tier condensada bold): nome, números, headlines de seção. Tamanho **gigante** — mínimo `text-6xl` em mobile, `clamp(22rem, 48vw, 56rem)` para elementos protagonistas (números de corrida).
- **Heading** (Saira Condensed 700/900, italic em ênfases): subtítulos, labels de bloco.
- **Body** (Geist Sans): parágrafos curtos, sempre.
- **Mono** (Geist Mono): números, datas, coordenadas, kicker labels editoriais ("ED. 2026 · Nº 76 · ALAGOAS / BR").

Sempre que possível, **misturar pelo menos 2 das 4** numa mesma seção pra criar contraste tipográfico (mono micro + display macro = lê como capa de revista).

Tratamento **outline + fill** em headlines longas (uma linha em outline, outra sólida) é a assinatura do projeto. Vide hero (`HILTON` outline / `LOUREIRO` sólido).

### 3.2 Identidade gráfica recorrente

Toda seção deve ter **pelo menos um** dos elementos abaixo (idealmente dois):

- **Slash diagonal vermelho** (`bg-racing-red`, skew/rotate, espessura 3–28px conforme escala) — separador, ênfase, ou elemento estrutural
- **Número 76 gigantesco** como background graphic (escala fora-do-grid, sangrando pra fora da viewport)
- **Speedlines** diagonais ambient (CSS `repeating-linear-gradient`, drift sutil 28s+ infinite, opacity ≤ 5%)
- **Cortes diagonais** em containers de imagem (`clip-path: polygon(...)`)
- **Grain noise** SVG sobre fundo (`mix-blend-mode: overlay`, opacity ~0.5) — dá textura analógica/film
- **Marquee horizontal** infinito com palmarés/marcas em mono micro
- **Kicker labels** editoriais nos cantos da seção (estilo "edição/número/origem" de capa)

### 3.3 Paleta — disciplina

Tokens em `src/app/globals.css`. **Nunca hex direto em componentes.**

- `--racing-blue-deep` — fundo dominante (90% da tela é isso)
- `--racing-blue` — surfaces, cards
- `--racing-blue-bright` — acento Sonic, links, focus rings, números outline
- `--racing-red` — slash, CTA primário, mark protagonista (ex.: "6"). **Acento, não dominante** — não use red como bg de seção inteira
- `--racing-yellow` — highlight Pirelli em palavras-chave (`<span>Bicampeão</span>`, `<span>600cc</span>`). **Pontual, não decorativo** — máximo 2–3 palavras por bloco
- `--racing-white` — tipografia primária sobre escuro
- `--racing-mute` — texto secundário e ícones em estado idle

A landing é **dark por padrão**. Light mode não é prioridade.

---

## 4. Motion language — o que separa "site bom" de "site premiado"

> **Regra de ouro:** se removendo as animações o site continuar "OK", as animações estavam **fracas demais**. Animação não é decoração — é narrativa.

### 4.1 Cada seção precisa de uma "signature"

Uma seção sem assinatura de movimento é uma seção em branco. Hero (S2) entrega a barra: ignição F1 + flash radial + clip-path mask por linha + reveal do 76 + parallax mouse + marquee + glow racing pulsante no CTA hover.

Outras seções (S3–S7) têm que ter algo análogo — **decidido na fase `/plan`**, nunca improvisado. Exemplos do brief:

- **Sobre / Palmarés**: timeline com pinning (GSAP ScrollTrigger), ano-a-ano com counter animado dos títulos
- **Temporada 2026**: mapa do Brasil interativo com 8 pinos animados (ondas de chegada do circuito quando entra no viewport)
- **Galeria**: hover causa duotone vermelho rápido + zoom 1.05; lightbox com transição shared-element
- **Patrocínio**: número de patrocinadores anteriores conta de 0 ao valor real ao entrar viewport; CTA forte com micro-shake feedback
- **Marcas**: logos entram em stagger com leve drift horizontal (esteira de pista)

### 4.2 Hierarquia de timing

- **Entrada de seção (`viewport`-triggered)**: stagger 80–120ms, duration 600–900ms, ease `[0.16, 1, 0.3, 1]` (cubic-bezier "out-expo")
- **Hover/interação**: 200–300ms, ease-out
- **Loop ambient** (marquee, glow pulse, scroll pulse): 1.5–60s, sempre `transform`/`opacity` (no compositor)
- **Sequência cinematográfica** (hero, qualquer entrada "uau"): pode ir até **3s** total. Acima disso, frustra.

### 4.3 `prefers-reduced-motion` é não-negociável

Toda animação tem fallback ≤200ms opacity-only. Já está protegido por `globals.css:@media (prefers-reduced-motion: reduce)` mas cada componente client deve usar `useReducedMotion()` explicitamente para escolhas mais finas (ex.: `IgnitionLights` retorna `null`).

### 4.4 Bibliotecas

- **Framer Motion**: padrão para variants, stagger, magnetic cursors, mouse parallax via `useMotionValue` + `useSpring`. **Já é o default.**
- **GSAP + ScrollTrigger**: reservado para timelines com pinning (mapa do Brasil, timeline de palmarés). Disponível no projeto, não usar gratuitamente.
- **Lenis**: smooth scroll global, já configurado no layout.
- **CSS keyframes** em `globals.css`: para animações simples em loop (marquee, glow pulse, ambient drift).

---

## 5. Arquitetura de componentes — padrão emergente

Padrão consolidado no Sprint 2 (Hero) e que **se aplica a toda seção complexa**:

```
src/components/sections/<seção>/
├── index.tsx                    # SERVER component, orquestrador
├── <seção>-parallax-scene.tsx  # CLIENT, foto + overlays + parallax mouse
├── <seção>-<bloco-1>.tsx       # CLIENT, bloco animado pequeno
├── <seção>-<bloco-2>.tsx       # CLIENT, ...
└── use-<seção>-...ts            # hooks compartilhados (skip, observers)
```

- `index.tsx` server preserva markup SSR para LCP
- Fragmentos animados são clients pequenos e isolados
- Hooks compartilhados ficam no mesmo diretório da seção, não em `src/lib`
- Fotos usam `<picture>` + `getImageProps` (uma única `<img>` no DOM, browser escolhe srcset por media query) — **não** dois `<Image>` com `display:hidden` por breakpoint

---

## 6. Acessibilidade — checklist por seção

Antes de fechar uma seção, validar:

- [ ] `<h1>` único na página (apenas o hero); demais seções usam `<h2>` em diante
- [ ] Hierarquia de heading sequencial (não pular níveis)
- [ ] `alt=""` em imagens decorativas; descrição via `aria-describedby` quando necessário
- [ ] Contraste ≥ 4.5:1 (texto sobre foto sempre com overlay gradient + opcional drop-shadow)
- [ ] Alvo touch ≥ 44px (preferimos 48px = `h-12`)
- [ ] Focus rings visíveis (`focus-visible:ring-2 ring-racing-blue-bright`)
- [ ] Animações em loop pausam em `prefers-reduced-motion`
- [ ] Texto crítico de SEO **no DOM** como texto, não em imagem (palmarés, marcas, palavras-chave)

---

## 7. Performance — alvos não-negociáveis

- **LCP** < 2.5s (foto hero é o LCP — deve ter `priority` + dimensões corretas)
- **CLS** < 0.1 (clip-path e fontes web não devem causar shift; `next/font` resolve)
- **INP** < 200ms (mousemove gateado por IntersectionObserver, animações no compositor)
- Imagens: `quality={75}` (alinhado com `images.qualities` default), formato AVIF/WebP via `next/image`
- Bundle: minimizar client components, usar dynamic imports para libs pesadas só quando necessário

---

## 8. Como reconhecer que uma entrega está "Awwwards-tier"

Antes de marcar um sprint como pronto, faça **o teste do screenshot**:

1. Tire um print da seção em desktop (1280–1440px)
2. Cole numa pasta `screenshots/<nome>.png`
3. Pergunte a si mesmo (ou peça pra outra LLM olhar):
   - Se eu visse essa imagem num feed de Awwwards/Behance, eu daria scroll pra ver mais? **Tem que ser sim.**
   - Eu consigo identificar o "personagem principal" da composição na primeira fração de segundo? **Tem que ser sim.**
   - Tem pelo menos 3 camadas de profundidade visual (background → mid → foreground)? **Tem que ser sim.**
   - O texto principal usa **escala dramática** (não `text-3xl text-4xl`, mas `text-[7.5rem]` ou maior)? **Tem que ser sim.**
   - Tem pelo menos um elemento gráfico não-tipográfico dominante (slash, número fora do grid, foto sangrada)? **Tem que ser sim.**

Se alguma resposta for "não" — **a seção não está pronta**. Volte pra `/plan` ou direto pro código e amplie a ousadia.

---

## 9. O que NÃO entra na landing

Para preservar a barra:

- Cards genéricos com border-radius padrão e padding 24px
- Botões pastel sem estado de hover marcante
- Hero com headline em `text-5xl` centralizado e dois CTAs em flex-row
- Grid de 3 colunas com ícone-título-parágrafo
- "Receba novidades por email" com input + botão
- Carrossel de depoimentos clichê
- Gradiente diagonal multicolor (estilo SaaS 2018)
- Lottie animações genéricas
- Stock photos de pessoas sorrindo
- Frases motivacionais: *garra · raça · sangue nas veias · paixão por velocidade · contra todos · nunca desistir* (banido pelo brief)

---

## 10. Copy — tom de voz

Detalhe completo em [`tasks/00-brief.md`](../tasks/00-brief.md) seção 3. Resumo:

- **Direto, confiante, com peso esportivo. Sem clichê motivacional.**
- Específico ("Bicampeão Brasileiro Endurance 600cc 2024–2025"), nunca abstrato ("uma trajetória de paixão")
- Verbos ativos em CTAs: *Conhecer, Ver, Conversar, Acompanhar, Falar com*
- pt-BR, construções naturais (não tradução literal de inglês)
- Highlight pontual em amarelo (1–3 palavras por bloco) para palavras-chave de identidade

---

## 11. Workflow — quando consultar este documento

| Momento | O que fazer |
|---|---|
| Antes de `/plan` de uma nova seção | Reler §3 (pilares) e §4 (motion) para calibrar o escopo |
| Durante `/exec` | Cada componente novo deve respeitar §5 (arquitetura) e §6 (a11y) |
| Antes de fechar `/walkthrough` | Rodar §8 (teste do screenshot) |
| Quando a entrega "tá OK" mas falta algo | É exatamente o sintoma do §9 — a entrega virou template. Volta e amplia. |

---

**Última revisão:** após Sprint 2 (Hero) — define a barra que as próximas seções têm que igualar ou superar.
