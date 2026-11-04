import { readFile, writeFile } from 'node:fs/promises';
import { guideCatalog } from '../../app/guide/GuideContent/catalog.ts';
import { buildSearchIndex } from '../../app/guide/GuideNavigation/search.ts';

// Authored public prose only. Load on demand instead of serializing the whole
// handbook into every chapter's initial RSC/HTML response.
const pages = await Promise.all(guideCatalog.map(async page => ({ ...page,
  content: await readFile(new URL(`../../app/guide/GuideContent/articles/${page.slug}.md`, import.meta.url), 'utf8'),
})));
const entries = buildSearchIndex(pages);
await writeFile(new URL('../../public/guide/search-index.json', import.meta.url), JSON.stringify(entries));
console.log(`Guide search: ${guideCatalog.length} chapters, ${entries.length} sections`);
