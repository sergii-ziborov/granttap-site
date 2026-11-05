import type { Metadata } from "next";
import { jsonLd, breadcrumbData, localizedMetadata } from "../../SearchMetadata";
import { articleBodyWordCount } from "../longform/wordCount";
import { notFound } from "next/navigation";
import { BlogArticleView } from "../BlogViews";
import { blogLocale } from "../locale";
import { publishedArticle, publishedArticles, articlePublicationDate } from "../publication";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ lang?: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = searchParams ? await searchParams : {};
  const article = publishedArticle(slug);
  if (!article) return {};
  const locale = blogLocale(lang);
  const copy = article[locale];
  const canonical = locale === "ru" ? `/blog/${article.slug}?lang=ru` : `/blog/${article.slug}`;
  return {
    title: copy.title,
    description: copy.summary,
    alternates: { canonical, languages: { en: `/blog/${article.slug}`, ru: `/blog/${article.slug}?lang=ru`, "x-default": `/blog/${article.slug}` } },
    openGraph: { ...localizedMetadata(`/blog/${article.slug}`, locale, copy.title, copy.summary).openGraph, type: "article", url: canonical, publishedTime: articlePublicationDate(article), modifiedTime: article.reviewedOn || articlePublicationDate(article), title: copy.title, description: copy.summary, images: [{ url: article.cover, width: 1600, height: 900, alt: copy.title }] },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.summary, images: [article.cover] },
  };
}

export default async function ArticlePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const article = publishedArticle(slug);
  if (!article) notFound();
  const locale = blogLocale(lang);
  const copy = article[locale];
  const pageUrl = `https://granttap.com/blog/${article.slug}${locale === "ru" ? "?lang=ru" : ""}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: copy.title,
    description: copy.summary,
    image: `https://granttap.com${article.cover}`,
    datePublished: articlePublicationDate(article),
    dateModified: article.reviewedOn || articlePublicationDate(article),
    inLanguage: locale,
    author: { "@type": "Organization", name: "GrantTap", url: "https://granttap.com/about" },
    articleSection: copy.category, wordCount: articleBodyWordCount(copy), isAccessibleForFree: true,
    timeRequired: `PT${article.minutes}M`, url: pageUrl,
    publisher: { "@type": "Organization", name: "GrantTap", url: "https://granttap.com",
      logo: { "@type": "ImageObject", url: "https://granttap.com/brand/apple-touch-icon.png", width: 180, height: 180 } },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbData([
      { name: locale === "ru" ? "Главная" : "Home", path: locale === "ru" ? "/?lang=ru" : "/" },
      { name: locale === "ru" ? "Журнал" : "Journal", path: locale === "ru" ? "/blog?lang=ru" : "/blog" },
      { name: copy.title, path: `/blog/${article.slug}${locale === "ru" ? "?lang=ru" : ""}` },
    ])) }} />
    <BlogArticleView article={article} articles={publishedArticles()} locale={locale} />
  </>;
}
