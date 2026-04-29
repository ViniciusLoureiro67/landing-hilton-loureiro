import { SobrePhoto } from "./sobre-photo";
import { SobreStats } from "./sobre-stats";
import { SobreBio } from "./sobre-bio";
import { SobreTimeline } from "./sobre-timeline";
import { SobreHeading } from "./sobre-heading";
import { SobreBackdrop } from "./sobre-backdrop";
import { SobreMarquee } from "./sobre-marquee";

/**
 * Seção Sobre — container editorial awwwards-tier.
 *
 * Camadas (de fundo pra frente):
 *
 *   1. SobreBackdrop — "76" gigante com parallax + speedlines difusos
 *   2. Marquee horizontal sutil no topo
 *   3. SobreHeading — "01" gigante de fundo + char reveal + slash
 *   4. Grid 6/6:
 *        - SobrePhoto (cinematic entry: stripes + cortina + tilt)
 *        - SobreBio (pull-quote + parágrafos word-by-word)
 *   5. SobreStats — 4 contadores massivos com flip 3D + pulse no "76"
 *   6. Marquee horizontal sutil no fim
 *   7. SobreTimeline — scrollytelling pinned
 */
export function Sobre() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-heading"
      className="relative isolate bg-racing-blue-deep"
    >
      <SobreBackdrop />

      {/* Marquee superior — separa do hero com peso editorial */}
      <div className="relative border-y border-racing-white/5 py-3">
        <SobreMarquee orientation="horizontal" />
      </div>

      {/* Bloco principal */}
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <SobreHeading />

        <div className="mt-14 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-6">
            <SobrePhoto />
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <SobreBio />
          </div>
        </div>

        {/* Stats — full width abaixo do grid */}
        <div className="mt-20 border-t border-racing-white/10 pt-12 lg:mt-28 lg:pt-16">
          <SobreStats />
        </div>
      </div>

      {/* Marquee inferior — fecha a seção principal antes da timeline */}
      <div className="relative border-y border-racing-white/5 py-3">
        <SobreMarquee orientation="horizontal" />
      </div>

      <SobreTimeline />
    </section>
  );
}
