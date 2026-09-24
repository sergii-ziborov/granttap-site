import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "../articles";
import { BlogArticleView } from "../BlogViews";

export function generateStaticParams() {
  return articles.map(article => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.en.title,
    description: article.en.summary,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: { type: "article", title: article.en.title, description: article.en.summary, images: [{ url: article.cover, width: 1600, height: 900, alt: article.en.title }] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return <BlogArticleView article={article} />;
}
