import type { Metadata } from "next";
import { CapabilityPage } from "../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Mesh for coding-agent handoffs",
  description: "A Mesh can connect multiple repositories while Tasks keep their identity across agents and computers.",
  alternates: { canonical: "/project-mesh" },
};

export default function ProjectMeshPage() {
  return <CapabilityPage
    eyebrow="Mesh coordination"
    title="One Task can outlive one agent session."
    intro="A Mesh connects Tasks, people, computers, and repositories. One Mesh can link several repositories; a Task keeps its identity when an agent or computer changes. A provider chat is one execution conversation inside a Task."
    status="Available with provider-specific limits"
    facts={[
      { title: "Compact shared state", text: "Tasks carry status, dependencies, resource claims, explicit decisions, and remaining work—not hidden reasoning." },
      { title: "Human attention", text: "Product, security, destructive, unresolved conflict, and failed-handoff events reach Needs You on iPhone and Apple Watch." },
      { title: "Authenticated handoff", text: "Claude Code ↔ Codex handoffs use a bounded capsule, phone authorization, a separate target worktree, and a receipt." },
      { title: "Current ownership", text: "The Task route follows the current owner and never reopens a previous native execution after transfer." },
      { title: "Mesh Governance", text: "Skills, MCP servers, and shell are allowed, asked, or denied in a Mesh—for a kind or one named capability. Each computer reports its applied revision and enforcement coverage." },
      { title: "Observed usage", text: "Task and computer observations retain their source and coverage. Account quota, token usage, and sampled machine resources have different meanings and are not added into one cost figure." },
      { title: "Shared with people", text: "A Mesh is shared by a one-time invite with a role—Viewer, Member, or Admin. The current controller checks messages, pauses, handoffs, and releases before they reach a computer." },
      { title: "Company accounts and repositories", text: "A company account receives selected repository grants. A device also needs a separate Mesh invite and role before it can receive a Mesh's data or actions." },
      { title: "Computers of their own", text: "A member adds an allowed Mac or PC to a Mesh. Its claims are visible to other permitted computers and a Task can be handed to it." },
      { title: "Linked repositories", text: "A Mesh can bind several repositories. Separate Mesh spaces can share a repository without merging their access; Weavatrix relations provide code-dependency evidence." },
      { title: "Mesh memory", text: "A person can record a Task-bound decision through Engine Memory, then correct it while the old record remains in audit history." },
      { title: "Full-screen code views", text: "An available architecture report opens as a searchable graph. Health can open its observed repository code map as searchable code towers." },
      { title: "Pinned execution", text: "A Mesh can pin new Tasks to one confirmed computer. The display name is not a routing key. Models come from that host's catalog. Offline, Mesh refuses or queues until a deadline." },
      { title: "Claims released by the person", text: "A claim left behind by an agent that is gone is released from the Task screen. The computer answers, a refusal puts the claim back with its reason, and the release is written down so a late snapshot cannot undo it." },
      { title: "Reported at the end", text: "A Task can be exported as a PDF or CSV with available observations and their source. Missing history and sampled resource values remain identified as such." },
    ]}
    limits={[
      "A capsule carries committed facts, not files; uncommitted work blocks departure.",
      "GrantTap never pushes, fetches, merges, or resolves resource conflicts by itself.",
      "Cursor has scoped author attribution but no phase-one remote start. Grok Build has no trusted caller hook yet.",
      "A pin is not a secure VM. Isolation from a toggle is not claimed.",
      "Company repository grants mediate the owner's GrantTap forwarding; they do not change Git provider or filesystem ACLs. Previously delivered data cannot be recalled.",
      "MCP and skill requests do not yet carry a complete bundle to every host or prove native installation.",
      "Usage is observational. A strict spending cap and use-only secret broker are not available yet; agent process environment secrets are readable by that process.",
    ]}
    related={[{ href: "/agents/claude-code", label: "Claude Code" }, { href: "/agents/codex", label: "Codex" }, { href: "/grok-bot", label: "Grok Bot" }]}
  />;
}
