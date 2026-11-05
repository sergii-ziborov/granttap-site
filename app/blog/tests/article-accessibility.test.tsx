import { render, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { BlogArticleView } from "../BlogViews";
import { articles } from "../articles";

it.each(["en", "ru"] as const)("exposes the %s sources as a named reading landmark", locale => {
  const article = articles.find(item => item[locale].sources?.length)!;
  const label = locale === "en" ? "Sources" : "Источники";
  const view = render(<BlogArticleView article={article} articles={articles} locale={locale} />);
  const sources = view.getByRole("region", { name: label });
  expect(within(sources).getByRole("heading", { name: label, level: 2 })).toBeTruthy();
  for (const source of article[locale].sources!) {
    expect(within(sources).getByRole("link", { name: `${source.label} ↗` }).getAttribute("href")).toBe(source.url);
  }
});
