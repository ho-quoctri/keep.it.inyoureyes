'use client';

import { type Ref, useEffect, useRef } from "react";
import gsap from "gsap";

type MyselfSectionProps = {
  sectionRef?: Ref<HTMLElement>;
  videoContainerRef?: Ref<HTMLDivElement>;
  videoRef?: Ref<HTMLVideoElement>;
};

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  ref.current = value;
}

export const MyselfSection = ({
  sectionRef,
  videoContainerRef,
  videoRef,
}: MyselfSectionProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlights = textRef.current?.querySelectorAll('.highlight');
    if (!highlights || highlights.length === 0) return;

    const tl = gsap.timeline({ repeat: -1, defaults: { duration: 0.7, ease: "power2.inOut" } });
    highlights.forEach((el) => {
      tl.to(el, { backgroundColor: "#1E1E1E", color: "#EEEDEA" }, "+=0.2")
        .to(el, { backgroundColor: "transparent", color: "inherit" }, "+=0.7");
    });
    return () => { tl.kill(); };
  }, []);

  return (
    <section
      ref={(node) => assignRef(sectionRef, node)}
      className="mx-auto flex min-h-fit md:min-h-[140svh] w-screen flex-col items-center justify-start gap-16 px-6 py-16 md:py-24"
    >
      <div
        ref={(node) => assignRef(videoContainerRef, node)}
        className="myself-video-container flex aspect-[5/3] w-[min(92vw,58rem)] items-center justify-start overflow-hidden"
      >
        <video
          ref={(node) => assignRef(videoRef, node)}
          src="/videos/myself-video.webm"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          data-shared-video-target="true"
          className="w-full h-full object-cover"
          style={{ transformOrigin: "center center" }}
        />
      </div>
      <div className="flex flex-row w-full items-start justify-center gap-6">
        <div className="font-secondary text-xl w-[30vw] pl-4 -rotate-5 pt-4">(about)</div>
        <div
          ref={textRef}
          className="myself-text font-primary md:text-lg xl:text-3xl 2xl:text-4xl text-right font-bold"
        >
          Passionate about merging engineering and design,<br/> I craft <span className="highlight">smooth</span>, interactive experiences with purpose. By leveraging <span className="highlight">modern</span> tech stacks, I deliver innovative solutions and <span className="highlight">high-performance</span> digital products for <br/> <span className="highlight">forward-thinking</span> brands around the world.
        </div>
      </div>
    </section>
  );
};