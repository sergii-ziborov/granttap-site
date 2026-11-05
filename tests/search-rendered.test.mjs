import assert from 'node:assert/strict';
import test from 'node:test';
import {JSDOM} from 'jsdom';
import {readFile} from 'node:fs/promises';
import {brotliDecompressSync} from 'node:zlib';
import {productionSite} from './production-site.mjs';
const render=await productionSite();
const origin='https://granttap.com';
async function page(path){const response=await render(origin+path,{'user-agent':'Googlebot'});assert.equal(response.status,200,path);return new JSDOM(await response.text());}

test('translated public pages expose their own language, canonical and reciprocal alternatives to crawlers',async()=>{
 for(const path of ['/','/about','/blog','/support','/pricing','/privacy','/mac']){
  for(const locale of ['en','ru']){
   const route=path+(locale==='ru'?'?lang=ru':'');const dom=await page(route);const d=dom.window.document;
   assert.equal(d.documentElement.lang,locale,route);
   assert.ok(d.head.querySelector('meta[name="description"]')?.content,route+' description is in head');
   assert.ok(d.head.querySelector('link[rel="canonical"]'),route+' canonical is in head');
   assert.equal(new URL(d.querySelector('link[rel="canonical"]').href).href,new URL(origin+route).href);
   for(const lang of ['en','ru'])assert.equal(new URL(d.querySelector(`link[hreflang="${lang}"]`).href).href,new URL(origin+path+(lang==='ru'?'?lang=ru':'')).href);
   assert.ok(d.querySelector('meta[property="og:image"]').content.endsWith(`/brand/share-${locale}.png`));
   assert.ok(d.querySelector('h1')?.textContent);dom.window.close();
  }
 }
});

test('single-language pages do not advertise a translation that does not exist',async()=>{
 const english=await page('/agents/claude-code?lang=ru');
 assert.equal(english.window.document.documentElement.lang,'en');
 assert.equal(english.window.document.querySelector('link[hreflang="ru"]'),null);english.window.close();
 const guide=await page('/guide/device-management');
 assert.equal(guide.window.document.documentElement.lang,'ru');
 assert.equal(guide.window.document.querySelector('link[hreflang="en"]'),null);guide.window.close();
});

test('RSS is valid localized XML and uses actual publication for retrospective articles',async()=>{
 for(const locale of ['en','ru']){
  const response=await render(origin+'/blog/feed.xml'+(locale==='ru'?'?lang=ru':''));
  assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/application\/rss\+xml/);
  const dom=new JSDOM(await response.text(),{contentType:'text/xml'});const d=dom.window.document;
  assert.equal(d.querySelector('channel > language').textContent,locale);
  assert.ok(d.querySelectorAll('item').length>=52);
  const row=[...d.querySelectorAll('item')].find(item=>item.querySelector('link').textContent.includes('granttap-agent-wrong-checkout-worktree'));
  assert.ok(row);assert.equal(row.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/','date')[0].textContent,'2026-11-05');
  assert.equal(row.querySelector('link').textContent.endsWith('?lang=ru'),locale==='ru');dom.window.close();
 }
});

test('social cards and static files are served through the production header policy',async()=>{
 for(const locale of ['en','ru']){
  const response=await render(origin+`/brand/share-${locale}.png`);assert.equal(response.status,200);
  assert.equal(response.headers.get('x-content-type-options'),'nosniff');
  const bytes=Buffer.from(await response.arrayBuffer());assert.equal(bytes.readUInt32BE(16),1200);assert.equal(bytes.readUInt32BE(20),630);
 }
 const response=await render('http://granttap.com/blog?lang=ru');assert.equal(response.status,308);
 assert.equal(response.headers.get('location'),origin+'/blog?lang=ru');
});

test('hashed JavaScript is served as verified Brotli bytes',async()=>{
 const dom=await page('/');
 const asset=dom.window.document.querySelector('script[src^="/_next/static/"]').getAttribute('src');
 const response=await render(origin+asset,{'accept-encoding':'br'});
 assert.equal(response.status,200);assert.equal(response.headers.get('content-encoding'),'br');
 const expected=await readFile('dist/client'+asset);
 const compressed=Buffer.from(await response.arrayBuffer());
 assert.deepEqual(brotliDecompressSync(compressed),expected);
 assert.ok(compressed.length<expected.length);dom.window.close();
});
