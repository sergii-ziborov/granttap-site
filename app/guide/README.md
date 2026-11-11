# GrantTap user guide

Public entry: https://granttap.com/guide (Russian). Updated 11 November 2026.

50 chapters cover setup, Tasks/Executions, delivery and recovery, native questions,
Files/Agents, existing Codex automations, searchable workspaces and handoff,
Mesh/Knowledge/Engine/Graph/Health, governance, devices, provider sign-in/updates,
cache, browser control, privacy and recovery. The coverage chapter records limits.

The guide uses the site's SiteHeader/SiteFooter and graphite/orange visual system,
with a local light theme, mobile navigation, per-chapter contents, full-text search,
keyboard access, screenshot enlargement and a downloadable practice project.
Authored Markdown supports explicit anchors, tables, callouts, code, captures and
three interactive diagrams. It never executes authored HTML.

38 real screenshot files have SHA-256, build, date, locale and scenario in
GuideContent/screenshots.json. 20 are build 250 Simulator captures from isolated
native demo/UI fixtures. Earlier iPhone 230 and Mac 181 captures retain their
actual provenance; they are never relabelled as new. Device versions, codes and
measurements in fixtures are examples. Separate ImageGen art is labelled as art.
Do not replace a product screenshot with an AI-drawn imitation.

Behavior source basis: native 3a7a6fcf (build 273, in App Review), MCP f2363b2 (0.8.165 on npm),
and the website revision containing this file. Captures do not establish live
provider authentication, successful user-project transfer or physical-device QA.
Native bundled Learn content is exported with `npm run guide:export -- --apple-root /path/to/apple`. This snapshot documents current CLI queue behavior without promising mid-turn steering. License and purchase instructions link to the canonical full legal documents.

## Maintain

- Add authored chapters to GuideContent/catalog.ts and GuideContent/index.ts.
- Preserve explicit anchors and cross-links. Add captures to screenshots.json
  with hashes of the unchanged original bytes and truthful fixture captions.
- `npm run build` generates public/guide/search-index.json. It is ignored in Git,
  included in production assets, and fetched only after the search is opened.
- `npx vitest run app/guide` checks content, source-image integrity, search,
  route rendering, keyboard navigation, theme sync and the screenshot dialog.
- `npm test` builds and exercises every production chapter, anchors, canonical
  URLs, 404 handling, the generated search index and the practice archive.
- `node scripts/qa/guide-browser.mjs URL OUTPUT_DIR` checks a running production
  build at 1440×1000 and 390×844 and captures visual evidence. Requires Chrome;
  CHROME_PATH can select another local Chromium executable.

See docs/guide/2026-11-04 for the release's source and capture evidence.
