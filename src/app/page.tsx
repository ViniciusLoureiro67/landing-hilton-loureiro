import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Sprint 2+ section anchors so navbar scroll works (vão receber conteúdo) */}
      <section id="sobre" className="min-h-[40vh]" />
      <section id="temporada" className="min-h-[40vh]" />
      <section id="galeria" className="min-h-[40vh]" />
      <section id="patrocinio" className="min-h-[40vh]" />
    </>
  );
}
