import type { Metadata } from "next";
import type { Locale } from "../components/Locale";

export const siteOrigin = "https://granttap.com";
export type LocalizedText = { en: string; ru: string };
export type PublicPageProps = { searchParams?: Promise<{ lang?: string }> };

export async function pageLocale(props: PublicPageProps = {}): Promise<Locale> {
  return (await props.searchParams)?.lang === "ru" ? "ru" : "en";
}

export function localizedMetadata(path: string, locale: Locale, title: string, description: string,
  options: { bilingual?: boolean; image?: string; type?: "website" | "article" } = {}): Metadata {
  const bilingual = options.bilingual !== false;
  const canonical = bilingual && locale === "ru" ? `${path}?lang=ru` : path;
  const image = options.image || `/brand/share-${locale}.png`;
  const languages = bilingual ? { en: path, ru: `${path}?lang=ru`, "x-default": path }
    : { [locale]: path, "x-default": path };
  return {
    title, description,
    alternates: { canonical, languages },
    openGraph: { type: options.type || "website", url: canonical, siteName: "GrantTap", title, description,
      locale: locale === "ru" ? "ru_RU" : "en_US", alternateLocale: bilingual ? [locale === "ru" ? "en_US" : "ru_RU"] : undefined,
      images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function breadcrumbData(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({
    "@type": "ListItem", position: index + 1, name: item.name, item: siteOrigin + item.path,
  })) };
}
