"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(
  () => import("@/components/common/custom-cursor").then((mod) => mod.CustomCursor),
  { ssr: false },
);

const TrackedOverlay = dynamic(
  () => import("@/components/common/tracked-overlay").then((mod) => mod.TrackedOverlay),
  { ssr: false },
);

const GridRuler = dynamic(
  () => import("@/components/common/grid-ruler").then((mod) => mod.GridRuler),
  { ssr: false },
);

export function DecorativeOverlays() {
  return (
    <>
      <CustomCursor />
      <TrackedOverlay />
      <GridRuler />
    </>
  );
}