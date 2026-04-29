"use client";

/**
 * Re-export do hook compartilhado de entrada cinematográfica
 * (`@/lib/use-cinematic-entry`) sob o nome local `useHeroEntrySkip`,
 * preservado por compatibilidade — todos os 8 client components do
 * hero continuam consumindo este caminho.
 *
 * O hook é o mesmo usado pelo navbar para coordenar a entrada com
 * a sequência de largada (LIGHTS OUT em ~3.1s).
 */
export { useCinematicEntrySkip as useHeroEntrySkip } from "@/lib/use-cinematic-entry";
