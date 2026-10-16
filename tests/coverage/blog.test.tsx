import { render, screen, within } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import BlogPage, { generateMetadata as indexMetadata } from "../../app/blog/page";
import ArticlePage, { generateMetadata } from "../../app/blog/[slug]/page";
import { BlogArticleView } from "../../app/blog/BlogViews";
import { articles, getArticle } from "../../app/blog/articles";
import { articleBodyWordCount } from "../../app/blog/longform/wordCount";
import { publishedArticles, publicationDay } from "../../app/blog/publication";

test("journal lists released stories and keeps language in its links", async () => {
  const english = render(await BlogPage({ searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { name: "Agent work you can understand and control." })).toBeTruthy();
  const list = screen.getByRole("region", { name: "All articles" });
  expect(within(list).getAllByRole("link")).toHaveLength(publishedArticles().length);
  expect(screen.getByRole("link", { name: "Switch to Russian" }).getAttribute("href")).toBe("/blog?lang=ru");
  english.unmount();
  render(await BlogPage({ searchParams: Promise.resolve({ lang: "ru" }) }));
  expect(screen.getByRole("heading", { name: "Работа агентов, которую можно понять и контролировать." })).toBeTruthy();
  expect(screen.getByRole("main").getAttribute("lang")).toBe("ru");
  expect(screen.getByRole("region", { name: "Все статьи" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Переключить на английский" }).getAttribute("href")).toBe("/blog");
  expect(screen.getByRole("link", { name: /Читать статью/ }).getAttribute("href")).toMatch(/\?lang=ru$/);
});

test("every article renders its own sections and sources in both languages", () => {
  for (const article of articles) {
    for (const locale of ["en", "ru"] as const) {
      const view = render(<BlogArticleView article={article} articles={articles} locale={locale} />);
      expect(screen.getByRole("heading", { name: article[locale].title })).toBeTruthy();
      expect(screen.getByText(article[locale].closing)).toBeTruthy();
      const captureLabel = screen.queryByText(locale === "en" ? "GrantTap screen · sample data" : "Экран GrantTap · тестовые данные");
      if (article.screenshot) {
        expect(screen.getByRole("img", { name: article[locale].screenshotCaption })).toBeTruthy();
        expect(captureLabel).toBeTruthy();
      } else {
        expect(article[locale].screenshotCaption).toBeUndefined();
        expect(captureLabel).toBeNull();
      }
      expect(screen.getByRole("heading", { name: locale === "en" ? "Sources" : "Источники" })).toBeTruthy();
      view.unmount();
    }
  }
});

test("each editorial story includes a real GrantTap interface with bilingual context", () => {
  const editorial = articles.filter(article => article.date >= "2026-10-03");
  expect(editorial).toHaveLength(20);
  // A story shows a capture only when one shows its feature; none shows message delivery marks yet.
  expect(editorial.filter(article => !article.screenshot).map(article => article.slug)).toEqual(["messages-that-wait-for-the-computer"]);
  for (const article of editorial.filter(item => item.screenshot)) {
    expect(article.screenshot).toMatch(/^\/product\/iphone-[\w-]+\.png$/);
    expect(existsSync(join(process.cwd(), "public", article.screenshot!))).toBe(true);
    expect(article.en.screenshotCaption?.length).toBeGreaterThan(30);
    expect(article.ru.screenshotCaption?.length).toBeGreaterThan(30);
  }
});

test("all bilingual stories have at least 1000 body words and two labeled inline images", () => {
  expect(articles).toHaveLength(25);
  for (const article of articles) {
    expect(article.generatedCover).toBe(true);
    for (const locale of ["en", "ru"] as const) {
      expect(article[locale].sources?.length).toBeGreaterThan(0);
      expect(articleBodyWordCount(article[locale])).toBeGreaterThanOrEqual(1000);
      expect(article[locale].illustrationCaption?.length).toBeGreaterThan(20);
      expect(article[locale].additionalIllustrationCaption?.length).toBeGreaterThan(20);
    }
    for (const path of [article.inlineIllustration, article.additionalIllustration]) {
      expect(path).toMatch(/^\/blog\/[\w-]+\.webp$/);
      expect(existsSync(join(process.cwd(), "public", path!))).toBe(true);
    }
    expect(article.inlineIllustration).not.toBe(article.additionalIllustration);
    expect(article.minutes).toBeGreaterThanOrEqual(6);
  }
});

test("article routes and metadata resolve exact slugs and reject unknown ones", async () => {
  expect(getArticle("connect-iphone-with-qr")?.en.title).toMatch(/iPhone/);
  expect(getArticle("missing")).toBeUndefined();
  const slug = "connect-iphone-with-qr";
  const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
  expect(metadata.alternates).toMatchObject({ canonical: `/blog/${slug}`, languages: { en: `/blog/${slug}`, ru: `/blog/${slug}?lang=ru` } });
  expect((await generateMetadata({ params: Promise.resolve({ slug }), searchParams: Promise.resolve({ lang: "ru" }) })).title).toBe(getArticle(slug)?.ru.title);
  expect((await indexMetadata({ searchParams: Promise.resolve({ lang: "ru" }) })).title).toBe("Журнал");
  expect(await generateMetadata({ params: Promise.resolve({ slug: "missing" }) })).toEqual({});
  render(await ArticlePage({ params: Promise.resolve({ slug }), searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { name: getArticle(slug)?.en.title })).toBeTruthy();
  await expect(ArticlePage({ params: Promise.resolve({ slug: "missing" }), searchParams: Promise.resolve({}) })).rejects.toThrow("not found");
});

test("journal availability follows the Jerusalem calendar day", () => {
  expect(publicationDay(new Date("2026-10-02T20:59:59Z"))).toBe("2026-10-02");
  expect(publicationDay(new Date("2026-10-02T21:00:00Z"))).toBe("2026-10-03");
  const first = publishedArticles(new Date("2026-10-03T12:00:00Z"));
  expect(first.map(item => item.slug)).toContain("why-granttap-is-a-control-center");
  expect(first.map(item => item.slug)).toContain("coding-agents-on-your-phone-2026");
  expect(first).toHaveLength(10);
  expect(publishedArticles(new Date("2026-10-04T12:00:00Z"))).toHaveLength(13);
  expect(publishedArticles(new Date("2026-10-04T20:59:59Z"))).toHaveLength(13);
  expect(publishedArticles(new Date("2026-10-04T21:00:00Z"))).toHaveLength(20);
});

test("new stories link to related guides and their source reports", async () => {
  const article = getArticle("microsoft-agent-365-mcp-tool-governance-september-2026")!;
  render(<BlogArticleView article={article} articles={articles} locale="en" />);
  expect(screen.getByRole("link", { name: "GrantTap capability status guide" }).getAttribute("href")).toBe("/blog/mcp-skills-and-governance-status");
  expect(screen.getByRole("region", { name: "Related reading" })).toBeTruthy();
  expect(screen.getByRole("link", { name: /What's new in Agent 365/ })).toBeTruthy();
  const page = await ArticlePage({ params: Promise.resolve({ slug: article.slug }), searchParams: Promise.resolve({ lang: "ru" }) });
  const view = render(page);
  expect(view.container.querySelector('script[type="application/ld+json"]')?.textContent).toContain('"@type":"BlogPosting"');
  expect((await generateMetadata({ params: Promise.resolve({ slug: article.slug }), searchParams: Promise.resolve({ lang: "ru" }) })).alternates?.canonical).toBe(`/blog/${article.slug}?lang=ru`);
});


test("three research stories exceed 1500 body words per language and contain an infographic", () => {
  const research = articles.filter(article => article.date === "2026-10-10");
  expect(research).toHaveLength(3);
  for (const article of research) {
    for (const locale of ["en", "ru"] as const) {
      expect(articleBodyWordCount(article[locale])).toBeGreaterThan(1500);
      expect(article[locale].illustrationCaption).toMatch(/Infographic|Инфографика/);
    }
    expect(article.inlineIllustration).toMatch(/infographic.webp$/);
    expect(existsSync(join(process.cwd(), "public", article.cover))).toBe(true);
  }
});

function webpSize(path: string) {
  const bytes = readFileSync(join(process.cwd(), "public", path));
  const chunk = bytes.toString("latin1", 12, 16);
  if (chunk === "VP8 ") return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8X") return { width: bytes.readUIntLE(24, 3) + 1, height: bytes.readUIntLE(27, 3) + 1 };
  const bits = bytes.readUInt32LE(21);
  return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
}

test("generated journal diagrams are 16:9 and each one is used by a story", () => {
  const script = readFileSync(join(process.cwd(), "scripts/blog/research-illustrations.mjs"), "utf8");
  const generated = [...script.matchAll(/scene\("([\w-]+)"/g)].map(match => `/blog/${match[1]}.webp`);
  expect(generated.length).toBeGreaterThanOrEqual(9);
  const used = new Set(articles.flatMap(article => [article.cover, article.inlineIllustration, article.additionalIllustration]));
  for (const path of generated) {
    expect(webpSize(path), path).toEqual({ width: 1600, height: 900 });
    expect(used.has(path), path).toBe(true);
  }
});

test("October 16 guides match or exceed the journal's typical story", () => {
  const fresh = articles.filter(article => article.date === "2026-10-16");
  expect(fresh.map(article => article.slug)).toEqual(["move-a-task-without-losing-work", "messages-that-wait-for-the-computer"]);
  const others = articles.filter(article => article.date !== "2026-10-16");
  const median = (values: number[]) => { const sorted = [...values].sort((a, b) => a - b); const middle = sorted.length >> 1; return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2; };
  for (const article of fresh) {
    expect(article.minutes).toBeGreaterThanOrEqual(median(others.map(other => other.minutes)));
    for (const locale of ["en", "ru"] as const) {
      expect(articleBodyWordCount(article[locale])).toBeGreaterThanOrEqual(median(others.map(other => articleBodyWordCount(other[locale]))));
      expect(article[locale].sections.length).toBeGreaterThanOrEqual(median(others.map(other => other[locale].sections.length)));
      expect(article[locale].illustrationCaption).toMatch(/Infographic|Инфографика/);
    }
    expect(article.cover).toBe(`/blog/${article.slug}-cover.webp`);
    expect(article.inlineIllustration).toBe(`/blog/${article.slug}-a.webp`);
    expect(article.additionalIllustration).toBe(`/blog/${article.slug}-b.webp`);
  }
});
