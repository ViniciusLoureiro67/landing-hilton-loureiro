"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const BIO_PARAGRAPHS = [
  "Hilton Loureiro compete no motociclismo brasileiro desde 2013. Aos 49 anos, acumula seis títulos regionais e nacionais, incluindo o bicampeonato do Brasileiro Endurance 600cc em 2024 e 2025. Natural de Maceió, Alagoas, corre atualmente pela equipe NRT na categoria 600cc Master do Campeonato Brasileiro.",
  "Sua moto é uma Kawasaki ZX6R — reconhecível pelo número 76 e pelo capacete com a marca registrada do Sonic. Em 13 temporadas consecutivas, construiu um retrospecto que inclui recordes de pista, títulos nordestinos e pódios nacionais, sempre na classe 600cc.",
  "Fora da pista, Hilton conecta marcas ao público do motociclismo através de uma presença constante em campeonatos com cobertura nacional e audiência digital em crescimento. Garagem 57, Formafit, AC Vitha Clinic e Brasil da Sorte são os parceiros da temporada atual.",
];

export function SobreBio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  return (
    <div ref={containerRef} className="space-y-5">
      {BIO_PARAGRAPHS.map((text, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { delay: i * 0.15, duration: 0.4, ease: "easeOut" }
          }
          className="text-base leading-[1.7] text-racing-white/88 lg:text-lg"
        >
          {text}
        </motion.p>
      ))}
    </div>
  );
}
