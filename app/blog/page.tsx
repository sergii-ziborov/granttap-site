import type { Metadata } from "next";
import { BlogIndex } from "./BlogViews";
import { blogLocale } from "./locale";
import { publishedArticles, publicationDay } from "./publication";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const { lang } = await searchParams;
  return blogLocale(lang) === "ru"
    ? { title: "Журнал", description: "GrantTap Journal: продукт, управление агентами, инструменты разработки и практические руководства.", alternates: { canonical: "/blog" } }
    : { title: "Journal", description: "GrantTap Journal: product thinking, agent governance, coding tools, repository evidence, and practical guides.", alternates: { canonical: "/blog" } };
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <BlogIndex articles={publishedArticles()} scheduleActive={publicationDay() < "2026-10-31"} locale={blogLocale(lang)} />;
}
