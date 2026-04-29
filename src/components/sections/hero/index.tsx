import { HeroParallaxScene } from "./hero-parallax-scene";
import { IgnitionLights } from "./ignition-lights";
import { NameReveal } from "./name-reveal";
import { HeroTagline } from "./hero-tagline";
import { HeroCtas } from "./hero-ctas";
import { HeroKicker } from "./hero-kicker";
import { HeroMarquee } from "./hero-marquee";
import { HeroMainColumn } from "./hero-main-column";
import { HeroScrollProvider } from "./hero-scroll-context";
import { ScrollIndicator } from "./scroll-indicator";

/**
 * Hero principal — server component orquestrador.
 *
 * Camadas (do fundo para frente):
 *   1. HeroParallaxScene  — foto + overlays + 76 gigante + speedlines
 *                           + grain. Toda a paralaxe de mouse vive aqui.
 *   2. HeroKicker         — labels topo (Ed. 2026 / Nº 76 / status live)
 *   3. Conteúdo principal — NameReveal + tagline + CTAs (8/12 cols)
 *   4. HeroMarquee        — faixa de palmarés/marcas, loop infinito
 *   5. ScrollIndicator    — progress index 01/07 lateral
 *   6. IgnitionLights     — semáforo de largada + flash radial (camada
 *                           mais alta, descarta-se sozinha após ~1.9s)
 *
 * Linha do tempo da entrada (sem reduced-motion / sem bfcache):
 *   0.00s — luz 1 acende (vermelha)
 *   0.95s — luz 2 ……….. acende
 *   1.50s — luz 3 ……….. acende
 *   2.05s — luz 4 ……….. acende
 *   2.60s — luz 5 ……….. acende → todas vermelhas, painel "STAND BY"
 *   3.10s — LIGHTS OUT — todas apagam, flash branco + flash radial
 *   3.20s — kicker labels + NAVBAR entram (junto com flash dissolvendo;
 *           o navbar fica oculto antes pra não competir com as luzes —
 *           ver `src/components/Navbar.tsx` + `useCinematicEntrySkip`)
 *   3.30s — clip-path reveal do nome
 *   3.55s — 76 gigante anima entrada (scale 1.06 → 1)
 *   3.85s — tagline aparece
 *   4.05s — CTAs aparecem
 *   4.35s — marquee de patrocinadores entra
 *   4.45s — scroll indicator aparece
 *   ~5.00s — hero está calmo
 *
 * TODO(asset): trocar fotos quando a hero limpa do Moto1000GP chegar.
 */
export function Hero() {
  return (
    <HeroScrollProvider
      ariaLabel="Hero — Hilton Loureiro 76"
      ariaDescribedBy="hero-photo-description"
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-racing-blue-deep"
    >
      <HeroParallaxScene />
      <HeroKicker />
      <IgnitionLights />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 pb-44 pt-32 sm:px-6 sm:pb-48 sm:pt-28 lg:px-8">
        <HeroMainColumn>
          <NameReveal />
          <HeroTagline />
          <HeroCtas />
          {/* Descrição da foto para leitores de tela — vinculada ao
              `aria-describedby` da `<section>`. Vem **depois** do `<h1>`,
              então o SR lê: "Hilton Loureiro" → tagline → CTAs → contexto
              da foto, em vez de começar pela foto. */}
          <span id="hero-photo-description" className="sr-only">
            Hilton Loureiro pilotando moto Yamaha número 76 em curva,
            capacete com Sonic visível.
          </span>
        </HeroMainColumn>
      </div>

      <HeroMarquee />
      <ScrollIndicator />
    </HeroScrollProvider>
  );
}
