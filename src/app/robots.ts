import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
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
