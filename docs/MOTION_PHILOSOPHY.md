# Motion Philosophy — landing-hilton-loureiro

> **Esta landing NÃO é uma landing genérica.** O cliente exige nível **awwwards-tier**. Toda seção que sai do agente principal — implementada por `exec`, `ui`, ou direta — tem que respeitar este documento. Se você está construindo uma seção e ela parece "uma landing normal", **pare e refaça**.

## Regra de ouro

**A landing inteira deve parecer um vídeo dirigido por scroll**, não uma página com "alguns componentes animados". O scroll é a linha do tempo do filme. Cada seção é uma cena. Cada elemento entra, atua e sai com timing deliberado.

## Princípios

1. **Scroll é o protagonista.** `useScroll` + `useTransform` em todo elemento que faz sentido. Posição, opacidade, escala, blur, rotação, clip-path — tudo pode (e deve) responder ao scroll.
2. **Pinned scrollytelling.** Seções importantes ficam "presas" enquanto a animação interna acontece (timeline avança, foto se monta, números flippam). `position: sticky` + scroll progress.
3. **Reveals dramáticos**, não fades genéricos. Char-by-char, word-by-word, line-by-line. Mask reveals (clip-path), curtain effects, cascata.
4. **Múltiplas camadas com parallax assimétrico.** Foto, foreground, background — cada uma em velocidade diferente.
5. **Microinteractions premium.** Hover, focus, mouseenter — tudo tem feedback visual rico (tilt 3D, color shift, mix-blend-mode).
6. **Counters não são contadores.** Use airport-flip / split-flap, roleta, ou pelo menos spring com ease elaborado.
7. **Transitions entre seções.** Não tem "cut seco". Sempre algum elemento liga uma seção à próxima — uma slash, um número 76 morphing, um overlay que desde.
8. **Tipografia em movimento.** Headings entram com clip-path, marquees em direções diferentes, texto se monta letra a letra.
9. **Reduced-motion sempre.** Tudo isso degrada pra fade simples sob `prefers-reduced-motion`. **Não negociável.**

## ⛔ Cursor nativo SEMPRE — proibido cursor customizado

**O cliente expressou desgosto explícito por cursores customizados** (sensação de "lag" / "delay" no movimento). Mesmo que tenticamente ofereçam visual diferenciado, **NUNCA implementar cursor customizado nesta landing**:

- ❌ Sem `<MagneticCursor />` global
- ❌ Sem `cursor: none` no html/body
- ❌ Sem dot circular seguindo o mouse via spring
- ❌ Sem hooks tipo `useMagnetic` que puxam elementos pro cursor (a sensação de delay vem do spring)

Microinteractions ainda existem e são bem-vindas, mas DENTRO do elemento (ex: tilt 3D na foto, hover scale em CTAs, glow em buttons). O cursor do sistema operacional não é tocado.

## Anti-padrões (NUNCA fazer)

- ❌ Fade-in genérico de 0→1 sem direção
- ❌ Scroll-reveal só com `translateY: 16` e opacity (isso é "landing genérica")
- ❌ Animar `width`/`height`/`top`/`left` (não-performant; só `transform`/`opacity`/`clip-path`)
- ❌ Counter que muda de número instantaneamente (use spring ou flip)
- ❌ Texto que aparece todo de uma vez (use char-by-char ou clip-path)
- ❌ Imagens que aparecem com `opacity: 0 → 1` (use mask reveal, scale com clip-path, ou curtain)
- ❌ Hover que só muda `opacity: 0.8` (faça algo: tilt, magnetic, color, scale, blur)
- ❌ Section que entra "do nada" — sempre conectar com a anterior

## Stack técnica

- **Framer Motion** v12 (já instalado) — `useScroll`, `useTransform`, `useSpring`, `useInView`, `motion.*`, `AnimatePresence`, `LayoutGroup`
- **Lenis** (já instalado) — smooth scroll obrigatório
- **CSS** — `clip-path`, `mix-blend-mode`, `mask-image`, `backdrop-filter` quando faz sentido
- **Hooks customizados** em `src/lib/` — pra reuso (cursor, char-reveal, etc.)

## Padrões reutilizáveis

### Char-by-char reveal

Usar componente `<CharReveal>` em `src/components/motion/char-reveal.tsx`. Cada char é um `<span>` com `inline-block`, animado via stagger.

### Pinned section

Usar `position: sticky` + container alto, com `useScroll({ target, offset })` no container externo. O sticky filho fica preso enquanto o scroll avança 0→1, e disso se deriva todas as transformações internas.

### Mask reveal

`clip-path: polygon(...)` animado de 0% → 100%. Direção pode ser horizontal, vertical, ou diagonal. Combinar com Framer Motion via `style={{ clipPath: useTransform(...) }}`.

### Airport-flip counter

Cada dígito é um `<motion.span>` que rotaciona em Y de 0deg → -360deg conforme o valor sobe. Stagger por dígito.

### Section divider

Componente `<SectionDivider>` em `src/components/motion/section-divider.tsx`. Slash vermelho que cresce de 0 → 100% width com scroll, ou número 76 que morpha entre seções.

## Performance

- Tudo em `transform` + `opacity` + `filter` (GPU)
- `will-change` cuidadoso (só quando precisa)
- `useReducedMotion()` em todo `motion.*`
- Lenis com config conservador (não muito "borracha")

## Definição de "pronto" (DoD)

Uma seção só está "pronta" se:

1. ✅ Tem ao menos **3 camadas** de animação (entry + scroll-driven + microinteraction)
2. ✅ Tem reveal dramático no heading (não fade genérico)
3. ✅ Tem transition pra próxima seção (não cut seco)
4. ✅ Funciona com reduced-motion (degrada pra fade simples)
5. ✅ É inspecionada num site real awwwards (refmas como [active-theory.com](https://activetheory.net), [edenspiekermann.com](https://edenspiekermann.com), [hassansaleh.com](https://hassansaleh.com)) e o nível visual bate
6. ✅ Mobile não vira 0 animação — é uma versão simplificada, mas presente

Se algum desses não bate, **a seção não está pronta**.
