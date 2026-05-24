"use client";

import { MENU } from "@/constants/menu";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { gsap } from "@/lib/gsap";

interface NavbarProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isClickScrolling: React.MutableRefObject<boolean>;
}

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
            fontSize: "80px",
            lineHeight: "80px",
            color: "var(--primary)",
            fontWeight: "700",
            duration: 0.4,
            ease: "power2.out",
          });
        } else {
          gsap.to(element, {
            fontSize: "40px",
            lineHeight: "40px",
            color: "var(--secondary)",
            fontWeight: "400",
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });
    }, [activeIndex]);

    const handleItemClick = (index: number) => {
      // 1. Cập nhật index đích ngay lập tức để Navbar đổi hiệu ứng chữ ngay khi vừa click
      setActiveIndex(index);
      
      const container = scrollContainerRef.current;
      const targetSection = document.getElementById(`section-${index}`);

      if (targetSection && container) {
        // 2. Bật cờ khóa: Báo cho ScrollTrigger biết đang cuộn chủ động do Click
        isClickScrolling.current = true;

        // Xóa timeout cũ nếu người dùng click liên tục nhiều tab
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        const targetOffsetTop = targetSection.offsetTop;
        
        container.scrollTo({
          top: targetOffsetTop,
          behavior: "smooth"
        });

        // 3. Tạo cơ chế phát hiện cuộn hoàn tất (Scroll End)
        // Khi container ngừng dịch chuyển trong khoảng 100ms, cờ khóa sẽ được hạ xuống an toàn
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

    // Dọn dẹp bộ nhớ khi unmount component
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
            style={{ fontSize: "40px", lineHeight: "40px" }}
          >
            {item.name},
          </div>
        ))}
      </div>
    );
  }
);

Navbar.displayName = "Navbar";