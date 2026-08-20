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

const PUBLIC_ROUTES = [
  "/",
  "/privacy",
  "/terms",
  "/support",
  "/security",
  "/data-rights",
  "/accessibility",
  "/licenses",
  "/pricing",
];

test("server-renders the GrantTap product page and social metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>GrantTap — Keep Cursor, Claude, Codex, Copilot, and Grok moving<\/title>/i,
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
  assert.match(html, /providers\/cursor\.png\?v=20260820/);
  assert.match(html, /providers\/claude\.png\?v=20260820/);
  assert.match(html, /providers\/codex\.png\?v=20260820/);
  assert.match(html, /providers\/copilot\.png\?v=20260820/);
  assert.match(html, /providers\/grok\.png\?v=20260820/);
  assert.doesNotMatch(html, /\/product\/(?:phone-(?:home|context|controls)-v\d+|watch-(?:activity|approval)\.png)/);
  assert.match(html, /One GrantTap installation/);
  assert.match(html, /codex plugin add granttap@personal/);
  assert.match(html, /Private testing before App Store submission/);
  assert.match(html, /https:\/\/www\.npmjs\.com\/package\/granttap-mcp/);
  assert.match(html, /property="og:image" content="https:\/\/granttap\.com\/product\/iphone-command-center\.png\?v=20260820"/i);
  assert.match(html, /property="og:image:width" content="1206"/i);
  assert.match(html, /property="og:image:height" content="2622"/i);
  assert.match(html, /name="twitter:card" content="summary_large_image"/i);
  await access(new URL("../public/product/iphone-command-center.png", import.meta.url));
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

test("publishes every support and legal route with canonical metadata", async () => {
  for (const path of PUBLIC_ROUTES) {
    const response = await render(`https://granttap.com${path}`);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const canonical = path === "/" ? "https://granttap.com/" : `https://granttap.com${path}`;
    assert.match(html, new RegExp(`<link(?=[^>]*rel="canonical")(?=[^>]*href="${canonical.replaceAll("/", "\\/")}")[^>]*>`, "i"));
    assert.doesNotMatch(html, /\[OWNER CONFIRMATION\]/, `${path} must not expose internal placeholders`);
  }
});

test("all public internal page links resolve", async () => {
  const discovered = new Set();

  for (const path of PUBLIC_ROUTES) {
    const response = await render(`https://granttap.com${path}`);
    const html = await response.text();
    for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)) {
      if (!match[1].startsWith("/_")) discovered.add(match[1]);
    }
  }

  for (const path of discovered) {
    const response = await render(`https://granttap.com${path}`);
    assert.equal(response.status, 200, `broken internal link: ${path}`);
  }
});

test("adds production security headers without forcing HSTS on HTTP", async () => {
  const secure = await render("https://granttap.com/privacy");
  const csp = secure.headers.get("content-security-policy") ?? "";
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /script-src 'self' 'unsafe-inline'/);
  assert.doesNotMatch(csp, /unsafe-eval/);
  assert.equal(secure.headers.get("x-content-type-options"), "nosniff");
  assert.equal(secure.headers.get("x-frame-options"), "DENY");
  assert.equal(secure.headers.get("referrer-policy"), "no-referrer");
  assert.match(secure.headers.get("permissions-policy") ?? "", /camera=\(\)/);
  assert.match(secure.headers.get("strict-transport-security") ?? "", /max-age=63072000/);

  const insecure = await render("http://granttap.com/privacy");
  assert.equal(insecure.headers.get("strict-transport-security"), null);
});

test("publishes robots and sitemap files for only the canonical domain", async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
  ]);

  assert.match(robots, /Sitemap: https:\/\/granttap\.com\/sitemap\.xml/);
  for (const path of PUBLIC_ROUTES) {
    assert.match(sitemap, new RegExp(`<loc>https:\\/\\/granttap\\.com${path.replace("/", "\\/")}<\\/loc>`));
  }
  assert.doesNotMatch(`${robots}\n${sitemap}`, /chatgpt\.site/);
});

test("publishes security headers for static Cloudflare asset responses", async () => {
  const headers = await readFile(new URL("../public/_headers", import.meta.url), "utf8");
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /frame-ancestors 'none'/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /Permissions-Policy:.*camera=\(\)/);
});

test("keeps bilingual, actionable privacy and deletion disclosures", async () => {
  const [privacy, deletion] = await Promise.all([
    readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data-rights/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(privacy, /No GrantTap account/);
  assert.match(privacy, /Нет аккаунта GrantTap/);
  assert.match(privacy, /APNs device token/);
  assert.match(deletion, /choose Clear local usage history/);
  assert.match(deletion, /~\/.granttap/);
  assert.match(deletion, /Apple Data and Privacy/);
});

test("publishes transparent subscription pricing and future LAN scope", async () => {
  const response = await render("https://granttap.com/pricing");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /7-day free trial/i);
  assert.match(html, /\$2\.99/);
  assert.match(html, /up to 3 (?:linked )?computers/i);
  assert.match(html, /cancel/i);
  assert.match(html, /same Wi-Fi/i);
  assert.match(html, /no server synchronization/i);
  assert.match(html, /free local mode/i);

  const terms = await render("https://granttap.com/terms").then((item) => item.text());
  assert.match(terms, /auto-renewable subscription/i);
  assert.match(terms, /7-day free trial/i);
});

test("documents the public pairing, setup, and Cursor authorization journey", async () => {
  const response = await render("https://granttap.com/support");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Install GrantTap once/);
  assert.match(html, /granttap connect/);
  assert.match(html, /granttap setup/);
  assert.match(html, /codex plugin add granttap@personal/);
  assert.match(html, /does not rotate keys/i);
  assert.match(html, /granttap authorize/);
  assert.match(html, /Cursor Settings/);
  assert.match(html, /Authorize/);
  assert.match(html, /single-use and expires after 15 minutes/i);
});

test("ships every referenced public product image", async () => {
  await Promise.all(
    [
      "public/app-icon.png",
      "public/product/iphone-command-center.png",
      "public/product/iphone-claude-tasks.png",
      "public/product/iphone-chat.png",
      "public/product/iphone-photo-preview.png",
      "public/product/iphone-task-detail.png",
      "public/product/iphone-mcp-usage.png",
      "public/product/iphone-security-settings.png",
      "public/product/apple-watch-inbox.png",
      "public/product/apple-watch-task.png",
      "public/product/apple-watch-approval.png",
      "public/providers/cursor.png",
      "public/providers/claude.png",
      "public/providers/codex.png",
      "public/providers/copilot.png",
      "public/providers/grok.png",
    ].map((path) => access(new URL(`../${path}`, import.meta.url))),
  );
});

test("lets Cloudflare serve hashed CSS and JS before the application worker", async () => {
  const config = JSON.parse(
    await readFile(new URL("../wrangler.production.jsonc", import.meta.url), "utf8"),
  );

  assert.notEqual(config.assets?.run_worker_first, true);
});
