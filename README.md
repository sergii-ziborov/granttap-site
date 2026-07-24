# GrantTap website

Source for [granttap.com](https://granttap.com), the product site for GrantTap
on iPhone and Apple Watch.

| Sessions on iPhone | Activity on iPhone | Approval on Apple Watch |
| --- | --- | --- |
| ![GrantTap sessions](public/product/phone-sessions.png) | ![GrantTap activity](public/product/phone-activity.png) | ![GrantTap approval](public/product/watch-approval.png) |

The canonical product site explains the GrantTap workflow, security boundary,
MCP integration, phone/watch experience, and current App Store review status
using real screenshots from the app. English is the default; visitors can
switch the full site to Russian.

## Install the public MCP bridge

```bash
# Codex
codex mcp add granttap -- npx -y granttap-mcp

# Claude Code
claude mcp add granttap -- npx -y granttap-mcp

# Optional approval hooks for both tools
npm install -g granttap-mcp
granttap-mcp connect
```

- npm: [granttap-mcp](https://www.npmjs.com/package/granttap-mcp)
- Source: [sergii-ziborov/granttap-mcp](https://github.com/sergii-ziborov/granttap-mcp)
- Relay source: [sergii-ziborov/granttap-relay](https://github.com/sergii-ziborov/granttap-relay)

## Development

Requires Node.js 22.13 or newer.

```bash
git clone https://github.com/sergii-ziborov/granttap-site.git
cd granttap-site
npm install
npm run dev
```

Validate the production build with:

```bash
npm test
npm run lint
```

The app is built with React, vinext, and Cloudflare's Vite tooling. The
production Worker is configured by `wrangler.production.jsonc` and deployed
directly to the `granttap.com` custom domain:

```bash
npm run deploy:cloudflare
```

`granttap.com` is the only canonical origin. The former hosted service URL and
`www` are permanent redirects, so search engines see one site rather than
duplicate content.

## Content and assets

- Page content: `app/page.tsx`
- Global styles: `app/globals.css`
- Metadata: `app/layout.tsx`
- Product screenshots: `public/product/`
- Social preview: `public/og.png`
- Privacy: `app/privacy/`
- Terms: `app/terms/`
- Support: `app/support/`
- Licenses: `app/licenses/`

## Related

- MCP bridge: [sergii-ziborov/granttap-mcp](https://github.com/sergii-ziborov/granttap-mcp)
- npm package: [granttap-mcp](https://www.npmjs.com/package/granttap-mcp)
- Relay: [sergii-ziborov/granttap-relay](https://github.com/sergii-ziborov/granttap-relay)

GrantTap is not affiliated with Anthropic, OpenAI, or Apple.
