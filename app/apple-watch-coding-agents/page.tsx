import type { Metadata } from "next";
import { CapabilityPage } from "../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Coding agents on Apple Watch",
  description: "See Needs You, approve, answer, and send short coding-agent turns from Apple Watch through the paired iPhone.",
  alternates: { canonical: "/apple-watch-coding-agents" },
};

export default function AppleWatchPage() {
  return <CapabilityPage
    eyebrow="Apple Watch companion"
    title="The wrist is for the decision, not the whole terminal."
    intro="GrantTap mirrors a bounded human-attention stream and current task state through the paired iPhone, so the watch stays fast and honest."
    status="Included with GrantTap Personal"
    facts={[
      { title: "One Needs You list", text: "Permissions, open questions, failed delivery, Mesh handoffs, conflicts, questions, and failures share one priority surface." },
      { title: "Act from the notification", text: "Approve or deny supported requests, continue a Mesh handoff, or dictate an answer to a Mesh question." },
      { title: "Current tasks", text: "See active and recent sessions with provider identity and short activity optimized for a glance." },
      { title: "Short continuation", text: "Reply to the current native task or start a supported voice task without pretending the watch is a terminal." },
    ]}
    limits={[
      "The watch has no relay socket; the paired iPhone authenticates, decrypts, and forwards state and actions.",
      "Conflicts and failures that need richer context explicitly ask you to open GrantTap on iPhone.",
      "Provider and computer confirmation—not a local tap animation—decides when a permission is truly resolved.",
    ]}
    related={[{ href: "/project-mesh", label: "Project Mesh" }, { href: "/agents/claude-code", label: "Claude Code" }, { href: "/agents/codex", label: "Codex" }]}
  />;
}
