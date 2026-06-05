import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import { DecorativeOverlays } from "@/components/common/decorative-overlays";
import { SitePreloaderProvider } from "@/components/providers/site-preloader-provider";
import { SitePageShell } from "@/components/layout/site-page-shell";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Digital editorial portfolio`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "digital editorial portfolio",
    "creative direction portfolio",
    "motion design",
    "editorial web design",
    "next.js",
    "gsap",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: `${SITE_NAME} | Digital editorial portfolio`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: `${SITE_NAME} brand mark`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Digital editorial portfolio`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
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
      <head>
        <link
          rel="preload"
          href="/images/gallery/image-1.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        {/* <LenisSmoothScrollWrapper> */}
          <SitePreloaderProvider>
            <SitePageShell>{children}</SitePageShell>
          </SitePreloaderProvider>
        {/* </LenisSmoothScrollWrapper> */}
        <DecorativeOverlays />
      </body>
    </html>
  );
}
