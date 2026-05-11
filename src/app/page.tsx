import { AboutPreview } from "@/components/sections/about-preview";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <AboutPreview />
    </main>
  );
}
