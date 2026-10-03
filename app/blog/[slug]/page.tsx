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
  const copy = article[blogLocale(lang)];
  return {
    title: copy.title,
    description: copy.summary,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: { type: "article", publishedTime: article.date, title: copy.title, description: copy.summary, images: [{ url: article.cover, width: 1600, height: 900, alt: copy.title }] },
  };
}

export default async function ArticlePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const article = publishedArticle(slug);
  if (!article) notFound();
  return <BlogArticleView article={article} articles={publishedArticles()} locale={blogLocale(lang)} />;
}
