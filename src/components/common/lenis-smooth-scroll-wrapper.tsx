"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Lenis from "lenis";

type LenisSmoothScrollWrapperProps = {
  children: ReactNode;
};

export function LenisSmoothScrollWrapper({
  children,
}: LenisSmoothScrollWrapperProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}