import { articles } from "./articles";
import type { BlogArticle } from "./articleTypes";

export function articlePublicationDate(article: BlogArticle): string { return article.publishedOn || article.date; }

export function publicationDay(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

export function publishedArticles(now = new Date()) {
  const today = publicationDay(now);
  return articles.filter(article => article.date <= today && articlePublicationDate(article) <= today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function publishedArticle(slug: string, now = new Date()) {
  return publishedArticles(now).find(article => article.slug === slug);
}
