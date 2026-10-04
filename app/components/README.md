# Site components

`HomeView.tsx` composes the server-rendered landing page from `app/homeCopy.ts`.
`SiteChrome.tsx` owns the navigation, locale links, and footer shared by the
landing page, journal, legal and capability pages, and account flows.
`LegalPage.tsx` owns legal document content. `Locale.tsx` manages language on
interactive flows. Components contain no release plans or internal roadmap content.

Rendered-route assertions live in `tests/rendered-html.test.mjs`.
