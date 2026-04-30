# Sprint — Patrocínio (`#patrocinio`)

> **Gate Plan = Livre** (após aprovação do usuário)

---

## Fase 1 — Scope

### Objetivo

Construir a seção comercial **"Para sua marca"** (`#patrocinio`) — peça mais importante da landing do ponto de vista de conversão — que **explica o que o sponsor recebe**, mostra ativações concretas (capacete, traje, moto, redes, presença em pista), exibe os patrocinadores atuais como prova social e fecha com um CTA WhatsApp **dedicado** com mensagem pré-preenchida específica de patrocínio.

### Contexto

- **Pedido:** complementar o pipeline comercial da landing. Hoje todos os CTAs empurram pro WhatsApp, mas nenhuma seção entrega o pitch — quem clica chega frio.
- **Propósito duplo da landing:** (1) vender patrocínio do Hilton; (2) servir de portfolio awwwards-tier do Vinicius. Sarrafo é "premium real", não "boa o bastante".
- **Posição na ordem do site:** entre `Temporada` e `Galeria` (placeholder atual em `src/app/page.tsx` linha 27, e item 4 do `Navbar` — confirmado em `src/components/Navbar.tsx` linha 26).
- **Personas em ordem de prioridade:** patrocinador (CMO regional, dono de empresa) > mídia > fã.

### Escopo

- **Heading editorial** "Para sua marca" com slash + char-reveal/clip-path mask (mesmo nível visual do `SobreHeading`)
- **Pitch principal — 3 stats massivos** (alcance / etapas / audiência) usando o **mesmo `<FlipCounter>`** já usado em `SobreStats` (consistência visual obrigatória)
- **Grid de ativações** (5 itens: capacete, traje, moto/livery, redes sociais, presença ao vivo) com tratamento editorial premium
- **Showcase dos patrocinadores atuais** (Garagem 57, Formafit, AC Vitha Clinic, Brasil da Sorte) com tipografia tratada
- **CTA final dedicado** "Falar sobre patrocínio" com `WHATSAPP_PATROCINIO_HREF` novo
- **Transições entre seções** via `<SectionDivider>` na entrada (Temporada → Patrocínio) e na saída (Patrocínio → próxima)
- Reuso de utilitários `racing-number-bg`, `racing-slash`, tokens em `globals.css`
- `useReducedMotion` honrado em todos os clients

### Não-escopo

- Logos vetoriais dos patrocinadores (cliente não entregou — vamos com tipografia tratada)
- Tabela de cotas (Diamond/Gold/Silver) com preços — qualifica via WhatsApp
- Modal/PDF de mídia kit — entregue por WhatsApp pelo Hilton
- Formulário inline (e-mail/orçamento) — decisão estratégica é WhatsApp único
- Carrossel de cases anteriores (sem dados ainda)
- Vídeos (peso de bundle desnecessário)
- Animação 3D do capacete/livery (overhead grande)
- Novas dependências em `package.json`

### Critérios de aceite

- [ ] Seção `#patrocinio` substitui o placeholder em `src/app/page.tsx` linha 27
- [ ] Acessível via clique em "Para sua marca" no navbar (âncora já existe — não mexer no `Navbar.tsx`)
- [ ] Heading "Para sua marca" com reveal char-by-char + slash crescente (não fade genérico)
- [ ] 3 stats massivos com `<FlipCounter>` animando 0 → valor (mesmo padrão de `SobreStats`)
- [ ] Grid de 5 ativações com tratamento editorial (clip-path / borda / hover scale 3D — não fade puro)
- [ ] Bloco de patrocinadores atuais com 4 nomes em tipografia tratada e reveal sequencial
- [ ] CTA primário "Falar sobre patrocínio" abrindo WhatsApp com mensagem **diferente** do hero CTA
- [ ] Mensagem do `WHATSAPP_PATROCINIO_HREF` exportada em `src/lib/links.ts`, claramente diferenciada
- [ ] Transição de entrada e saída via `<SectionDivider>` — não cut seco
- [ ] Reveals dramáticos em todos elementos de copy (zero fade-in genérico — banidos por `MOTION_PHILOSOPHY.md`)
- [ ] Responsivo 375 / 768 / 1024 / 1440
- [ ] Contraste WCAG AA ≥ 4.5:1
- [ ] Touch targets ≥ 44×44 (CTA com `h-12 min-w-[15rem]`)
- [ ] `npm run lint` e `npm run build` zero erros
- [ ] Sem novas dependências no `package.json`

