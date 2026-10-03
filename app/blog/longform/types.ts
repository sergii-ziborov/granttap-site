import type { ArticleText } from "../articleTypes";

export type ArticleExtension = {
  images: { first?: string; second: string };
  en: { sections: ArticleText["sections"]; firstCaption?: string; secondCaption: string };
  ru: { sections: ArticleText["sections"]; firstCaption?: string; secondCaption: string };
};
