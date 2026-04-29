# Brief — Landing Hilton Loureiro

> Documento-mestre. Toda decisão de design, copy ou implementação deve voltar a ele. Atualizar quando o cliente aprovar mudanças de escopo.

## 1. Quem é o piloto

**Hilton Loureiro** — alagoano (DDD 82), piloto profissional, número de corrida **76**.

- **Marca pessoal:** "HILTON 76" (com `7` azul + `6` vermelho com slash diagonal). Mascote: **Sonic the Hedgehog** (capacete e adesivo na moto — assinatura visual).
- **Equipe atual:** PRT Racing · parceria com **Garagem 53**
- **Stack de marcas na livery:** Yamaha · Pirelli · LS2 · Alpinestars · Motul
- **Categoria 2025:** Brasileiro Endurance 600cc — **bicampeão (2024 + 2025)**
- **Movimento 2026:** sobe pra **Moto1000GP** (Campeonato Brasileiro de Motovelocidade — homologação CBM + FIM Latin América)

### Palmarés (cronológico)

| Ano | Conquista |
|---|---|
| 2016 | Vice-campeão Pernambucano + recorde da pista de Caruaru |
| 2018 | Campeão Nordestino |
| 2022 | Vice-campeão Paraibano |
| 2023 | Vice-campeão Brasileiro 600cc |
| 2024 | 3º Brasileiro 600cc Master + Campeão Brasileiro Endurance 600cc |
| **2025** | **Bicampeão Brasileiro Endurance 600cc** |

## 2. Audiência da landing (em ordem de prioridade)

| # | Persona | Quer | CTA esperado |
|---|---------|------|--------------|
| 1 | **Patrocinador** (CMO de marca regional, dono de empresa) | Saber alcance, propriedades, ROI | "Receber projeto completo via WhatsApp" |
| 2 | **Mídia / imprensa** | Bio, palmarés, fotos, contato | "Baixar press kit / agendar entrevista" |
| 3 | **Torcida / fã** | Próximas corridas, redes sociais, conteúdo | "Seguir no Instagram" |

**Decisão:** uma única landing serve as 3 audiências, mas a hierarquia visual prioriza a #1 sem alienar #2 e #3. Ninguém é redirecionado pra outro site.

## 3. Tom de voz

**Direto, confiante, com peso esportivo. Sem clichê motivacional barato.**

- Específico sempre que possível ("Bicampeão Brasileiro Endurance 600cc 2024–2025"), não abstrato ("uma trajetória de paixão").
- Em pt-BR, com construções naturais (não tradução literal de inglês).
- Verbos ativos em CTAs: *Conhecer, Ver, Conversar, Acompanhar, Falar com.*
- **Banido:** garra, raça, sangue nas veias, paixão por velocidade, contra todos, nunca desistir.

## 4. Identidade visual

### Paleta

| Token | Hex | Uso |
|---|---|---|
| `--racing-blue` | `#0A1F44` | Background dominante (próximo do azul-marinho da livery) |
| `--racing-blue-deep` | `#050E1F` | Surfaces escuras (cards, footer) |
| `--racing-red` | `#E30613` | Acento, brand mark, CTAs primários, slashes |
| `--racing-white` | `#F5F5F5` | Tipografia primária sobre escuro |
| `--racing-yellow` | `#FFD400` | Acento Pirelli pontual (highlight de palavras-chave) |
| `--racing-asphalt` | `#1B1F24` | Cinza-pista para divisores e cards |
| `--racing-mute` | `#8C95A6` | Texto secundário |

### Tipografia

- **Display / hero:** **Anton** ou **Bebas Neue** (Google Fonts) — sans condensada bold, italic-ready. Reproduz o tom "PROJETO DE INVESTIMENTO 2026" do PDF.
- **Headings de seção:** **Saira Condensed** (700/900) — italic ativada em ênfases.
- **Body:** **Geist Sans** (já no projeto via `next/font`). Inter como fallback.
- **Números / dados:** **Geist Mono** — usa em palmarés, calendário, contadores.

