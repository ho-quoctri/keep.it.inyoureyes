"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "@/components/sections/hero";
import { Myself } from "@/components/sections/myself";
import { gsap } from "@/lib/gsap";

const CONTENT_SCROLLER_ID = "site-content-scroll";

export function HomeHorizontalStage() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [scrollDistance, setScrollDistance] = useState(0);
  
  // Lưu trữ các giá trị kích thước tĩnh và vị trí offset chuẩn
  const dimensionsRef = useRef({ trackWidth: 0, scrollerWidth: 0, myselfWidth: 0, myselfOffsetLeft: 0 });

  useEffect(() => {
    const calculateDistance = () => {
      const scroller = sectionRef.current?.closest<HTMLElement>(`#${CONTENT_SCROLLER_ID}`) || window;
      const track = trackRef.current;
      if (!track) return;

      const trackWidth = track.getBoundingClientRect().width;
      const scrollerWidth = scroller === window ? window.innerWidth : (scroller as HTMLElement).clientWidth;
      
      const myselfSection = track.querySelector<HTMLElement>(".myself-section");
      const myselfWidth = myselfSection ? myselfSection.getBoundingClientRect().width : 0;
      
      // FIX CỐT LÕI: Lấy chính xác khoảng cách từ điểm đầu của track đến phần tử Myself
      const myselfOffsetLeft = myselfSection ? myselfSection.offsetLeft : 0;

      // Lưu lại tất cả thông số vào ref
      dimensionsRef.current = { trackWidth, scrollerWidth, myselfWidth, myselfOffsetLeft };
      
      setScrollDistance(Math.max(0, trackWidth - scrollerWidth));
    };

    // Đợi 100ms đảm bảo DOM/CSS của Hero và Myself đã render xong kích thước thực tế
    const timer = setTimeout(calculateDistance, 150);
    window.addEventListener("resize", calculateDistance);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateDistance);
    };
  }, [router]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const videoElement = videoRef.current;
    const scroller = section?.closest<HTMLElement>(`#${CONTENT_SCROLLER_ID}`) || window;

    if (!section || !track || !videoElement || scrollDistance === 0) return;

    // Đảm bảo trạng thái khởi đầu của video
    gsap.set(videoElement, { width: "40%", transformOrigin: "center center" });

    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect();
      let scrollerTop = 0;

      if (scroller !== window) {
        const scrollerRect = (scroller as HTMLElement).getBoundingClientRect();
        scrollerTop = scrollerRect.top;
      }

      const relativeTop = sectionRect.top - scrollerTop;

      if (relativeTop <= 0 && relativeTop >= -scrollDistance) {
        const overallProgress = Math.abs(relativeTop) / scrollDistance;
        const targetX = -overallProgress * scrollDistance;

        // 1. Di chuyển track mượt mà
        gsap.to(track, {
          x: targetX,
          duration: 0.2,
          ease: "power1.out",
          overwrite: "auto"
        });

        // 2. Tính toán chính xác vị trí của góc trái phần tử Myself dựa trên tọa độ đích targetX
        const { scrollerWidth, myselfWidth, myselfOffsetLeft } = dimensionsRef.current;
        
        // Tọa độ X của Myself so với Viewport màn hình hiện tại
        const currentMyselfLeft = targetX + myselfOffsetLeft;

        // Điểm bắt đầu hiệu ứng: Khi cạnh trái của Myself vừa chạm mép phải màn hình
        const startX = scrollerWidth;
        // Điểm kết thúc hiệu ứng: Khi tâm của Myself nằm chính giữa màn hình
        const endX = (scrollerWidth - myselfWidth) / 2;

        // Tiến độ scale video chạy từ 0 -> 1
        let videoProgress = (startX - currentMyselfLeft) / (startX - endX);
        videoProgress = Math.max(0, Math.min(1, videoProgress));

        // 3. Thực hiện ép hiệu ứng scale theo progress tính toán
        gsap.to(videoElement, {
          width: `${32 + videoProgress * 68}%`,
          duration: 0.2,
          ease: "power1.out",
          overwrite: "auto",
          onStart: () => {
            if (videoProgress > 0 && videoElement.paused) {
              videoElement.play().catch((err) => console.log("Auto-play blocked:", err));
            }
          }
        });

      } else if (relativeTop > 0) {
        gsap.to(track, { x: 0, duration: 0.2, overwrite: "auto", transformOrigin: "center center" });
        gsap.to(videoElement, {  width: "32%", duration: 0.2, overwrite: "auto", transformOrigin: "center center" });
      } else if (relativeTop < -scrollDistance) {
        gsap.to(track, { x: -scrollDistance, duration: 0.2, overwrite: "auto" });
        gsap.to(videoElement, { width: "100%", duration: 0.2, overwrite: "auto", transformOrigin: "center center" });
      }
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      gsap.killTweensOf([track, videoElement]);
    };
  }, [scrollDistance]);

  return (
    <section 
      ref={sectionRef} 
      className="relative overflow-visible"
      style={{ height: `calc(100vh + ${scrollDistance}px)` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={trackRef} className="flex h-full w-max justify-center will-change-transform">
          <div className="flex w-screen h-full items-center justify-center">
            <Hero />
          </div>
          <div className="flex h-full myself-section">
            <Myself ref={videoRef} />
          </div>
        </div>
      </div>
    </section>
  );
}