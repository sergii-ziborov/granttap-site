import { render, screen, within } from "@testing-library/react";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { seoGuideStories } from "../stories/seo2026-guides";
import { articleBodyWordCount } from "../longform/wordCount";
import { articlePublicationDate, publishedArticles } from "../publication";
import { BlogArticleView } from "../BlogViews";
import { QuickChecks } from "../QuickChecks";
import calendar from "../../../docs/editorial/seo2026-guides/calendar-validation.json";
import provenance from "../../../docs/editorial/seo2026-guides/image-prompts.json";

test("five original practical guides fill the nearest five existing past slots", () => {
  expect(seoGuideStories.map(row => row.date)).toEqual(["2026-10-08", "2026-10-09", "2026-10-11", "2026-10-12", "2026-10-13"]);
  expect(calendar.afterGaps).toHaveLength(10);
  expect(calendar.beforeGaps.filter(date => !calendar.afterGaps.includes(date))).toEqual(seoGuideStories.map(row => row.date));
  expect(publishedArticles(new Date("2026-11-05T12:00:00Z"))).toHaveLength(52);
  expect(publishedArticles(new Date("2026-11-08T12:00:00Z"))).toHaveLength(55);
  for (const article of seoGuideStories) {
    expect(articlePublicationDate(article)).toBe("2026-11-05");
    for (const locale of ["en", "ru"] as const) {
      const words = articleBodyWordCount(article[locale]);
      expect(words).toBeGreaterThanOrEqual(2500);
      expect(words).toBe(calendar.articles.find(row => row.slug === article.slug)!.words[locale]);
      expect(article[locale].practice?.steps).toHaveLength(3);
      expect(article[locale].sources!.length).toBeGreaterThanOrEqual(3);
    }
  }
  for (const locale of ["en", "ru"] as const) {
    const paragraphs = seoGuideStories.flatMap(row => [...row[locale].intro, ...row[locale].sections.flatMap(section => section.paragraphs)]);
    expect(new Set(paragraphs).size).toBe(paragraphs.length);
  }
});

test("fifteen separate image originals match the public bytes", () => {
  expect(provenance.mode).toBe("built-in image_gen");
  expect(provenance.images).toHaveLength(15);
  expect(new Set(provenance.images.map(image => image.sourceAssetId)).size).toBe(15);
  expect(new Set(provenance.images.map(image => image.webpSha256)).size).toBe(15);
  for (const article of seoGuideStories) {
    for (const path of [article.cover, article.inlineIllustration!, article.additionalIllustration!]) {
      const source = provenance.images.find(image => image.destination === "public" + path)!;
      expect(source).toBeDefined();
      expect(createHash("sha256").update(readFileSync("public" + path)).digest("hex")).toBe(source.webpSha256);
    }
  }
});

test("the focused check is usable HTML and keeps code distinct from prose", () => {
  render(<QuickChecks practice={seoGuideStories[3].en.practice!} />);
  expect(screen.getByRole("heading", { name: "Try a focused check" })).toBeTruthy();
  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  expect(screen.getByText(/git worktree list --porcelain/).tagName).toBe("CODE");
});

test("the article exposes actual publication separately from its archive slot", () => {
  const article = seoGuideStories[0];
  render(<BlogArticleView article={article} articles={seoGuideStories} locale="ru" />);
  expect(screen.getByText(/Опубликовано/).textContent).toContain("2026-11-05");
  expect(screen.getByText(/Слот архива/).textContent).toContain("2026-10-08");
  expect(within(screen.getByRole("region", { name: "Источники" })).getAllByRole("link").length).toBeGreaterThanOrEqual(3);
});
