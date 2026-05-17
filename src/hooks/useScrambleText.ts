"use client";

import { RefObject, useEffect } from "react";
import { gsap } from "@/lib/gsap";

type UseScrambleTextOptions = {
  scopeRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
  selector?: string;
  scrambleChars?: string;
  scrambleDuration?: number;
  entranceDuration?: number;
  entranceY?: number;
  overlap?: number;
};

export function useScrambleText({
  scopeRef,
  enabled = true,
  selector = "[data-scramble-text]",
  scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&",
  scrambleDuration = 0.9,
  entranceDuration = 0.45,
  entranceY = 22,
  overlap = 0.2,
}: UseScrambleTextOptions) {
  useEffect(() => {
    if (!enabled || !scopeRef.current) {
      return;
    }

    const scrambleText = (element: HTMLElement, targetText: string) => {
      const state = { progress: 0 };
      const targetChars = Array.from(targetText);

      gsap.to(state, {
        progress: 1,
        duration: scrambleDuration,
        ease: "power2.out",
        onUpdate: () => {
          const revealCount = Math.floor(state.progress * targetChars.length);
          const scrambled = targetChars
            .map((char, index) => {
              if (char === " ") {
                return " ";
              }

              if (index < revealCount) {
                return char;
              }

              const randomIndex = Math.floor(Math.random() * scrambleChars.length);
              return scrambleChars[randomIndex];
            })
            .join("");

          element.textContent = scrambled;
        },
        onComplete: () => {
          element.textContent = targetText;
        },
      });
    };

    const ctx = gsap.context(() => {
      const textNodes = gsap.utils.toArray<HTMLElement>(selector);

      if (!textNodes.length) {
        return;
      }

      const originalTexts = textNodes.map((node) => node.textContent ?? "");

      gsap.set(textNodes, { autoAlpha: 0, y: entranceY });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      textNodes.forEach((node, index) => {
        timeline.to(
          node,
          {
            autoAlpha: 1,
            y: 0,
            duration: entranceDuration,
            onStart: () => scrambleText(node, originalTexts[index]),
          },
          index === 0 ? 0 : `-=${overlap}`
        );
      });
    }, scopeRef);

    return () => {
      ctx.revert();
    };
  }, [enabled, entranceDuration, entranceY, overlap, scopeRef, scrambleChars, scrambleDuration, selector]);
}
