import ContentLayout from "@/components/layout/content-layout";
import { Footer } from "@/components/layout/footer";
import { HomeHorizontalStage } from "@/components/sections/home-horizontal-stage";
import { ShowSection } from "@/components/sections/show-section";

export default function Home() {
  return (
    <main className="w-full relative">
      <ShowSection />
      <HomeHorizontalStage />
      <ContentLayout />
      <Footer />
    </main>
  );
}