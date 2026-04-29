import { cn } from "@/lib/utils";

/**
 * Logotype "HILTON 76" — wordmark da identidade.
 *
 * Paleta atualizada para casar com o "76" gigante do hero:
 *   - "HILTON" .... azul-bright (--racing-blue-bright)
 *   - "7" .......... azul-bright outline-style (mesma cor do wordmark)
 *   - slash ........ vermelho racing
 *   - "6" .......... vermelho racing
 *
 * Vetor puro (texto + spans) para escalar/animar sem perda.
 */
export function Hilton76Logo({ className }: { className?: string }) {
  return (
    <span
      aria-label="Hilton 76"
      className={cn(
        "inline-flex items-center font-display uppercase leading-none tracking-tight text-racing-blue-bright",
        className
      )}
    >
      <span className="text-[1.6em]">Hilton</span>
      <span className="ml-2 inline-flex items-baseline">
        <span className="relative text-[1.8em] text-racing-blue-bright">
          7
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 w-[3px] origin-center rotate-[18deg] bg-racing-red"
          />
        </span>
        <span className="text-[1.8em] text-racing-red">6</span>
      </span>
    </span>
  );
}
