import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";

export const Myself = forwardRef<HTMLVideoElement>((props, ref) => {
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
    <section className="mx-auto w-screen h-full px-10 flex items-center justify-start gap-16">
      {/* Container bọc video: Ban đầu thu nhỏ bằng Tailwind hoặc để GSAP set */}
      <div className="myself-video-container w-3/5 h-auto flex items-center justify-start overflow-hidden ">
        <video
          ref={ref}
          src="/videos/myself-video.webm"
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ transformOrigin: "center center" }}
        />
      </div>
      <div
        ref={textRef}
        className="myself-text flex-1 font-primary font-bold text-2xl"
      >
        (01) - Passionate about merging engineering and design, I craft <span className="highlight">smooth</span>, interactive experiences with purpose. By leveraging <span className="highlight">modern</span> tech stacks, I deliver innovative solutions and <span className="highlight">high-performance</span> digital products for <span className="highlight">forward-thinking</span> brands around the world.
      </div>
    </section>
  );
});

Myself.displayName = "Myself";