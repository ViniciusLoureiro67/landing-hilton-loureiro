import { PatrocinioHeading } from "./patrocinio-heading";
import { PatrocinioPitch } from "./patrocinio-pitch";
import { PatrocinioStats } from "./patrocinio-stats";
import { PatrocinioAtivacoes } from "./patrocinio-ativacoes";
import { PatrocinioSponsors } from "./patrocinio-sponsors";
import { PatrocinioCta } from "./patrocinio-cta";

/**
 * Seção Patrocínio (#patrocinio) — pitch comercial awwwards-tier.
 *
 * Composição (top → bottom):
 *   1. PatrocinioHeading — kicker + char-reveal + slash
 *   2. PatrocinioPitch — pull-quote + 3 parágrafos editorial
 *   3. PatrocinioStats — 3 contadores massivos com FlipCounter
 *   4. PatrocinioAtivacoes — grid 5 cards com tilt 3D + mask reveal
 *   5. PatrocinioSponsors — showcase tipográfico com diamond separator
 *   6. PatrocinioCta — fechamento com WhatsApp dedicado
 *
 * Background:
 *   - bg-racing-blue-deep (continuidade)
 *   - "76" gigante assimétrico de fundo (mesmo padrão de Sobre/Temporada)
 */
export function Patrocinio() {
  return (
    <section
      id="patrocinio"
      aria-labelledby="patrocinio-heading"
      className="relative isolate overflow-x-clip bg-racing-blue-deep"
    >
      {/* "76" gigante assimétrico — assinatura visual recorrente */}
      <span
        aria-hidden
        className="racing-number-bg pointer-events-none absolute -left-32 top-1/3 select-none opacity-100"
      >
        76
      </span>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        {/* 1. Heading */}
        <PatrocinioHeading />

        {/* 2. Pitch */}
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-7">
            <PatrocinioPitch />
          </div>
        </div>

        {/* 3. Stats */}
        <div className="mt-20 border-t border-racing-white/10 pt-12 lg:mt-28 lg:pt-16">
          <PatrocinioStats />
        </div>

        {/* 4. Ativações */}
        <div className="mt-24 lg:mt-32">
          <PatrocinioAtivacoes />
        </div>

        {/* 5. Sponsors */}
        <div className="mt-24 border-t border-racing-white/10 pt-14 lg:mt-32 lg:pt-20">
          <PatrocinioSponsors />
        </div>

        {/* 6. CTA */}
        <div className="mt-24 lg:mt-32">
          <PatrocinioCta />
        </div>
      </div>
    </section>
  );
}
