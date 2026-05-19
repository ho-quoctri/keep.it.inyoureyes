"use client";

import { useRef } from "react";
import { EyesSlide } from "@/components/common/eyes-slide";
import { useSitePreloader } from "@/components/providers/site-preloader-provider";
import { useScrambleText } from "@/hooks/useScrambleText";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isLoading } = useSitePreloader();

  useScrambleText({
    scopeRef: sectionRef,
    enabled: !isLoading,
    selector: "[data-hero-scramble]",
  });

  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-full overflow-hidden">
      <div className="font-secondary text-[clamp(40px,7.5vw,120px)] leading-[1.05] text-left tracking-tighter">
        <div data-hero-scramble>THE</div>
        <div data-hero-scramble>ART</div>
       
        <div className="flex items-center gap-[0.2em]">
          <div className="h-[1em] flex items-center"><EyesSlide /></div>
          <div data-hero-scramble>OF</div>
        </div>
        
        <div data-hero-scramble>BRIDGING</div>
        <div data-hero-scramble>CODE &amp; SOUL</div>
      </div>
    </section>
  );
}