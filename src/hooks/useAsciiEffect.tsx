"use client";

import { useEffect, useRef } from "react";

type UseAsciiEffectOptions = {
  imageSrc: string;
  pixelResolution?: number;
  backgroundColor?: string;

  asciiChars?: string[];
  numberChars?: string[];

  brightThreshold?: number;
  mediumThreshold?: number;
};

const DEFAULT_ASCII = [
  "@",
  "#",
  "8",
  "&",
  "o",
  ":",
  "*",
  ".",
  " ",
];

const DEFAULT_NUMBERS = [
  "0",
  "1",
  "7",
  "9",
  "Ø",
  "∑",
  "∞",
  "X",
  "Y",
];

function useAsciiEffect(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  {
    imageSrc,
    pixelResolution = 7,
    backgroundColor = "#020105",

    asciiChars = DEFAULT_ASCII,
    numberChars = DEFAULT_NUMBERS,

    brightThreshold = 180,
    mediumThreshold = 80,
  }: UseAsciiEffectOptions
) {
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrameId = 0;

    // blink state
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkFrame = 0;

    const img = new Image();
    img.src = imageSrc;

    const offscreenCanvas =
      document.createElement("canvas");

    const offCtx =
      offscreenCanvas.getContext("2d");

    if (!offCtx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    img.onload = () => {
      resizeCanvas();

      const render = () => {
        if (!ctx) return;

        // background
        ctx.fillStyle = backgroundColor;

        ctx.fillRect(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const cols = Math.floor(
          canvas.width / pixelResolution
        );

        const rows = Math.floor(
          canvas.height / pixelResolution
        );

        offscreenCanvas.width = cols;
        offscreenCanvas.height = rows;

        // draw image
        offCtx.clearRect(0, 0, cols, rows);

        offCtx.drawImage(
          img,
          0,
          0,
          cols,
          rows
        );

        const imgData = offCtx.getImageData(
          0,
          0,
          cols,
          rows
        ).data;

        ctx.font = `bold ${
          pixelResolution + 2
        }px monospace`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // blink animation
        blinkTimer += 1;

        if (
          blinkTimer > 200 &&
          !isBlinking
        ) {
          isBlinking = true;
          blinkFrame = 0;
        }

        if (isBlinking) {
          blinkFrame += 1;

          if (blinkFrame > 12) {
            isBlinking = false;
            blinkTimer = 0;
          }
        }

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const idx =
              (y * cols + x) * 4;

            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];

            const brightness =
              0.2126 * r +
              0.7152 * g +
              0.0722 * b;

            const posX =
              x * pixelResolution +
              pixelResolution / 2;

            const posY =
              y * pixelResolution +
              pixelResolution / 2;

            // BRIGHT AREA
            if (
              brightness > brightThreshold
            ) {
              ctx.fillStyle = "#D3D3D3";

              const numChar =
                numberChars[
                  Math.floor(
                    (x +
                      y +
                      blinkTimer / 10) %
                      numberChars.length
                  )
                ];

              ctx.fillText(
                numChar,
                posX,
                posY
              );
            }

            // MID AREA
            else if (
              brightness >
              mediumThreshold
            ) {
              ctx.fillStyle =
                "rgba(255,255,255,0.75)";

              const charIdx = Math.floor(
                (brightness / 255) *
                  (asciiChars.length - 1)
              );

              ctx.fillText(
                asciiChars[charIdx],
                posX,
                posY
              );
            }

            // DARK AREA
            else {
              ctx.fillStyle =
                "rgba(153,0,255,0)";

              if ((x + y) % 3 === 0) {
                ctx.fillText(
                  numberChars[
                    x % numberChars.length
                  ],
                  posX,
                  posY
                );
              } else {
                ctx.fillRect(
                  posX -
                    pixelResolution / 4,
                  posY -
                    pixelResolution / 4,
                  pixelResolution / 2,
                  pixelResolution / 2
                );
              }
            }
          }
        }

        animationFrameId =
          requestAnimationFrame(render);
      };

      render();
    };

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    return () => {
      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, [
    imageSrc,
    pixelResolution,
    backgroundColor,
    asciiChars,
    numberChars,
    brightThreshold,
    mediumThreshold,
    canvasRef,
  ]);
}

type AsciiImageProps = {
  imageSrc: string;
  className?: string;

  pixelResolution?: number;
  backgroundColor?: string;
};

export function AsciiImage({
  imageSrc,
  className,

  pixelResolution,
  backgroundColor,
}: AsciiImageProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useAsciiEffect(canvasRef, {
    imageSrc,
    pixelResolution,
    backgroundColor,
  });

  return (
    <div
      className={`
        relative
        overflow-hidden
        ${className ?? ""}
      `}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}