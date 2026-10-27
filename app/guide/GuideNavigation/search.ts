import { parseGuide, plainText } from "../GuideReader/markdown";
import type { GuideMeta } from "../GuideContent/catalog";

type SearchPage = GuideMeta & { content: string };
export type SearchEntry = {
  slug: string; title: string; heading: string; href: string; excerpt: string;
  text: string; titleText: string; keywords: string;
};

export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase("ru").replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function matchesSearchTerm(text: string, term: string): boolean {
  return term.length <= 2 ? text.split(" ").includes(term) : text.includes(term);
}

function excerpt(text: string, terms: string[]): string {
  const match = [...text.matchAll(/[\p{L}\p{N}]+/gu)]
    .find(word => terms.some(term => matchesSearchTerm(normalizeSearch(word[0]), term)));
  const from = Math.max(0, (match?.index ?? 0) - 60);
  const start = from ? text.indexOf(" ", from) + 1 : 0;
  const end = Math.min(text.length, start + 220);
  return `${start ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

export function buildSearchIndex(pages: SearchPage[]): SearchEntry[] {
  return pages.flatMap(page => parseGuide(page.content).filter(section => section.title || section.blocks.length).map(section => {
    const text = plainText(section.blocks.map(block =>
      "text" in block ? block.text : "items" in block ? block.items.join(" ") : "rows" in block ? block.rows.flat().join(" ") : "").join(" "));
    return { slug: page.slug, title: page.title, heading: section.title,
      href: `/guide/${page.slug}${section.title ? `#${section.id}` : ""}`,
      excerpt: text, text: normalizeSearch(`${page.title} ${section.title} ${text}`),
      titleText: normalizeSearch(`${page.title} ${section.title}`), keywords: normalizeSearch(page.keywords.join(" ")) };
  }));
}

export function searchGuide(index: SearchEntry[], query: string, limit = 12): SearchEntry[] {
  const normalized = normalizeSearch(query); if (!normalized) return [];
  const terms = normalized.split(" ");
  return index.map(entry => {
    if (!terms.every(term => matchesSearchTerm(entry.text, term) || entry.keywords.split(" ").includes(term))) return { entry, score: 0 };
    const score = terms.reduce((sum, term) => sum + (matchesSearchTerm(entry.titleText, term) ? 12 : 0)
      + (entry.keywords.split(" ").includes(term) ? 18 : 0) + (matchesSearchTerm(entry.text, term) ? 3 : 0), 0)
      + (matchesSearchTerm(entry.titleText, normalized) ? 8 : 0);
    return { entry, score };
  }).filter(result => result.score > 0).sort((a, b) => b.score - a.score).slice(0, limit)
    .map(({ entry }) => ({ ...entry, excerpt: excerpt(entry.excerpt, terms) }));
}
