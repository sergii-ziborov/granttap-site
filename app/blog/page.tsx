import type { Metadata } from "next";
import { BlogIndex } from "./BlogViews";

export const metadata: Metadata = {
  title: "Journal",
  description: "Practical guides to GrantTap pairing, Project Mesh, Task continuity, architecture evidence, and governance.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <BlogIndex />;
}
