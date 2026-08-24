import type { Metadata } from "next";
import { CapabilityPage } from "../../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Cursor Beta integration",
  description: "See and continue Cursor tasks with GrantTap's honest Beta capability boundary.",
  alternates: { canonical: "/agents/cursor" },
};

export default function CursorPage() {
  return <CapabilityPage
    eyebrow="Provider integration"
    title="Cursor support, labeled Beta on purpose."
    intro="GrantTap reads the durable local Cursor state that is actually available, keeps root and child work together, and uses Cursor's supported hook surfaces."
    status="Beta"
    facts={[
      { title: "Session visibility", text: "Cursor composer tasks, child agents, activity, and observed capability usage appear in the shared task catalog." },
      { title: "Continuation", text: "GrantTap uses Cursor's persisted native session identifier for bounded follow-up turns." },
      { title: "Local policy", text: "Shell and MCP hooks can route or block exact calls when Cursor exposes deterministic correlation." },
      { title: "Scoped Mesh authoring", text: "The trusted MCP hook can attribute supported Mesh calls to the calling Cursor execution." },
    ]}
    limits={[
      "Cursor must authorize GrantTap's persistent local MCP connection after setup.",
      "The first remote-start handoff path is Claude Code ↔ Codex; Cursor does not claim that parity yet.",
      "Where Cursor cannot deterministically enforce a capability, GrantTap reports observation rather than a false block guarantee.",
    ]}
    related={[{ href: "/project-mesh", label: "Project Mesh" }, { href: "/agents/grok-build", label: "Grok Build" }, { href: "/support", label: "Setup help" }]}
  />;
}
