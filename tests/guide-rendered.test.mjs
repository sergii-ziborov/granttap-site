import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { JSDOM } from "jsdom";

const { default: worker } = await import("../dist/server/index.js");
const environment = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const context = { waitUntil() {}, passThroughOnException() {} };

test("production guide serves every chapter with real content and resolvable deep links", async () => {
  const files = await readdir(new URL("../app/guide/GuideContent/articles/", import.meta.url));
  const routes = ["/guide", ...files.filter(file => file.endsWith(".md")).map(file => `/guide/${file.slice(0, -3)}`)];
  for (const route of routes) {
    const response = await worker.fetch(new Request(`https://granttap.com${route}`, { headers: { accept: "text/html" } }), environment, context);
    assert.equal(response.status, 200, route);
    const dom = new JSDOM(await response.text());
    const document = dom.window.document;
    assert.ok(document.querySelector("h1")?.textContent, route);
    assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute("href"), `https://granttap.com${route}`);
    assert.ok(document.querySelector('nav[aria-label="Разделы руководства"]'), route);
    for (const link of document.querySelectorAll('a[href^="#"]')) {
      assert.ok(document.getElementById(link.getAttribute("href").slice(1)), `${route} ${link.outerHTML}`);
    }
    assert.doesNotMatch(document.querySelector(".guide-main").textContent, /\{#[a-z-]+\}|:::capture/);
    dom.window.close();
  }
  const invalid = await worker.fetch(new Request("https://granttap.com/guide/missing-chapter"), environment, context);
  assert.equal(invalid.status, 404);
});

test("the downloadable practice project is included in the production assets", async () => {
  const bytes = await readFile(new URL("../dist/client/guide/granttap-lab.zip", import.meta.url));
  assert.equal(bytes.subarray(0, 2).toString(), "PK");
  const index = JSON.parse(await readFile(new URL("../dist/client/guide/search-index.json", import.meta.url), "utf8"));
  const files = await readdir(new URL("../app/guide/GuideContent/articles/", import.meta.url));
  assert.deepEqual([...new Set(index.map(entry => entry.slug))].sort(), files.filter(file => file.endsWith(".md")).map(file => file.slice(0, -3)).sort());
});
