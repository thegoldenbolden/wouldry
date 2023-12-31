import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `https://www.wouldry.com/sitemap.xml`,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        crawlDelay: 10,
      },
      {
        userAgent: "*",
        disallow: ["/api/", "/settings/"],
      },
    ],
  };
}
