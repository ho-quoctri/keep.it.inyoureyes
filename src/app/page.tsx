import { ShowMyselfTransition } from "@/components/sections/show-myself-transition";
import { ServiceSection } from "@/components/sections/service-section";
import ContactSection from "@/components/sections/contact-section";

export default function Home() {
  return (
    <main className="w-full relative">
      <ShowMyselfTransition />
      <ServiceSection />
      <ContactSection />
    </main>
  );
}