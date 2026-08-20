# Public site styles

`../globals.css` is the stable entry point imported by the application layout.
It composes small, purpose-named style modules from this directory.

- `foundation.css` — design tokens, reset, navigation, and hero typography.
- `device-previews.css` — iPhone, Watch, approval, and animation previews.
- `commerce.css` — trust, pricing, install, and support links.
- `legal.css` — shared privacy, terms, support, and accessibility documents.
- `workflow.css` — workflow and activity sections.
- `controls.css` — capability controls and the security diagram.
- `gallery.css` — screenshots, availability, and footer.
- `responsive-*.css` — breakpoint-specific layout changes.
- `accessibility.css` — narrow-screen and reduced-motion behavior.

Rendered behavior is covered by `../../tests/rendered-html.test.mjs`; `npm test`
also performs a production build so malformed imports fail before publishing.
