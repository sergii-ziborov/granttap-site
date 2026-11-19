export const body = String.raw`
GrantTap for iPhone and iPad is on the App Store. Version 1.0 was approved and published on November 13, 2026, and version 1.0.1 followed on November 15. The app is a free download. It connects to the coding agents that already run on your own computers, so you can see what they are doing, answer their questions, approve or deny the actions they ask about, and send the next instruction while you are away from the keyboard.

This article is a practical introduction for developers who have not tried GrantTap yet, and a change list for those who used the TestFlight builds. It covers what the app does and does not do, how the computer side is installed, what the plans cost, and what changed in 1.0.1. The Mac app is a separate story: version 1.0.1 for Mac was submitted to App Review on November 15 and, until Apple publishes it, is available by TestFlight invitation.

## What GrantTap is for

A coding agent spends a lot of its time waiting for you. It asks whether it may run a command, wants a decision between two approaches, or finishes a step and stops until someone reads the result. If you are at the desk, that wait is a few seconds. If you are in a meeting, on a train or making dinner, the agent sits idle for an hour, and the work you expected to come back to has not moved.

GrantTap puts those moments on your phone. The agents keep running where they always ran: Claude Code, Codex, Cursor or Grok Build on your Mac, Linux workstation or other computer, with your repositories, your provider accounts and your local tools. The phone is a controller. It shows the conversation, the questions and the approval requests, and it carries your answers back to the computer that asked.

That split matters for how you think about the product. GrantTap does not run models, does not host your code and does not sell AI tokens. Your Claude, OpenAI, Cursor or xAI account keeps its own plan, limits and terms. What GrantTap adds is a live view across your computers and a way to act on it, with the decision attached to the exact request and the exact Task it belongs to.

The integrations are not equally deep, and the app says so. Claude Code and Codex are the primary routes, with observation, questions, approvals and continuing a conversation from the phone. Cursor is marked Beta. For Grok Build, GrantTap shows local conversations and can send a follow-up to the same native session through the installed Grok CLI, but it does not claim the same blocking control. The [provider guides](/agents/claude-code) list what each route supports.

## Now, Tasks and Mesh

The app has three main places, and each answers a different question. Now answers "what needs me right now". At the top is Needs You: questions, approvals and failed deliveries that cannot move without a person. Below that come groups such as At Risk, Working, Open, Blocked and Recently Finished. A card shows the title, the project, the agent and computer that own the work, and its current state. A New reply mark appears when the agent answered after you last opened that chat on this phone.

Tasks is where you find the work itself. A Task is one goal with its history. An Execution is one agent session doing part of that goal on one computer. The distinction exists because work moves: a Task can start in Claude Code on a laptop and continue in Codex on a workstation, and the Task keeps its identity and history while the executions change. Opening a Task gives you the conversation, the files it changed, nested agent conversations and the controls that apply to it.

Mesh groups work by project. A Mesh brings together a project's repositories, the computers they live on, the people who share it and the rules that apply to its agents. A Mesh appears after an agent works in a repository on a connected computer, so you do not have to create one by hand. From a Mesh you can start a new Task, see which repositories and computers belong to it, and set Governance rules that allow, ask about or deny skills, MCP servers and shell access. We wrote a separate guide to [working with Mesh across repositories and computers](/blog/granttap-mesh-repositories-computers).

An Apple Watch companion works through the paired iPhone. It is meant for a glance, a decision, a short reply or a new voice task, not for reading long diffs.

## How your data travels

The phone and your computers talk through a relay, and native iPhone and Apple Watch traffic is end-to-end encrypted. The relay routes ciphertext. It sees bounded routing metadata, expiry and wake signals, but not your prompts, your agents' answers, your commands or your code. Pairing keys and per-task keys stay on the devices that are allowed to decrypt.

Provider credentials never leave your computer. When Claude Code needs you to sign in again, the sign-in happens on the computer, in the provider's own flow. GrantTap can bring that browser page to your phone when nobody is at the computer, which is one of the 1.0.1 changes described below, but it does not store or replay your provider login.

This design has a practical consequence: the computer has to be reachable for work to happen. If the Mac is asleep, a message you send waits. The relay can hold a queued message until the computer comes back, and the delivery line in the chat tells you whether the message was saved on the relay, received by the computer or answered by the agent. Those are three separate facts, and the app keeps them separate so that a spinner never pretends to be progress. The [security page](/security) describes the boundary in more detail.

## Getting started

The setup has two halves: the app on your phone and a small helper on each computer where agents run.

Install GrantTap from the [App Store](https://apps.apple.com/app/id6809739366) on iPhone or iPad. Open Devices and sign in. The app offers one sign-in choice of passkey, QR code or password. A passkey creates or joins your Account Mesh, the personal network of your devices and computers, even before any computer is connected.

On the computer, you need Node.js 22.13 or newer. Open your usual terminal and install the helper from npm, then run setup. The commands are in the setup box at the top of this article. The first command installs the granttap-mcp package and its CLI. Running granttap setup detects the coding agents installed on that computer, installs or repairs the hooks that GrantTap owns, and prepares the background helper and the MCP service. It changes local configuration, so run it on the computer you want to control, under your own user.

Then add GrantTap to the coding app you use. For Claude Code and Codex there are plugins in the GrantTap marketplace; Cursor uses the reviewed GrantTap listing in Cursor Marketplace; Grok Build has its own plugin commands. The [installation chapter of the guide](/guide/installation) lists each one. In the MCP connection card, sign in with the same passkey to link this computer to your Account Mesh. If you prefer a direct link between one computer and one phone without an account, the connection card also offers Add a device with a one-time QR code.

Two coding apps ask for one more confirmation. In Claude Code, open /mcp, choose GrantTap and complete Authenticate if the app asks for it; the /granttap:granttap-connect command then shows the connection. Codex may ask you to trust the exact GrantTap hooks: review them in GrantTap Settings → This Mac → Codex hooks or in Codex's own /hooks view, rather than allowing all hooks globally. Both steps authorize the coding app to use the local MCP. Pairing the phone is a separate step, and authorizing Claude Code does not sign you in to the Account Mesh.

When the computer is linked, granttap status prints a read-only summary of pairing, the helper and each integration, and its Next line names the next step if something is missing. Open Now on the phone, start a small task on the computer, and watch it appear. A safe first exercise is to ask the agent to explain a README without changing files, then answer one of its questions from the phone.

If you would rather look around before connecting a real repository, the app has a built-in Demo with sample work. It shows the screens on an example and runs nothing on your computers. When you are ready for real work, set up a separate practice repository with a small README: it is a convenient place to try questions, approvals and message delivery without risking a working branch.

## Plans and the free trial

The app is free to download. Using the managed service with your computers requires a subscription, sold through Apple inside the iPhone and iPad app. There are three monthly plans in the United States: Personal at $4.99 a month for up to 2 computers, Personal Plus at $7.99 for up to 5, and Fleet at $13.99 for up to 15. Every plan has the same features; the plans differ only in how many computers can publish agent work through the managed service.

A computer here means one stable machine where agents run and publish their work. Several agents and many projects on that machine do not use extra seats. iPhones, iPads, Apple Watch and a Mac used only as a controller do not count as computers. Fleet is a larger personal allowance, not a team license or an enterprise agreement.

Eligible new subscribers get a 7-day free trial when Apple offers it. Apple decides eligibility, and the purchase sheet shows whether you qualify, along with the local price in your country. Subscriptions renew monthly until cancelled in Apple's subscription settings; there are no annual plans. Cancelling does not delete local history or downloaded chats.

Mac Local is separate. It is a one-time purchase of $39.99 inside GrantTap for Mac, for people who want local control and their own relay instead of the managed service. It does not require a Personal subscription, and an active Personal plan already covers the Mac app as a managed client, so you do not need both. Because Mac Local is bought in the Mac app, it follows the Mac app's availability. The [pricing page](/pricing) has the full terms.

## What 1.0.1 added

Version 1.0.1 (build 289) was submitted on November 14 and published on November 15. These are the changes most people will notice.

The message queue was redesigned. When an agent is busy, you can line up the next messages, and each queued message is now a card that shows its own state, such as Queued for this task, Delivering or Held. You can edit a queued message, move it up or down or drag it, and hold the whole queue without stopping the agent. Deliver now on a card releases that message at once, and the button answers the tap immediately. The [queue chapter](/guide/message-queue) explains the states.

Sign-in can now happen from the chat. When a command on your computer needs a browser sign-in, an agent can send that page to your phone (this needs MCP 0.8.170 or later). In 1.0.1 the request appears as a card in the chat that sent it, with a notification, and opens in the in-app browser. If a message was refused because a provider login had expired, it is sent again after you sign in, so you do not have to retype it.

Subscription limits became more precise. A limit that applies to only one model is shown under that model's name and counted in the composer's limit ring only while the chat uses that model. An older reading shows its age instead of disappearing. A chat that is waiting on a limit, or on its own background work, now has its own color, and the automatic continuation after a limit resets can be turned off per chat. We cover this in detail in [working with agents that hit subscription limits](/blog/granttap-subscription-limits-auto-continue).

Mesh got search, filters and an archive. You can search Meshes by name, repository or computer, filter by state and computer, archive a Mesh you no longer need in the main list, and delete one from the phone. Now can be filtered by agent. A new Task can start from a Mesh or from a plain folder in one form.

Helper runs stopped cluttering the lists. When a chat asks for a picture, image generation scripts often start their own short headless agent session. With MCP 0.8.175 or later, that run appears under the chat that started it, labelled as image generation, with the pictures it made, instead of as a separate chat and a separate Mesh.

Smaller changes: hold a message to quote or forward it; files named in messages open in a preview; typing is faster in long chats; camera photos are attached at about 1800 pixels; and a computer the phone is still checking is shown as being checked rather than offline.

## Keeping the computer side current

The app and the computer helper update separately. The App Store updates the app. The helper is an npm package, and its version decides several of the behaviors above: sign-in requests need 0.8.170, per-model Claude limits need 0.8.172, image generation runs under their chat need 0.8.175. The computer's MCP version is shown in Devices, which also offers Check for MCP update and Restart MCP. From MCP 0.8.173, an update can be taken while chats keep running, and newly queued phone messages are held for up to ten minutes during the restart.

If a feature described here does not appear, check both versions before anything else: the app's build number in About, and the computer's MCP version in Devices or with granttap --version. A normal update does not require granttap reset, deleting history or re-pairing.

## Where to read more

The [GrantTap for iPhone page](/iphone) shows real screens captured with sample data. The [complete guide](/guide) covers every screen, with chapters on pairing, Devices, provider sign-in, the queue, Mesh and troubleshooting. If something does not work, the [support page](/support) lists the information to collect before writing to us: the app build, the MCP version, the time, and the stage at which a message stopped.

If you want to try GrantTap for Mac before Apple publishes it, request a TestFlight invitation through the same support page. In TestFlight, local control and your own relay need no purchase; the GrantTap relay needs a subscription there too, with the same free trial, and Apple does not charge for purchases made in TestFlight. The Mac app joins the same Account Mesh with the same passkey.
`;
