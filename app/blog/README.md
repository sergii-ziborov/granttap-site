# Bilingual journal

`BlogViews.tsx` is the public entry for article and journal presentation.
`articles.ts` supplies the released content; `publication.ts` applies the
Jerusalem publication calendar. Each article keeps its language, named heading,
inline links, illustrated context, product captures, sources and related reading.

The sources section is a named reading landmark in both languages, allowing
assistive technology to reach its heading and links directly. Local tests live
in `tests/`; `tests/coverage/blog.test.tsx` verifies the complete bilingual set
with the same aggregate deadline and assertions, scoped to each rendered article.
