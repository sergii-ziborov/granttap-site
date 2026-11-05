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
  editorialNote?: string;
  practice?: { title: string; intro: string; steps: { title: string; detail: string; code?: string }[] };
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
  reviewedOn?: string;
  /** Actual page publication; date remains the requested archive slot. */
  publishedOn?: string;
  minutes: number;
  cover: string;
  generatedCover?: boolean;
  screenshot?: string;
  inlineIllustration?: string;
  additionalIllustration?: string;
  en: ArticleText;
  ru: ArticleText;
};
