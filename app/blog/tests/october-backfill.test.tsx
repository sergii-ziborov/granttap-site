import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { octoberBackfillStories } from "../stories/october2026-backfill";
import { articleBodyWordCount } from "../longform/wordCount";
import { publishedArticles } from "../publication";
import { BlogArticleView } from "../BlogViews";
import { inlineStoryLinks } from "../InlineStoryLinks";
import provenance from "../../../docs/editorial/october2026-backfill/image-prompts.json";

describe("reviewed retrospective field guides", () => {
  it("fills exactly five October gaps with at least 2500 body words in each locale", () => {
    expect(octoberBackfillStories.map(article => article.date)).toEqual(["2026-10-25", "2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29"]);
    for (const article of octoberBackfillStories) {
      expect(article.reviewedOn).toBe("2026-11-05");
      expect(article.reviewedOn! > article.date).toBe(true);
      for (const locale of ["en", "ru"] as const) {
        expect(articleBodyWordCount(article[locale]), article.slug + ":" + locale).toBeGreaterThanOrEqual(2500);
        expect(article[locale].editorialNote).toContain(locale === "en" ? "editorial slot" : "редакционный слот");
      }
    }
    expect(publishedArticles(new Date("2026-11-05T12:00:00Z"))).toHaveLength(52);
    expect(publishedArticles(new Date("2026-11-08T12:00:00Z"))).toHaveLength(55);
  });
  it("ships fifteen distinct generated originals and verified web assets", () => {
    const paths = octoberBackfillStories.flatMap(article => [article.cover, article.inlineIllustration!, article.additionalIllustration!]);
    expect(new Set(paths).size).toBe(15);
    expect(provenance.images).toHaveLength(15);
    expect(new Set(provenance.images.map(item => item.sourceAssetId)).size).toBe(15);
    for (const path of paths) {
      const source = provenance.images.find(item => item.destination === "public" + path)!;
      expect(source, path).toBeDefined();
      const bytes = readFileSync("public" + path);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(source.webpSha256);
      expect(source.width / source.height).toBeGreaterThan(1.7);
    }
  });
  it("shows the honest review date and preserves source anchors in Russian links", () => {
    render(<BlogArticleView article={octoberBackfillStories[0]} articles={octoberBackfillStories} locale="ru" />);
    const notice = screen.getByText("Проверено 2026-11-05");
    expect(notice.closest(".blog-prose")).not.toBeNull();
    expect(notice.closest(".reading-rail")).toBeNull();
    expect(screen.getByText(/Материал подготовлен и проверен 5 ноября/)).toBeTruthy();
    const view = render(<div>{inlineStoryLinks("[Ресурсы](/guide/transcript-sources#resources)", "ru")}</div>);
    expect(view.getByRole("link", { name: "Ресурсы" }).getAttribute("href")).toBe("/guide/transcript-sources#resources");
  });
});
