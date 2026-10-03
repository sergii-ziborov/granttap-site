import type { ArticleText } from "../articleTypes";

export function articleBodyWordCount(article: ArticleText): number {
  const paragraphs = [...article.intro, ...article.sections.flatMap(section => section.paragraphs)];
  return paragraphs.join(" ").trim().split(/\s+/u).length;
}
