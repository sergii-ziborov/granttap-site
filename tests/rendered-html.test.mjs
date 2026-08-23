import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(url = "https://granttap.com/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(url, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

const routes = ["/", "/privacy", "/terms", "/support", "/security", "/data-rights", "/accessibility", "/licenses", "/pricing"];

test("server-renders one Personal product", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /All your coding agents\./);
  assert.match(html, /One live control center\./);
  assert.match(html, /Claude Code \+ Codex/);
  assert.match(html, /Cursor Beta/);
  assert.match(html, /Needs You/);
  assert.match(html, /npm install -g granttap-mcp/);
  assert.match(html, /granttap setup/);
  assert.match(html, /Native E2EE/);
  assert.match(html, /Join TestFlight/);
  assert.match(html, /iphone-command-center\.png/);
  assert.match(html, /iphone-chat\.png/);
  assert.match(html, /iphone-mcp-usage\.png/);
  assert.match(html, /apple-watch-approval\.png/);
  assert.doesNotMatch(html, /Enterprise|GrantTap Web|Open account|browser workspace|organization policy|scheduler/i);
  assert.doesNotMatch(html, /href="\/(?:account|enterprise)/);
  assert.match(html, /property="og:image" content="https:\/\/granttap\.com\/product\/iphone-command-center\.png\?v=20260823-1"/i);
  assert.match(html, /<link(?=[^>]*rel="canonical")(?=[^>]*href="https:\/\/granttap\.com\/")[^>]*>/i);
});

test("redirects the Sites hostname to the canonical domain", async () => {
  const response = await render("https://granttap.serhiiright.chatgpt.site/features?from=sites");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://granttap.com/features?from=sites");
});

test("publishes only Personal customer routes with canonical metadata", async () => {
  for (const path of routes) {
    const response = await render(`https://granttap.com${path}`);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const canonical = path === "/" ? "https://granttap.com/" : `https://granttap.com${path}`;
    assert.match(html, new RegExp(`<link(?=[^>]*rel="canonical")(?=[^>]*href="${canonical.replaceAll("/", "\\/")}")[^>]*>`, "i"));
    assert.doesNotMatch(html, /Enterprise|GrantTap Web|browser vault|organization policy/i);
  }
  assert.equal((await render("https://granttap.com/enterprise")).status, 404);
  assert.equal((await render("https://granttap.com/account")).status, 404);
});

test("all internal links resolve", async () => {
  const links = new Set();
  for (const path of routes) {
    const html = await (await render(`https://granttap.com${path}`)).text();
    for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)) if (!match[1].startsWith("/_")) links.add(match[1]);
  }
  for (const path of links) assert.equal((await render(`https://granttap.com${path}`)).status, 200, path);
});

test("adds production security headers", async () => {
  const secure = await render("https://granttap.com/privacy");
  const csp = secure.headers.get("content-security-policy") ?? "";
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.doesNotMatch(csp, /unsafe-eval/);
  assert.equal(secure.headers.get("x-content-type-options"), "nosniff");
  assert.match(secure.headers.get("strict-transport-security") ?? "", /max-age=63072000/);
  assert.equal((await render("http://granttap.com/privacy")).headers.get("strict-transport-security"), null);
});

test("robots and sitemap expose no retired product route", async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
  ]);
  assert.match(robots, /Sitemap: https:\/\/granttap\.com\/sitemap\.xml/);
  for (const path of routes) assert.match(sitemap, new RegExp(`<loc>https:\/\/granttap\.com${path.replace("/", "\\/")}<\/loc>`));
  assert.doesNotMatch(`${robots}\n${sitemap}`, /chatgpt\.site|enterprise|account/i);
});

test("publishes actionable Personal support and privacy copy", async () => {
  const support = await (await render("https://granttap.com/support")).text();
  assert.match(support, /npm install -g granttap-mcp/);
  assert.match(support, /granttap setup/);
  assert.match(support, /granttap status/);
  assert.match(support, /Cursor is Beta/);
  assert.doesNotMatch(support, /granttap (?:authorize|serve|monitor|hook|web|login)/);
  const privacy = await readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8");
  assert.match(privacy, /APNs device token/);
  assert.doesNotMatch(privacy, /Enterprise|GrantTap Web/);
});

test("publishes transparent subscription pricing", async () => {
  const html = await (await render("https://granttap.com/pricing")).text();
  assert.match(html, /7-day free trial/i);
  assert.match(html, /\$2\.99/);
  assert.match(html, /up to 3 (?:linked )?computers/i);
  assert.match(html, /cancel/i);
  const terms = await (await render("https://granttap.com/terms")).text();
  assert.match(terms, /auto-renewable subscription/i);
});

test("ships every homepage image", async () => {
  await Promise.all(["app-icon.png", "product/iphone-command-center.png", "product/iphone-chat.png", "product/iphone-mcp-usage.png", "product/apple-watch-inbox.png", "product/apple-watch-approval.png", "providers/claude.png", "providers/codex.png"].map(path => access(new URL(`../public/${path}`, import.meta.url))));
});
