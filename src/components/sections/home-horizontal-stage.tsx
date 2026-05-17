"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import { Hero } from "@/components/sections/hero";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const CONTENT_SCROLLER_ID = "site-content-scroll";

export function HomeHorizontalStage() {
  const router = useRouter(); // 2. Khởi tạo router
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current) {
        return;
      }

      const scroller = sectionRef.current.closest<HTMLElement>(`#${CONTENT_SCROLLER_ID}`);

      if (!scroller) {
        return;
      }

      const track = trackRef.current;
      const getMaxX = () => Math.max(0, track.scrollWidth - scroller.clientWidth);

      gsap.set(track, { x: 0 });

      const tween = gsap.to(track, {
        x: () => -getMaxX(),
        ease: "none",
        duration: 1,
      });

      const scrollTrigger = ScrollTrigger.create({
        scroller,
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${getMaxX()}`,
        pin: true,
        animation: tween,
        scrub: true,
        anticipatePin: 1,
        fastScrollEnd: false,
        invalidateOnRefresh: true,
        onLeave: () => {
          gsap.set(track, { x: -getMaxX() });
          
          // 3. KÍCH HOẠT CHUYỂN TRANG KHI ĐI HẾT CHIỀU NGANG
          // Dùng scroll: false để Next.js không tự động giật màn hình lên top
          router.push("/work", { scroll: false }); 
        },
        onLeaveBack: () => {
          gsap.set(track, { x: 0 });
        },
      });

      const refreshOnLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", refreshOnLoad);

      return () => {
        window.removeEventListener("load", refreshOnLoad);
        scrollTrigger.kill();
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [router] } // 4. Thêm router vào dependencies
  );

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div ref={trackRef} className="flex h-full w-max will-change-transform pr-[10vw]">
        <div className="flex h-screen w-screen items-end justify-start pl-10 pb-10">
          <Hero />
        </div>
        <div className="w-[20px] h-screen flex-shrink-0" />
      </div>
    </section>
  );
}