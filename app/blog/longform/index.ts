import type { BlogArticle } from "../articleTypes";
import type { ArticleExtension } from "./types";
import { connectExtension } from "./connect";
import { continuityExtension } from "./continuity";
import { linkedExtension } from "./linked";
import { architectureExtension } from "./architecture";
import { capabilityExtension } from "./capability";
import { controlExtension } from "./control";
import { landscapeExtension } from "./landscape";
import { governanceExtension } from "./governance";
import { summitExtension } from "./summit";
import { cortexExtension } from "./cortex";
import { articleBodyWordCount } from "./wordCount";

const extensions: Record<string, ArticleExtension> = {
  "connect-iphone-with-qr": connectExtension,
  "task-continuity-across-agents": continuityExtension,
  "linked-projects-without-merging-access": linkedExtension,
  "architecture-graph-with-evidence": architectureExtension,
  "mcp-skills-and-governance-status": capabilityExtension,
  "why-granttap-is-a-control-center": controlExtension,
  "coding-agents-on-your-phone-2026": landscapeExtension,
  "governance-that-reaches-the-computer": governanceExtension,
  "aws-summit-tel-aviv-agentic-systems": summitExtension,
  "cortex-loom-evidence-per-token": cortexExtension,
};

export function extendArticle(article: BlogArticle): BlogArticle {
  const extra = extensions[article.slug];
  if (!extra) throw new Error(`Missing longform article: ${article.slug}`);
  const en = {
    ...article.en,
    illustrationCaption: article.en.illustrationCaption ?? extra.en.firstCaption,
    additionalIllustrationCaption: extra.en.secondCaption,
    sections: [...article.en.sections, ...extra.en.sections],
  };
  const ru = {
    ...article.ru,
    illustrationCaption: article.ru.illustrationCaption ?? extra.ru.firstCaption,
    additionalIllustrationCaption: extra.ru.secondCaption,
    sections: [...article.ru.sections, ...extra.ru.sections],
  };
  return {
    ...article,
    minutes: Math.ceil(Math.max(articleBodyWordCount(en), articleBodyWordCount(ru)) / 180),
    inlineIllustration: article.inlineIllustration ?? extra.images.first,
    additionalIllustration: extra.images.second,
    en, ru,
  };
}
