"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef } from "react";

/**
 * SobreBio — pull-quote editorial gigante + 3 parágrafos com cascata
 * coordenada via `staggerChildren` no parent + scroll-driven parallax.
 *
 * Awwwards-tier:
 *   - Pull-quote em tipografia heroica com slide-in lateral + barra
 *     vermelha que cresce vertical
 *   - Parágrafos entram em cascata com fade + rise
 *   - Highlights mantém ritmo de leitura — fatos importantes em peso
 *     mais alto e cor branca pura
 *   - Trigger via `amount: 0.15` (mais robusto que `margin` em mobile)
 *   - Parallax no scroll: a coluna inteira se move pra cima levemente,
 *     em direção oposta à foto (assimetria racing)
 */

const PARAGRAPHS = [
  {
    text: (
      <>
        Compete no motociclismo brasileiro desde{" "}
        <strong className="font-medium text-racing-white">2013</strong>. Aos{" "}
        <strong className="font-medium text-racing-white">49 anos</strong>,
        acumula seis títulos regionais e nacionais, incluindo o{" "}
        <strong className="text-racing-white">
          bicampeonato do Brasileiro Endurance 600cc
        </strong>{" "}
        em 2024 e 2025. Natural de Maceió, Alagoas, corre atualmente pela
        equipe{" "}
        <strong className="font-medium text-racing-white">NRT</strong> na
        categoria{" "}
        <strong className="font-medium text-racing-white">600cc Master</strong>{" "}
        do Campeonato Brasileiro.
      </>
    ),
  },
  {
    text: (
      <>
        Sua moto é uma{" "}
        <strong className="font-medium text-racing-white">
          Kawasaki ZX6R
        </strong>{" "}
        — reconhecível pelo número{" "}
        <strong className="font-mono font-bold text-racing-white">76</strong> e
        pelo capacete com a marca registrada do{" "}
        <strong className="font-medium text-racing-white">Sonic</strong>. Em
        treze temporadas consecutivas, construiu um retrospecto que inclui
        recordes de pista, títulos nordestinos e pódios nacionais.
      </>
    ),
  },
  {
    text: (
      <>
        Fora da pista, conecta marcas ao público do motociclismo através de
        presença constante em campeonatos com cobertura nacional.{" "}
        <strong className="text-racing-white">
          Garagem 57, Formafit, AC Vitha Clinic e Brasil da Sorte
        </strong>{" "}
        são os parceiros da temporada atual.
      </>
    ),
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.05 },
  },
};

const quoteVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

const quoteBarVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
  },
};

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export function SobreBio() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  // Scroll-driven parallax — coluna sobe levemente em oposição à foto
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["3%", "-5%"]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={reduce ? undefined : containerVariants}
      style={
        reduce
          ? undefined
          : { y, willChange: "transform" }
      }
      className="space-y-7"
    >
      <motion.div
        variants={
          reduce
            ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
            : quoteVariants
        }
        className="relative pl-6"
      >
        <motion.span
          aria-hidden
          variants={reduce ? undefined : quoteBarVariants}
          style={{ transformOrigin: "top center", willChange: "transform" }}
          className="absolute left-0 top-0 block h-full w-[3px] bg-racing-red"
        />
        <p className="font-heading text-xl font-bold uppercase leading-[1.1] tracking-tight text-racing-white sm:text-2xl lg:text-3xl">
          Treze temporadas.{" "}
          <span className="text-racing-blue-bright">Seis títulos.</span>{" "}
          <span className="text-racing-red">Um número.</span>
        </p>
      </motion.div>

      {PARAGRAPHS.map((p, idx) => (
        <motion.p
          key={idx}
          variants={
            reduce
              ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
              : paragraphVariants
          }
          className="text-base leading-[1.75] text-racing-white/75 lg:text-lg"
        >
          {p.text}
        </motion.p>
      ))}
    </motion.div>
  );
}