### Premissas (warning)

- (warning) **Stats numéricos são placeholders plausíveis** marcados com `TODO(cliente)`. Sugestão inicial:
  - **8 etapas** em 2026 (já confirmado via `temporada-data.ts`)
  - **+2 milhões** de impressões/temporada (estimativa Moto1000GP — TODO confirmar)
  - **+50k** seguidores agregados em redes (TODO confirmar com Hilton)
  - Alternativas se cliente preferir números próprios: "13 temporadas", "+100 corridas", "6 títulos"
- (warning) **Patrocinadores atuais aparecem em ambos** — marquee do hero (teaser/prova social) E seção patrocínio (com tratamento editorial maior). Justificado em §3.7.
- (warning) **Mensagem do CTA WhatsApp** proposta inicial: *"Olá Hilton, vim pelo site oficial e quero conversar sobre patrocínio na temporada Moto1000GP 2026. Pode me enviar o projeto comercial?"*. Final fica a critério do cliente.
- (warning) **Imagens das ativações**: por padrão **sem foto** — só ícone Lucide + tipografia. Justificado em §3.11.
- (warning) **Categoria atual**: vamos com Moto1000GP 2026 (consistente com `temporada-data.ts`).

### Bloqueadores / perguntas ao usuário

Nenhum bloqueador hard. Soft (responder na execução ou no walkthrough):

1. **Os 3 números de stat** — confirmar quais entram e valores reais. Default vai com placeholder + TODO.
2. **Texto exato da mensagem WhatsApp** do CTA.
3. **Logos dos patrocinadores** — vamos com tipografia editorial; se cliente prefere logos reais, precisa entregar SVG/PNG.

---

## Fase 2 — Evidências

| Arquivo | Linhas-âncora | Por quê |
|---------|---------------|---------|
| `src/app/page.tsx` | linha 27 (`<section id="patrocinio">`) | Placeholder a substituir |
| `src/components/Navbar.tsx` | linha 26 | Âncora `#patrocinio` já registrada — não mexer |
| `src/lib/links.ts` | inteiro (35 linhas) | Adicionar `WHATSAPP_PATROCINIO_HREF` |
| `src/components/sections/sobre/sobre-stats.tsx` | inteiro | Padrão de stats (FlipCounter + barra + index + reveal) |
| `src/components/sections/sobre/sobre-heading.tsx` | inteiro | Padrão de heading editorial (kicker + char-reveal + slash) |
| `src/components/sections/temporada/index.tsx` | inteiro | Padrão de seção (Server orquestrador + Clients + "76" gigante) |
| `src/components/sections/hero/hero-marquee.tsx` | linhas 20–25 | Lista de SPONSORS (manter sincronizado) |
| `src/components/sections/hero/hero-ctas.tsx` | inteiro | Padrão de CTA primário com sweep, ícone morph, glow racing |
| `src/components/motion/section-divider.tsx` | variantes slash / 76 / ticker | Escolher transition entre seções |
| `src/components/motion/{char-reveal,mask-reveal,flip-counter}.tsx` | API pública | Primitivos reutilizáveis — não recriar |
| `docs/MOTION_PHILOSOPHY.md` | inteiro | Anti-padrões; nenhum fade genérico |
| `tasks/00-brief.md` §1, §2, §4 | bio + personas + identidade | Tom de voz e paleta |

---

## Fase 3 — Decisões de design

### 3.1 Composição visual e ordem dos elementos

