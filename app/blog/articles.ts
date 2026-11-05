import { practicalFiveStories } from "./stories/practical2026-five";
import { octoberNextFiveStories } from "./stories/october2026-next-five";
import { octoberBackfillStories } from "./stories/october2026-backfill";
import { novemberStories } from "./stories/november2026";
import { cortexResearch, meshResearch, governanceResearch } from "./stories/research";
import { taskTransferStory, waitingMessagesStory } from "./stories/october16";
import type { BlogArticle } from "./articleTypes";
import { extendArticle } from "./longform";
import { foundationGuides } from "./stories/foundation-guides";
import { granttapControl } from "./stories/granttap-control";
import { agentLandscape } from "./stories/agent-landscape";
import { governance } from "./stories/governance";
import { awsTelAviv } from "./stories/aws-tel-aviv";
import { cortexLoom } from "./stories/cortex-loom";
import { mobileWorkflowMap } from "./stories/mobile-workflow-map";
import { approvalBoundaries } from "./stories/approval-boundaries";
import { taskHandoffPaths } from "./stories/task-handoff-paths";
import { usageEvidence } from "./stories/usage-evidence";
import { localCloudBoundaries } from "./stories/local-cloud-boundaries";
import { iphoneClaudeCodex } from "./stories/iphone-claude-codex";
import { granttapMeshGovernance } from "./stories/granttap-mesh-governance";
import { microsoftAgent365Tools } from "./stories/microsoft-agent365-tools";
import { awsTemporalPolicy } from "./stories/aws-temporal-policy";
import { anthropicAgentSecurity } from "./stories/anthropic-agent-security";
export type { BlogArticle, BlogLocale } from "./articleTypes";


export const articles: BlogArticle[] = [
  ...novemberStories, ...octoberBackfillStories,
  ...octoberNextFiveStories,
  ...practicalFiveStories,
  taskTransferStory, waitingMessagesStory,
  cortexResearch, meshResearch, governanceResearch,
  iphoneClaudeCodex, granttapMeshGovernance, microsoftAgent365Tools, awsTemporalPolicy, anthropicAgentSecurity,
  localCloudBoundaries, usageEvidence, taskHandoffPaths, approvalBoundaries, mobileWorkflowMap,
  ...[cortexLoom, awsTelAviv, governance, agentLandscape, granttapControl, ...foundationGuides].map(extendArticle),
];

export function getArticle(slug: string) {
  return articles.find(article => article.slug === slug);
}
