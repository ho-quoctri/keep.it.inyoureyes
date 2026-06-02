"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

const PHOTOS = [
  {
    id: 1,
    src: "/images/gallery/image-1.webp",
    width: 400,
    height: 580,
  },
  {
    id: 2,
    src: "/images/gallery/image-2.webp",
    width: 320,
    height: 420,
  },
  {
    id: 3,
    src: "/images/gallery/image-3.webp",
    width: 350,
    height: 340,
  },
  {
    id: 4,
    src: "/images/gallery/image-4.webp",
    width: 260,
    height: 380,
  },
  {
    id: 5,
    src: "/images/gallery/image-5.webp",
    width: 260,
    height: 600,
  },
  {
    id: 6,
    src: "/images/gallery/image-6.webp",
    width: 340,
    height: 260,
  },
  {
    id: 7,
    src: "/images/gallery/image-7.webp",
    width: 300,
    height: 450,
  },
  {
    id: 8,
    src: "/images/gallery/image-8.webp",
    width: 340,
    height: 360,
  },
  {
    id: 9,
    src: "/images/gallery/image-9.webp",
    width: 340,
    height: 500,
  },
  {
    id: 10,
    src: "/images/gallery/image-10.webp",
    width: 290,
    height: 420,
  },
  {
    id: 11,
    src: "/images/gallery/image-11.webp",
    width: 360,
    height: 520,
  },
  {
    id: 12,
    src: "/images/gallery/image-12.webp",
    width: 340,
    height: 360,
  },
  {
    id: 13,
    src: "/images/gallery/image-13.webp",
    width: 300,
    height: 430,
  },
  {
    id: 14,
    src: "/images/gallery/image-14.webp",
    width: 360,
    height: 300,
  },
  {
    id: 15,
    src: "/images/gallery/image-15.webp",
    width: 320,
    height: 560,
  },
  {
    id: 16,
    src: "/images/gallery/image-16.webp",
    width: 340,
    height: 280,
  },
  {
    id: 17,
    src: "/images/gallery/image-17.webp",
    width: 320,
    height: 460,
  },
  {
    id: 18,
    src: "/images/gallery/image-18.webp",
    width: 280,
    height: 140,
  },
  {
    id: 19,
    src: "/images/gallery/image-19.webp",
    width: 360,
    height: 540,
  },
  {
    id: 20,
    src: "/images/gallery/image-20.webp",
    width: 290,
    height: 400,
  },
  {
    id: 21,
    src: "/images/gallery/image-21.webp",
    width: 340,
    height: 500,
  },
  {
    id: 22,
    src: "/images/gallery/image-22.webp",
    width: 320,
    height: 320,
  },
  {
    id: 23,
    src: "/images/gallery/image-23.webp",
    width: 370,
    height: 620,
  },
];

type PhotoNode = {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
};

