"use client";

import { MENU } from "@/constants/menu";
import { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    MENU.forEach((_, index) => {
      const element = itemRefs.current[index];
      if (!element) return;

      if (index === activeIndex) {
        gsap.to(element, {
          fontSize: "80px",
          lineHeight: "80px",
          color: "var(--primary)",
          duration: 0.5,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(element, {
          fontSize: "40px",
          lineHeight: "40px",
          color: "var(--secondary)",
          duration: 0.5,
          ease: "power2.inOut",
        });
      } 
    });
  }, [activeIndex]);

  return (
    <div className="flex flex-col text-end items-end gap-4">
      {MENU.map((item, index) => (
        <div
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          onClick={() => setActiveIndex(index)}
          className={`capitalize interactive ${activeIndex === index ? "text-primary font-secondary text-[80px] leading-20" : "text-secondary text-[40px] leading-10"}`}
          key={item.name}
        >
          {item.name},
        </div>
      ))}
    </div>
  );
}