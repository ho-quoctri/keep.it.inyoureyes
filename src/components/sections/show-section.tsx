import { PhotoGlobe } from "@/components/sections/photo-globe";
import { type Ref } from "react";

type ShowSectionProps = {
  sectionRef?: Ref<HTMLElement>;
  globeRef?: Ref<HTMLDivElement>;
  heroVideoFrameRef?: Ref<HTMLDivElement>;
  heroVideoRef?: Ref<HTMLVideoElement>;
  dragHintRef?: Ref<HTMLDivElement>;
};

export const ShowSection = ({
  sectionRef,
  globeRef,
  heroVideoFrameRef,
  heroVideoRef,
  dragHintRef,
}: ShowSectionProps) => {
  return (
    <div className="w-full h-fit flex flex-col gap-4">
      <PhotoGlobe
        sectionRef={sectionRef}
        globeRef={globeRef}
        heroVideoFrameRef={heroVideoFrameRef}
        heroVideoRef={heroVideoRef}
        dragHintRef={dragHintRef}
      />
    </div>
  );
};