export const PhotoGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globe = globeRef.current;

    if (!globe) return;

    const items = globe.querySelectorAll(".globe-item");

    const baseCoords: PhotoNode[] = [];

    /**
     * Layout cố định
     * đẹp hơn random hoàn toàn
     */
    const layout = [
      // ===== VERY FRONT =====
      { x: -850, y: -320, z: 900 },
      { x: -300, y: -180, z: 700 },
      { x: 320, y: -250, z: 1000 },
      { x: 900, y: -100, z: 800 },

      { x: -700, y: 320, z: 750 },
      { x: 100, y: 450, z: 950 },
      { x: 720, y: 380, z: 800 },

      // ===== FRONT =====
      { x: -550, y: -520, z: 700 },
      { x: -50, y: -600, z: 800 },
      { x: 520, y: -500, z: 600 },

      { x: -850, y: 50, z: 500 },
      { x: -250, y: 120, z: 650 },
      { x: 350, y: 80, z: 700 },
      { x: 900, y: 120, z: 550 },

      // ===== MIDDLE =====
      { x: -650, y: 550, z: 250 },
      { x: -100, y: 700, z: 300 },
      { x: 450, y: 620, z: 200 },

      { x: -450, y: -780, z: 350 },
      { x: 150, y: -850, z: 150 },

      // ===== BACK =====
      { x: -900, y: -200, z: -700 },
      { x: -350, y: 650, z: -600 },
      { x: 350, y: -650, z: -800 },
      { x: 950, y: 450, z: -500 },
    ];

    PHOTOS.forEach((photo, index) => {
      const pos = layout[index];

      baseCoords.push({
        x: pos.x,
        y: pos.y,
        z: pos.z,

        width: photo.width,
        height: photo.height,
      });
    });

    const rotation = {
      x: 0,
      y: 0,
    };

    const targetRotation = {
      x: 0,
      y: 0,
    };

    const perspective = 2600;

    const updateGlobe = () => {
      rotation.x +=
        (targetRotation.x - rotation.x) * 0.08;

      rotation.y +=
        (targetRotation.y - rotation.y) * 0.08;

      const radX =
        (rotation.x * Math.PI) / 180;

      const radY =
        (rotation.y * Math.PI) / 180;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);

      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      items.forEach((item, i) => {
        const base = baseCoords[i];

        const x1 =
          base.x * cosY -
          base.z * sinY;

        const z1 =
          base.z * cosY +
          base.x * sinY;

        const y2 =
          base.y * cosX -
          z1 * sinX;

        const z2 =
          z1 * cosX +
          base.y * sinX;

        const depth = gsap.utils.clamp(
          0.45,
          0.8,
          perspective /
          (perspective - z2)
        );

        const normalizedZ =
          gsap.utils.normalize(
            -800,
            1000,
            z2
          );

        const scaleValue =
          gsap.utils.interpolate(
            0.55,
            0.8,
            normalizedZ
          );

        gsap.set(item, {
          x: x1 * depth,
          y: y2 * depth,
          scale: scaleValue * depth, // Kết hợp depth và scale theo vị trí
          zIndex: Math.round(z2 + 10000),
        });
      });
    };

    gsap.ticker.add(updateGlobe);

    const autoRotate = gsap.to(
      targetRotation,
      {
        y: "+=360",
        duration: 80,
        ease: "none",
        repeat: -1,
      }
    );

    let delayedCall:
      | gsap.core.Tween
      | undefined;

    const obs = Observer.create({
      target: containerRef.current,

      type: "pointer,touch",

      onChange: (self) => {
        gsap.killTweensOf(targetRotation);

        if (
          self.event &&
          self.event.type === "wheel"
        ) {
          targetRotation.y +=
            self.deltaY * 0.1;
        } else {
          targetRotation.y +=
            self.deltaX * 0.2;

          targetRotation.x -=
            self.deltaY * 0.2;
        }

        targetRotation.x =
          gsap.utils.clamp(
            -60,
            60,
            targetRotation.x
          );

        delayedCall?.kill();

        delayedCall =
          gsap.delayedCall(
            0.2,
            resumeAutoRotate
          ) as unknown as gsap.core.Tween;
      },
    });

    function resumeAutoRotate() {
      gsap.to(targetRotation, {
        y: targetRotation.y + 360,
        duration: 80,
        ease: "none",
        repeat: -1,
      });
    }

    return () => {
      gsap.ticker.remove(updateGlobe);

      autoRotate.kill();

      obs.kill();

      delayedCall?.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="
        relative
        w-screen
        h-screen
        overflow-hidden
        bg-background
        flex
        items-center
        justify-center
        cursor-grab
        active:cursor-grabbing
        select-none
      "
      style={{
        perspective: "2600px",
      }}
    >
      <div
        ref={globeRef}
        className="
          relative
          w-0
          h-0
        "
        style={{
          transformStyle:
            "preserve-3d",
        }}
      >
        {PHOTOS.map((photo) => (
          <div
            key={photo.id}
            className="
              globe-item
              absolute
              w-[200px]
              h-auto
              overflow-hidden
              shadow-xl
              group
            "
            style={{
              willChange:
                "transform",
            }}
          >
            <img
              src={photo.src}
              alt={`Project ${photo.id}`}
              draggable={false}
              className="
              w-full
              h-full
              object-cover
              brightness-75
              hover:grayscale-0
              hover:brightness-100
              transition-all
              duration-700
              ease-out
            "
            />
          </div>
        ))}
      </div>
      <div
        className="
    absolute
    top-1/2
    left-1/2
    -translate-x-1/2
    -translate-y-1/2
    text-center
    pointer-events-none
    z-[999999]
    mix-blend-difference
  "
      >
        <div
          className="
      text-4xl
      font-secondary
      text-white
      tracking-wide
    "
        >
          Creative Studio
        </div>

        <div
          className="
      mt-2
      text-sm
      font-primary
      text-white
      tracking-[0.3em]
    "
        >
          Drag To Explore
        </div>
      </div>
    </section>
  );
};