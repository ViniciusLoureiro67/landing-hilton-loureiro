"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Hilton76Logo } from "@/components/Hilton76Logo";
import { WHATSAPP_HREF } from "@/lib/links";
import { useCinematicEntrySkip } from "@/lib/use-cinematic-entry";

const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#temporada", label: "Temporada" },
  { href: "#galeria", label: "Galeria" },
  { href: "#patrocinio", label: "Para sua marca" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const skipEntry = useCinematicEntrySkip();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Coordena com a sequência de largada do hero (`ignition-lights.tsx`):
  // só na home, sem reduced-motion, sem bfcache, esperamos o "LIGHTS OUT"
  // (3.1s) + 0.1s de respiro pra entrar junto com o kicker. Em qualquer
  // outra rota futura ou em retorno via histórico/back-forward, navbar
  // entra rápido (0.2s) — não pode parecer travado.
  //
  // Easing: `easeOut` simples é deliberado. Curvas tipo expo-out
  // (`[0.16, 1, 0.3, 1]`) desaceleram tanto no final que dão sensação
  // de "travar pela metade", o que num elemento sólido como o navbar
  // fica feio (em texto que entra com clip-path passa despercebido).
  const isHome = pathname === "/";
  const cinematicEntry = isHome && !reduceMotion && !skipEntry;
  const headerTransition = cinematicEntry
    ? { duration: 0.65, ease: "easeOut" as const, delay: 3.2 }
    : { duration: 0.4, ease: "easeOut" as const, delay: 0.2 };

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={headerTransition}
      // `transition-colors` (não `transition-all`) — restringimos ao
      // grupo de cor/borda/backdrop pra **NÃO** brigar com o framer-motion
      // que controla opacity+transform via JS. Quando `transition-all`
      // estava aqui, o CSS interpolava por cima do JS e a entrada do
      // navbar parecia travar pela metade antes de completar.
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ease-out",
        scrolled
          ? "bg-racing-blue-deep/75 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#top"
          aria-label="Hilton 76 — voltar ao topo"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Hilton76Logo className="h-7 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-sm uppercase tracking-widest text-racing-white/80 transition-colors hover:text-racing-white px-3 py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden sm:inline-flex bg-racing-red hover:bg-racing-red/90 text-racing-white font-heading uppercase tracking-widest"
            )}
          >
            Falar no WhatsApp
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Abrir menu"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "lg:hidden"
              )}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-racing-blue-deep border-white/5 w-[88vw] sm:w-96"
            >
              <SheetHeader className="border-b border-white/5 pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Hilton76Logo className="h-6 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <AnimatePresence>
                <nav className="mt-8 flex flex-col">
                  {NAV_LINKS.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ x: 24, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.06, ease: "easeOut" }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block font-display text-3xl uppercase tracking-tight py-3 border-b border-white/5 hover:text-racing-blue-bright transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </AnimatePresence>
              <div className="mt-8">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants(),
                    "w-full bg-racing-red hover:bg-racing-red/90 text-racing-white font-heading uppercase tracking-widest"
                  )}
                >
                  Falar no WhatsApp
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