### Linguagem gráfica recorrente

- **Slash diagonal vermelho** — separador entre seções, recorrente como o `7` cortado do logo "76".
- **Número 76 gigantesco em background** com blur/transparência, posicionado fora do grid (sai da viewport).
- **Speed lines** sutis em cards no hover (linhas brancas paralelas saindo da direção do movimento).
- **Cortes diagonais** em containers de imagem (clip-path), reforçando velocidade.
- **Grid de 12 col** com gutter generoso. Tipografia massiva ocupando 8–10 col.

### Motion language

- **Hero**: ao carregar, sequência de "ignição" (3 luzes laterais — vermelho/amarelo/verde estilo semáforo de largada) e o nome aparece com translateY+blur reveal.
- **Scroll-reveal**: cada seção entra com translateY de 32px + opacity, stagger nos filhos, ease-out 400ms.
- **Counters**: stats animam de 0 ao valor real quando entram em viewport (`+193 milhões`, `8 etapas`, `+100 corridas`).
- **Calendário**: mapa do Brasil com 8 pinos. Hover/tap em pino expande card flutuante com circuito + data. No mobile vira lista vertical.
- **Galeria**: hover causa duotone vermelho rápido (200ms) + zoom 1.05.
- **CTA primário**: magnetic cursor (desktop) + leve vibração visual no hover. Mobile = press feedback.
- **Easter egg**: Konami code (`↑↑↓↓←→←→BA`) faz o **Sonic** atravessar o site da esquerda pra direita com trilha de azul. Sem som, sem bloqueio de UX.
- **Respeitar `prefers-reduced-motion`**: degrada para fade simples.

## 5. Estrutura (ordem das seções)

1. **Hero** — nome + tagline + CTA primário (WhatsApp) + CTA secundário (rolar para "Sobre")
2. **Sobre + Trajetória** — bio curta + timeline visual de palmarés (16 → 25)
3. **Temporada 2026** — calendário com mapa do Brasil + lista de etapas
4. **Galeria** — foto grid editorial (4–8 fotos) com lightbox
5. **Para sua marca** (patrocínio) — pilares Mídia / B2B / Emoção, propriedades simplificadas, **CTA forte: "Receber projeto completo"** (WhatsApp pré-preenchido)
6. **Equipe & marcas** — logos dos parceiros atuais (PRT Racing, Garagem 53, Yamaha, Pirelli, LS2, Alpinestars, Motul)
7. **Imprensa & Contato** (rodapé) — WhatsApp, Instagram (`@hilton_loureiro76`), e-mail (placeholder), download de press kit

### Navegação

- Topbar fixa, traduzida em scroll: começa transparente, vira `bg-racing-blue/80 backdrop-blur` após 64px de scroll
- Links: **Sobre · Temporada · Galeria · Patrocínio · Contato**
- Botão CTA persistente "Falar no WhatsApp" (à direita, vermelho)
- Mobile: sheet (já temos shadcn) com mesma navegação

## 6. Assets disponíveis (com gaps marcados)

### Já temos (placeholders extraídos do PDF — `public/photos/placeholder/`)

| Arquivo | Conteúdo | Qualidade | Uso candidato |
|---|---|---|---|
| `hero-bike.jpg` | Hilton em ação, moto YZF-R1, livery PRT | OK (logo HILTON76 sobreposto) | Hero secundário |
| `hilton-podium.jpg` | Vibrando no pódio com troféu | OK (texto sobreposto bottom) | Sobre |
| `hilton-motul.jpg` | Hilton + moto Motul + entrevista | OK (overlay vermelho) | Galeria |
| `hilton-balaclava.jpg` | Close moody com capacete Sonic | Tem tinta azul baked-in | Sobre/transição |
| `hilton-vencedor.jpg` | Com placa "1" do Moto1000GP | **Boa**, texto pequeno bottom-left | Hero principal |

