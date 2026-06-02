"use client";

import { useRef } from "react";
import { Hero } from "@/components/sections/hero";
import { gsap, useGSAP } from "@/lib/gsap";

export const ServiceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const pills = gsap.utils.toArray<HTMLElement>("[data-float]");

      pills.forEach((pill, index) => {
        gsap.to(pill, {
          x: index === 0 ? 40 : -40,
          y: index === 0 ? -30 : 30,
          rotation: index === 0 ? 4 : -4,
          duration: gsap.utils.random(5, 8),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      const onMove = (e: MouseEvent) => {
        pills.forEach((pill) => {
          const rect = pill.getBoundingClientRect();

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 400) {
            gsap.to(pill, {
              x: `+=${dx * 0.015}`,
              y: `+=${dy * 0.015}`,
              duration: 1.2,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      };

      window.addEventListener("mousemove", onMove);

      return () => {
        window.removeEventListener("mousemove", onMove);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden"
    >
      {/* Floating Elements */}

      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          data-float
          className="
            absolute
            left-[8%]
            top-[18%]
            w-fit
            rounded-full
            border-2
            border-primary
            bg-background/20
            px-6
            py-3
            font-primary
            text-2xl
            font-semibold
            backdrop-blur-md
            will-change-transform
          "
        >
          you need it?
        </div>

        <div
          data-float
          className="
            absolute
            bottom-[18%]
            right-[8%]
            w-fit
            rounded-full
            border-2
            border-primary
            bg-background/20
            px-6
            py-3
            font-primary
            text-2xl
            font-semibold
            backdrop-blur-md
            will-change-transform
          "
        >
          we provide it.
        </div>
      </div>
      <div className="relative z-10 w-full">
        <Hero />
      </div>
    </section>
  );
};