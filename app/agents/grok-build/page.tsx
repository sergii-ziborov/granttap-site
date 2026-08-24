import type { Metadata } from "next";
import { CapabilityPage } from "../../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Grok Build Experimental integration",
  description: "The exact Experimental visibility and continuation boundary for Grok Build in GrantTap.",
  alternates: { canonical: "/agents/grok-build" },
};

export default function GrokBuildPage() {
  return <CapabilityPage
    eyebrow="Provider integration"
    title="Grok Build is Experimental—not fake parity."
    intro="GrantTap includes Grok Build where its local runtime exposes durable session behavior, while clearly separating that integration from the scoped Grok Bot endpoint."
    status="Experimental where available"
    facts={[
      { title: "Honest discovery", text: "Visible Grok Build sessions can join the same provider-neutral task catalog." },
      { title: "Bounded continuation", text: "Where the installed CLI supports it, GrantTap can route a follow-up to the native session." },
      { title: "Shared presentation", text: "Computer, workspace, task state, and observed activity use the same truthful UI vocabulary." },
    ]}
    limits={[
      "Grok Build does not yet expose a trusted caller hook to GrantTap.",
      "Agent-authored scoped Project Mesh events are therefore not offered for Grok Build.",
      "GrantTap does not claim deterministic remote capability blocking or Claude/Codex handoff parity.",
    ]}
    related={[{ href: "/grok-bot", label: "Grok Bot" }, { href: "/project-mesh", label: "Project Mesh" }, { href: "/agents/cursor", label: "Cursor Beta" }]}
  />;
}
