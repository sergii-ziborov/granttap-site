# GrantTap website

Source for [granttap.com](https://granttap.com), the product site for GrantTap
on iPhone and Apple Watch.

The site explains the GrantTap workflow, security boundary, MCP integration,
phone/watch experience, and current product status using real screenshots from
the app.

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

The app is built with React, vinext, and Cloudflare's Vite tooling. Deployment
metadata lives in `.openai/hosting.json`; it contains an opaque project ID, not
credentials or application secrets.

## Content and assets

- Page content: `app/page.tsx`
- Global styles: `app/globals.css`
- Metadata: `app/layout.tsx`
- Product screenshots: `public/product/`
- Social preview: `public/og.png`

## Related

- MCP bridge: [sergii-ziborov/granttap-mcp](https://github.com/sergii-ziborov/granttap-mcp)
- Relay: [sergii-ziborov/granttap-relay](https://github.com/sergii-ziborov/granttap-relay)

GrantTap is not affiliated with Anthropic, OpenAI, or Apple.
