import { Hero } from "@/components/sections/hero";
import { Sobre } from "@/components/sections/sobre";
import { Temporada } from "@/components/sections/temporada";
import { Patrocinio } from "@/components/sections/patrocinio";
import { SectionDivider } from "@/components/motion/section-divider";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Conexão Hero → Sobre */}
      <SectionDivider variant="ticker" label="Sobre o piloto" />

      <Sobre />

      {/* Conexão Sobre → Temporada */}
      <SectionDivider
        variant="slash"
        numerator={["03", "04"]}
        label="Temporada 2026"
      />

      <Temporada />

      {/* Conexão Temporada → Patrocínio */}
      <SectionDivider
        variant="slash"
        numerator={["04", "05"]}
        label="Para sua marca"
      />

      <Patrocinio />

      {/* Conexão Patrocínio → Galeria */}
      <SectionDivider variant="ticker" label="Galeria" />

      {/* Sprint 5+ section anchors */}
      <section id="galeria" className="min-h-[40vh]" />
    </>
  );
}
