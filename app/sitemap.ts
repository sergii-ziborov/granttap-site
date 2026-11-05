import type { MetadataRoute } from "next";
import { publishedArticles, articlePublicationDate } from "./blog/publication";
import { guideCatalog } from "./guide/GuideContent/catalog";
import { publicPageCopy } from "./SearchMetadata/pages";
import { siteOrigin } from "./SearchMetadata";

export const dynamic = "force-dynamic";
function translated(path: string, updated: string, priority = .7): MetadataRoute.Sitemap {
  const languages = { en: siteOrigin + path, ru: `${siteOrigin}${path}?lang=ru`, "x-default": siteOrigin + path };
  return ["", "?lang=ru"].map(query => ({ url: siteOrigin + path + query,
    lastModified: updated, changeFrequency: "monthly", priority, alternates: { languages } }));
}
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = publishedArticles();
  const latest = articles.reduce((day, article) => [day, article.reviewedOn || articlePublicationDate(article)].sort().at(-1)!, "2026-11-05");
  return [
    ...Object.entries(publicPageCopy).flatMap(([path, page]) => translated(path, page.updated, path === "/" ? 1 : .7)),
    ...translated("/mac", "2026-11-05"), ...translated("/blog", latest, .8),
    ...["agents/claude-code", "agents/codex", "agents/cursor", "agents/grok-build", "project-mesh", "grok-bot", "apple-watch-coding-agents"].map(path => ({ url: `${siteOrigin}/${path}`, lastModified: "2026-11-05", changeFrequency: "monthly" as const, priority: .7 })),
    ...["", ...guideCatalog.map(page => `/${page.slug}`)].map(path => ({ url: `${siteOrigin}/guide${path}`,
      lastModified: "2026-11-05", changeFrequency: "monthly" as const, priority: .8, alternates: { languages: { ru: `${siteOrigin}/guide${path}` } } })),
    ...articles.flatMap(article => translated(`/blog/${article.slug}`, article.reviewedOn || articlePublicationDate(article))),
  ];
}
