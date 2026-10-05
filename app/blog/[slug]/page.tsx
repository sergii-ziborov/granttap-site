import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleView } from "../BlogViews";
import { blogLocale } from "../locale";
import { publishedArticle, publishedArticles } from "../publication";

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
    alternates: { canonical, languages: { en: `/blog/${article.slug}`, ru: `/blog/${article.slug}?lang=ru` } },
    openGraph: { type: "article", publishedTime: article.date, title: copy.title, description: copy.summary, images: [{ url: article.cover, width: 1600, height: 900, alt: copy.title }] },
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
    datePublished: article.date,
    inLanguage: locale,
    author: { "@type": "Organization", name: "GrantTap" },
    publisher: { "@type": "Organization", name: "GrantTap", url: "https://granttap.com" },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <BlogArticleView article={article} articles={publishedArticles()} locale={locale} />
  </>;
}
