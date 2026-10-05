# Site components

`HomeView.tsx` composes the server-rendered landing page from `app/homeCopy.ts`.
`SiteChrome.tsx` owns the navigation, locale links, and footer shared by the
landing page, journal, legal and capability pages, and account flows.
`ReadingGrid.tsx` gives articles, legal documents, and capability guides the
same content and sidebar columns within the shared page width.
`LegalPage.tsx` owns legal document content. `Locale.tsx` manages language on
interactive flows. Components contain no release plans or internal roadmap content.

Rendered-route assertions live in `tests/rendered-html.test.mjs`.
