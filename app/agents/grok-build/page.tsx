import type { Metadata } from "next";
import { CapabilityPage } from "../../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Grok Build integration",
  description: "See Grok Build work and continue a native session when the installed local runtime supports it.",
  alternates: { canonical: "/agents/grok-build" },
};

export default function GrokBuildPage() {
  return <CapabilityPage
    eyebrow="Provider integration"
    title="Keep Grok Build work in view."
    intro="GrantTap brings visible Grok Build sessions into the shared Task view and offers follow-up where the installed local CLI supports it. Grok Bot remains a separate scoped Mesh endpoint."
    status="Available where the local runtime supports it"
    facts={[
      { title: "Authenticate", text: "After granttap setup, authenticate Grok Build. granttap.com/connect handles coding-app approval; the private device QR stays in the GrantTap connection card." },
      { title: "Honest discovery", text: "Visible Grok Build sessions can join the same provider-neutral task catalog." },
      { title: "Bounded continuation", text: "Where the installed CLI supports it, GrantTap can route a follow-up to the native session." },
      { title: "Shared presentation", text: "Computer, workspace, task state, and observed activity use the same truthful UI vocabulary." },
    ]}
    limits={[
      "Grok Build does not yet expose a trusted caller hook to GrantTap.",
      "Agent-authored scoped Mesh events are therefore not offered for Grok Build.",
      "GrantTap does not claim deterministic remote capability blocking or Claude/Codex handoff parity.",
    ]}
    related={[{ href: "/grok-bot", label: "Grok Bot" }, { href: "/project-mesh", label: "Mesh" }, { href: "/agents/cursor", label: "Cursor" }]}
  />;
}
