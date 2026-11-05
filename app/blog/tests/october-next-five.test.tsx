import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { octoberNextFiveStories } from "../stories/october2026-next-five";
import { articleBodyWordCount } from "../longform/wordCount";
import { publishedArticles } from "../publication";
import { BlogArticleView } from "../BlogViews";
import calendar from "../../../docs/editorial/october2026-next-five/calendar-validation.json";
import provenance from "../../../docs/editorial/october2026-next-five/image-prompts.json";
import earlierImages from "../../../docs/editorial/october2026-backfill/image-prompts.json";
import screenshots from "../../guide/GuideContent/screenshots.json";

describe("five more retrospective articles", () => {
  it("fills only October 20–24 and preserves the actual review date", () => {
    expect(octoberNextFiveStories.map(article => article.date)).toEqual([
      "2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23", "2026-10-24",
    ]);
    expect(calendar.beforeGaps.filter(date => !calendar.afterGaps.includes(date))).toEqual(octoberNextFiveStories.map(article => article.date));
    expect(calendar.afterGaps).toHaveLength(20);
    expect(calendar.afterGaps.slice(-3)).toEqual(["2026-10-17", "2026-10-18", "2026-10-19"]);
    expect(publishedArticles(new Date("2026-11-05T12:00:00Z"))).toHaveLength(42);
    expect(publishedArticles(new Date("2026-11-08T12:00:00Z"))).toHaveLength(45);
    for (const article of octoberNextFiveStories) {
      expect(article.reviewedOn).toBe("2026-11-05");
      for (const locale of ["en", "ru"] as const) {
        const text = article[locale];
        const words = articleBodyWordCount(text);
        expect(words, article.slug + ":" + locale).toBeGreaterThanOrEqual(2500);
        expect(calendar.articles.find(row => row.slug === article.slug)?.words[locale]).toBe(words);
        expect(text.editorialNote).toContain(locale === "en" ? "editorial slot" : "редакционный слот");
        expect(text.sources?.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("ships fifteen new generated assets with distinct identities and matching bytes", () => {
    const paths = octoberNextFiveStories.flatMap(article => [article.cover, article.inlineIllustration!, article.additionalIllustration!]);
    expect(new Set(paths).size).toBe(15);
    expect(provenance.mode).toBe("built-in image_gen");
    expect(provenance.images).toHaveLength(15);
    expect(new Set(provenance.images.map(image => image.sourceAssetId)).size).toBe(15);
    expect(new Set(provenance.images.map(image => image.webpSha256)).size).toBe(15);
    for (const path of paths) {
      const image = provenance.images.find(row => row.destination === "public" + path)!;
      expect(image, path).toBeDefined();
      expect(earlierImages.images.some(row => row.sourceAssetId === image.sourceAssetId)).toBe(false);
      expect(image.prompt.length).toBeGreaterThan(150);
      expect(createHash("sha256").update(readFileSync("public" + path)).digest("hex")).toBe(image.webpSha256);
      expect(image.width / image.height).toBeGreaterThan(1.7);
    }
  });

  it("uses original paragraphs and preserves real capture provenance", () => {
    for (const locale of ["en", "ru"] as const) {
      const paragraphs = octoberNextFiveStories.flatMap(article => [...article[locale].intro, ...article[locale].sections.flatMap(section => section.paragraphs)]);
      expect(new Set(paragraphs).size).toBe(paragraphs.length);
    }
    for (const article of octoberNextFiveStories.filter(row => row.screenshot)) {
      const source = screenshots.find(row => row.file === article.screenshot)!;
      expect(source).toBeDefined();
      expect(existsSync("public" + article.screenshot)).toBe(true);
      for (const locale of ["en", "ru"] as const) {
        expect(article[locale].screenshotCaption).toContain(source.build);
        expect(article[locale].screenshotCaption).toContain(source.date);
        expect(article[locale].screenshotCaption).toContain("Simulator");
      }
    }
    render(<BlogArticleView article={octoberNextFiveStories[0]} articles={octoberNextFiveStories} locale="ru" />);
    expect(screen.getByText("Проверено 2026-11-05").closest(".blog-prose")).not.toBeNull();
    expect(screen.getByText(/Материал подготовлен и проверен 5 ноября/)).toBeTruthy();
  });
});