```
[ Temporada ]
   v  SectionDivider variant="slash" numerator=["04","05"] label="Para sua marca"

  <section id="patrocinio">  bg-racing-blue-deep + "76" gigante assimétrico de fundo

  1. PatrocinioHeading
     - Kicker mono "05 / Para sua marca"
     - H2 char-reveal "Para sua marca"
     - Slash vermelho cresc + linha decor
     - Subtítulo editorial (1 frase)

  2. PatrocinioPitch (parágrafo curto editorial)
     - pull-quote estilo SobreBio
     - 2-3 parágrafos cascata (TODO copy validar)

  3. PatrocinioStats (3 contadores massivos com FlipCounter)
     - "08" Etapas Moto1000GP 2026
     - "2M+" Impressões previstas (TODO cliente)
     - "50K+" Audiência em redes (TODO cliente)

  4. PatrocinioAtivacoes (grid editorial)
     - 5 cards: Capacete · Traje · Moto · Redes · Pista
     - desktop: split asymmetric (3+2 ou 2+3)
     - mobile: stack vertical

  5. PatrocinioSponsors (showcase patrocinadores atuais)
     - Label "Quem já está na livery"
     - 4 nomes em tipografia tratada (não logos cinza)

  6. PatrocinioCta (CTA primário dedicado)
     - Pull-headline grande "Sua marca cabe aqui."
     - CTA "Falar sobre patrocínio" -> WhatsApp dedicado
     - Reassure line: "Resposta direta com o piloto."

   v  SectionDivider variant="ticker" label="Galeria"
[ Galeria / Contato ]
```

### 3.2 Estrutura de arquivos

```
src/components/sections/patrocinio/
├── index.tsx                       # Server orquestrador (sem "use client")
├── patrocinio-heading.tsx          # Client — kicker + char-reveal + slash
├── patrocinio-pitch.tsx            # Client — pull-quote + parágrafos
├── patrocinio-stats.tsx            # Client — 3x FlipCounter (replica SobreStats)
├── patrocinio-ativacoes.tsx        # Client — grid editorial 5 itens
├── patrocinio-ativacao-card.tsx    # Client — card individual com hover
├── patrocinio-sponsors.tsx         # Client — showcase tipográfico
├── patrocinio-cta.tsx              # Client — CTA WhatsApp dedicado
└── patrocinio-copy.ts              # (puro) — copy pt-BR centralizada
```

> Justificativa da copy isolada: facilita iteração com o cliente sem mexer em motion / componentes. Mesmo padrão dos `temporada-data.ts`.

### 3.3 Estratégia de motion por elemento

| Bloco | Técnica primária | Técnica secundária | Trigger |
|-------|------------------|--------------------|---------|
| Heading | CharReveal no H2 ("Para sua marca") | Slash scaleX 0->1 + linha decor scaleX 0->1 em sequência | useInView amount: 0.3, once: true |
| Kicker "05/..." | slide-in lateral x: -28 -> 0 | Linha curta scaleX | mesmo container do heading |
| Pull-quote | x: -32 -> 0 + barra vermelha scaleY 0->1 | — | parent stagger |
| Parágrafos | cascata y: 24 -> 0 com staggerChildren 0.18 | — | useInView amount: 0.15 |
| Stats | FlipCounter (3D flip per dígito) + barra vermelha scaleX 0->1 + clip-path mask reveal vertical | Index "01/02/03" mono | useInView amount: 0.2 |
| Cards de ativação | clip-path mask reveal diagonal (MaskReveal direction="diagonal") com stagger | Hover: tilt 3D leve (rotateY +/-3deg) + sweep diagonal vermelho | whileInView |
| Sponsors (4 nomes) | Char-reveal por nome com stagger entre nomes | Diamond vermelho separador (rotacionado 45deg) | useInView amount: 0.4 |
| CTA pull-headline | Char-reveal + scale leve (0.92 -> 1) | — | useInView |
| CTA botão | Reuso do padrão WhatsAppCta do hero (sweep + icon morph + glow) | — | hover/focus |
| "76" de fundo | scroll-driven parallax y: -40 -> 40 ao longo do scroll da seção | — | useScroll target |
| Divider entrada | SectionDivider variant="slash" numerator=["04","05"] label="Para sua marca" | — | scroll |
| Divider saída | SectionDivider variant="ticker" label="Galeria" ou variant="76" | — | scroll |

**Conformidade com `MOTION_PHILOSOPHY.md`:** todos os elementos têm pelo menos 1 reveal dramático (não fade puro), parallax do "76", microinteractions nos cards (tilt 3D), counters elaborados (FlipCounter), e transição entre seções via SectionDivider. Mobile mantém versões simplificadas (sem tilt 3D, sem parallax — só clip-path reveal).

### 3.4 Tokens / paleta

