import { Hero } from "@/components/sections/hero";
import { Sobre } from "@/components/sections/sobre";
import { SectionDivider } from "@/components/motion/section-divider";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Conexão Hero → Sobre */}
      <SectionDivider variant="ticker" label="Sobre o piloto" />

      <Sobre />

      {/* Conexão Sobre → próxima seção (placeholder por enquanto) */}
      <SectionDivider
        variant="slash"
        numerator={["02", "03"]}
        label="Temporada 2026"
      />

      {/* Sprint 4+ section anchors */}
      <section id="temporada" className="min-h-[40vh]" />
      <section id="galeria" className="min-h-[40vh]" />
      <section id="patrocinio" className="min-h-[40vh]" />
    </>
  );
}
