import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Flip from "gsap/Flip";
import ScrollTrigger from "gsap/ScrollTrigger";

let gsapConfigured = false;

export function setupGsap() {
  if (gsapConfigured) {
    return gsap;
  }

  gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);
  gsapConfigured = true;

  return gsap;
}

export { Flip, ScrollTrigger };
export const gsapInstance = setupGsap();
export { gsapInstance as gsap };
export { useGSAP };