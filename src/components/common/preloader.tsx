"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type PreloaderProps = {
  finishLoading: () => void;
};

export function Preloader({ finishLoading }: PreloaderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !fillRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(fillRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      const progressTimeline = gsap.timeline({
        onComplete: () => {
          gsap.to(wrapperRef.current, {
            y: "-100%",
            duration: 1,
            ease: "expo.inOut",
            onComplete: finishLoading,
          });
        },
      });

      progressTimeline
        .to(fillRef.current, {
          scaleX: 0.8,
          duration: 2.5,
          ease: "power1.inOut",
        })
        .to(fillRef.current, {
          scaleX: 1,
          duration: 0.5,
          ease: "power4.out",
        });
    }, wrapperRef);

    return () => {
      ctx.revert();
    };
  }, [finishLoading]);

  return (
    <div
      ref={wrapperRef}
      className="loader-wrapper fixed inset-0 z-[9999] flex items-center justify-center bg-background text-foreground"
    >
      <div className="loader-progress-shell">
        <div className="loader-progress-labels" aria-hidden="true">
          <span>0</span>
          <span>100%</span>
        </div>
        <div className="loader-progress-track">
          <span ref={fillRef} className="loader-progress-fill" />
        </div>
      </div>
    </div>
  );
}
