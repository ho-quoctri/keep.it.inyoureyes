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
    width: 420,
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
    width: 520,
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
    width: 460,
    height: 600,
  },
  {
    id: 6,
    src: "/images/gallery/image-6.webp",
    width: 380,
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
    width: 540,
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
    width: 620,
    height: 420,
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
      { x: -450, y: -220, z: 700 },
      { x: -150, y: -120, z: 500 },
      { x: 280, y: -180, z: 800 },
      { x: 480, y: 50, z: 300 },

      { x: -380, y: 250, z: -100 },
      { x: -80, y: 280, z: 250 },

      { x: 280, y: 250, z: 700 },
      { x: 500, y: 320, z: -200 },

      { x: -100, y: -350, z: 600 },
      { x: 150, y: -320, z: -300 },
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

        const depth =
          perspective /
          (perspective - z2);

        const normalizedZ =
  gsap.utils.normalize(
    -800,
    1200,
    z2
  );

const scaleValue =
  gsap.utils.interpolate(
    0.55,
    1,
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
              grayscale
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
    </section>
  );
};