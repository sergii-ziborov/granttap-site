import type { Metadata } from "next";
import { CapabilityPage } from "../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Project Mesh for coding-agent handoffs",
  description: "Stable Project and Task identity, scoped agent coordination, Projects shared with people by role, and human-authorized handoffs without transcript replication.",
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
      { title: "Project Governance", text: "Skills, MCP servers, and shell are allowed, asked, or denied per Project—for a kind or one named capability. Each computer reports its applied revision and enforcement coverage." },
      { title: "Cost by computer", text: "Calls, tokens, processor time, and peak memory are reported per task, per computer, and per Project, and each figure opens the call it came from." },
      { title: "Shared with people", text: "A Project is shared by a one-time invite with a role—Viewer, Member, or Admin. The owner's phone stays the hub and checks every message, pause, handoff, and release before it reaches a computer; a refusal names the rule that stopped it." },
      { title: "Company accounts and repositories", text: "An owner-managed account receives selected or all repository IDs. Its phone or tablet can receive a one-time device code before any computer or Project exists. Project Mesh access and a role are granted separately; the owner's phone requires both grants before forwarding a whole Project snapshot or action." },
      { title: "Computers of their own", text: "A member adds their own Mac or PC to the Project. Its chats join the mesh, its claims are seen by every other computer, and a Task can be handed to it." },
      { title: "Linked Projects", text: "Repository bindings can group related Projects without merging their access. Only an evidenced Weavatrix relation is presented as a code dependency." },
      { title: "Project Knowledge", text: "A person can record a Task-bound decision through Engine Memory, then correct it while the old record remains in audit history. The phone waits for an Engine-confirmed result." },
      { title: "Full-screen code views", text: "An available architecture report opens as a searchable graph. Health can open its observed repository code map as searchable code towers." },
      { title: "Pinned execution", text: "A Project can pin new tasks to one confirmed computer. The display name is not a routing key. Models come from that host's catalog. Offline, the Project refuses or queues until a deadline — it does not silently pick another machine." },
      { title: "Claims released by the person", text: "A claim left behind by an agent that is gone is released from the Task screen. The computer answers, a refusal puts the claim back with its reason, and the release is written down so a late snapshot cannot undo it." },
      { title: "Reported at the end", text: "A Task is exported as a PDF to read or a CSV with every table: tokens, tool calls, wrong turns, processor time, peak memory, and wall time, by tool and by execution." },
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
