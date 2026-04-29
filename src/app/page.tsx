import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_0%,oklch(0.3_0_0)_0%,transparent_70%)]"
      />
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <Badge variant="secondary" className="uppercase tracking-widest">
          Em construção
        </Badge>
        <h1 className="font-sans text-5xl font-semibold tracking-tight sm:text-7xl">
          Hilton Loureiro
        </h1>
        <p className="text-balance text-base text-muted-foreground sm:text-lg">
          Piloto profissional &middot; Campeonato Brasileiro Moto1000GP
        </p>
        <p className="max-w-md text-sm text-muted-foreground/80">
          O site oficial está em desenvolvimento. Em breve: resultados,
          calendário da temporada, galeria e oportunidades de patrocínio.
        </p>
      </section>
      <footer className="absolute inset-x-0 bottom-6 text-center text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} Hilton Loureiro
      </footer>
    </main>
  );
}
