import { cn } from "@/lib/utils";

/**
 * Logotype "HILTON 76" — wordmark inspired by the press kit:
 * "HILTON" in white display sans, "7" in white with a red diagonal slash
 * forming the "6". Vector reproduction so it scales and animates cleanly.
 */
export function Hilton76Logo({ className }: { className?: string }) {
  return (
    <span
      aria-label="Hilton 76"
      className={cn(
        "inline-flex items-center font-display uppercase leading-none tracking-tight text-racing-white",
        className
      )}
    >
      <span className="text-[1.6em]">Hilton</span>
      <span className="ml-2 inline-flex items-baseline">
        <span className="relative text-[1.8em] text-racing-white">
          7
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 w-[3px] bg-racing-red rotate-[18deg] origin-center"
          />
        </span>
        <span className="text-[1.8em] text-racing-red">6</span>
      </span>
    </span>
  );
}
