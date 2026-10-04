import type { Metadata } from "next";
import { HomeView } from "./components/HomeView";
import { copy } from "./homeCopy";

export const dynamic = "force-dynamic";

type HomeParams = { searchParams: Promise<{ lang?: string }> };

export async function generateMetadata({ searchParams }: HomeParams): Promise<Metadata> {
  const { lang } = await searchParams;
  if (lang !== "ru") return { alternates: { canonical: "/", languages: { en: "/", ru: "/?lang=ru" } } };
  const title = "GrantTap — Все coding-агенты. Один центр управления.";
  const description = "Управляйте локальными задачами Claude Code, Codex, Cursor и Grok Build с Mac, iPhone, iPad и Apple Watch.";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/?lang=ru", languages: { en: "/", ru: "/?lang=ru" } },
    openGraph: { type: "website", url: "/?lang=ru", siteName: "GrantTap", title, description,
      images: [{ url: "/product/iphone-command-center.png?v=20260828-1", width: 1320, height: 2868,
        alt: "Экран текущей задачи GrantTap на iPhone." }] },
    twitter: { card: "summary_large_image", title, description,
      images: ["/product/iphone-command-center.png?v=20260828-1"] },
  };
}

export default async function Home({ searchParams }: HomeParams) {
  const { lang } = await searchParams;
  const locale = lang === "ru" ? "ru" : "en";
  return <HomeView locale={locale} t={copy[locale]} />;
}
