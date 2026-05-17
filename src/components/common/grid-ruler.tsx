"use client";

import { useEffect, useRef } from "react";

const STEP = 50;
const MAJOR_EVERY = 100;

export function GridRuler() {
  const topCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const topCanvas = topCanvasRef.current;
    const leftCanvas = leftCanvasRef.current;
    if (!topCanvas || !leftCanvas) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const thickness = 20;

      const styles = getComputedStyle(document.documentElement);
      const color =
        styles.getPropertyValue("--ruler-color").trim() ||
        styles.getPropertyValue("--primary").trim() ||
        "#000";
      const fontFamily =
        styles.getPropertyValue("--font-body").trim() || "ui-monospace, monospace";

      const setupCanvas = (
        canvas: HTMLCanvasElement,
        w: number,
        h: number
      ) => {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.font = `9px ${fontFamily}`;
        ctx.textBaseline = "top";
        ctx.lineWidth = 1;
        return ctx;
      };

      const topCtx = setupCanvas(topCanvas, width, thickness);
      if (topCtx) {
        for (let x = 0; x <= width; x += STEP) {
          const isMajor = x % MAJOR_EVERY === 0;
          const tickLen = isMajor ? thickness * 0.55 : thickness * 0.3;
          topCtx.beginPath();
          topCtx.moveTo(x + 0.5, thickness);
          topCtx.lineTo(x + 0.5, thickness - tickLen);
          topCtx.stroke();
          if (isMajor && x !== 0) {
            topCtx.fillText(String(x), x + 3, 2);
          }
        }
      }

      const leftCtx = setupCanvas(leftCanvas, thickness, height);
      if (leftCtx) {
        for (let y = 0; y <= height; y += STEP) {
          const isMajor = y % MAJOR_EVERY === 0;
          const tickLen = isMajor ? thickness * 0.55 : thickness * 0.3;
          leftCtx.beginPath();
          leftCtx.moveTo(thickness, y + 0.5);
          leftCtx.lineTo(thickness - tickLen, y + 0.5);
          leftCtx.stroke();
          if (isMajor && y !== 0) {
            leftCtx.save();
            leftCtx.translate(2, y + 3);
            leftCtx.fillText(String(y), 0, 0);
            leftCtx.restore();
          }
        }
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <div className="grid-ruler" aria-hidden="true">
      <canvas ref={topCanvasRef} className="grid-ruler__axis grid-ruler__axis--top" />
      <canvas ref={leftCanvasRef} className="grid-ruler__axis grid-ruler__axis--left" />
      <div className="grid-ruler__corner" />
    </div>
  );
}
