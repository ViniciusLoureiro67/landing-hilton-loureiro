"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export function SobrePhoto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden clip-diagonal-br lg:aspect-[3/4]"
    >
      <motion.div
        className="absolute inset-0"
        style={reduceMotion ? undefined : { y }}
      >
        <Image
          src="/photos/06-curb-brasil-flag.jpg"
          alt="Hilton Loureiro em curva sobre zebra com bandeira do Brasil na pista, pilotando Kawasaki ZX6R azul número 76, traje vermelho e preto, capacete azul com Sonic"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 42vw"
          className="object-cover object-[center_30%] scale-105"
          quality={75}
        />
      </motion.div>
      {/* Overlay gradient sutil no bottom */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-racing-blue-deep/30 to-transparent"
      />
    </div>
  );
}
