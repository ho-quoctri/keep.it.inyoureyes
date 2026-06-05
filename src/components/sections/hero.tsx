"use client";

import { useEffect, useRef, useState } from "react";
import { useSitePreloader } from "@/components/providers/site-preloader-provider";
import { useScrambleText } from "@/hooks/useScrambleText";
import { gsap, useGSAP } from "@/lib/gsap";
import { EyesSlide } from "@/components/common/eyes-slide";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const videoCursorRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hoverIntentRef = useRef<number | null>(null);
  const interactionStateRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    previousTargetX: 0,
    velocityX: 0,
    rotation: 0,
    titleTargetX: 0,
    titleTargetY: 0,
    titleCurrentX: 0,
    titleCurrentY: 0,
    active: false,
    revealed: false,
  });
  const { isLoading } = useSitePreloader();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useScrambleText({
    scopeRef: sectionRef,
    enabled: !isLoading && inView,
    selector: "[data-hero-scramble]",
  });

  useGSAP(
    () => {
      const title = titleRef.current;
      const videoCursor = videoCursorRef.current;
      const video = videoRef.current;

      if (!title || !videoCursor || !video) {
        return;
      }

      const state = interactionStateRef.current;
      const revealDelay = 110;
      const cursorOffsetX = 28;
      const cursorOffsetY = 24;

      const syncInitialPosition = () => {
        const titleRect = title.getBoundingClientRect();
        const videoWidth = videoCursor.offsetWidth || 320;
        const videoHeight = videoCursor.offsetHeight || 180;
        const nextX = gsap.utils.clamp(12, window.innerWidth - videoWidth - 12, titleRect.left + titleRect.width / 2 - videoWidth / 2);
        const nextY = gsap.utils.clamp(12, window.innerHeight - videoHeight - 12, titleRect.top + titleRect.height / 2 - videoHeight / 2);

        state.targetX = nextX;
        state.targetY = nextY;
        state.currentX = nextX;
        state.currentY = nextY;
        state.previousTargetX = nextX;

        gsap.set(videoCursor, { x: nextX, y: nextY });
      };

      const updateTargets = (clientX: number, clientY: number) => {
        const videoWidth = videoCursor.offsetWidth || 320;
        const videoHeight = videoCursor.offsetHeight || 180;
        const nextX = gsap.utils.clamp(12, window.innerWidth - videoWidth - 12, clientX + cursorOffsetX);
        const nextY = gsap.utils.clamp(12, window.innerHeight - videoHeight - 12, clientY + cursorOffsetY);

        state.velocityX = nextX - state.previousTargetX;
        state.previousTargetX = nextX;
        state.targetX = nextX;
        state.targetY = nextY;

        const titleRect = title.getBoundingClientRect();
        const relativeX = titleRect.width === 0 ? 0 : (clientX - titleRect.left) / titleRect.width;
        const relativeY = titleRect.height === 0 ? 0 : (clientY - titleRect.top) / titleRect.height;

        state.titleTargetX = gsap.utils.mapRange(0, 1, -20, 20, gsap.utils.clamp(0, 1, relativeX));
        state.titleTargetY = gsap.utils.mapRange(0, 1, -10, 10, gsap.utils.clamp(0, 1, relativeY));
      };

      const clearHoverIntent = () => {
        if (hoverIntentRef.current !== null) {
          window.clearTimeout(hoverIntentRef.current);
          hoverIntentRef.current = null;
        }
      };

      const revealCursor = () => {
        hoverIntentRef.current = null;
        if (state.revealed) {
          void video.play().catch(() => undefined);
          return;
        }

        state.revealed = true;
        gsap.killTweensOf(videoCursor);
        gsap.to(videoCursor, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
        });
        void video.play().catch(() => undefined);
      };

      const hideCursor = () => {
        clearHoverIntent();
        state.revealed = false;
        state.active = false;
        state.titleTargetX = 0;
        state.titleTargetY = 0;
        gsap.killTweensOf(videoCursor);
        gsap.to(videoCursor, {
          autoAlpha: 0,
          scale: 0.8,
          duration: 0.4,
          ease: "power3.out",
        });
        video.pause();
      };

      const startHoverIntent = () => {
        clearHoverIntent();
        hoverIntentRef.current = window.setTimeout(revealCursor, revealDelay);
      };

      const activateFromCenter = () => {
        const titleRect = title.getBoundingClientRect();
        updateTargets(titleRect.left + titleRect.width / 2, titleRect.top + titleRect.height / 2);
        state.active = true;
        startHoverIntent();
      };

      const onPointerEnter = (event: PointerEvent) => {
        state.active = true;
        updateTargets(event.clientX, event.clientY);
        startHoverIntent();
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!state.active) {
          return;
        }

        updateTargets(event.clientX, event.clientY);
      };

      const onPointerLeave = () => {
        hideCursor();
      };

      const onFocus = () => {
        activateFromCenter();
      };

      const onBlur = () => {
        hideCursor();
      };

      const tick = () => {
        state.currentX += (state.targetX - state.currentX) * 0.25;
        state.currentY += (state.targetY - state.currentY) * 0.25;

        const targetRotation = state.active ? gsap.utils.clamp(-15, 15, state.velocityX * 0.35) : 0;
        state.rotation += (targetRotation - state.rotation) * 0.14;

        state.titleCurrentX += (state.titleTargetX - state.titleCurrentX) * 0.12;
        state.titleCurrentY += (state.titleTargetY - state.titleCurrentY) * 0.12;

        gsap.set(videoCursor, {
          x: state.currentX,
          y: state.currentY,
          rotation: state.rotation,
        });

        gsap.set(title, {
          x: state.titleCurrentX,
          y: state.titleCurrentY,
        });

        state.velocityX *= 0.82;
      };

      syncInitialPosition();

      gsap.set(videoCursor, {
        autoAlpha: 0,
        scale: 0.8,
        x: state.currentX,
        y: state.currentY,
        transformOrigin: "50% 50%",
      });

      title.addEventListener("pointerenter", onPointerEnter);
      title.addEventListener("pointermove", onPointerMove);
      title.addEventListener("pointerleave", onPointerLeave);
      title.addEventListener("focus", onFocus);
      title.addEventListener("blur", onBlur);
      window.addEventListener("resize", syncInitialPosition);
      gsap.ticker.add(tick);

      return () => {
        clearHoverIntent();
        title.removeEventListener("pointerenter", onPointerEnter);
        title.removeEventListener("pointermove", onPointerMove);
        title.removeEventListener("pointerleave", onPointerLeave);
        title.removeEventListener("focus", onFocus);
        title.removeEventListener("blur", onBlur);
        window.removeEventListener("resize", syncInitialPosition);
        gsap.ticker.remove(tick);
        video.pause();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto flex min-h-screen w-full max-w-full items-center justify-center overflow-hidden px-6  sm:px-10 lg:px-16"
    >
      
      <div className="relative flex w-full flex-col items-center justify-center">
        <div
          ref={titleRef}
          tabIndex={0}
          className="cursor-none font-secondary text-center flex items-center flex-col justify-center text-[clamp(40px,5.4vw,100px)] tracking-[-0.06em] outline-none will-change-transform"
          aria-label="Crafting digital experiences"
        >
          <div className="flex items-center"><EyesSlide /></div>
          <div data-hero-scramble>branding</div>
          <div data-hero-scramble>web/app design</div>
          <div data-hero-scramble>motion</div>
          <div data-hero-scramble>development</div>
        </div>
        <div
          ref={videoCursorRef}
          className="pointer-events-none fixed left-0 top-0 z-9999 aspect-video w-[320px] overflow-hidden rounded-xl bg-black shadow-xl will-change-transform"
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            src="/videos/projects.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

    </section>
  );
}