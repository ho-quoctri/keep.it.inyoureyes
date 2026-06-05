import type { Metadata } from "next";
import { ShowMyselfTransition } from "@/components/sections/show-myself-transition";
import { ServiceSection } from "@/components/sections/service-section";
import ContactSection from "@/components/sections/contact-section";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: SITE_NAME,
  description:
    "Explore the motion-led portfolio of keep.it.inyoureyes across editorial experiences, service direction, and contact touchpoints.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Home() {
  return (
    <main className="w-full relative">
      <ShowMyselfTransition />
      <ServiceSection />
      <ContactSection />
    </main>
  );
}