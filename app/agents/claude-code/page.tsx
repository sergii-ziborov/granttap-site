import { localizedMetadata } from "../../SearchMetadata";
import { CapabilityPage } from "../../components/CapabilityPage";

export const metadata = localizedMetadata("/agents/claude-code", "en", "Claude Code on iPhone and Apple Watch", "See, approve, continue, and hand off local Claude Code tasks with GrantTap Personal.", { bilingual: false });

export default function ClaudeCodePage() {
  return <CapabilityPage
    eyebrow="Primary integration"
    title="Claude Code, visible beyond the terminal."
    intro="GrantTap follows your local Claude Code sessions across linked computers and brings the moments that need a human to iPhone and Apple Watch."
    status="Primary"
    facts={[
      { title: "Authenticate", text: "Open GrantTap in Claude and authenticate. granttap.com/connect shows this computer and its phones. Do not ask Claude to print a pairing QR in chat." },
      { title: "Live task state", text: "See the computer, workspace, model, context pressure, and latest useful activity." },
      { title: "Authenticated decisions", text: "Allow or deny native permission requests from iPhone notifications or Apple Watch." },
      { title: "Continue locally", text: "Send the next bounded turn back to the same native session while preserving the selected conversation identity. Visible history can be cached on your controller." },
      { title: "Devices, login and updates", text: "Inspect the selected computer’s CLI and MCP versions, complete a supported sign-in flow, and update the tool through its supported installer. A mobile continuation reaches an already open desktop session through unread journal context on its next supported prompt hook, not instant in-memory synchronization." },
      { title: "Mesh", text: "A trusted Claude hook can publish execution-scoped progress, questions, claims, and handoff requests." },
    ]}
    limits={[
      "Claude Code remains the execution environment; GrantTap is not a model proxy or remote terminal.",
      "Provider controls and the computer's own policy remain authoritative.",
      "A Task handoff moves bounded committed facts, not hidden reasoning or an entire transcript.",
    ]}
    related={[{ href: "/guide/providers", label: "Provider behavior guide (RU)" }, { href: "/guide/provider-sign-in", label: "Provider sign-in guide (RU)" }, { href: "/project-mesh", label: "Mesh" }, { href: "/apple-watch-coding-agents", label: "Apple Watch" }, { href: "/agents/codex", label: "Codex" }]}
  />;
}
