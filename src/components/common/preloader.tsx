"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BrandName } from "@/components/common/brand-name";

type PreloaderProps = {
  finishLoading: () => void;
};

export function Preloader({ finishLoading }: PreloaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !fillRef.current || !brandRef.current || !progressRef.current) return;

    const fillEl = fillRef.current;
    const brandEl = brandRef.current;
    const progressEl = progressRef.current;

    const ctx = gsap.context(() => {
      gsap.set(fillEl, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(brandEl, {
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "top left",
      });

      const brandRect = brandEl.getBoundingClientRect();
      const targetRight = 40;
      const targetTop = 40;
      const targetX = window.innerWidth - targetRight - brandRect.width - brandRect.left;
      const targetY = targetTop - brandRect.top;

      const wrapperEl = wrapperRef.current!;

      const progressTimeline = gsap.timeline();

      progressTimeline.to(fillEl, {
        scaleX: 0.84,
        duration: 1.9,
        ease: "power2.inOut",
      });

      progressTimeline.to(fillEl, {
        scaleX: 1,
        duration: 0.45,
        ease: "power4.out",
      });

      progressTimeline.to(progressEl, {
        autoAlpha: 0,
        y: 10,
        duration: 0.4,
        ease: "power2.out",
      });

      progressTimeline.to(
        brandEl,
        {
          x: targetX,
          y: targetY,
          scale: 1,
          duration: 1.1,
          ease: "power3.inOut",
        },
        "-=0.35"
      );

      // pause 0.3s, then cube-flip brand upward (bottom edge as pivot)
      progressTimeline.to(brandEl, {
        rotationX: -90,
        transformOrigin: "50% 100%",
        duration: 0.45,
        ease: "power2.in",
        delay: 0.3,
      });

      // once brand is edge-on, fade overlay so page appears
      progressTimeline.to(wrapperEl, {
        backgroundColor: "rgba(238,237,234,0)",
        duration: 0.35,
        ease: "power2.out",
        onComplete: finishLoading,
      });
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, [finishLoading]);

  return (
    <div
      ref={wrapperRef}
      className="loader-wrapper fixed inset-0 z-9999 flex items-center flex-col justify-center bg-background text-foreground"
    >
      <div
        ref={brandRef}
        className="pointer-events-none"
        style={{ perspective: 600 }}
      >
        <BrandName />
      </div>
      <div ref={progressRef} className="loader-progress-shell">
        <div className="loader-progress-labels" aria-hidden="true">
          <span className="font-sans text-2xl">0</span>
          <span className="font-sans text-2xl">100%</span>
        </div>
        <div className="loader-progress-track">
          <span ref={fillRef} className="loader-progress-fill" />
        </div>
      </div>
    </div>
  );
}
