import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Internal operations OS — crawlable marketing surface is everything else.
const DISALLOW = [
  "/admin",
  "/api",
  "/dashboard",
  "/focus",
  "/invite",
  "/lesson",
  "/login",
  "/mission",
  "/register",
  "/seminar", // finished event pages, kept live but not for search
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // Naver's crawler. Wildcard already covers it, but an explicit block is
      // what Search Advisor's diagnostics report on.
      { userAgent: "Yeti", allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