### Gaps (precisamos pedir pra equipe / fotógrafo)

- [ ] **Foto hero limpa** — Hilton em pista, alta resolução, sem texto, formato 16:9 e 9:16 (mobile)
- [ ] **Foto retrato** — close de capacete/macacão pra seção "Sobre" (alguma com Sonic visível)
- [ ] **6–8 fotos da galeria** — pista, box, bastidores, equipe
- [ ] **Logos vetoriais** — PRT Racing, Garagem 53 (parceiros principais)
- [ ] **OG image dedicada** — 1200×630, idealmente com Hilton + nome (geramos via `opengraph-image.tsx` se faltarem fotos cruas)
- [ ] **Vídeo hero (opcional)** — 6–10s loop em pista, mute, autoplay (cai pra foto se ausente)

### Conteúdo textual — confirmar com cliente

- [ ] Bio em 1ª ou 3ª pessoa? (recomendação: **3ª pessoa**, soa mais oficial pra patrocinador)
- [ ] Email oficial pra contato de imprensa
- [ ] Texto de apresentação do projeto 2026 (qual o pitch principal?)
- [ ] Press kit baixável (PDF reduzido sem números, ou link pro projeto completo via WhatsApp)
- [ ] Patrocinadores atuais — quais devem aparecer com logo na seção "Marcas"?

## 7. SEO / técnico

- **Domínio público inicial**: `landing-hilton-loureiro.vercel.app` (Vercel) — depois apontar `hiltonloureiro.com.br` se cliente comprar.
- **OG image**: gerar dinâmica via `src/app/opengraph-image.tsx` no MVP.
- **JSON-LD**: `Person` + `Athlete` no `<head>` da home.
- **Sitemap + robots**: gerar via `src/app/sitemap.ts` e `robots.ts`.
- **Performance alvo**: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **Acessibilidade**: WCAG AA — contraste, focus, reduced-motion, alt descritivo.

## 8. Plano de iteração (sprints)

| Sprint | Escopo | Entregável |
|---|---|---|
| **S1 — Foundation** | Tokens, fontes, layout global, navbar, footer | Skeleton do site no ar com nav funcional |
| **S2 — Hero** | Hero principal com sequência de ignição, CTAs | Primeira impressão "uau" |
| **S3 — Sobre + Palmarés** | Bio, timeline visual, foto retrato | Seção 1 + 2 completas |
| **S4 — Temporada** | Mapa do Brasil interativo, calendário 2026 | Seção 3 completa |
| **S5 — Galeria** | Grid de fotos com hover/lightbox | Seção 4 completa |
| **S6 — Patrocínio** | Pilares + propriedades + CTA forte | Seção 5 (mais crítica comercial) |
| **S7 — Marcas + Imprensa** | Logos, contato, press kit | Seção 6 + 7 |
| **S8 — Polish** | Easter egg Sonic, audit a11y/perf, OG, JSON-LD | Pronto pra divulgação |

Cada sprint = 1 plan + 1 exec + 1 walkthrough + commit + (opcional) PR.

## 9. Decisões pendentes do cliente

Antes do S1 começar, confirmar:

1. ✅ **Sem valores na landing** — confirmado
2. ✅ **Site em pt-BR** — confirmado
3. ✅ **Tema escuro com identidade racing (azul + vermelho)** — confirmado pela peça
4. ⏳ **Bio em 3ª pessoa?** — minha recomendação
5. ⏳ **Easter egg Sonic é OK?** — meio risk-prone com patrocinador formal, mas o Sonic já é assinatura dele no capacete e na moto. Recomendo manter como detalhe sutil (mascote no canto da página, ou Konami code), não como elemento dominante.
6. ⏳ **Vídeo hero?** — bom ter mas não bloqueante. MVP com foto.

---

**Próximo passo:** rodar `/plan` pro Sprint 1 (Foundation) — gera `tasks/01-foundation.md` com o checklist de execução.
