import { existsSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { docPath, docsByCategory, docsOfKind } from "@/lib/content/registry";
import { absoluteUrl } from "@/lib/seo";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

type Route = {
  path: string;
  /** Real content revision date. Never `new Date()` — a build-time stamp marks
   *  every page as changed on each deploy and Google stops trusting lastmod. */
  lastModified: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  /** Planned route owned by another workstream; emitted only once it exists. */
  optional?: boolean;
};

const METADATA_REVISION = "2026-08-10";

const ROUTES: readonly Route[] = [
  { path: "/", lastModified: METADATA_REVISION, changeFrequency: "weekly", priority: 1 },
  {
    path: "/bundang-vocal-lesson",
    lastModified: METADATA_REVISION,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  { path: "/signature", lastModified: METADATA_REVISION, changeFrequency: "monthly", priority: 0.9 },
  { path: "/spark", lastModified: METADATA_REVISION, changeFrequency: "monthly", priority: 0.8 },
  { path: "/reserve", lastModified: METADATA_REVISION, changeFrequency: "monthly", priority: 0.8 },
  { path: "/diagnosis", lastModified: METADATA_REVISION, changeFrequency: "monthly", priority: 0.8 },
  { path: "/crew", lastModified: METADATA_REVISION, changeFrequency: "monthly", priority: 0.6 },
  { path: "/refund", lastModified: METADATA_REVISION, changeFrequency: "yearly", priority: 0.3 },

  {
    path: "/vocal-correction",
    lastModified: METADATA_REVISION,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/adult-vocal-lesson",
    lastModified: METADATA_REVISION,
    changeFrequency: "monthly",
    priority: 0.8,
  },

  // Landing pages in flight elsewhere. Listing a route before its page ships
  // would report 404s in Search Console, so each is gated on the file existing.
  {
    path: "/pangyo-vocal-lesson",
    lastModified: METADATA_REVISION,
    changeFrequency: "monthly",
    priority: 0.7,
    optional: true,
  },
  {
    path: "/location",
    lastModified: METADATA_REVISION,
    changeFrequency: "yearly",
    priority: 0.6,
    optional: true,
  },
  {
    path: "/reviews",
    lastModified: METADATA_REVISION,
    changeFrequency: "monthly",
    priority: 0.6,
    optional: true,
  },
];

const APP_DIR = path.join(process.cwd(), "src", "app");

function routeExists(routePath: string): boolean {
  const dir = path.join(APP_DIR, routePath.replace(/^\//, ""));
  return ["page.tsx", "page.ts", "page.jsx", "page.mdx"].some((file) =>
    existsSync(path.join(dir, file))
  );
}

// Guide hub, its category pages, and every guide article — generated from the
// content registry so a new article appears in the sitemap automatically.
function guideRoutes(): MetadataRoute.Sitemap {
  const guides = docsOfKind("guide");
  if (!guides.length) return [];

  const latest = guides
    .map((doc) => doc.updated ?? doc.published)
    .sort()
    .at(-1)!;

  const hub = {
    url: absoluteUrl("/guide"),
    lastModified: latest,
    changeFrequency: "weekly" as ChangeFrequency,
    priority: 0.7,
  };

  const categoryPages = docsByCategory("guide").map((group) => {
    const catLatest = group.docs
      .map((doc) => doc.updated ?? doc.published)
      .sort()
      .at(-1)!;
    return {
      url: absoluteUrl(`/guide/${group.category}`),
      lastModified: catLatest,
      changeFrequency: "weekly" as ChangeFrequency,
      priority: 0.6,
    };
  });

  const articles = guides.map((doc) => ({
    url: absoluteUrl(docPath(doc)),
    lastModified: doc.updated ?? doc.published,
    changeFrequency: "monthly" as ChangeFrequency,
    priority: 0.8,
  }));

  return [hub, ...categoryPages, ...articles];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ROUTES.filter(
    (route) => !route.optional || routeExists(route.path)
  ).map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [...staticRoutes, ...guideRoutes()];
}
