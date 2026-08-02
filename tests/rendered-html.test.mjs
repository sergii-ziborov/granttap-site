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
    /<title>GrantTap — Keep Codex and Claude Code moving<\/title>/i,
  );
  assert.match(html, /Step away from your Mac\./);
  assert.match(html, /The work keeps moving\./);
  assert.match(html, /Zero-knowledge relay/);
  assert.match(html, /Real context usage/);
  assert.match(html, /MCP per task/);
  assert.match(html, /iphone-command-center\.png/);
  assert.match(html, /iphone-claude-tasks\.png/);
  assert.match(html, /iphone-task-detail\.png/);
  assert.match(html, /iphone-security-settings\.png/);
  assert.match(html, /apple-watch-inbox\.png/);
  assert.match(html, /apple-watch-task\.png/);
  assert.match(html, /apple-watch-approval\.png/);
  assert.doesNotMatch(html, /\/product\/(?:phone-(?:home|context|controls)-v\d+|watch-(?:activity|approval)\.png)/);
  assert.match(html, /codex mcp add granttap -- npx -y granttap-mcp/);
  assert.match(html, /Preparing for App Store review/);
  assert.match(html, /https:\/\/www\.npmjs\.com\/package\/granttap-mcp/);
  assert.doesNotMatch(html, /property="og:image"/i);
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
      "public/product/iphone-command-center.png",
      "public/product/iphone-claude-tasks.png",
      "public/product/iphone-task-detail.png",
      "public/product/iphone-mcp-usage.png",
      "public/product/iphone-security-settings.png",
      "public/product/apple-watch-inbox.png",
      "public/product/apple-watch-task.png",
      "public/product/apple-watch-approval.png",
    ].map((path) => access(new URL(`../${path}`, import.meta.url))),
  );
});

test("lets Cloudflare serve hashed CSS and JS before the application worker", async () => {
  const config = JSON.parse(
    await readFile(new URL("../wrangler.production.jsonc", import.meta.url), "utf8"),
  );

  assert.notEqual(config.assets?.run_worker_first, true);
});