| Elemento | Token |
|----------|-------|
| Background da seção | `bg-racing-blue-deep` (continuidade) |
| "76" de fundo | `text-racing-white/[0.045]` |
| Heading principal | `text-racing-white` |
| Slash + barras vermelhas + ring CTA | `bg-racing-red` |
| Subtítulo / labels mono | `text-racing-mute` |
| Stats número | `text-racing-white` (font-display) |
| Stats label | `text-racing-mute` (font-mono uppercase tracking-[0.35em]) |
| Cards ativação — borda | `border-racing-white/10` -> hover `border-racing-blue-bright/60` |
| Cards ativação — overlay sweep hover | gradient `racing-red/20 -> transparent` |
| Sponsors — nome | `text-racing-white` (font-heading bold) |
| Sponsors — separador | `bg-racing-red` (diamond rotacionado, como em hero-marquee) |
| CTA primário (Patrocínio) | `bg-racing-red text-racing-white` (idêntico ao hero, intencional — consistência) |

**Sem hex direto.** Todos via tokens semânticos do `@theme inline` em `globals.css`.

### 3.5 Tipografia

| Bloco | Família | Tamanho |
|-------|---------|---------|
| H2 "Para sua marca" | font-heading (Saira Condensed) | clamp(3.5rem, 9vw, 7.5rem) — consistente com SobreHeading |
| Pull-quote | font-heading bold uppercase | text-xl sm:text-2xl lg:text-3xl |
| Stats número | font-display (Anton/Bebas) | clamp(3rem, 7vw, 5.5rem) |
| Stats label | font-mono | text-[10px] uppercase tracking-[0.35em] |
| Cards título | font-heading uppercase | text-base sm:text-lg |
| Cards descrição | font-sans | text-sm leading 1.6 |
| Sponsors nome | font-heading bold uppercase | text-2xl sm:text-3xl lg:text-4xl tracking-tight |
| CTA pull-headline | font-display | clamp(2.25rem, 5vw, 4rem) |

### 3.6 Responsividade

| Breakpoint | Layout |
|------------|--------|
| 375px | Vertical: heading -> pitch -> stats (1 col) -> ativações (1 col stack) -> sponsors (1 col stack) -> CTA centralizado |
| 768px | Stats em 3 cols, ativações em 2 cols (último ocupa full), sponsors inline com diamond separador |
| 1024px | Stats 3 cols com gutter generoso, ativações grid asymmetric 12-col (3+2 ou 2+3), sponsors em linha horizontal |
| 1440px | max-w-7xl com gutters, "76" gigante posicionado fora do grid à direita |

### 3.7 Decisão sobre redundância patrocinadores Hero <-> Patrocínio

**Decisão: aparecem em ambos.**

**Por quê:**
- Hero marquee = teaser silencioso, prova social subliminar pra todas as audiências
- Seção Patrocínio = pitch comercial explícito, com tratamento tipográfico editorial maior (font-heading bold no lugar de tracking-[0.32em] discreto)
- Não é repetição visual — é o mesmo conteúdo em dois pesos editoriais diferentes, casando com o ritmo da landing (teaser -> pitch)
- Análoga ao "76" que aparece em SOBRE, TEMPORADA e PATROCÍNIO — é deliberado, parte da identidade

**Alternativa rejeitada:** remover do hero marquee -> perde-se prova social no primeiro contato.

### 3.8 Acessibilidade

| Item | Implementação |
|------|---------------|
| Heading | h2 id="patrocinio-heading" + section aria-labelledby="patrocinio-heading" |
| Stats | cada stat com aria-label descritivo (ex: "8 etapas no Campeonato Moto1000GP 2026") |
| Cards ativação | article com h3 interno (heading sequencial: h2 da seção -> h3 dos cards) |
| CTA | a real para WHATSAPP_PATROCINIO_HREF com target="_blank" rel="noopener noreferrer", aria-label explícito |
| Sponsors | ul aria-label="Patrocinadores oficiais 2026" com li semânticos |
| Focus visible | ring --racing-blue-bright em todos botões/links (padrão já usado nas outras seções) |
| Touch >=44px | CTA com h-12 min-w-[15rem] (mesmo do hero) |
| Contraste | racing-white sobre racing-blue-deep ~14:1 OK; racing-red sobre racing-blue-deep ~5:1 OK |
| Reduced-motion | useReducedMotion em todos components — fallback fade simples |

