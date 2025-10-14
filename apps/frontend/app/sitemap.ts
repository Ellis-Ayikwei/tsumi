import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const routes = [
    "",
    "dashboard",
    "errands",
    "agent",
    "admin",
    "wallet",
    "history",
    "auth/login",
    "auth/signup",
    "request-errand",
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}/${route}`.replace(/\/$/, ""),
    lastModified: now,
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.7,
  }));
}


