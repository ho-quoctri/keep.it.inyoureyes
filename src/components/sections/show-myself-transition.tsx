"use client";

import { useEffect, useRef } from "react";
import { ShowSection } from "@/components/sections/show-section";
import { MyselfSection } from "@/components/sections/myself-section";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type RectLike = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function interpolateRect(progress: number, from: RectLike, to: RectLike): RectLike {
  return {
    left: gsap.utils.interpolate(from.left, to.left, progress),
    top: gsap.utils.interpolate(from.top, to.top, progress),
    width: gsap.utils.interpolate(from.width, to.width, progress),
    height: gsap.utils.interpolate(from.height, to.height, progress),
  };
}

function safePlay(video: HTMLVideoElement | null) {
  if (!video) {
    return;
  }

  const playResult = video.play();
  if (playResult && typeof playResult.catch === "function") {
    playResult.catch(() => undefined);
  }
}

export function ShowMyselfTransition() {
  const showSectionRef = useRef<HTMLElement | null>(null);
  const globeRef = useRef<HTMLDivElement | null>(null);
  const heroVideoFrameRef = useRef<HTMLDivElement | null>(null);
  const sourceVideoRef = useRef<HTMLVideoElement | null>(null);
  const dragHintRef = useRef<HTMLDivElement | null>(null);
  const myselfSectionRef = useRef<HTMLElement | null>(null);
  const targetContainerRef = useRef<HTMLDivElement | null>(null);
  const targetVideoRef = useRef<HTMLVideoElement | null>(null);
  const cloneRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef(0);
  const sourceAnchorRectRef = useRef<RectLike | null>(null);

  useEffect(() => {
    const showSection = showSectionRef.current;
    const globe = globeRef.current;
    const heroVideoFrame = heroVideoFrameRef.current;
    const sourceVideo = sourceVideoRef.current;
    const dragHint = dragHintRef.current;
    const myselfSection = myselfSectionRef.current;
    const targetContainer = targetContainerRef.current;
    const targetVideo = targetVideoRef.current;
    const scroller = document.getElementById("site-content-scroll");

    if (!showSection || !globe || !heroVideoFrame || !sourceVideo || !myselfSection || !targetContainer || !targetVideo || !scroller) {
      return;
    }

    const clone = document.createElement("video");
    cloneRef.current = clone;
    clone.src = sourceVideo.currentSrc || sourceVideo.src;
    clone.muted = true;
    clone.loop = true;
    clone.autoplay = true;
    clone.playsInline = true;
    clone.preload = "auto";
    clone.setAttribute("aria-hidden", "true");
    clone.tabIndex = -1;
    Object.assign(clone.style, {
      position: "fixed",
      inset: "0 auto auto 0",
      margin: "0",
      width: "0px",
      height: "0px",
      objectFit: "cover",
      pointerEvents: "none",
      opacity: "0",
      zIndex: "1000000",
      willChange: "top,left,width,height,opacity,transform",
    });
    document.body.appendChild(clone);

    const snapshotSourceAnchorRect = () => {
      const sourceRect = heroVideoFrame.getBoundingClientRect();
      if (!sourceRect.width || !sourceRect.height) {
        return;
      }

      sourceAnchorRectRef.current = {
        left: sourceRect.left,
        top: sourceRect.top,
        width: sourceRect.width,
        height: sourceRect.height,
      };
    };

    snapshotSourceAnchorRect();

    const updateVisualState = (progress: number) => {
      if (progress <= 0.01 || !sourceAnchorRectRef.current) {
        snapshotSourceAnchorRect();
      }

      const revealProgress = gsap.utils.clamp(0, 1, gsap.utils.normalize(0.02, 0.34, progress));
      const frameWidth = gsap.utils.interpolate(24, Math.min(window.innerWidth * 0.28, 188), revealProgress);
      const frameHeight = gsap.utils.interpolate(40, Math.min(window.innerHeight * 0.22, 132), revealProgress);

      gsap.set(heroVideoFrame, {
        width: frameWidth,
        height: frameHeight,
        autoAlpha: gsap.utils.interpolate(0, 1, revealProgress),
        scale: gsap.utils.interpolate(0.82, 1, revealProgress),
      });
      if (dragHint) {
        gsap.set(dragHint, {
          autoAlpha: gsap.utils.interpolate(1, 0.15, revealProgress),
          y: gsap.utils.interpolate(0, 18, revealProgress),
        });
      }

      const liveSourceRect = heroVideoFrame.getBoundingClientRect();
      const liveTargetRect = targetContainer.getBoundingClientRect();

      if (!liveSourceRect.width || !liveSourceRect.height || !liveTargetRect.width || !liveTargetRect.height) {
        return;
      }

      const sourceRect = sourceAnchorRectRef.current ?? {
        left: liveSourceRect.left,
        top: liveSourceRect.top,
        width: liveSourceRect.width,
        height: liveSourceRect.height,
      };

      const depthProgress = gsap.utils.clamp(0, 1, gsap.utils.normalize(0.18, 0.62, progress));
      const handoffProgress = gsap.utils.clamp(0, 1, gsap.utils.normalize(0.62, 1, progress));
      const sourceAspect = sourceRect.width / sourceRect.height;
      const focalHeight = gsap.utils.interpolate(
        sourceRect.height,
        Math.min(window.innerHeight * 0.56, sourceRect.height * 3.4),
        depthProgress,
      );
      const focalWidth = focalHeight * sourceAspect;
      const focalRect: RectLike = {
        width: focalWidth,
        height: focalHeight,
        left: window.innerWidth / 2 - focalWidth / 2,
        top: window.innerHeight / 2 - focalHeight / 2,
      };

      const nextRect = progress < 0.62
        ? interpolateRect(depthProgress, sourceRect, focalRect)
        : interpolateRect(handoffProgress, focalRect, {
          left: liveTargetRect.left,
          top: liveTargetRect.top,
          width: liveTargetRect.width,
          height: liveTargetRect.height,
        });

      const sourceOpacity = 1 - gsap.utils.clamp(0, 1, gsap.utils.normalize(0.22, 0.5, progress));
      const frameOpacity = gsap.utils.interpolate(0, 1, revealProgress) * sourceOpacity;
      const targetOpacity = gsap.utils.clamp(0, 1, gsap.utils.normalize(0.76, 1, progress));
      const cloneOpacity = progress <= 0.08
        ? 0
        : progress >= 0.97
          ? gsap.utils.interpolate(1, 0, gsap.utils.normalize(0.97, 1, progress))
          : 1;
      const cloneDepthScale = gsap.utils.interpolate(0.88, 1.18, depthProgress);
      const cloneHandoffScale = gsap.utils.interpolate(1.18, 1, handoffProgress);
      const cloneScale = progress < 0.62 ? cloneDepthScale : cloneHandoffScale;

      gsap.set(clone, {
        left: nextRect.left,
        top: nextRect.top,
        width: nextRect.width,
        height: nextRect.height,
        autoAlpha: cloneOpacity,
        scale: cloneScale,
        rotateX: gsap.utils.interpolate(8, 0, gsap.utils.clamp(0, 1, gsap.utils.normalize(0.2, 0.74, progress))),
        transformOrigin: "center center",
      });

      gsap.set(heroVideoFrame, { autoAlpha: frameOpacity });
      gsap.set(targetVideo, { autoAlpha: targetOpacity });
      gsap.set(globe, {
        autoAlpha: gsap.utils.interpolate(1, 0.08, progress),
        scale: gsap.utils.interpolate(1, 0.82, progress),
        filter: `blur(${gsap.utils.interpolate(0, 12, progress)}px)`,
        transformOrigin: "center center",
      });
    };

    safePlay(sourceVideo);
    safePlay(targetVideo);
    safePlay(clone);

    gsap.set(targetVideo, { autoAlpha: 0 });
    gsap.set(heroVideoFrame, { autoAlpha: 0, width: 0, height: 0, scale: 0 });
    if (dragHint) {
      gsap.set(dragHint, { autoAlpha: 1, y: 0 });
    }
    gsap.set(globe, { autoAlpha: 1, scale: 1, filter: "blur(0px)" });

    const trigger = ScrollTrigger.create({
      scroller,
      trigger: showSection,
      start: "bottom bottom",
      endTrigger: myselfSection,
      end: "top 35%",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        updateVisualState(self.progress);
      },
      onRefresh: (self) => {
        snapshotSourceAnchorRect();
        progressRef.current = self.progress;
        updateVisualState(self.progress);
      },
    });

    const syncCloneToLiveSource = () => {
      updateVisualState(progressRef.current);
    };

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    resizeObserver.observe(sourceVideo);
    resizeObserver.observe(targetContainer);
    resizeObserver.observe(showSection);
    resizeObserver.observe(myselfSection);
    resizeObserver.observe(scroller);
    gsap.ticker.add(syncCloneToLiveSource);
    ScrollTrigger.refresh();

    return () => {
      resizeObserver.disconnect();
      gsap.ticker.remove(syncCloneToLiveSource);
      trigger.kill();
      clone.pause();
      clone.remove();
      cloneRef.current = null;
      sourceAnchorRectRef.current = null;
      gsap.set(heroVideoFrame, { clearProps: "opacity,visibility,width,height,scale" });
      if (dragHint) {
        gsap.set(dragHint, { clearProps: "opacity,visibility,y" });
      }
      gsap.set(targetVideo, { clearProps: "opacity,visibility" });
      gsap.set(globe, { clearProps: "opacity,visibility,scale,filter,transformOrigin" });
    };
  }, []);

  return (
    <>
      <ShowSection
        sectionRef={showSectionRef}
        globeRef={globeRef}
        heroVideoFrameRef={heroVideoFrameRef}
        heroVideoRef={sourceVideoRef}
        dragHintRef={dragHintRef}
      />
      <MyselfSection
        sectionRef={myselfSectionRef}
        videoContainerRef={targetContainerRef}
        videoRef={targetVideoRef}
      />
    </>
  );
}