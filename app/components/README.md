# Site components

`HomeView.tsx` composes the server-rendered landing page from `app/homeCopy.ts`.
`SiteChrome.tsx` owns the navigation, locale links, and footer shared by the
landing page, journal, legal and capability pages, and account flows.
`ReadingGrid.tsx` gives articles, legal documents, and capability guides the
same content and sidebar columns within the shared page width.
`MeshExplainer.tsx` and `DesktopShowcase.tsx` present product concepts on the
landing page; their generated art is labeled as conceptual rather than a
product capture. `EditorialArt.tsx` shares that image and caption treatment
between About, Security, Support, and Mesh guides.
`LegalPage.tsx` owns legal document content. `Locale.tsx` manages language on
interactive flows. Components contain no release plans or internal roadmap content.

Rendered-route assertions live in `tests/rendered-html.test.mjs`.
