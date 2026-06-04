"use client";

import { useEffect, useRef } from "react";
import { Navbar } from "@/components/common/navbar";
import { WorkSection } from "@/components/sections/work-section";
import { MENU } from "@/constants/menu";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WorksLayout() {
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<{ setActiveIndex: (id: number) => void }>(null);

  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const isClickScrolling = useRef(false);

  useEffect(() => {
    if (!mainScrollRef.current) return;

    const triggers: ScrollTrigger[] = [];

    const ctx = gsap.context(() => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const trigger = ScrollTrigger.create({
          trigger: section,
          scroller: mainScrollRef.current,
          start: "top center",
          end: "bottom center",

          onToggle: (self) => {
            if (
              self.isActive &&
              !isClickScrolling.current &&
              navbarRef.current
            ) {
              navbarRef.current.setActiveIndex(index);
            }
          },
        });

        triggers.push(trigger);
      });
    }, mainScrollRef);

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <div className="flex px-10 flex-col lg:flex-row w-screen h-screen overflow-hidden bg-background relative">
      <aside className="lg:w-[30vw] h-auto lg:h-full pt-[20%] lg:pt-0 lg:pr-10 flex flex-col justify-center border-r border-white/5 z-10">
        <Navbar
          ref={navbarRef}
          scrollContainerRef={mainScrollRef}
          isClickScrolling={isClickScrolling}
        />
      </aside>

      <main
        ref={mainScrollRef}
        className="h-full overflow-y-auto pt-12 px-3 custom-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {MENU.map((project, index) => (
          <section
            key={project.name}
            id={`section-${index}`}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="lg:min-h-screen py-16"
          >
            <WorkSection
              project={project}
              index={index}
            />
          </section>
        ))}
      </main>
    </div>
  );
}