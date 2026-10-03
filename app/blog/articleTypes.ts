export type BlogLocale = "en" | "ru";

export type ArticleText = {
  title: string;
  summary: string;
  category: string;
  intro: string[];
  sections: { heading: string; paragraphs: string[] }[];
  screenshotCaption?: string;
  illustrationCaption?: string;
  additionalIllustrationCaption?: string;
  closing: string;
  sources?: { label: string; url: string }[];
  graphic?: {
    title: string;
    caption: string;
    rows: { label: string; detail: string; value?: number }[];
  };
};

export type BlogArticle = {
  slug: string;
  date: string;
  minutes: number;
  cover: string;
  generatedCover?: boolean;
  screenshot?: string;
  inlineIllustration?: string;
  additionalIllustration?: string;
  en: ArticleText;
  ru: ArticleText;
};
