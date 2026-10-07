# GrantTap

> **All your coding agents. One live control center.**

GrantTap brings local coding work into one clear view across Mac, iPhone, iPad,
and Apple Watch. See what needs your attention, decide from the right device,
and return to the same Task without losing its history when an agent session or
computer changes.

[Explore the product](https://granttap.com) · [See GrantTap for Mac](https://granttap.com/mac) · [Read the journal](https://granttap.com/blog) ·
[See availability](https://granttap.com/#availability) · [Get help](https://granttap.com/support)

## See. Decide. Continue.

- **See the work.** Now brings urgent decisions, active Tasks, and recent progress
  together. Open a Task for its conversation, computer, agent, and latest useful
  activity.
- **Decide with context.** Answer a question, review an approval, or retry a
  failed delivery on iPhone or Apple Watch. The decision stays attached to the
  Task and its execution.
- **Continue where it belongs.** Follow the same Task across supported local
  Claude Code and Codex sessions. Cursor and Grok Build can join the shared
  view where their installed integrations expose the needed behavior.
- **Set the rules once.** Mesh Governance lets you allow, ask, or deny skills,
  MCP servers, and shell access for a Mesh. Linked computers report whether
  they applied those rules.

## The real app

| Now on iPhone | Task conversation | Usage |
| --- | --- | --- |
| ![GrantTap Now, with urgent and active work](public/product/iphone-command-center.png) | ![GrantTap Task conversation and composer](public/product/iphone-chat.png) | ![GrantTap Usage screen](public/product/iphone-mcp-usage.png) |

| Now on Mac | Task conversation on Mac |
| --- | --- |
| ![GrantTap Now on Mac](public/product/mac-now.jpg) | ![GrantTap Task conversation on Mac](public/product/mac-task.jpg) |

These are captures of the GrantTap app using deterministic sample work; no
private task, repository, pairing key, or customer data appears in them. The
[product page](https://granttap.com) also shows Mesh and Apple Watch screens;
the [Mac page](https://granttap.com/mac) shows five SwiftUI captures.

## Account Mesh and Project Mesh

A passkey creates or joins an Account Mesh on the relay before any computer is
connected. Its **Devices** view lists computers by their user-assigned names;
one account can contain many computers and Project Meshes. The same passkey in
the Mac app or MCP connection card joins the existing account. Each computer
running GrantTap MCP contributes its own encrypted connection and Task catalog;
the phone combines those catalogs without changing the computer route of any
Task. A registered computer may be online in the account before its secure
chat link is ready on the phone. Project Meshes remain separate project scopes.

QR remains a direct device-pairing option without an account. The Mac App Store
app needs the separately installed local helper to show agent work; installing
the app alone still lets you join the Account Mesh.

## One Project Mesh for connected work

A Mesh brings a project's repositories, people, computers, and access rules
into one scope. A **Task** holds one goal and its visible history. An
**Execution** is one agent session doing part of that work. That separation
makes a handoff understandable: the Task continues while the provider or
computer may change.

Mesh also keeps dependencies, resource claims, questions, and bounded handoff
records close to the Task. It shares compact state, not private hidden
reasoning. [See how Mesh works](https://granttap.com/project-mesh).

Sharing remains explicit. A company account can grant selected repository IDs;
a device separately receives access to selected Mesh spaces and a role. A Mesh
invitation does not change Git provider permissions.

## Install

```bash
# Codex plugin
codex plugin marketplace add sergii-ziborov/granttap-mcp
codex plugin add granttap@granttap

# Claude Code plugin
claude plugin marketplace add sergii-ziborov/granttap-mcp
claude plugin install granttap@granttap

# Background helper and provider hooks
npm install -g granttap-mcp
granttap setup
```

## Connect your devices

1. Open **Devices** in the iPhone, iPad, or Mac app and sign in with a passkey.
   This opens the Account Mesh even if there are no computers yet.
2. Install the local helper and run `granttap setup`. In the MCP connection
   card, use the same passkey to link that computer to your Account Mesh.
3. Open Now to see active work and decisions. For a direct device link instead,
   choose **Add a device** in the connection card and scan its one-time QR.

A GrantTap account passkey is optional. QR pairing works without an account;
passkey sign-in can also approve a coding-app connection on a Mac with the local
bridge. Joining the Account Mesh and approving a coding app are different
steps. [Connection
help](https://granttap.com/support) walks through both.

## Explore GrantTap

- [Journal](https://granttap.com/blog) — twenty sourced, illustrated stories in
  English and Russian. Every story has a real GrantTap interface capture and
  explains where a product claim can be verified.
- [Agent security briefings](https://granttap.com/blog/microsoft-agent-365-mcp-tool-governance-september-2026) — original analysis of
  recent Microsoft, AWS, and Anthropic announcements, with the exact local
  boundary GrantTap covers and links to the primary reports.
- [Mesh](https://granttap.com/project-mesh) — how connected work keeps one Task
  identity across supported executions.
- [GrantTap for Mac](https://granttap.com/mac) — Mac screens, local helper
  connection, passkey and QR paths, and release availability.
- [Security](https://granttap.com/security) — what stays local and what the
  encrypted relay can see.
- [Pricing and availability](https://granttap.com/pricing) — current Personal
  tiers and the status of the Mac release.

The iPhone app is currently available through TestFlight by invitation while
GrantTap 1.0 addresses App Review feedback. A one-time Mac license is being prepared; its
price and availability are determined by the App Store purchase sheet. The
website distinguishes those release states from working product paths.

## Source and license

This repository contains the public website source under the [GrantTap
Commercial Source License](LICENSE). Production deployment and redistribution
under that license require a commercial grant. Earlier MIT releases keep their
original permissions. The [MCP runtime](https://github.com/sergii-ziborov/granttap-mcp)
is MIT licensed; the [ciphertext relay](https://github.com/sergii-ziborov/granttap-relay)
has its own license.

<details>
<summary>Development and deployment notes</summary>

Node.js 22.13 or newer is required.

```bash
npm install
npm run typecheck
npm test
npm run lint
```

Live granttap.com uses the Hetzner compose stack. The website runs as `site`;
`/connect`, `/api/connect`, and `/api/account` use `web` and retain the
persistent `account_data` volume. `wrangler.production.jsonc` is legacy
Cloudflare configuration and is not the live deployment target. Site-only copy
changes rebuild only the `site` service.

Product captures under `public/product/` use deterministic sample data, never
private pairing material or customer Tasks. The iPhone and Mac screens were
recaptured from the SwiftUI clients on 2026-10-08. Older graph and code-tower captures
are explicitly marked as fixtures and do not claim a live repository scan.
Generated editorial images in `public/visuals/` and the journal are captioned
as illustrations rather than product captures.

The Mac client source and its end-user license are in the
[GrantTap Apple repository](https://github.com/sergii-ziborov/granttap).

</details>
