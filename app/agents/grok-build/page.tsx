import type { Metadata } from "next";
import { CapabilityPage } from "../../components/CapabilityPage";

export const metadata: Metadata = {
  title: "Grok Build integration",
  description: "Follow Grok Build conversations from Mac, iPhone, and iPad, and send the next request back to the same local session.",
  alternates: { canonical: "/agents/grok-build" },
};

export default function GrokBuildPage() {
  return <CapabilityPage
    eyebrow="Provider integration"
    title="Keep Grok Build work in view."
    intro="Grok Build is part of your GrantTap workspace. Follow its conversation from Mac, iPhone, or iPad, see which computer owns the work, and send the next request back to the same native session. Your installed Grok CLI runs the work using its existing sign-in."
    status="Available where the local runtime supports it"
    facts={[
      { title: "Connect your computer", text: "Install GrantTap MCP with granttap setup, and sign in to Grok Build on that computer. Open GrantTap and connect through your Account Mesh or the private device QR in the connection card. Installing the Mac app alone does not install Grok or the local helper." },
      { title: "See your Grok conversations", text: "Local Grok sessions join the Task catalog with their workspace, computer, and reported model. Open a Task to read visible requests and answers, including conversations saved in Grok's current history format." },
      { title: "Continue the same session", text: "Send a follow-up from GrantTap. The helper resumes the selected native Grok session on its owning computer, and its answer returns to the Task conversation. That computer must be available and the installed CLI must support continuation." },
      { title: "Keep provider context", text: "Grok works alongside Claude Code, Codex, and Cursor in one control center. Each execution keeps its provider and computer identity; opening another provider does not silently move a Grok conversation." },
      { title: "Keep private reasoning private", text: "The timeline shows visible conversation content. It excludes hidden reasoning, system instructions, and synthetic reminders. Device traffic uses GrantTap's encrypted connection; model requests still go through your local Grok installation." },
      { title: "Use Grok Bot separately", text: "Want a bot to participate in a Project Mesh? Grok Bot is a separate invitation-based endpoint with scoped access and revocation. Connecting a local Grok Build session does not automatically invite a bot into your Mesh." },
    ]}
    limits={[
      "The GrantTap integration does not currently have a trusted caller hook for Grok Build. Agent-authored scoped Mesh events are not offered through this local integration.",
      "GrantTap does not claim deterministic remote capability blocking or Claude/Codex handoff parity.",
      "Grok authentication, model availability, usage limits, and model charges belong to your Grok account. A GrantTap subscription does not include Grok model access.",
      "Only activity actually exposed by the installed integration is shown. A missing usage measurement is unknown, not proof that a tool was unused.",
    ]}
    related={[{ href: "/connect", label: "Connect a computer" }, { href: "/grok-bot", label: "Grok Bot" }, { href: "/project-mesh", label: "Mesh" }, { href: "/agents/cursor", label: "Cursor" }]}
  />;
}
