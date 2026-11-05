import type { Metadata } from "next";
import { BlogIndex } from "./BlogViews";
import { blogLocale } from "./locale";
import { publishedArticles, articlePublicationDate } from "./publication";
import { localizedMetadata, jsonLd, siteOrigin } from "../SearchMetadata";

export const dynamic = "force-dynamic";
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
  const locale = blogLocale((await searchParams).lang);
  return { ...localizedMetadata("/blog", locale,
    locale === "ru" ? "Практические статьи об ИИ и coding-агентах" : "Practical AI and coding-agent guides",
    locale === "ru" ? "Подробные руководства GrantTap: Claude Code, Codex, MCP, доставка сообщений, проверка кода и управление агентами. Источники, примеры и реальные экраны." : "Detailed GrantTap guides to Claude Code, Codex, MCP, message delivery, code review and agent control. Primary sources, practical examples and real screens."),
    alternates: { canonical: locale === "ru" ? "/blog?lang=ru" : "/blog",
      languages: { en: "/blog", ru: "/blog?lang=ru", "x-default": "/blog" },
      types: { "application/rss+xml": `/blog/feed.xml${locale === "ru" ? "?lang=ru" : ""}` } } };
}
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = blogLocale((await searchParams).lang);
  const articles = publishedArticles();
  const data = { "@context": "https://schema.org", "@type": "Blog", name: "GrantTap Journal",
    url: `${siteOrigin}/blog${locale === "ru" ? "?lang=ru" : ""}`, inLanguage: locale,
    publisher: { "@type": "Organization", name: "GrantTap", url: siteOrigin },
    blogPost: articles.map(article => ({ "@type": "BlogPosting", headline: article[locale].title,
      url: `${siteOrigin}/blog/${article.slug}${locale === "ru" ? "?lang=ru" : ""}`, datePublished: articlePublicationDate(article) })) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} /><BlogIndex articles={articles} locale={locale} /></>;
}
