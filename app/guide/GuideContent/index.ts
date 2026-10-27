import { guideCatalog } from "./catalog";
import { buildSearchIndex } from "../GuideNavigation/search";
import chapter0 from "./articles/quick-start.md?raw";
import chapter1 from "./articles/installation.md?raw";
import chapter2 from "./articles/pairing.md?raw";
import chapter3 from "./articles/mac-app.md?raw";
import chapter4 from "./articles/demo-project.md?raw";
import chapter5 from "./articles/walkthrough.md?raw";
import chapter6 from "./articles/new-task.md?raw";
import chapter7 from "./articles/now-tasks.md?raw";
import chapter8 from "./articles/task-execution.md?raw";
import chapter9 from "./articles/chat.md?raw";
import chapter10 from "./articles/questions-approvals.md?raw";
import chapter11 from "./articles/files-voice.md?raw";
import chapter12 from "./articles/message-delivery.md?raw";
import chapter13 from "./articles/message-queue.md?raw";
import chapter14 from "./articles/notifications.md?raw";
import chapter15 from "./articles/providers.md?raw";
import chapter16 from "./articles/mesh-projects.md?raw";
import chapter17 from "./articles/handoff.md?raw";
import chapter18 from "./articles/delegation.md?raw";
import chapter19 from "./articles/knowledge-context.md?raw";
import chapter20 from "./articles/engine.md?raw";
import chapter21 from "./articles/graph-health.md?raw";
import chapter22 from "./articles/governance.md?raw";
import chapter23 from "./articles/skills-mcp-shell.md?raw";
import chapter24 from "./articles/capability-setup.md?raw";
import chapter25 from "./articles/members.md?raw";
import chapter26 from "./articles/audit-evidence.md?raw";
import chapter27 from "./articles/security.md?raw";
import chapter28 from "./articles/usage-reports.md?raw";
import chapter29 from "./articles/devices-watch.md?raw";
import chapter30 from "./articles/offline-storage.md?raw";
import chapter31 from "./articles/account-recovery.md?raw";
import chapter32 from "./articles/updates.md?raw";
import chapter33 from "./articles/self-hosted.md?raw";
import chapter34 from "./articles/limits.md?raw";
import chapter35 from "./articles/troubleshooting.md?raw";
import restrictions from "./articles/restrictions.md?raw";
import projectConfiguration from "./articles/project-configuration.md?raw";
import chapter36 from "./articles/glossary.md?raw";

export const guideContent: Record<string, string> = {
  "quick-start": chapter0,
  "installation": chapter1,
  "pairing": chapter2,
  "mac-app": chapter3,
  "demo-project": chapter4,
  "walkthrough": chapter5,
  "new-task": chapter6,
  "now-tasks": chapter7,
  "task-execution": chapter8,
  "chat": chapter9,
  "questions-approvals": chapter10,
  "files-voice": chapter11,
  "message-delivery": chapter12,
  "message-queue": chapter13,
  "notifications": chapter14,
  "providers": chapter15,
  "mesh-projects": chapter16,
  "handoff": chapter17,
  "delegation": chapter18,
  "knowledge-context": chapter19,
  "project-configuration": projectConfiguration,
  "restrictions": restrictions,
  "engine": chapter20,
  "graph-health": chapter21,
  "governance": chapter22,
  "skills-mcp-shell": chapter23,
  "capability-setup": chapter24,
  "members": chapter25,
  "audit-evidence": chapter26,
  "security": chapter27,
  "usage-reports": chapter28,
  "devices-watch": chapter29,
  "offline-storage": chapter30,
  "account-recovery": chapter31,
  "updates": chapter32,
  "self-hosted": chapter33,
  "limits": chapter34,
  "troubleshooting": chapter35,
  "glossary": chapter36,
};

export const guideSearchIndex = buildSearchIndex(guideCatalog.map(page => ({ ...page, content: guideContent[page.slug] })));
