import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <>
      {/* Hero placeholder — substituído no Sprint 2 */}
      <section
        id="top"
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
      >
        <span aria-hidden className="racing-number-bg absolute -bottom-20 -right-10 sm:-right-32 select-none">
          76
        </span>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(70%_55%_at_50%_0%,oklch(0.27_0.08_264)_0%,transparent_70%)]"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-racing-blue-bright/15 text-racing-blue-bright border-racing-blue-bright/30 font-heading uppercase tracking-[0.25em]"
          >
            Em construção · Temporada 2026
          </Badge>

          <h1 className="font-display text-6xl uppercase leading-[0.85] tracking-tight sm:text-8xl lg:text-[10rem]">
            Hilton
            <br />
            <span className="inline-flex items-center gap-2">
              Loureiro
              <span className="relative ml-3 inline-block text-racing-blue-bright">
                76
              </span>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-balance text-base text-racing-mute sm:text-lg">
            Piloto profissional · Campeonato Brasileiro Moto1000GP.
            Bicampeão Brasileiro Endurance 600cc.
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-racing-mute/70">
            Site oficial em desenvolvimento
          </p>
        </div>
      </section>

      {/* Sprint 2+ section anchors so navbar scroll works (vão receber conteúdo) */}
      <section id="sobre" className="min-h-[40vh]" />
      <section id="temporada" className="min-h-[40vh]" />
      <section id="galeria" className="min-h-[40vh]" />
      <section id="patrocinio" className="min-h-[40vh]" />
    </>
  );
}
