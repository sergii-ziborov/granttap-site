import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import BlogPage from "../../app/blog/page";
import ArticlePage, { generateMetadata, generateStaticParams } from "../../app/blog/[slug]/page";
import { BlogArticleView } from "../../app/blog/BlogViews";
import { articles, getArticle } from "../../app/blog/articles";

test("journal lists five guides and changes visible copy with the language control", async () => {
  const user = userEvent.setup();
  render(<BlogPage />);
  expect(screen.getByRole("heading", { name: "Agent work you can understand and control." })).toBeTruthy();
  const list = screen.getByRole("region", { name: "All articles" });
  expect(within(list).getAllByRole("link")).toHaveLength(5);
  await user.click(screen.getByRole("button", { name: "Switch to Russian" }));
  expect(screen.getByRole("heading", { name: "Работа агентов, которую можно понять и контролировать." })).toBeTruthy();
  expect(screen.getByRole("region", { name: "Все статьи" })).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Переключить на английский" }));
  expect(screen.getByRole("heading", { name: "All stories" })).toBeTruthy();
});

test("every article renders its own sections and screenshot in both languages", async () => {
  const user = userEvent.setup();
  for (const article of articles) {
    const view = render(<BlogArticleView article={article} />);
    expect(screen.getByRole("heading", { name: article.en.title })).toBeTruthy();
    expect(screen.getByText(article.en.closing)).toBeTruthy();
    expect(screen.getByRole("img", { name: article.en.screenshotCaption })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Switch to Russian" }));
    expect(screen.getByRole("heading", { name: article.ru.title })).toBeTruthy();
    expect(screen.getByText(article.ru.closing)).toBeTruthy();
    expect(screen.getByRole("img", { name: article.ru.screenshotCaption })).toBeTruthy();
    view.unmount();
    window.localStorage.clear();
  }
});

test("article routes and metadata resolve exact slugs and reject unknown ones", async () => {
  expect(generateStaticParams()).toEqual(articles.map(article => ({ slug: article.slug })));
  expect(getArticle("connect-iphone-with-qr")?.en.title).toMatch(/iPhone/);
  expect(getArticle("missing")).toBeUndefined();
  const metadata = await generateMetadata({ params: Promise.resolve({ slug: articles[0].slug }) });
  expect(metadata.alternates).toEqual({ canonical: `/blog/${articles[0].slug}` });
  expect(await generateMetadata({ params: Promise.resolve({ slug: "missing" }) })).toEqual({});
  render(await ArticlePage({ params: Promise.resolve({ slug: articles[0].slug }) }));
  expect(screen.getByRole("heading", { name: articles[0].en.title })).toBeTruthy();
  await expect(ArticlePage({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("not found");
});
