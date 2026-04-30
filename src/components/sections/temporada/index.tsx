import { TemporadaHeading } from "./temporada-heading";
import { TemporadaCounter } from "./temporada-counter";
import { TemporadaGrid } from "./temporada-grid";

/**
 * Seção Temporada — calendário oficial Moto1000GP 2026.
 *
 * Composição:
 *   1. Heading com slash + subtítulo
 *   2. Counter da próxima etapa + N restantes (client-only, calcula no mount)
 *   3. Grid responsivo:
 *        - Desktop: mapa sticky à esquerda + lista rolando à direita (scrollytelling)
 *        - Mobile/tablet: empilhado vertical
 *
 * Sincronização entre mapa e lista via TemporadaContext interno ao TemporadaGrid.
 */
export function Temporada() {
  return (
    <section
      id="temporada"
      aria-labelledby="temporada-heading"
      className="relative isolate overflow-hidden bg-racing-blue-deep"
    >
      {/* "76" gigante de fundo, posição assimétrica fora do grid */}
      <span
        aria-hidden
        className="racing-number-bg pointer-events-none absolute -right-32 top-1/4 select-none opacity-100"
      >
        76
      </span>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <TemporadaHeading />
          </div>
          <div className="lg:col-span-5">
            <TemporadaCounter />
          </div>
        </div>

        <div className="mt-16 border-t border-racing-white/5 pt-12 lg:mt-24 lg:pt-16">
          <TemporadaGrid />
        </div>
      </div>
    </section>
  );
}
