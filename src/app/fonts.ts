import localFont from "next/font/local";

export const satoshi = localFont({
  src: [
    { path: "../assets/fonts/Satoshi-Light.otf", weight: "300", style: "normal" },
    { path: "../assets/fonts/Satoshi-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../assets/fonts/Satoshi-Regular.otf", weight: "400", style: "normal" },
    { path: "../assets/fonts/Satoshi-Italic.otf", weight: "400", style: "italic" },
    { path: "../assets/fonts/Satoshi-Medium.otf", weight: "500", style: "normal" },
    { path: "../assets/fonts/Satoshi-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../assets/fonts/Satoshi-Bold.otf", weight: "700", style: "normal" },
    { path: "../assets/fonts/Satoshi-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "../assets/fonts/Satoshi-Black.otf", weight: "900", style: "normal" },
    { path: "../assets/fonts/Satoshi-BlackItalic.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});
