import { render, screen, within } from "@testing-library/react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import BlogPage from "../../app/blog/page";
import ArticlePage, { generateMetadata } from "../../app/blog/[slug]/page";
import { BlogArticleView } from "../../app/blog/BlogViews";
import { articles, getArticle } from "../../app/blog/articles";
import { publishedArticles, publicationDay } from "../../app/blog/publication";

test("journal lists released stories and changes visible copy with the language control", async () => {
  const user = userEvent.setup();
  render(<BlogPage />);
  expect(screen.getByRole("heading", { name: "Agent work you can understand and control." })).toBeTruthy();
  const list = screen.getByRole("region", { name: "All articles" });
  expect(within(list).getAllByRole("link")).toHaveLength(publishedArticles().length);
  await user.click(screen.getByRole("button", { name: "Switch to Russian" }));
  expect(screen.getByRole("heading", { name: "Работа агентов, которую можно понять и контролировать." })).toBeTruthy();
  expect(screen.getByRole("region", { name: "Все статьи" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Переключить на английский" }));
  expect(screen.getByRole("heading", { name: "All stories" })).toBeTruthy();
});

test("every article renders its own sections and sources in both languages", async () => {
  const user = userEvent.setup();
  for (const article of articles) {
    const view = render(<BlogArticleView article={article} articles={articles} />);
    expect(screen.getByRole("heading", { name: article.en.title })).toBeTruthy();
    expect(screen.getByText(article.en.closing)).toBeTruthy();
    if (article.en.screenshotCaption) expect(screen.getByRole("img", { name: article.en.screenshotCaption })).toBeTruthy();
    if (article.en.sources) expect(screen.getByRole("heading", { name: "Sources" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Switch to Russian" }));
    expect(screen.getByRole("heading", { name: article.ru.title })).toBeTruthy();
    expect(screen.getByText(article.ru.closing)).toBeTruthy();
    if (article.ru.screenshotCaption) expect(screen.getByRole("img", { name: article.ru.screenshotCaption })).toBeTruthy();
    view.unmount();
    window.localStorage.clear();
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

test("article routes and metadata resolve exact slugs and reject unknown ones", async () => {
  expect(getArticle("connect-iphone-with-qr")?.en.title).toMatch(/iPhone/);
  expect(getArticle("missing")).toBeUndefined();
  const slug = "connect-iphone-with-qr";
  const metadata = await generateMetadata({ params: Promise.resolve({ slug }) });
  expect(metadata.alternates).toEqual({ canonical: `/blog/${slug}` });
  expect(await generateMetadata({ params: Promise.resolve({ slug: "missing" }) })).toEqual({});
  render(await ArticlePage({ params: Promise.resolve({ slug }) }));
  expect(screen.getByRole("heading", { name: getArticle(slug)?.en.title })).toBeTruthy();
  await expect(ArticlePage({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("not found");
});

test("publication schedule releases stories on the Jerusalem calendar day", () => {
  expect(publicationDay(new Date("2026-10-02T20:59:59Z"))).toBe("2026-10-02");
  expect(publicationDay(new Date("2026-10-02T21:00:00Z"))).toBe("2026-10-03");
  const first = publishedArticles(new Date("2026-10-03T12:00:00Z"));
  expect(first.map(item => item.slug)).toContain("why-granttap-is-a-control-center");
  expect(first.map(item => item.slug)).not.toContain("coding-agents-on-your-phone-2026");
  expect(publishedArticles(new Date("2026-10-31T12:00:00Z"))).toHaveLength(10);
});
