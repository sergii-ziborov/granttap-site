import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(url = "https://granttap.com/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(url, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the GrantTap product page and social metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>GrantTap — Control coding agents from Apple Watch<\/title>/i,
  );
  assert.match(html, /Approve the next move\./);
  assert.match(html, /Keep yours\./);
  assert.match(html, /Zero-knowledge relay/);
  assert.match(html, /Real context controls/);
  assert.match(html, /MCP per task/);
  assert.match(html, /phone-controls-v030\.png/);
  assert.match(html, /codex mcp add granttap -- npx -y granttap-mcp/);
  assert.match(html, /Preparing for App Store review/);
  assert.match(html, /https:\/\/www\.npmjs\.com\/package\/granttap-mcp/);
  assert.match(
    html,
    /<meta(?=[^>]*property="og:image")(?=[^>]*content="https:\/\/granttap\.com\/og\.png")[^>]*>/i,
  );
  assert.match(
    html,
    /<link(?=[^>]*rel="canonical")(?=[^>]*href="https:\/\/granttap\.com\/")[^>]*>/i,
  );
  assert.doesNotMatch(html, /Nodvox|Your site is taking shape/);
  assert.doesNotMatch(html, /\/Users\/|\.vinext\/fonts\//);
});

test("permanently redirects the Sites hostname to the canonical domain", async () => {
  const response = await render(
    "https://granttap.serhiiright.chatgpt.site/features?from=sites",
  );

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "https://granttap.com/features?from=sites",
  );
});

test("publishes robots and sitemap files for only the canonical domain", async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
  ]);

  assert.match(robots, /Sitemap: https:\/\/granttap\.com\/sitemap\.xml/);
  for (const path of ["/", "/privacy", "/terms", "/support", "/licenses"]) {
    assert.match(sitemap, new RegExp(`<loc>https:\\/\\/granttap\\.com${path.replace("/", "\\/")}<\\/loc>`));
  }
  assert.doesNotMatch(`${robots}\n${sitemap}`, /chatgpt\.site/);
});

test("ships the real product imagery used by the page", async () => {
  await Promise.all(
    [
      "public/app-icon.png",
      "public/og.png",
      "public/product/phone-sessions.png",
      "public/product/phone-activity.png",
      "public/product/phone-home-v030.png",
      "public/product/phone-context-v030.png",
      "public/product/phone-controls-v030.png",
      "public/product/watch-approval.png",
      "public/product/watch-activity.png",
    ].map((path) => access(new URL(`../${path}`, import.meta.url))),
  );
});

test("lets Cloudflare serve hashed CSS and JS before the application worker", async () => {
  const config = JSON.parse(
    await readFile(new URL("../wrangler.production.jsonc", import.meta.url), "utf8"),
  );

  assert.notEqual(config.assets?.run_worker_first, true);
});
