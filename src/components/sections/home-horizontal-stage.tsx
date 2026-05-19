"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { Myself } from "@/components/sections/myself";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const CONTENT_SCROLLER_ID = "site-content-scroll";

export function HomeHorizontalStage() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Tạo ref để điều khiển trực tiếp video từ component con Myself
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current) return;

      const scroller = sectionRef.current.closest<HTMLElement>(`#${CONTENT_SCROLLER_ID}`);
      if (!scroller) return;

      const track = trackRef.current;
      const getMaxX = () => {
        if (!trackRef.current || !scroller) return 0;
        const trackWidth = trackRef.current.getBoundingClientRect().width;
        return Math.max(0, trackWidth - scroller.clientWidth);
      };

      gsap.set(track, { x: 0 });

      // 1. Tween chính phụ trách cuộn ngang toàn bộ timeline
      const mainTween = gsap.to(track, {
        x: () => -getMaxX(),
        ease: "none",
        duration: 1,
        force3D: true,
      });

      // Master ScrollTrigger điều khiển việc Pin và chạy mainTween
      const mainScrollTrigger = ScrollTrigger.create({
        scroller,
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${getMaxX()}`,
        pin: true,
        animation: mainTween,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onLeave: () => {
          gsap.set(track, { x: -getMaxX() });
        },
        onLeaveBack: () => {
          gsap.set(track, { x: 0 });
        },
      });

      // 2. HIỆU ỨNG PHÓNG TO VIDEO VÀ TỰ ĐỘNG CHƠI DỰA TRÊN CONTAINER ANIMATION
      if (videoRef.current) {
        const videoElement = videoRef.current;

        gsap.fromTo(
          videoElement,
          {
            scale: 0.1,
            width: "40%",
          },
          {
            scale: 1, // Phóng to ra toàn bộ vùng chứa
            ease: "power1.out",
            width: "100%",
            scrollTrigger: {
              scroller,
              trigger: ".myself-section", // Kích hoạt khi vùng của Myself bắt đầu tiến vào màn hình
              containerAnimation: mainTween, // BẮT BUỘC: Đồng bộ theo timeline cuộn ngang
              start: "left right",  // Bắt đầu chạy hiệu ứng khi cạnh trái của section chạm mép phải màn hình
              end: "center center", // Hoàn thành phóng to khi tâm section nằm giữa màn hình
              scrub: 0.5,
              onEnter: () => {
                videoElement.play().catch((err) => console.log("Video auto-play blocked:", err));
              }
            },
          }
        );
      }

      const refreshOnLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", refreshOnLoad);

      return () => {
        window.removeEventListener("load", refreshOnLoad);
        mainScrollTrigger.kill();
        mainTween.kill();
      };
    },
    { scope: sectionRef, dependencies: [router] }
  );

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div ref={trackRef} className="flex h-full w-max justify-center will-change-transform">
        <div className="flex h-full w-[80vw] items-end justify-start pl-10 pb-10">
          <Hero />
        </div>
        <div className="flex h-full myself-section ">
          <Myself ref={videoRef} />
        </div>
      </div>
    </section>
  );
}