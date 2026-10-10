import type { BlogArticle } from "./articleTypes";

const editorialPaths: Record<string, string[]> = {
  "cortex-loom-inside-granttap-token-economy": ["project-mesh-memory-handoff-less-duplicate-work", "granttap-governance-native-enforcement-research", "cortex-loom-evidence-per-token"],
  "project-mesh-memory-handoff-less-duplicate-work": ["cortex-loom-inside-granttap-token-economy", "granttap-governance-native-enforcement-research", "task-continuity-beyond-an-agent-session"],
  "granttap-governance-native-enforcement-research": ["project-mesh-memory-handoff-less-duplicate-work", "cortex-loom-inside-granttap-token-economy", "mcp-skills-and-governance-status"],
  "control-claude-code-codex-iphone-granttap": ["connect-iphone-with-qr", "task-continuity-across-agents", "granttap-mesh-governance-allow-ask-deny-local-agents"],
  "granttap-mesh-governance-allow-ask-deny-local-agents": ["governance-that-reaches-the-computer", "mcp-skills-and-governance-status", "microsoft-agent-365-mcp-tool-governance-september-2026"],
  "microsoft-agent-365-mcp-tool-governance-september-2026": ["granttap-mesh-governance-allow-ask-deny-local-agents", "mcp-skills-and-governance-status", "aws-agentcore-temporal-policy-agent-security-2026"],
  "aws-agentcore-temporal-policy-agent-security-2026": ["agent-approvals-at-the-execution-boundary", "granttap-mesh-governance-allow-ask-deny-local-agents", "anthropic-agent-security-incident-lessons-local-coding-agents"],
  "anthropic-agent-security-incident-lessons-local-coding-agents": ["local-cloud-hybrid-agent-boundaries", "agent-approvals-at-the-execution-boundary", "aws-agentcore-temporal-policy-agent-security-2026"],
  "governance-that-reaches-the-computer": ["granttap-mesh-governance-allow-ask-deny-local-agents", "microsoft-agent-365-mcp-tool-governance-september-2026"],
  "agent-approvals-at-the-execution-boundary": ["granttap-mesh-governance-allow-ask-deny-local-agents", "aws-agentcore-temporal-policy-agent-security-2026"],
  "connect-iphone-with-qr": ["control-claude-code-codex-iphone-granttap", "task-continuity-across-agents"],
  "mcp-skills-and-governance-status": ["granttap-mesh-governance-allow-ask-deny-local-agents", "microsoft-agent-365-mcp-tool-governance-september-2026"],
};

export function relatedArticles(article: BlogArticle, articles: BlogArticle[]): BlogArticle[] {
  const preferred = editorialPaths[article.slug] ?? [];
  const candidates = [
    ...preferred,
    ...articles.filter(other => other.slug !== article.slug && other.en.category === article.en.category).map(other => other.slug),
    ...articles.filter(other => other.slug !== article.slug).map(other => other.slug),
  ];
  return [...new Set(candidates)].slice(0, 3).map(slug => articles.find(other => other.slug === slug)!).filter(Boolean);
}
