import type { Metadata } from "next";
import { CapabilityPage } from "../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Project Mesh for coding-agent handoffs",
  description: "Stable Project and Task identity, scoped agent coordination, and human-authorized handoffs without transcript replication.",
  alternates: { canonical: "/project-mesh" },
};

export default function ProjectMeshPage() {
  return <CapabilityPage
    eyebrow="Project coordination"
    title="One Task can outlive one agent session."
    intro="Project Mesh adds stable Project and Task identity above provider-native chats. Agents exchange bounded facts, while ownership changes remain explicit and visible to the human."
    status="Available with provider-specific limits"
    facts={[
      { title: "Compact shared state", text: "Tasks carry status, dependencies, resource claims, explicit decisions, and remaining work—not hidden reasoning." },
      { title: "Human attention", text: "Product, security, destructive, unresolved conflict, and failed-handoff events reach Needs You on iPhone and Apple Watch." },
      { title: "Authenticated handoff", text: "Claude Code ↔ Codex handoffs use a bounded capsule, phone authorization, a separate target worktree, and a receipt." },
      { title: "Current ownership", text: "The Task route follows the current owner and never reopens a previous native execution after transfer." },
      { title: "Project Governance", text: "Skills, MCP servers, and shell are allowed, asked, or denied per Project—for a kind or one named capability—and every computer applies the same revision." },
      { title: "Cost by computer", text: "Calls, tokens, processor time, and peak memory are reported per task, per computer, and per Project, and each figure opens the call it came from." },
    ]}
    limits={[
      "A capsule carries committed facts, not files; uncommitted work blocks departure.",
      "GrantTap never pushes, fetches, merges, or resolves resource conflicts by itself.",
      "Cursor has scoped author attribution but no phase-one remote start. Grok Build has no trusted caller hook yet.",
    ]}
    related={[{ href: "/agents/claude-code", label: "Claude Code" }, { href: "/agents/codex", label: "Codex" }, { href: "/grok-bot", label: "Grok Bot" }]}
  />;
}
