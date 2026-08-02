# GrantTap

**Step away from your Mac. Keep Codex and Claude Code moving.**

GrantTap is the secure iPhone and Apple Watch companion for coding-agent
sessions already running on your computer. Approve a command, answer a
question, inspect the latest task activity, or send the next turn without
starting a second agent or moving your project to another service.

<p align="center">
  <img src="public/product/iphone-command-center.png" width="220" alt="GrantTap Codex task list on iPhone">
  <img src="public/product/iphone-claude-tasks.png" width="220" alt="GrantTap Claude Code task list on iPhone">
  <img src="public/product/apple-watch-approval.png" width="185" alt="GrantTap command approval on Apple Watch">
</p>

The product site is live at [granttap.com](https://granttap.com). The iPhone
and Apple Watch apps are still being prepared for App Store review.

## One task, wherever you are

1. Codex or Claude Code keeps working in its normal local session.
2. When it needs a decision, GrantTap sends the encrypted event to your paired
   devices.
3. You approve, deny, reply by voice or text, or open the task for more context.
4. The response returns to the same local session.

On iPhone, each task exposes recent visible activity, full formatted chat,
attachments, agent access, context-window usage, Codex compaction, and allowed
MCP servers or project skills. Apple Watch keeps the fast path focused: active
and recent tasks, recent updates, voice replies, and approvals.

## Security boundary

GrantTap is a thin encrypted control channel, not a model proxy.

- Projects, model credentials, and model traffic remain on the computer.
- Pairing and task traffic are end-to-end encrypted.
- Each attached task has an independent key.
- The relay routes ciphertext and cannot decrypt task content.
- A device with access to one task cannot use that key to open another task.

See [SECURITY.md](SECURITY.md) for the exact boundary and relay-visible
metadata.

## Connect the public bridge

```bash
# Codex
codex mcp add granttap -- npx -y granttap-mcp

# Claude Code
claude mcp add granttap -- npx -y granttap-mcp

# Optional local approval hooks for both tools
npm install -g granttap-mcp
granttap-mcp connect
```

- [granttap-mcp on npm](https://www.npmjs.com/package/granttap-mcp)
- [MCP bridge source](https://github.com/sergii-ziborov/granttap-mcp)
- [Relay source](https://github.com/sergii-ziborov/granttap-relay)

## Develop the website

Node.js 22.13 or newer is required.

```bash
git clone https://github.com/sergii-ziborov/granttap-site.git
cd granttap-site
npm install
npm run dev
```

Validate a production build with:

```bash
npm test
npm run lint
```

The site uses React, vinext, and Cloudflare's Vite tooling. Production is
configured in `wrangler.production.jsonc`; `granttap.com` is the canonical
origin and `www` redirects permanently to it.

## Product-capture contract

The website and this README use captures from current test builds—not redrawn
or generated interface mockups. Keep a single language and matching time across
each capture set.

| Asset | Pixels | Contents |
| --- | ---: | --- |
| `public/product/iphone-command-center.png` | 1206 × 2622 | Codex task list and composer |
| `public/product/iphone-claude-tasks.png` | 1206 × 2622 | Claude Code task list, scheduler, and composer |
| `public/product/iphone-task-detail.png` | 1206 × 2622 | Recent activity, usage, and context |
| `public/product/iphone-mcp-usage.png` | 1206 × 2622 | Observed MCP and skill usage |
| `public/product/iphone-security-settings.png` | 1206 × 2622 | Face ID, notification privacy, task keys, and audit log |
| `public/product/apple-watch-inbox.png` | 416 × 496 | Pending approval and active-task inbox |
| `public/product/apple-watch-task.png` | 416 × 496 | Recent task updates and reply actions |
| `public/product/apple-watch-approval.png` | 416 × 496 | Real pending approval |

Do not add device frames, marketing text, or demo overlays to the PNG files;
the website supplies presentation framing and accessible captions.
Do not reuse a skeleton frame or an older Watch build merely to fill a slot.
Each device set must come from one reproducible current state; Watch may use a
different clock time because watchOS Simulator does not support status-bar time
overrides.

## Repository map

- `app/page.tsx` — product page and English/Russian copy
- `app/globals.css` — responsive presentation and product-capture motion
- `app/layout.tsx` — metadata and social preview
- `public/product/` — canonical real product captures
- `app/privacy/`, `app/terms/`, `app/support/`, `app/licenses/` — public policy pages
- `.openai/hosting.json` — Sites project binding
- `wrangler.production.jsonc` — canonical Cloudflare deployment

GrantTap is not affiliated with Anthropic, OpenAI, or Apple.
