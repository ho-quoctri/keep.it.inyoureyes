import { ShowMyselfTransition } from "@/components/sections/show-myself-transition";
import { ServiceSection } from "@/components/sections/service-section";

export default function Home() {
  return (
    <main className="w-full relative">
      <ShowMyselfTransition />
      <ServiceSection />
    </main>
  );
}