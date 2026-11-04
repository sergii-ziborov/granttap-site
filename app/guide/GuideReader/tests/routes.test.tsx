import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GuidePage from "../../page";
import GuideLayout from "../../layout";
import GuideChapter, { generateMetadata, generateStaticParams } from "../../[slug]/page";
import { GuideArticle } from "../Article";
import { guideCatalog } from "../../GuideContent/catalog";
import { guideContent } from "../../GuideContent";

describe("guide routes and authored rendering", () => {
  it("renders the entry point with all learning paths and its real product screenshots", () => {
    render(<GuideLayout><GuidePage /></GuideLayout>);
    expect(screen.getByRole("heading", { level: 1 }).textContent?.toLowerCase()).toContain("шаг за шагом");
    expect(screen.getByRole("link", { name: "Начать с первого подключения ↗" }).getAttribute("href")).toBe("/guide/quick-start");
    expect(screen.getAllByRole("img").length).toBeGreaterThan(3);
  });
  it("renders every chapter with working heading IDs and previous/next navigation", () => {
    for (const page of guideCatalog) {
      const view = render(<GuideArticle page={page} content={guideContent[page.slug]} />);
      expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(page.title);
      expect(screen.getByRole("navigation", { name: "Между главами" })).toBeTruthy();
      for (const link of view.container.querySelectorAll('a[href^="#"]')) {
        expect(view.container.querySelector(link.getAttribute("href")!)).not.toBeNull();
      }
      view.unmount();
    }
  });
  it("resolves known routes and metadata while rejecting unknown chapters", async () => {
    expect(generateStaticParams()).toEqual(guideCatalog.map(({ slug }) => ({ slug })));
    const params = Promise.resolve({ slug: "message-delivery" });
    expect((await generateMetadata({ params })).alternates?.canonical).toBe("/guide/message-delivery");
    render(await GuideChapter({ params }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Как доставляется сообщение");
    expect(await generateMetadata({ params: Promise.resolve({ slug: "missing" }) })).toEqual({});
    await expect(GuideChapter({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("not found");
  });
});
