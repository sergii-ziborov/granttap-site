import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';

const base = process.argv[2] || 'http://127.0.0.1:3216';
const output = process.argv[3] || '/tmp/granttap-editorial-http-proof.json';
const calendar = JSON.parse(await readFile('docs/editorial/october2026-backfill/calendar-validation.json', 'utf8'));
const images = JSON.parse(await readFile('docs/editorial/october2026-backfill/image-prompts.json', 'utf8')).images;
const proof = { base, checkedOn: '2026-11-05', articles: [], images: [], pages: [] };
async function html(path) { const r = await fetch(base + path); assert.equal(r.status, 200, path); return new JSDOM(await r.text()); }
for (const row of calendar.articles) {
  for (const locale of ['en', 'ru']) {
    const route = '/blog/' + row.slug + (locale === 'ru' ? '?lang=ru' : '');
    const dom = await html(route); const d = dom.window.document;
    const paragraphs = [...d.querySelectorAll('.blog-prose > p.blog-intro, .blog-prose > section:not(.blog-sources) > p')];
    const words = paragraphs.map(p => p.textContent).join(' ').trim().split(/\s+/u).length;
    assert.ok(words >= 2500, route + ': ' + words);
    assert.ok(d.querySelector('.blog-prose > .blog-current-guide'), route);
    assert.ok(d.querySelector('.blog-current-guide').textContent.includes('2026-11-05'));
    const source = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent);
    assert.equal(source.datePublished, row.date); assert.equal(source.dateModified, '2026-11-05');
    const references = [...d.querySelectorAll('.blog-article img')].map(image => image.getAttribute('src'));
    for (const path of row.images) assert.ok(references.includes(path), path);
    assert.ok(d.querySelector('link[rel="canonical"]').href.endsWith(route));
    proof.articles.push({ route, date: row.date, locale, visibleBodyWords: words, conceptualImages: row.images.length, reviewNoteInMainText: true });
    dom.window.close();
  }
}
for (const image of images) {
  const route = '/' + image.destination.slice(7); const r = await fetch(base + route); assert.equal(r.status, 200, route);
  const sha256 = createHash('sha256').update(Buffer.from(await r.arrayBuffer())).digest('hex'); assert.equal(sha256, image.webpSha256, route);
  proof.images.push({ route, sha256 });
}
for (const route of ['/support', '/support?lang=ru', '/guide', '/guide/providers', '/guide/device-management', '/agents/claude-code', '/agents/codex', '/agents/cursor', '/agents/grok-build', '/pricing', '/privacy', '/terms', '/mac', '/project-mesh']) {
  const dom = await html(route); const d = dom.window.document;
  if (route.startsWith('/support')) { assert.ok(d.body.textContent.includes('0.8.143')); assert.ok(d.body.textContent.includes('250')); assert.ok(d.querySelector('a[href^="/guide/provider-sign-in"]')); }
  if (route === '/guide') assert.ok(d.body.textContent.includes('5 ноября 2026'));
  proof.pages.push({ route, status: 200 }); dom.window.close();
}
const index = await html('/blog'); assert.equal(index.window.document.querySelectorAll('.blog-card').length, 37); index.window.close();
// Slugs are taken from deployed editorial metadata rather than guessed titles.
const source = await readFile('docs/editorial/november2026/calendar-validation.json', 'utf8');
for (const row of JSON.parse(source).articles.filter(row => row.date > '2026-11-05')) {
  const r = await fetch(base + '/blog/' + row.slug); assert.equal(r.status, 404, row.slug);
}
proof.publishedArticleCount = 37; proof.futureGatesPreserved = true;
await writeFile(output, JSON.stringify(proof, null, 2)); console.log(JSON.stringify({ articles: proof.articles.length, images: proof.images.length, pages: proof.pages.length, published: 37, output }));
