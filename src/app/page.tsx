import ContentLayout from "@/components/layout/content-layout";
import { Footer } from "@/components/layout/footer";
import { HomeHorizontalStage } from "@/components/sections/home-horizontal-stage";

export default function Home() {
  return (
    <main className="w-full relative">
      <HomeHorizontalStage />
      <ContentLayout />
      <Footer />
    </main>
  );
}