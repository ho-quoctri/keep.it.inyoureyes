const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeUrl(value: string | undefined): string {
  if (!value) {
    return DEFAULT_SITE_URL;
  }

  return value.startsWith("http") ? value : `https://${value}`;
}

export const SITE_NAME = "keep.it.inyoureyes";
export const SITE_REVALIDATE_SECONDS = 60 * 60;
export const SITE_URL = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL,
);
export const DEFAULT_OG_IMAGE = "/images/keepitinyoureyes-logo.jpg";
export const SITE_DESCRIPTION =
  "High-end digital editorial portfolio for keep.it.inyoureyes, blending motion direction, immersive storytelling, and intentional typography.";

export function getCanonicalUrl(pathname = "/") {
  return new URL(pathname, SITE_URL);
}