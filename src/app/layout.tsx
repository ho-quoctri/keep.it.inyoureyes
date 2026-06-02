import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import { SitePreloaderProvider } from "@/components/providers/site-preloader-provider";
import { SitePageShell } from "@/components/layout/site-page-shell";
import { CustomCursor } from "@/components/common/custom-cursor";
import { TrackedOverlay } from "@/components/common/tracked-overlay";
import { GridRuler } from "@/components/common/grid-ruler";
import { satoshi } from "./fonts";

const inter = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

const playfair = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const dirtylineFont = localFont({
  src: [
    {
      path: "../assets/fonts/dirtyline.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-dirtyline",
  display: "swap",
});

const stretchFont = localFont({
  src: [
    {
      path: "../assets/fonts/stretch.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-stretch",
  display: "swap",
});

export const metadata: Metadata = {
  title: "keep.it.inyoureyes | A creative design studio",
  description:
    "A creative design studio specializing in digital editorial projects, built with Next.js, Tailwind CSS, GSAP, and Lenis.",
  applicationName: "keep.it.inyoureyes",
  keywords: [
    "creative design studio",
    "digital art direction",
    "motion design",
    "next.js",
    "gsap",
  ],
  authors: [{ name: "keep.it.inyoureyes" }],
  creator: "keep.it.inyoureyes",
  openGraph: {
    title: "keep.it.inyoureyes | A creative design studio",
    description:
      "Editorial web presence with intentional motion, smooth scrolling, and refined typography.",
    type: "website",
    siteName: "keep.it.inyoureyes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${dirtylineFont.variable} ${stretchFont.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {/* <LenisSmoothScrollWrapper> */}
          <SitePreloaderProvider>
            <SitePageShell>{children}</SitePageShell>
          </SitePreloaderProvider>
        {/* </LenisSmoothScrollWrapper> */}
        <CustomCursor/>
        <TrackedOverlay />
        <GridRuler />
      </body>
    </html>
  );
}
