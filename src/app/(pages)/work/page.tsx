import type { Metadata } from "next";
import WorksLayout from "@/components/layout/works-layout";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description:
    "Browse selected projects from keep.it.inyoureyes, spanning interactive product stories, motion systems, and editorial brand experiences.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function WorkPage() {
  return (
    <WorksLayout />
  );
}