### 3.9 Copy proposta (pt-BR)

> Marcada com TODO(cliente) onde precisa de validação. Tom: direto, peso esportivo, sem clichê motivacional ("garra", "raça", "paixão" — banidos pelo brief).

**Heading kicker:** `05 / PARA SUA MARCA`

**H2:** `Para sua marca`

**Subtítulo:** `Patrocinar o Hilton 76 é estar em pista nacional, oito vezes em 2026.`

**Pull-quote:** `Oito etapas. Cobertura nacional. Um número.`

**Parágrafos do pitch:**

1. Hilton Loureiro corre o Campeonato Brasileiro Moto1000GP 2026 com presença em **oito etapas** distribuídas entre São Paulo, Goiânia, Curvelo, Cascavel, Santa Cruz do Sul e Cuiabá. Todas com transmissão ao vivo e cobertura editorial. — TODO(cliente): confirmar lista de transmissoras.

2. Patrocinar é mais que estar na livery. É aparecer em capacete, traje, moto, redes sociais, transmissão e conteúdo de bastidores — em oito fins de semana de circuito ao longo do ano.

3. Um portfólio enxuto de marcas-parceiras já está na temporada atual. (linka pro showcase abaixo)

**Stats labels:**

- 01 — Etapas em 2026 · valor: `8`
- 02 — Impressões previstas · valor: `2.000.000` — TODO(cliente) confirmar (display final pode ser "2M+" ou flip 0->2 com sufixo)
- 03 — Audiência em redes · valor: `50.000` — TODO(cliente) (display: "50K+")

**Ativações (5 cards):**

1. **Capacete LS2** — Slot premium em todas as transmissões — close de câmera no grid e na premiação.
2. **Traje Alpinestars** — Logos no peito, ombro e costas. Visível em pódio, entrevistas e foto oficial da equipe.
3. **Moto Yamaha #76** — Adesivagem na carenagem, rabeta e sub-frame. Posições por cota.
4. **Redes sociais** — Instagram do piloto + cobertura de bastidores em Reels e Stories durante a semana de corrida. — TODO(cliente): confirmar handles/canais.
5. **Presença na pista** — Hospitalidade no box em até 2 etapas/ano por cota Diamond. — TODO(cliente): confirmar política de hospitalidade.

> Decisão de execução: começar com o variante tipográfico-only (ícone Lucide + texto). Foto entra apenas se sobrar espaço visual sem atrapalhar o ritmo. Justificado em §3.11.

**Sponsors label:** `Quem já está na livery 2026`

**Sponsors lista:** `Garagem 57 · Formafit · AC Vitha Clinic · Brasil da Sorte`

**CTA pull-headline:** `Sua marca cabe aqui.`

**CTA texto botão:** `Falar sobre patrocínio`

**CTA reassure:** `Resposta direta com o piloto. Sem intermediário.`

**Mensagem WhatsApp do CTA (proposta):**

> Olá Hilton, vim pelo site oficial e quero conversar sobre patrocínio na temporada Moto1000GP 2026. Pode me enviar o projeto comercial?

— TODO(cliente): aprovar texto exato.

### 3.10 Acréscimo em `src/lib/links.ts`

Adicionar **abaixo** de `WHATSAPP_HERO_HREF` (sem mexer nos existentes):

- Constante: `WHATSAPP_PATROCINIO_HREF`
- Builder: reusar `buildWhatsappHref(message)` interno
- Mensagem: a mesma proposta acima (assume que o lead já leu a seção e pede o projeto direto)
- Comentário: documentar a persona-alvo (marca/empresa entrando direto no pitch comercial), diferenciando do hero (curiosidade inicial)

### 3.11 Imagens — decisão

**Decisão:** ativações **tipográficas + ícone Lucide**, sem foto por padrão.

**Razões:**
- Já temos forte protagonismo visual da foto em SOBRE (`SobrePhoto`) e na GALERIA (próxima seção)
- Cards com foto pequena tendem a parecer "stock catalog" — anti-awwwards
- Ícone Lucide + tipografia bold dá peso editorial e consistência com o resto da landing
- Custo zero de bundle, zero LCP risk

