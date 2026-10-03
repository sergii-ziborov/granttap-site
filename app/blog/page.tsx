import type { Metadata } from "next";
import { BlogIndex } from "./BlogViews";
import { publishedArticles, publicationDay } from "./publication";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description: "GrantTap Journal: product thinking, agent governance, coding tools, repository evidence, and practical guides.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogIndex articles={publishedArticles()} scheduleActive={publicationDay() < "2026-10-31"} />;
}
