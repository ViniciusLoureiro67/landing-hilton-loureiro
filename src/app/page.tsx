import { Hero } from "@/components/sections/hero";
import { Sobre } from "@/components/sections/sobre";

export default function Home() {
  return (
    <>
      <Hero />
      <Sobre />

      {/* Sprint 3+ section anchors so navbar scroll works (vão receber conteúdo) */}
      <section id="temporada" className="min-h-[40vh]" />
      <section id="galeria" className="min-h-[40vh]" />
      <section id="patrocinio" className="min-h-[40vh]" />
    </>
  );
}
