import type { Metadata } from "next";
import { CapabilityPage } from "../../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Cursor integration",
  description: "See Cursor tasks, continue supported local sessions, and inspect the controls available through GrantTap.",
  alternates: { canonical: "/agents/cursor" },
};

export default function CursorPage() {
  return <CapabilityPage
    eyebrow="Provider integration"
    title="Bring Cursor work into the same Task view."
    intro="See local Cursor work beside your other agents. GrantTap keeps root and child activity together, lets you continue supported sessions, and shows which controls the installed Cursor integration can actually enforce."
    status="Available with defined limits"
    facts={[
      { title: "Authenticate on this Mac", text: "Cursor Authenticate opens granttap.com/connect for coding-app approval. The GrantTap connection card in Cursor offers Add a device and Reconnect with a one-time QR; scan it in the phone app. Do not add GrantTap in Customize → MCPs." },
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
    related={[{ href: "/project-mesh", label: "Mesh" }, { href: "/agents/grok-build", label: "Grok Build" }, { href: "/support", label: "Setup help" }]}
  />;
}
