import { expect, test } from "vitest";
import { breadcrumbData, jsonLd, localizedMetadata, pageLocale } from "..";
import { metadataForPage, publicPageCopy } from "../pages";

test("Translated public pages have self canonicals, reciprocal language links and page-specific social URLs", async () => {
  for (const path of Object.keys(publicPageCopy)) for (const locale of ["en", "ru"] as const) {
    const data = await metadataForPage(path, { searchParams: Promise.resolve({ lang: locale }) });
    const url = path + (locale === "ru" ? "?lang=ru" : "");
    expect(data.alternates?.canonical).toBe(url); expect(data.alternates?.languages).toEqual({ en: path, ru: `${path}?lang=ru`, "x-default": path });
    expect(data.openGraph).toMatchObject({ url, locale: locale === "ru" ? "ru_RU" : "en_US", title: publicPageCopy[path].title[locale] });
    expect(data.twitter).toMatchObject({ card: "summary_large_image", images: [`/brand/share-${locale}.png`] });
  }
});
test("English-only content does not advertise a fabricated Russian translation", () => {
  const data = localizedMetadata("/agents/codex", "en", "Codex", "Current support", { bilingual: false });
  expect(data.alternates?.languages).toEqual({ en: "/agents/codex", "x-default": "/agents/codex" });
});
test("URL language is authoritative, JSON-LD escapes markup and breadcrumb links are absolute", async () => {
  expect(await pageLocale()).toBe("en"); expect(await pageLocale({ searchParams: Promise.resolve({ lang: "other" }) })).toBe("en");
  expect(await pageLocale({ searchParams: Promise.resolve({ lang: "ru" }) })).toBe("ru");
  expect(jsonLd({ title: "</script>" })).not.toContain("<");
  expect(breadcrumbData([{ name: "Home", path: "/" }]).itemListElement).toEqual([{ "@type": "ListItem", position: 1, name: "Home", item: "https://granttap.com/" }]);
});
