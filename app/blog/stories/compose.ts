import type { ArticleText, BlogArticle } from "../articleTypes";
import { articleBodyWordCount } from "../longform/wordCount";

type StoryLocale = Pick<ArticleText, "title" | "summary" | "category" | "closing" | "sources" | "graphic"> & {
  body: string;
  screenshotCaption: string;
  illustrationCaption: string;
  additionalIllustrationCaption: string;
};

type StoryDraft = Pick<BlogArticle, "slug" | "date" | "cover" | "screenshot" | "inlineIllustration" | "additionalIllustration"> & {
  en: StoryLocale;
  ru: StoryLocale;
};

function prose(body: string): Pick<ArticleText, "intro" | "sections"> {
  const blocks = body.trim().split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
  const intro: string[] = [];
  const sections: ArticleText["sections"] = [];
  for (const block of blocks) {
    if (block.startsWith("## ")) sections.push({ heading: block.slice(3), paragraphs: [] });
    else if (sections.length) sections.at(-1)!.paragraphs.push(block.replace(/\s*\n\s*/g, " "));
    else intro.push(block.replace(/\s*\n\s*/g, " "));
  }
  if (intro.length < 2 || sections.length < 5 || sections.some(section => section.paragraphs.length < 2)) {
    throw new Error("Longform story needs two opening paragraphs and five developed sections");
  }
  return { intro, sections };
}

export function composeStory(draft: StoryDraft): BlogArticle {
  const { body: enBody, ...enFields } = draft.en;
  const { body: ruBody, ...ruFields } = draft.ru;
  const en: ArticleText = { ...enFields, ...prose(enBody) };
  const ru: ArticleText = { ...ruFields, ...prose(ruBody) };
  return {
    slug: draft.slug,
    date: draft.date,
    minutes: Math.ceil(Math.max(articleBodyWordCount(en), articleBodyWordCount(ru)) / 180),
    cover: draft.cover,
    generatedCover: true,
    screenshot: draft.screenshot,
    inlineIllustration: draft.inlineIllustration,
    additionalIllustration: draft.additionalIllustration,
    en, ru,
  };
}
