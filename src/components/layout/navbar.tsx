"use client";

import { MENU } from "@/constants/menu";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { gsap } from "@/lib/gsap";

interface NavbarProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isClickScrolling: React.MutableRefObject<boolean>;
}

// clamp(min, preferred, max)
// preferred dùng vw để scale liên tục theo viewport width
// min/max giữ kích thước trong giới hạn hợp lý
const FONT_SIZES = {
  active:   "clamp(32px, 5vw, 80px)",
  inactive: "clamp(18px, 2.8vw, 40px)",
};

export const Navbar = forwardRef<{ setActiveIndex: (index: number) => void }, NavbarProps>(
  ({ scrollContainerRef, isClickScrolling }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      setActiveIndex: (index: number) => {
        setActiveIndex(index);
      },
    }));

    useEffect(() => {
      MENU.forEach((_, index) => {
        const element = itemRefs.current[index];
        if (!element) return;

        if (index === activeIndex) {
          gsap.to(element, {
            fontSize: FONT_SIZES.active,
            lineHeight: FONT_SIZES.active,
            color: "var(--primary)",
            fontWeight: "700",
            duration: 0.4,
            ease: "power2.out",
          });
        } else {
          gsap.to(element, {
            fontSize: FONT_SIZES.inactive,
            lineHeight: FONT_SIZES.inactive,
            color: "var(--secondary)",
            fontWeight: "400",
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });
    }, [activeIndex]);

    const handleItemClick = (index: number) => {
      setActiveIndex(index);

      const container = scrollContainerRef.current;
      const targetSection = document.getElementById(`section-${index}`);

      if (targetSection && container) {
        isClickScrolling.current = true;

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        container.scrollTo({
          top: targetSection.offsetTop,
          behavior: "smooth",
        });

        const handleScrollEnd = () => {
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => {
            isClickScrolling.current = false;
            container.removeEventListener("scroll", handleScrollEnd);
          }, 100);
        };

        container.addEventListener("scroll", handleScrollEnd);
      }
    };

    useEffect(() => {
      return () => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, []);

    return (
      <div className="flex flex-col text-end items-end gap-6 select-none">
        {MENU.map((item, index) => (
          <div
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            onClick={() => handleItemClick(index)}
            className="capitalize interactive cursor-pointer transition-colors duration-200 origin-right"
            key={item.name}
            style={{ fontSize: FONT_SIZES.inactive, lineHeight: FONT_SIZES.inactive }}
          >
            {item.name},
          </div>
        ))}
      </div>
    );
  }
);

Navbar.displayName = "Navbar";