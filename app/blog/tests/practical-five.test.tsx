import { expect, test } from "vitest";
import { articles } from "../articles";
import { articleBodyWordCount } from "../longform/wordCount";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import images from "../../../docs/editorial/practical2026-five/image-prompts.json";
import calendar from "../../../docs/editorial/practical2026-five/calendar-validation.json";
import { practicalFiveStories } from "../stories/practical2026-five";
import { publishedArticles } from "../publication";

const slots = [
  ["2026-10-14", "granttap-agent-time-zones-calendar-tests"],
  ["2026-10-15", "granttap-agent-long-builds-process-results"],
  ["2026-10-17", "granttap-agent-environment-config-secrets"],
  ["2026-10-18", "granttap-agent-database-migration-rehearsal"],
  ["2026-10-19", "granttap-agent-api-client-server-compatibility"],
];

test("five missing dates provide original bilingual practical workshops", () => {
  for (const [date, slug] of slots) {
    const article = articles.find(row => row.slug === slug);
    expect(article, slug).toBeDefined();
    expect(article!.date).toBe(date);
    expect(article!.reviewedOn).toBe("2026-11-05");
    for (const locale of ["en", "ru"] as const) {
      expect(articleBodyWordCount(article![locale])).toBeGreaterThanOrEqual(2500);
      expect(article![locale].sources!.length).toBeGreaterThanOrEqual(3);
    }
    expect(new Set([article!.cover, article!.inlineIllustration, article!.additionalIllustration]).size).toBe(3);
  }
});

test("the five workshops fill only existing gaps and preserve later publication gates", () => {
  expect(calendar.beforeGaps.filter(date => !calendar.afterGaps.includes(date))).toEqual(slots.map(([date]) => date));
  expect(calendar.afterGaps).toHaveLength(15);
  expect(calendar.afterGaps.slice(-3)).toEqual(["2026-10-11", "2026-10-12", "2026-10-13"]);
  expect(publishedArticles(new Date("2026-11-05T12:00:00Z"))).toHaveLength(47);
  expect(publishedArticles(new Date("2026-11-08T12:00:00Z"))).toHaveLength(50);
  for (const locale of ["en", "ru"] as const) {
    const paragraphs = practicalFiveStories.flatMap(article => [...article[locale].intro, ...article[locale].sections.flatMap(section => section.paragraphs)]);
    expect(new Set(paragraphs).size).toBe(paragraphs.length);
    for (const article of practicalFiveStories) {
      expect(article[locale].editorialNote).toContain(locale === "en" ? "editorial slot" : "редакционный слот");
      expect(calendar.articles.find(row => row.slug === article.slug)!.words[locale]).toBe(articleBodyWordCount(article[locale]));
    }
  }
});

test("each workshop has three distinct new generated assets with their original provenance", () => {
  expect(images.mode).toBe("built-in image_gen");
  expect(images.images).toHaveLength(15);
  expect(new Set(images.images.map(image => image.sourceAssetId)).size).toBe(15);
  expect(new Set(images.images.map(image => image.webpSha256)).size).toBe(15);
  for (const article of practicalFiveStories) {
    for (const path of [article.cover, article.inlineIllustration!, article.additionalIllustration!]) {
      const image = images.images.find(row => row.destination === "public" + path)!;
      expect(image, path).toBeDefined();
      expect(image.width / image.height).toBeGreaterThan(1.7);
      expect(image.prompt.length).toBeGreaterThan(150);
      expect(createHash("sha256").update(readFileSync("public" + path)).digest("hex")).toBe(image.webpSha256);
    }
  }
});
