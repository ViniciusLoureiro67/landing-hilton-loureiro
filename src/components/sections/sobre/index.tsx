import { SobrePhoto } from "./sobre-photo";
import { SobreStats } from "./sobre-stats";
import { SobreBio } from "./sobre-bio";
import { SobreTimeline } from "./sobre-timeline";

/**
 * Seção Sobre — server component orquestrador.
 *
 * Layout desktop (≥1024px):
 *   Grid 12-col — foto em 5 cols à esquerda + bio/stats em 7 cols à direita.
 *   Palmarés (timeline) full-width abaixo.
 *
 * Layout mobile:
 *   Stack vertical: título → foto → stats → bio → palmarés.
 *
 * Grafismo:
 *   - "76" gigantesco no fundo a ~3% opacity (font-display Anton)
 *   - Slash diagonal vermelho como acento visual ao lado do título
 */
export function Sobre() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-heading"
      className="relative isolate overflow-hidden bg-racing-blue-deep py-24 lg:py-32"
    >
      {/* 76 gigantesco de fundo */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[10vw] top-1/2 -translate-y-1/2 select-none font-display leading-[0.78] tracking-[-0.04em]"
        style={{
          fontSize: "clamp(18rem, 35vw, 45rem)",
          color: "oklch(1 0 0 / 0.03)",
        }}
      >
        76
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading com slash vermelho */}
        <div className="mb-12 flex items-center gap-4 lg:mb-16">
          <h2
            id="sobre-heading"
            className="font-heading text-[2.5rem] font-black uppercase leading-none text-racing-white lg:text-[4rem]"
          >
            Sobre
          </h2>
          <span
            aria-hidden
            className="h-10 w-1 bg-racing-red"
          />
        </div>

        {/* Grid principal: foto + conteúdo */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Foto — 5 cols desktop */}
          <div className="lg:col-span-5">
            <SobrePhoto />
          </div>

          {/* Conteúdo — 7 cols desktop */}
          <div className="flex flex-col gap-10 lg:col-span-7">
            <SobreBio />
            <SobreStats />
          </div>
        </div>

        {/* Palmarés — full-width abaixo */}
        <div className="mt-16 lg:mt-24">
          <SobreTimeline />
        </div>
      </div>
    </section>
  );
}