**Ícones Lucide propostos:** Shield (capacete), Shirt (traje), Bike ou GaugeCircle (moto), Instagram (redes), MapPin (presença na pista). Trocar conforme execução.

**Alternativa caso usuário insista em fotos:** usar 2 das 7 fotos disponíveis em `public/photos/` para os cards "Capacete" e "Moto" — mas isso introduz desbalanço visual (3 cards com foto, 2 sem). Decisão final na execução.

### 3.12 Riscos / decisões abertas

| Risco | Mitigação |
|-------|-----------|
| Stats com placeholder ("2M+") soarem inflados / falsos | Marcar TODO claro no código + revisão obrigatória com cliente antes do deploy. Alternativa: substituir por números reais do Hilton (13 temporadas, 6 títulos, 8 etapas) — perde-se "alcance" mas ganha credibilidade |
| Cards de ativação ficarem "lista bullet genérica" | Tratamento editorial obrigatório: clip-path em canto, número grande "01/02/03" no card, hover tilt 3D + sweep. Se na execução não bater nível awwwards, refazer |
| Sponsors em tipografia (sem logo) parecer "lazy" | Tratamento massivo (text-3xl font-heading bold + diamond separator vermelho) compensa. Quando logos chegarem, swap pontual sem refactor |
| CTA no fim repetir o do hero e perder força | Mensagem WhatsApp diferente + pull-headline "Sua marca cabe aqui." + reassure line — diferencia psicologicamente |
| Seção ficar muito longa e cansar antes da Galeria | Compactar pitch (max 3 parágrafos curtos) e usar SectionDivider saída pra fechar o "ato" comercial |
| Mobile com 8+ blocos verticais empilhados | Reduzir ativações pra 4 em mobile (esconder o 5o) ou tornar grid 2 cols compactos. Decisão na execução |
| Hydration mismatch com FlipCounter | Replica padrão de SobreStats (já SSR-safe via useReducedMotion + useInView no client) |
| Ordem visual após Temporada (sticky map) competir com pitch | SectionDivider entrada com ticker/slash dá pausa visual antes do heading entrar |

---

## Fase 4 — Checklist de execução (em ordem)

1. **Copy + links** — adicionar `WHATSAPP_PATROCINIO_HREF` em `src/lib/links.ts` + criar `patrocinio-copy.ts` com toda a copy centralizada (pull-quote, parágrafos, ativações, CTA)
2. **Server orquestrador** — `src/components/sections/patrocinio/index.tsx` (sem `"use client"`) com `<section id="patrocinio" aria-labelledby="patrocinio-heading">` + "76" gigante de fundo + container max-w-7xl
3. **Heading** — `patrocinio-heading.tsx` (replica padrão `SobreHeading`: kicker + CharReveal + slash + linha decor)
4. **Pitch** — `patrocinio-pitch.tsx` (pull-quote + 3 parágrafos cascata, replica padrão `SobreBio`)
5. **Stats** — `patrocinio-stats.tsx` (3 stats com `<FlipCounter>`, replica padrão `SobreStats` exato — só trocar dados)
6. **Ativações** — `patrocinio-ativacoes.tsx` + `patrocinio-ativacao-card.tsx` (grid 5 cards com clip-path mask reveal + hover tilt 3D)
7. **Sponsors** — `patrocinio-sponsors.tsx` (4 nomes em tipografia tratada, char-reveal por nome com stagger + diamond separator)
8. **CTA** — `patrocinio-cta.tsx` (pull-headline + botão WhatsApp idêntico ao hero, mas com `WHATSAPP_PATROCINIO_HREF` e cópia "Falar sobre patrocínio")
9. **Integração** — substituir `<section id="patrocinio">` placeholder em `src/app/page.tsx` + adicionar `<SectionDivider>` entrada (slash) e saída (ticker)
10. **Validação** — `npm run lint` + `npm run build` zero erros, walkthrough manual em 375/768/1024/1440, conferir reveals, contraste e touch targets

---

## Fase 5 — Verificação do plano

