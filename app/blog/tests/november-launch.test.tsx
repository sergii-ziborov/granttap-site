import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { articles } from "../articles";
import { BlogArticleView } from "../BlogViews";
import { articleBodyWordCount } from "../longform/wordCount";
import { publishedArticles } from "../publication";
import { relatedArticles } from "../related";
import { novemberLaunchStories } from "../stories/november2026-launch";
import calendar from "../../../docs/editorial/november2026-launch/calendar-validation.json";
import provenance from "../../../docs/editorial/november2026-launch/image-prompts.json";
import sitemap from "../../sitemap";

const slugs = ["granttap-iphone-ipad-app-store-launch", "granttap-subscription-limits-auto-continue", "granttap-mesh-repositories-computers"];

describe("November 14–16 App Store stories", () => {
  it("are dated 16, 15 and 14 November, newest first, and all published on the 16th", () => {
    expect(novemberLaunchStories.map(article => [article.date, article.slug])).toEqual([
      ["2026-11-16", slugs[0]], ["2026-11-15", slugs[1]], ["2026-11-14", slugs[2]],
    ]);
    for (const article of novemberLaunchStories) {
      expect(article.publishedOn).toBe("2026-11-16");
      expect(article.reviewedOn).toBe("2026-11-16");
      expect(articles.filter(row => row.slug === article.slug)).toHaveLength(1);
    }
    expect(publishedArticles(new Date("2026-11-15T12:00:00Z")).map(article => article.slug)).not.toContain(slugs[2]);
    expect(publishedArticles(new Date("2026-11-16T12:00:00Z")).slice(0, 3).map(article => article.slug)).toEqual(slugs);
    vi.useFakeTimers();
    let urls: string[];
    try { vi.setSystemTime(new Date("2026-11-16T12:00:00Z")); urls = sitemap().map(entry => entry.url); } finally { vi.useRealTimers(); }
    for (const slug of slugs) expect(urls).toContain(`https://granttap.com/blog/${slug}?lang=ru`);
  });

  it("has at least 2000 body words per language, recorded in the editorial calendar", () => {
    for (const article of novemberLaunchStories) {
      const row = calendar.articles.find(entry => entry.slug === article.slug)!;
      expect(row.date).toBe(article.date);
      for (const locale of ["en", "ru"] as const) {
        const words = articleBodyWordCount(article[locale]);
        expect(words, `${article.slug}:${locale}`).toBeGreaterThanOrEqual(2000);
        expect(row.words[locale]).toBe(words);
        expect(article[locale].sections.length).toBe(article.en.sections.length);
        expect(article[locale].sources!.length).toBeGreaterThanOrEqual(4);
        expect(article[locale].practice!.steps.some(step => step.code?.includes("granttap"))).toBe(true);
      }
    }
  });

  it("states availability, prices and versions as shipped", () => {
    const [launch, limits, mesh] = novemberLaunchStories;
    const text = (article: typeof launch, locale: "en" | "ru") =>
      [...article[locale].intro, ...article[locale].sections.flatMap(section => section.paragraphs)].join(" ");
    const en = text(launch, "en");
    for (const fact of ["$4.99", "$7.99", "$13.99", "$39.99", "7-day free trial", "npm install -g granttap-mcp", "granttap setup"]) {
      expect(en + launch.en.practice!.steps.map(step => step.code).join(" ")).toContain(fact);
    }
    expect(en).toContain("submitted to App Review on November 15");
    expect(en).not.toMatch(/Mac app (is|is now) (on|available on) the App Store/);
    expect(text(launch, "ru")).toContain("отправлена в App Review 15 ноября");
    expect(text(limits, "en")).toContain("MCP 0.8.181");
    expect(text(limits, "en")).toContain("currently applies to Claude Code chats");
    expect(text(mesh, "en")).toContain("does not include the repository editor");
    expect(text(mesh, "ru")).toContain("редактора репозиториев нет");
  });

  it("ships nine distinct Grok-generated WebP images whose bytes match their provenance", () => {
    const paths = novemberLaunchStories.flatMap(article => [article.cover, article.inlineIllustration!, article.additionalIllustration!]);
    expect(new Set(paths).size).toBe(9);
    expect(provenance.mode).toBe("Grok CLI image generation");
    expect(provenance.images).toHaveLength(9);
    expect(new Set(provenance.images.map(image => image.originalSha256)).size).toBe(9);
    expect(new Set(provenance.images.map(image => image.webpSha256)).size).toBe(9);
    for (const path of paths) {
      const image = provenance.images.find(row => row.destination === "public" + path)!;
      expect(image, path).toBeDefined();
      expect(image.prompt).toContain(image.subject);
      expect(image.prompt).toMatch(/no text, no letters/);
      expect(image.width / image.height).toBeCloseTo(16 / 9, 2);
      const bytes = readFileSync("public" + path);
      expect(bytes.toString("latin1", 8, 12)).toBe("WEBP");
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(image.webpSha256);
    }
  });

  it.each(novemberLaunchStories.flatMap(article => (["en", "ru"] as const).map(locale => ({ article, locale }))))(
    "$article.slug describes its images and links its companions in $locale", ({ article, locale }) => {
      const view = render(<BlogArticleView article={article} articles={articles} locale={locale} />);
      const label = locale === "en" ? "AI-generated conceptual illustration" : "Сгенерированная концептуальная иллюстрация";
      expect(screen.getByRole("img", { name: article[locale].coverAlt })).toBeTruthy();
      expect(screen.getByRole("img", { name: article[locale].illustrationCaption })).toBeTruthy();
      expect(screen.getByRole("img", { name: article[locale].additionalIllustrationCaption })).toBeTruthy();
      expect(article[locale].illustrationCaption).toContain(label);
      expect(within(screen.getByRole("region", { name: locale === "en" ? "Related reading" : "Читайте также" })).getAllByRole("link")).toHaveLength(3);
      expect(relatedArticles(article, articles).map(row => row.slug).filter(slug => slugs.includes(slug)).length).toBeGreaterThanOrEqual(1);
      view.unmount();
    });
});
