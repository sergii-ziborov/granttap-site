import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guideCatalog } from "../GuideContent/catalog";
import { guideContent } from "../GuideContent";
import { GuideShell } from "../GuideNavigation";
import { GuideArticle } from "../GuideReader/Article";
import { localizedMetadata } from "../../SearchMetadata";

export function generateStaticParams() { return guideCatalog.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const page = guideCatalog.find(item => item.slug === slug);
  return page ? localizedMetadata(`/guide/${slug}`, "ru", page.title, page.summary, { bilingual: false }) : {};
}

export default async function GuideChapter({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const page = guideCatalog.find(item => item.slug === slug);
  if (!page || !guideContent[slug]) notFound();
  return <GuideShell current={slug}><GuideArticle page={page} content={guideContent[slug]} /></GuideShell>;
}
