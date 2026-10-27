# GrantTap user guide

Public routes: `/guide` and `/guide/[slug]`. The guide is Russian, with actual
English UI labels where useful. `GuideContent` owns the chapter catalog and
authored Markdown; `GuideReader` renders the safe content dialect; `GuideNavigation`
owns chapter navigation and browser-local full-text search.

The guide distinguishes the native app, local MCP runtime, optional Engine,
coding provider and ciphertext relay. Receipt stages never imply another stage.
The observed “about 30 seconds” is not a measured average or delivery guarantee.

All product figures are real captures on deterministic sample work. Their public
manifest under `public/guide/screens` retains date, build, language, dimensions and
SHA-256. The Mac figures explicitly show an older build. Screens are not AI mockups
or evidence that the sample actions ran against a live provider.

`public/guide/lab` is a dependency-free educational Node project, available as a
ZIP for the complete walkthrough. It contains no network calls or credentials.
The in-app Demo shown in figures and the user's own Lab are separate examples.

## Authoring

Add metadata in `GuideContent/catalog.ts`, Markdown in `GuideContent/articles`,
and the corresponding raw import in `GuideContent/index.ts`. Headings use stable
ASCII anchors: `## Heading {#anchor}`. Links target `/guide/slug#anchor`.

Supported blocks: paragraphs, ordered/unordered lists, tables, fenced code,
`:::note`, `:::tip`, `:::warning`, `:::check`, `:::exercise`, and the single-line
`:::capture id` / `:::diagram id` directives. Raw HTML is treated as text;
unsafe URL schemes are not rendered as links.

Checks exercise body-text search, precise section links, safe rendering, keyboard
and modal behavior, complete content links and real screenshot files. The site
retains its normal typecheck, coverage, build and rendered-HTML gates.
