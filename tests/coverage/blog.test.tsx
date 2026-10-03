import { render, screen, within } from "@testing-library/react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import BlogPage, { generateMetadata as indexMetadata } from "../../app/blog/page";
import ArticlePage, { generateMetadata } from "../../app/blog/[slug]/page";
import { BlogArticleView } from "../../app/blog/BlogViews";
import { articles, getArticle } from "../../app/blog/articles";
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
      if (article[locale].screenshotCaption) expect(screen.getByRole("img", { name: article[locale].screenshotCaption })).toBeTruthy();
      expect(screen.getByRole("heading", { name: locale === "en" ? "Sources" : "Источники" })).toBeTruthy();
      view.unmount();
    }
  }
});

test("each editorial story includes a real GrantTap interface with bilingual context", () => {
  const editorial = articles.filter(article => article.date >= "2026-10-03");
  expect(editorial).toHaveLength(5);
  for (const article of editorial) {
    expect(article.screenshot).toMatch(/^\/product\/iphone-[\w-]+\.png$/);
    expect(existsSync(join(process.cwd(), "public", article.screenshot!))).toBe(true);
    expect(article.en.screenshotCaption?.length).toBeGreaterThan(30);
    expect(article.ru.screenshotCaption?.length).toBeGreaterThan(30);
  }
});

test("all ten stories have attributable sources and labeled editorial artwork", () => {
  expect(articles).toHaveLength(10);
  for (const article of articles) {
    expect(article.generatedCover).toBe(true);
    for (const locale of ["en", "ru"] as const) {
      expect(article[locale].sources?.length).toBeGreaterThan(0);
      if (article.inlineIllustration) expect(article[locale].illustrationCaption?.length).toBeGreaterThan(20);
    }
    if (article.inlineIllustration) {
      expect(existsSync(join(process.cwd(), "public", article.inlineIllustration))).toBe(true);
    }
  }
  expect(articles.filter(article => article.inlineIllustration)).toHaveLength(3);
});

test("article routes and metadata resolve exact slugs and reject unknown ones", async () => {
  expect(getArticle("connect-iphone-with-qr")?.en.title).toMatch(/iPhone/);
  expect(getArticle("missing")).toBeUndefined();
  const slug = "connect-iphone-with-qr";
  const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
  expect(metadata.alternates).toEqual({ canonical: `/blog/${slug}` });
  expect((await generateMetadata({ params: Promise.resolve({ slug }), searchParams: Promise.resolve({ lang: "ru" }) })).title).toBe(getArticle(slug)?.ru.title);
  expect((await indexMetadata({ searchParams: Promise.resolve({ lang: "ru" }) })).title).toBe("Журнал");
  expect(await generateMetadata({ params: Promise.resolve({ slug: "missing" }) })).toEqual({});
  render(await ArticlePage({ params: Promise.resolve({ slug }), searchParams: Promise.resolve({}) }));
  expect(screen.getByRole("heading", { name: getArticle(slug)?.en.title })).toBeTruthy();
  await expect(ArticlePage({ params: Promise.resolve({ slug: "missing" }), searchParams: Promise.resolve({}) })).rejects.toThrow("not found");
});

test("publication schedule releases stories on the Jerusalem calendar day", () => {
  expect(publicationDay(new Date("2026-10-02T20:59:59Z"))).toBe("2026-10-02");
  expect(publicationDay(new Date("2026-10-02T21:00:00Z"))).toBe("2026-10-03");
  const first = publishedArticles(new Date("2026-10-03T12:00:00Z"));
  expect(first.map(item => item.slug)).toContain("why-granttap-is-a-control-center");
  expect(first.map(item => item.slug)).not.toContain("coding-agents-on-your-phone-2026");
  expect(publishedArticles(new Date("2026-10-31T12:00:00Z"))).toHaveLength(10);
});
