"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function useGsap(scopeName = "scope") {
  const scope = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!scope.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Intentionally empty. Add section-specific timelines later.
    }, scope);

    return () => ctx.revert();
  }, [scopeName]);

  return scope;
}