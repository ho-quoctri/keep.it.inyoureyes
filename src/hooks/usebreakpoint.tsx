/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type TailwindBreakpoint = keyof typeof TAILWIND_BREAKPOINTS;

function useBreakpoint(breakpoint: TailwindBreakpoint | number): boolean {
  const px =
    typeof breakpoint === "number"
      ? breakpoint
      : TAILWIND_BREAKPOINTS[breakpoint];

  const query = `(min-width: ${px}px)`;

  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false; // SSR safe
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export { useBreakpoint, TAILWIND_BREAKPOINTS };
export type { TailwindBreakpoint };