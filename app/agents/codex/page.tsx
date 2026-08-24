import type { Metadata } from "next";
import { CapabilityPage } from "../../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Codex on iPhone and Apple Watch",
  description: "See, approve, continue, and hand off local Codex tasks with GrantTap Personal.",
  alternates: { canonical: "/agents/codex" },
};

export default function CodexPage() {
  return <CapabilityPage
    eyebrow="Primary integration"
    title="Codex tasks, connected to the same human."
    intro="GrantTap keeps local Codex sessions visible across your computers and routes exact permission and task decisions to your Apple devices."
    status="Primary"
    facts={[
      { title: "Live task catalog", text: "See active and recent Codex work with its real computer, workspace, model, and context state." },
      { title: "Permission hooks", text: "Trusted Codex hooks enforce configured local policy and route unresolved decisions to the phone." },
      { title: "Native continuation", text: "Reply to the same Codex session from iPhone or send a short turn from Apple Watch." },
      { title: "Project Mesh", text: "Codex can author scoped Mesh events and receive an authorized handoff in a separate worktree." },
    ]}
    limits={[
      "Both installed GrantTap hooks must be reviewed and trusted in Codex before enforcement is considered ready.",
      "GrantTap does not broaden Codex approval policy or silently push and fetch Git state.",
      "Uncommitted work blocks a commit-based handoff instead of being left behind.",
    ]}
    related={[{ href: "/project-mesh", label: "Project Mesh" }, { href: "/apple-watch-coding-agents", label: "Apple Watch" }, { href: "/agents/claude-code", label: "Claude Code" }]}
  />;
}