- [x] Todos os critérios de aceite têm passo correspondente no checklist
- [x] Componentes shadcn necessários: nenhum novo (reuso de `Button` via classes; `Sheet` já no Navbar não é tocado)
- [x] Decisão de imagem clara (tipografia + ícone Lucide, sem foto por default — §3.11)
- [x] Copy proposta com TODOs explícitos onde precisa de dado real (§3.9)
- [x] Sem mistura de feature+refactor — só feature nova; não toca em hero/sobre/temporada
- [x] Plano cabe em 1 dia de trabalho (10 passos curtos, todos reusam padrões existentes)
- [x] Anti-padrões `MOTION_PHILOSOPHY.md`: zero fade-in genérico planejado, zero translateY-only, transitions entre seções definidas, counters elaborados, char-reveal no heading, parallax do "76", tilt 3D nos cards
- [x] Reduced-motion: `useReducedMotion` em todos os clients (boa higiene mesmo com flag global desligada)
- [x] Acessibilidade: aria, semântica `<section>`/`<article>`/`<ul>`, contraste, focus, touch >=44 mapeados
- [x] Sem novas dependências
- [x] Posição na navegação confirmada (Navbar.tsx linha 26, page.tsx linha 27)

**Gate Plan = Livre.**

---

## Fase 6 — Implementação

| Arquivo | Status | Notas |
|---------|--------|-------|
| `src/lib/links.ts` | ✅ modificado | Adicionado `WHATSAPP_PATROCINIO_HREF` com mensagem específica de patrocínio (lead que já leu o pitch e pede projeto comercial) |
| `src/components/sections/patrocinio/patrocinio-copy.ts` | ✅ criado | Copy pt-BR centralizada + `ATIVACOES` (5 itens) + `PATROCINIO_STATS` (3 itens) com TODO(cliente) onde precisa de validação |
| `src/components/sections/patrocinio/index.tsx` | ✅ criado | Server orquestrador, `<section id="patrocinio" aria-labelledby="patrocinio-heading">`, "76" de fundo, max-w-7xl |
| `src/components/sections/patrocinio/patrocinio-heading.tsx` | ✅ criado | Replica padrão SobreHeading: kicker "05 / Para sua marca" + CharReveal no H2 + slash crescente + linha decor |
| `src/components/sections/patrocinio/patrocinio-pitch.tsx` | ✅ criado | Pull-quote (slide-in lateral + barra vermelha scaleY) + 3 parágrafos cascata, replica SobreBio |
| `src/components/sections/patrocinio/patrocinio-stats.tsx` | ✅ criado | 3 stats com `<FlipCounter>` + barra vermelha + clip-path mask reveal vertical (mesma API de SobreStats); suffix "M+"/"K+" estilizado em vermelho fora do FlipCounter |
| `src/components/sections/patrocinio/patrocinio-ativacao-card.tsx` | ✅ criado | Card individual: MaskReveal diagonal/left/right + tilt 3D no hover (rotateX/rotateY ±4°) + sweep diagonal vermelho + número gigante de fundo + barra inferior crescendo no hover |
| `src/components/sections/patrocinio/patrocinio-ativacoes.tsx` | ✅ criado | Grid asymmetric 12-col desktop (4/4/4 + 6/6), 2 cols tablet (último full), 1 col mobile; header com kicker + linha crescendo |
| `src/components/sections/patrocinio/patrocinio-sponsors.tsx` | ✅ criado | 4 nomes em font-heading bold uppercase com CharReveal por nome + diamond vermelho separator (rotacionado, scale-in com stagger) — `<ul aria-label="Patrocinadores oficiais 2026">` |
| `src/components/sections/patrocinio/patrocinio-cta.tsx` | ✅ criado | Pull-headline char-reveal + scale (0.94→1) + slash decorativo crescendo + botão WhatsApp idêntico ao hero (sweep + icon morph) usando `WHATSAPP_PATROCINIO_HREF` + reassure line |
| `src/app/page.tsx` | ✅ modificado | Substituído placeholder `<section id="patrocinio">` por `<Patrocinio />`; adicionado `SectionDivider variant="slash" numerator={["04","05"]}` na entrada e `SectionDivider variant="ticker" label="Galeria"` na saída |

### Decisões durante a execução (desvios menores do plano)

