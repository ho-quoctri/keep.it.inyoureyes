"use client";

import { useEffect, useRef } from "react";
import { Navbar } from '@/components/layout/navbar';
import { WorkSection } from '@/components/sections/work-section';
import { AboutSection } from '@/components/sections/about-section';
import { ContactSection } from '@/components/sections/contact-section';
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContentLayout() {
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<{ setActiveIndex: (id: number) => void }>(null);
  
  // Biến cờ dùng useRef để không bị re-render giao diện, đảm bảo tốc độ phản hồi zero-lag
  const isClickScrolling = useRef(false);

  useEffect(() => {
    if (!mainScrollRef.current) return;

    const sections = [
      { ref: workRef, index: 0 },
      { ref: aboutRef, index: 1 },
      { ref: contactRef, index: 2 },
    ];

    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        if (!section.ref.current) return;

        const st = ScrollTrigger.create({
          trigger: section.ref.current,
          scroller: mainScrollRef.current,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => {
            // ĐIỀU KIỆN QUAN TRỌNG: Chỉ cập nhật Navbar nếu người dùng đang tự cuộn chuột (không phải do click)
            if (self.isActive && !isClickScrolling.current && navbarRef.current) {
              navbarRef.current.setActiveIndex(section.index);
            }
          },
        });
        triggers.push(st);
      });
    }, mainScrollRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-background relative">
      <aside className="md:w-[25vw] h-full p-8 flex flex-col justify-center border-r border-white/5 z-10">
        {/* Truyền ref biến cờ xuống Navbar */}
        <Navbar 
          ref={navbarRef} 
          scrollContainerRef={mainScrollRef} 
          isClickScrolling={isClickScrolling}
        />
      </aside>

      <main 
        ref={mainScrollRef} 
        className="custom-scrollbar  h-full overflow-y-auto p-12 relative custom-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div ref={workRef} id="section-0" className="min-h-screen py-16">
          <WorkSection />
        </div>
        <div ref={aboutRef} id="section-1" className="min-h-screen py-16">
          <AboutSection />
        </div>
        <div ref={contactRef} id="section-2" className="min-h-screen py-16">
          <ContactSection />
        </div>
      </main>
    </div>
  );
}