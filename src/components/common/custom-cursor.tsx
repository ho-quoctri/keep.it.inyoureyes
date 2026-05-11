"use client";

import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "content";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const contentSelectors = [
      "p",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "li",
      "blockquote",
      "strong",
      "em",
      "figcaption",
      "article",
      "section",
      "figure",
      "img",
      "video",
      "canvas",
      "[data-cursor='text']",
      "[data-cursor='content']",
    ].join(",");

    const updateVariant = (x: number, y: number) => {
      const element = document.elementFromPoint(x, y);
      setVariant(element?.closest(contentSelectors) ? "content" : "default");
    };

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      targetRef.current = { x: clientX, y: clientY };
      updateVariant(clientX, clientY);

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
        currentRef.current = { x: clientX, y: clientY };
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
      setVariant("default");
    };

    const onMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    const animate = () => {
      const cursor = cursorRef.current;
      if (cursor) {
        const speed = 0.16;
        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * speed;
        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * speed;

        cursor.style.setProperty("--cursor-x", `${currentRef.current.x}px`);
        cursor.style.setProperty("--cursor-y", `${currentRef.current.y}px`);
      }

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseenter", onMouseEnter, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor custom-cursor--${variant} ${isVisible ? "is-visible" : ""}`}
      aria-hidden="true"
    />
  );
}