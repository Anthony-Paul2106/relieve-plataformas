import type { MetadataRoute } from "next";
import { getSiteUrl } from "./lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    return [];
  }

  return [
    {
      url: new URL("/", siteUrl).toString(),
    },
  ];
}
