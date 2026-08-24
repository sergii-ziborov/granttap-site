import type { Metadata } from "next";
import { CapabilityPage } from "../../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Claude Code on iPhone and Apple Watch",
  description: "See, approve, continue, and hand off local Claude Code tasks with GrantTap Personal.",
  alternates: { canonical: "/agents/claude-code" },
};

export default function ClaudeCodePage() {
  return <CapabilityPage
    eyebrow="Primary integration"
    title="Claude Code, visible beyond the terminal."
    intro="GrantTap follows your local Claude Code sessions across linked computers and brings the moments that need a human to iPhone and Apple Watch."
    status="Primary"
    facts={[
      { title: "Live task state", text: "See the computer, workspace, model, context pressure, and latest useful activity." },
      { title: "Authenticated decisions", text: "Allow or deny native permission requests from iPhone notifications or Apple Watch." },
      { title: "Continue locally", text: "Send the next bounded turn back to the same native session without copying its transcript to GrantTap." },
      { title: "Project Mesh", text: "A trusted Claude hook can publish execution-scoped progress, questions, claims, and handoff requests." },
    ]}
    limits={[
      "Claude Code remains the execution environment; GrantTap is not a model proxy or remote terminal.",
      "Provider controls and the computer's own policy remain authoritative.",
      "A Task handoff moves bounded committed facts, not hidden reasoning or an entire transcript.",
    ]}
    related={[{ href: "/project-mesh", label: "Project Mesh" }, { href: "/apple-watch-coding-agents", label: "Apple Watch" }, { href: "/agents/codex", label: "Codex" }]}
  />;
}
