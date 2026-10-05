import type { Metadata } from "next";
import { CapabilityPage } from "../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Grok Bot as a scoped Mesh participant",
  description: "Connect a persistent Grok Bot endpoint with explicit Mesh, actor, operation, and expiry scope.",
  alternates: { canonical: "/grok-bot" },
};

export default function GrokBotPage() {
  return <CapabilityPage
    eyebrow="Scoped Mesh endpoint"
    title="Grok Bot is a participant, not a provider shortcut."
    intro="A persistent Grok Bot endpoint joins only the Mesh spaces and operations you choose. It has its own identity and trust path, separate from the Grok Build integration."
    status="Explicit invitation required"
    facts={[
      { title: "Phone-issued invite", text: "The iPhone creates a one-time encrypted invite scoped to selected Mesh spaces." },
      { title: "Trusted redemption", text: "A human redeems the invite with the local GrantTap CLI; the model-callable MCP cannot create or widen it." },
      { title: "Actor controls", text: "Each call rechecks endpoint status, policy revision, expiry, actor, chat scope, and allowed operation." },
      { title: "Immediate revocation", text: "Disabling or revoking the endpoint on iPhone stops new Mesh operations while local Task history remains." },
    ]}
    limits={[
      "Grok Bot cannot create invites, choose a relay, run setup, or expand its own chat scope.",
      "The endpoint can read and write only its bounded task-scoped Mesh operations.",
      "A compromised authorized endpoint can read the Tasks whose keys it was explicitly granted.",
    ]}
    related={[{ href: "/project-mesh", label: "Mesh" }, { href: "/agents/grok-build", label: "Grok Build" }, { href: "/security", label: "Security boundary" }]}
  />;
}
