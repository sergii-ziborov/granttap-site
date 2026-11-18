import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { articles } from "../articles";
import { BlogArticleView } from "../BlogViews";
import { articleBodyWordCount } from "../longform/wordCount";
import { publishedArticles } from "../publication";
import { releaseStory } from "../stories/november2026-release";
import calendar from "../../../docs/editorial/november2026-release/calendar-validation.json";
import sitemap from "../../sitemap";

const slug = "granttap-1-0-2-app-store-whats-new";
const text = (locale: "en" | "ru") =>
  [...releaseStory[locale].intro, ...releaseStory[locale].sections.flatMap(section => section.paragraphs)].join(" ");

describe("November 18 release story", () => {
  it("is published on the 18th, first in the journal and in the sitemap", () => {
    expect([releaseStory.slug, releaseStory.date, releaseStory.publishedOn, releaseStory.reviewedOn]).toEqual([slug, "2026-11-18", "2026-11-18", "2026-11-18"]);
    expect(articles.filter(article => article.slug === slug)).toHaveLength(1);
    expect(publishedArticles(new Date("2026-11-17T12:00:00Z")).map(article => article.slug)).not.toContain(slug);
    expect(publishedArticles(new Date("2026-11-18T12:00:00Z"))[0].slug).toBe(slug);
    vi.useFakeTimers();
    let urls: string[];
    try { vi.setSystemTime(new Date("2026-11-18T12:00:00Z")); urls = sitemap().map(entry => entry.url); } finally { vi.useRealTimers(); }
    expect(urls).toContain(`https://granttap.com/blog/${slug}?lang=ru`);
  });

  it("has at least 2000 body words per language, recorded in the editorial calendar", () => {
    const row = calendar.articles.find(entry => entry.slug === slug)!;
    for (const locale of ["en", "ru"] as const) {
      const words = articleBodyWordCount(releaseStory[locale]);
      expect(words, locale).toBeGreaterThanOrEqual(2000);
      expect(row.words[locale]).toBe(words);
      expect(releaseStory[locale].sections.length).toBe(releaseStory.en.sections.length);
      expect(releaseStory[locale].sources!.length).toBeGreaterThanOrEqual(4);
      expect(releaseStory[locale].practice!.steps.some(step => step.code?.includes("granttap"))).toBe(true);
    }
  });

  it("states versions and availability as shipped and keeps the next update unreleased", () => {
    const en = text("en"), ru = text("ru");
    for (const fact of ["since November 13, 2026", "version 1.0.2 arrived on November 18", "0.8.195", "$4.99", "$7.99", "$13.99", "$39.99", "submitted to App Review on November 15 and is still in review", "TestFlight invitation", "after Apple approves it"]) {
      expect(en).toContain(fact);
    }
    for (const fact of ["с 13 ноября 2026 года", "18 ноября вышла версия 1.0.2", "0.8.195", "$4,99", "отправлена в App Review 15 ноября и всё ещё на проверке", "после одобрения Apple"]) {
      expect(ru).toContain(fact);
    }
    expect(en).not.toMatch(/Mac app (is|is now) (on|available on) the App Store|1\.0\.3/);
    expect(ru).not.toMatch(/1\.0\.3/);
    expect(en).toContain("GrantTap 1.0.2 already shows image generation runs");
    expect(en).toContain("comes with the next iPhone update");
  });

  it("ships three generated 16:9 diagrams whose bytes match the calendar", () => {
    const row = calendar.articles[0];
    const paths = [releaseStory.cover, releaseStory.inlineIllustration!, releaseStory.additionalIllustration!];
    expect(new Set(paths).size).toBe(3);
    const script = readFileSync("scripts/blog/research-illustrations.mjs", "utf8");
    for (const path of paths) {
      const image = row.images.find(entry => entry.path === path)!;
      expect(image, path).toBeDefined();
      expect(script).toContain(`scene("${path.slice(6, -5)}"`);
      const bytes = readFileSync("public" + path);
      expect(bytes.toString("latin1", 8, 12)).toBe("WEBP");
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(image.sha256);
    }
  });

  it.each(["en", "ru"] as const)("labels its diagrams and links related reading in %s", locale => {
    const view = render(<BlogArticleView article={releaseStory} articles={articles} locale={locale} />);
    expect(screen.getByRole("img", { name: releaseStory[locale].coverAlt })).toBeTruthy();
    expect(screen.getByRole("img", { name: releaseStory[locale].illustrationCaption })).toBeTruthy();
    expect(releaseStory[locale].illustrationCaption).toMatch(locale === "en" ? /^Infographic/ : /^Инфографика/);
    const related = within(screen.getByRole("region", { name: locale === "en" ? "Related reading" : "Читайте также" })).getAllByRole("link");
    expect(related).toHaveLength(3);
    expect(related[0].getAttribute("href")).toContain("granttap-iphone-ipad-app-store-launch");
    view.unmount();
  });
});
