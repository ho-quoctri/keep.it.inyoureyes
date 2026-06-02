"use client";

import { useEffect, useRef, useState } from "react";
import { EyesSlide } from "@/components/common/eyes-slide";
import { useSitePreloader } from "@/components/providers/site-preloader-provider";
import { useScrambleText } from "@/hooks/useScrambleText";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { isLoading } = useSitePreloader();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useScrambleText({
    scopeRef: sectionRef,
    enabled: !isLoading && inView,
    selector: "[data-hero-scramble]",
  });

  return (
    <section ref={sectionRef} className="mx-auto w-full flex items-center justify-center max-w-full overflow-hidden">
      <div className="font-secondary text-[clamp(40px,5.4vw,100px)] flex flex-col items-center leading-[1.05] text-center tracking-tighter">
        <div className="flex items-center gap-[0.2em]">
          <div className="flex items-center"><EyesSlide /></div>
        </div>
        <div data-hero-scramble>branding</div>
        <div data-hero-scramble>web/app design</div>
        <div data-hero-scramble>motion</div>
        <div data-hero-scramble>development</div>
      </div>
    </section>
  );
}