1. **Ícone "redes sociais"** — plano sugeria `Instagram` (Lucide), mas esse export não existe no `lucide-react` atual (build error: "Export Instagram doesn't exist"). Trocado por `Megaphone`, que casa semanticamente melhor com "cobertura de bastidores em Reels e Stories" e mantém peso editorial neutro (não é logo de plataforma proprietária).
2. **Pitch em 7/12 cols (não full)** — o plano não cravou o span. Coloquei `lg:col-span-7` pra gerar respiro à direita, espelhando o padrão editorial de Sobre.
3. **Stats com suffix "M+"/"K+" estilizado** — em vez de inflar o `value` pra 2.000.000 e perder a leitura do flip, animamos `0→2` e `0→50` e renderizamos o suffix em vermelho fora do FlipCounter (font-size 0.55em). Mantém o flip dramático e a copy clara.
4. **MaskReveal com `h-full w-full`** — necessário pra o `<motion.article>` interno preencher o `<li>` flex no grid.

### Critérios de aceite — checagem final

- [x] Seção `#patrocinio` substitui o placeholder em `src/app/page.tsx`
- [x] Acessível via clique em "Para sua marca" no navbar (âncora `#patrocinio` mantida)
- [x] Heading "Para sua marca" com CharReveal + slash crescente
- [x] 3 stats massivos com `<FlipCounter>` (mesmo padrão de SobreStats)
- [x] Grid de 5 ativações com clip-path mask reveal + tilt 3D no hover
- [x] Bloco de patrocinadores com 4 nomes em tipografia tratada + diamond separator
- [x] CTA "Falar sobre patrocínio" abrindo WhatsApp com mensagem **diferente** do hero
- [x] `WHATSAPP_PATROCINIO_HREF` exportada em `src/lib/links.ts` com comentário explicando a persona-alvo
- [x] SectionDivider de entrada (slash 04→05) e saída (ticker "Galeria")
- [x] Reveals dramáticos em todos os elementos (sem fade genérico)
- [x] Touch targets do CTA: `h-12 min-w-[15rem]`
- [x] `useReducedMotion` honrado em todos os clients (mesmo com flag global desligada)
- [x] `npm run lint` zero erros
- [x] `npm run build` zero erros
- [x] Sem novas dependências em `package.json`

---

## Fase 7 — Verificação

### Comandos

| Comando | Resultado |
|---------|-----------|
| `npm run lint` | ✅ zero erros, zero warnings |
| `npm run build` | ✅ Compiled successfully in ~1.7s, 6 static pages geradas |

### A validar manualmente (próximo turno — `/walkthrough`)

- Inspeção visual em 375 / 768 / 1024 / 1440
- Confirmar contraste racing-red sobre racing-blue-deep nos números/CTAs (≥ 4.5:1 esperado)
- Confirmar que CharReveal não quebra layout em telas muito estreitas
- Confirmar timing das cascatas (heading → pitch → stats → ativações → sponsors → CTA)
- Validar tilt 3D dos cards com mouse real (em mobile não há mouse — só MaskReveal)
- Validar transições entre seções (Temporada → Patrocínio com slash, Patrocínio → Galeria com ticker)
- Pendências de copy/dados aguardando cliente:
  - Stats `2M+` e `50K+` (impressões + audiência) — TODO(cliente)
  - Texto exato da mensagem WhatsApp — TODO(cliente)
  - Confirmar transmissoras na cobertura editorial — TODO(cliente)

---

## Resumo executivo

Seção comercial `#patrocinio` posicionada entre Temporada e Galeria. Composição: heading editorial -> pitch (pull-quote + parágrafos) -> 3 stats com FlipCounter -> grid de 5 ativações tipográficas -> showcase de patrocinadores atuais -> CTA WhatsApp dedicado. Reusa primitivos já existentes (`CharReveal`, `MaskReveal`, `FlipCounter`, `SectionDivider`) e padrões consolidados (`SobreHeading`, `SobreStats`, `SobreBio`) sem refactor neles. Adiciona `WHATSAPP_PATROCINIO_HREF` em `src/lib/links.ts` com mensagem específica de patrocínio. Stats e copy ficam com `TODO(cliente)` para revisão antes do deploy. Sem dependências novas. 9 arquivos novos em `src/components/sections/patrocinio/` + 1 acréscimo em `links.ts` + 1 substituição em `page.tsx`. Pronto pra `/exec`.
