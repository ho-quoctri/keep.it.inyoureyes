"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap"; // Điều chỉnh đường dẫn import GSAP tùy cấu hình dự án của bạn

const LOCK_SELECTOR = ".interactive";
const TRACK_SELECTOR = ".trackable";
const TRACK_PROXIMITY = 160;
const AMBIENT_SIZE = 36;
const LOCK_PADDING = 8;

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const axisRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const root = rootRef.current;
    const axis = axisRef.current;
    const box = boxRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !axis || !box || !dot || !label) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const currentPos = { x: mouse.x, y: mouse.y };
    
    // Khởi tạo state cho chiếc hộp Lock mục tiêu
    const boxState = {
      x: mouse.x - AMBIENT_SIZE / 2,
      y: mouse.y - AMBIENT_SIZE / 2,
      w: AMBIENT_SIZE,
      h: AMBIENT_SIZE,
    };

    let lockedEl: HTMLElement | null = null;
    let rafId = 0;
    let visible = false;

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      gsap.to(root, {
        autoAlpha: next ? 1 : 0,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const tweenBoxTo = (
      rect: { x: number; y: number; w: number; h: number },
      duration: number
    ) => {
      gsap.to(boxState, {
        ...rect,
        duration,
        ease: "expo.out",
        overwrite: true,
      });
    };

    const lockRectFor = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - LOCK_PADDING,
        y: rect.top - LOCK_PADDING,
        w: rect.width + LOCK_PADDING * 2,
        h: rect.height + LOCK_PADDING * 2,
      };
    };

    const lockTo = (el: HTMLElement) => {
      lockedEl = el;
      root.classList.add("custom-cursor--locked");
      tweenBoxTo(lockRectFor(el), 0.45);
    };

    const unlock = () => {
      if (!lockedEl) return;
      lockedEl = null;
      root.classList.remove("custom-cursor--locked");
    };

    const findNearestTrackable = (x: number, y: number): HTMLElement | null => {
      const nodes = document.querySelectorAll<HTMLElement>(TRACK_SELECTOR);
      let best: HTMLElement | null = null;
      let bestDist = TRACK_PROXIMITY;

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const cx = Math.max(rect.left, Math.min(x, rect.right));
        const cy = Math.max(rect.top, Math.min(y, rect.bottom));
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < bestDist) {
          best = node;
          bestDist = dist;
        }
      });

      return best;
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      setVisible(true);

      const hoverEl = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        LOCK_SELECTOR
      );

      const nextEl = hoverEl ?? findNearestTrackable(mouse.x, mouse.y);

      if (nextEl && nextEl !== lockedEl) {
        lockTo(nextEl);
      } else if (!nextEl && lockedEl) {
        unlock();
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    const onScrollOrResize = () => {
      if (lockedEl) {
        tweenBoxTo(lockRectFor(lockedEl), 0.25);
      }
    };

    const tick = () => {
      const lerp = 0.28;
      currentPos.x += (mouse.x - currentPos.x) * lerp;
      currentPos.y += (mouse.y - currentPos.y) * lerp;

      // 1. Di chuyển trục XY theo tọa độ chuột
      axis.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0) translate(-50%, -50%)`;
      axis.style.width = `${window.innerWidth * 2}px`;
      axis.style.height = `${window.innerHeight * 2}px`;

      // 2. Di chuyển dấu cộng ở trung tâm trục
      dot.style.transform = `translate3d(${currentPos.x}px, ${currentPos.y}px, 0) translate(-50%, -50%)`;

      // 3. Xử lý khung hộp Lock khi hover mục tiêu
      if (!lockedEl) {
        // Khi không hover, thu nhỏ hộp ẩn về tâm chuột theo hiệu ứng lerp mượt
        boxState.x += (mouse.x - boxState.w / 2 - boxState.x) * lerp;
        boxState.y += (mouse.y - boxState.h / 2 - boxState.y) * lerp;
        boxState.w += (0 - boxState.w) * lerp;
        boxState.h += (0 - boxState.h) * lerp;
      }

      box.style.transform = `translate3d(${boxState.x}px, ${boxState.y}px, 0)`;
      box.style.width = `${boxState.w}px`;
      box.style.height = `${boxState.h}px`;

      // 4. Nhãn text HUD hiển thị thông tin kĩ thuật số
      if (lockedEl) {
        const rect = lockedEl.getBoundingClientRect();
        label.textContent = `OBJ_LOCK | W: ${Math.round(rect.width)}px H: ${Math.round(
          rect.height
        )}px | X: ${Math.round(rect.left)} Y: ${Math.round(rect.top)}`;
        label.style.transform = `translate3d(${boxState.x + boxState.w + 12}px, ${
          boxState.y + boxState.h - 14
        }px, 0)`;
      } else {
        label.textContent = `TRK_X: ${Math.round(mouse.x)} / TRK_Y: ${Math.round(
          mouse.y
        )}`;
        label.style.transform = `translate3d(${currentPos.x + 18}px, ${currentPos.y + 18}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <div ref={rootRef} className="custom-cursor" aria-hidden="true">
      {/* Trục tọa độ XY cắt nhau */}
      <div ref={axisRef} className="custom-cursor__axis" />
      
      {/* Khung hộp Lock với 4 góc (Sẽ phóng to ra khi hover) */}
      <div ref={boxRef} className="custom-cursor__box">
        <span className="custom-cursor__corner custom-cursor__corner--tl" />
        <span className="custom-cursor__corner custom-cursor__corner--tr" />
        <span className="custom-cursor__corner custom-cursor__corner--bl" />
        <span className="custom-cursor__corner custom-cursor__corner--br" />
      </div>
      
      {/* Tâm giao nhau: Dấu cộng đậm */}
      <div ref={dotRef} className="custom-cursor__crosshair" />
      
      {/* Nhãn chữ */}
      <div ref={labelRef} className="custom-cursor__label" />
    </div>
  );
}