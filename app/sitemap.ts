import type { MetadataRoute } from "next";
import { publishedArticles, publicationDay } from "./blog/publication";

export const dynamic = "force-dynamic";

const pages = [
  ["", ""], ["about", "2026-09-28"], ["privacy", "2026-08-28"],
  ["terms", "2026-09-25"], ["support", "2026-08-28"],
  ["security", "2026-08-28"], ["data-rights", "2026-08-28"],
  ["accessibility", "2026-08-28"], ["licenses", "2026-09-25"],
  ["pricing", "2026-09-28"], ["mac", "2026-10-08"], ["agents/claude-code", "2026-08-28"],
  ["agents/codex", "2026-08-28"], ["agents/cursor", "2026-08-28"],
  ["agents/grok-build", "2026-08-28"], ["project-mesh", "2026-08-28"],
  ["grok-bot", "2026-08-28"], ["apple-watch-coding-agents", "2026-08-28"],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const today = publicationDay();
  return [
    ...pages.map(([path, updated]) => ({
      url: `https://granttap.com/${path}`,
      lastModified: updated || today,
      changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : .7,
    })),
    { url: "https://granttap.com/blog", lastModified: today, changeFrequency: "weekly", priority: .8 },
    ...publishedArticles().map(article => ({
      url: `https://granttap.com/blog/${article.slug}`,
      lastModified: article.date,
      changeFrequency: "monthly" as const,
      priority: .7,
    })),
  ];
}
