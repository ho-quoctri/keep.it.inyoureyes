import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/site";

const staticRoutes = [
  {
    pathname: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    pathname: "/work",
    changeFrequency: "weekly",
    priority: 0.8,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map((route) => ({
    url: getCanonicalUrl(route.pathname).toString(),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}