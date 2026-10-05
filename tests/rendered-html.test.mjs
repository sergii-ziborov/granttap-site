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

const routes = [
  "/", "/about", "/privacy", "/terms", "/support", "/security", "/data-rights",
  "/accessibility", "/licenses", "/pricing", "/agents/claude-code",
  "/agents/codex", "/agents/cursor", "/agents/grok-build", "/project-mesh",
  "/grok-bot", "/apple-watch-coding-agents",
  "/blog", "/blog/why-granttap-is-a-control-center", "/blog/connect-iphone-with-qr", "/blog/task-continuity-across-agents",
  "/blog/linked-projects-without-merging-access", "/blog/architecture-graph-with-evidence",
  "/blog/mcp-skills-and-governance-status",
];

test("server-renders one Personal product", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /All your coding agents\./);
  assert.match(html, /One live control center\./);
  assert.match(html, /Claude Code · Codex · Cursor · Grok Build/);
  assert.match(html, />Cursor<\/strong>/);
  assert.match(html, />Grok Build<\/strong>/);
  assert.match(html, /Needs You/);
  assert.match(html, /One Mesh gives the work a home\./);
  assert.doesNotMatch(html, /Project Mesh|Shared Projects/);
  assert.match(html, /Claude · MacBook/);
  assert.match(html, /Codex · Workstation/);
  assert.match(html, /A Mesh groups a project&#x27;s repositories, people, computers, and rules/);
  assert.match(html, /The control center is on your computer, too/);
  assert.match(html, /mac-workspace\.jpg/);
  assert.match(html, /Conceptual illustration of the Mac workspace/);
  assert.match(html, /codex plugin add granttap@granttap/);
  assert.match(html, /claude plugin install granttap@granttap/);
  assert.match(html, /npm install -g granttap-mcp/);
  assert.match(html, /granttap setup/);
  assert.match(html, /Native E2EE/);
  assert.match(html, /TestFlight by invitation/);
  assert.match(html, /GrantTap 1\.0 is waiting for App Review/);
  assert.match(html, /iphone-command-center\.png/);
  assert.match(html, /iphone-chat\.png/);
  assert.match(html, /iphone-mcp-usage\.png/);
  assert.match(html, /apple-watch-approval\.png/);
  assert.match(html, /content="Coordinate Claude Code, Codex, Cursor, and Grok Build/i);
  assert.doesNotMatch(html, /Enterprise|GrantTap Web|Open account|browser workspace|organization policy|scheduler|Copilot/i);
  assert.doesNotMatch(html, /href="\/(?:account|enterprise)/);
  assert.match(html, /property="og:image" content="https:\/\/granttap\.com\/product\/iphone-command-center\.png\?v=20260828-1"/i);
  assert.match(html, /<link(?=[^>]*rel="canonical")(?=[^>]*href="https:\/\/granttap\.com\/")[^>]*>/i);
});

test("Russian homepage is complete in server HTML with matching SEO metadata", async () => {
  const html = await (await render("https://granttap.com/?lang=ru")).text();
  assert.match(html, /<main lang="ru">/);
  assert.match(html, /Все ваши coding agents/);
  assert.match(html, /<title>GrantTap — Все coding-агенты\. Один центр управления\.<\/title>/);
  assert.match(html, /href="https:\/\/granttap\.com\/\?lang=ru"/);
});

test("main, journal, article, and legal routes use the same navigation shell", async () => {
  for (const path of ["/", "/blog", "/blog/connect-iphone-with-qr", "/data-rights"]) {
    const html = await (await render(`https://granttap.com${path}`)).text();
    assert.match(html, /class="site-header page-shell"/);
    for (const label of ["Product", "How it works", "Security", "Blog", "Pricing", "Support"]) {
      assert.match(html, new RegExp(`>${label}<`), `${path}: ${label}`);
    }
  }
});

test("editorial pages identify conceptual art and articles expose a working breadcrumb", async () => {
  for (const [path, image] of [["/about", "device-journey.jpg"], ["/security", "encrypted-route.jpg"], ["/support", "pairing-journey.jpg"], ["/project-mesh", "mesh-network.jpg"]]) {
    const html = await (await render(`https://granttap.com${path}`)).text();
    assert.match(html, new RegExp(image.replace(".", "\\.")));
  }
  const html = await (await render("https://granttap.com/blog/connect-iphone-with-qr")).text();
  assert.match(html, /class="blog-breadcrumb"/);
  assert.match(html, /<a href="\/">Home<\/a>/);
  assert.match(html, /<a href="\/blog">Journal<\/a>/);
  assert.match(html, /aria-current="page">Connect your iPhone without another account/);
  await Promise.all(["device-journey.jpg", "encrypted-route.jpg", "mac-workspace.jpg", "mesh-network.jpg", "pairing-journey.jpg"].map(name => access(new URL(`../public/visuals/${name}`, import.meta.url))));
});

test("provider and Mesh guides publish exact capability boundaries", async () => {
  const grok = await (await render("https://granttap.com/agents/grok-build")).text();
  assert.match(grok, /does not yet expose a trusted caller hook/);
  assert.match(grok, /Agent-authored scoped Mesh events are therefore not offered/);
  const mesh = await (await render("https://granttap.com/project-mesh")).text();
  assert.match(mesh, /never reopens a previous native execution/);
  assert.match(mesh, /uncommitted work blocks departure/);
  const watch = await (await render("https://granttap.com/apple-watch-coding-agents")).text();
  assert.match(watch, /One Needs You list/);
  assert.match(watch, /Mesh handoffs, conflicts, questions, and failures/);
  const bot = await (await render("https://granttap.com/grok-bot")).text();
  assert.match(bot, /cannot create invites, choose a relay, run setup, or expand/);
});

test("journal publishes current stories with accurate status and images", async () => {
  const index = await (await render("https://granttap.com/blog")).text();
  assert.match(index, /All stories/);
  assert.match(index, /connect-iphone-with-qr/);
  assert.match(index, /why-granttap-is-a-control-center/);
  assert.match(index, /mcp-skills-and-governance-status/);
  assert.match(index, /blog-list-heading[^>]*><h2>All stories<\/h2><span>15/);
  assert.match(index, /choose-a-mobile-coding-agent-workflow/);
  const workflow = await render("https://granttap.com/blog/choose-a-mobile-coding-agent-workflow");
  assert.equal(workflow.status, 200);
  const pairing = await (await render("https://granttap.com/blog/connect-iphone-with-qr")).text();
  assert.match(pairing, /You do not need to add GrantTap under Codex Connected accounts/);
  assert.match(pairing, /Add a device \(Scan QR\)/);
  const mesh = await (await render("https://granttap.com/blog/linked-projects-without-merging-access")).text();
  assert.match(mesh, /Grouping is a map for the person/);
  const governance = await (await render("https://granttap.com/blog/mcp-skills-and-governance-status")).text();
  assert.match(governance, /budget and use-only flows are still being built/);
  const product = await (await render("https://granttap.com/blog/why-granttap-is-a-control-center")).text();
  assert.match(product, /One Task, many executions/);
  assert.match(product, /why-granttap-is-a-control-center-a\.webp/);
  assert.match(product, /why-granttap-is-a-control-center-b\.webp/);
  await Promise.all(["device-network", "linked-work", "task-continuity", "architecture-evidence", "capability-states", "granttap-control", "agent-landscape", "governance-boundary", "tel-aviv-agentic", "cortex-evidence"].map(name => access(new URL(`../public/blog/${name}.webp`, import.meta.url))));
});

test("homepage leaves journal assets and article data to blog routes", async () => {
  const home = await (await render("https://granttap.com/")).text();
  const journal = await (await render("https://granttap.com/blog")).text();
  assert.doesNotMatch(home, /href="\/blog\.css"|\/blog\/[a-z-]+\.webp|A phone should reduce uncertainty|An agent approval is only as strong/);
  assert.match(journal, /href="\/blog\.css"/);
  assert.doesNotMatch(journal, /A phone should reduce uncertainty/);
  const cssAssets = [...home.matchAll(/href="(\/assets\/[^\"]+\.css)"/g)].map(match => match[1]);
  for (const asset of cssAssets) {
    const css = await readFile(new URL(`../dist/client${asset}`, import.meta.url), "utf8");
    assert.doesNotMatch(css, /\.blog-article-head|\.blog-screenshot|\.blog-graphic-row/);
  }
  const jsAssets = [...home.matchAll(/(?:href|src)="(\/assets\/[^\"]+\.js)"/g)].map(match => match[1]);
  for (const asset of jsAssets) {
    const js = await readFile(new URL(`../dist/client${asset}`, import.meta.url), "utf8");
    assert.doesNotMatch(js, /blog-article-head|A phone should reduce uncertainty|An agent approval is only as strong/);
  }
  await access(new URL("../public/blog.css", import.meta.url));
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
  const account = await (await render("https://granttap.com/account")).text();
  assert.match(account, /Your GrantTap account/);
  assert.match(account, /name="robots" content="noindex/);
  assert.match(account, /href="https:\/\/granttap\.com\/account"/);
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

test("robots and dynamic sitemap expose only published customer routes", async () => {
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await (await render("https://granttap.com/sitemap.xml")).text();
  assert.match(robots, /Sitemap: https:\/\/granttap\.com\/sitemap\.xml/);
  for (const path of routes) assert.match(sitemap, new RegExp(`<loc>https:\/\/granttap\.com${path.replace("/", "\\/")}<\/loc>`));
  assert.doesNotMatch(`${robots}\n${sitemap}`, /chatgpt\.site|enterprise|account/i);
});

test("publishes actionable Personal support and privacy copy", async () => {
  const support = await (await render("https://granttap.com/support")).text();
  assert.match(support, /npm install -g granttap-mcp/);
  assert.match(support, /granttap setup/);
  assert.match(support, /granttap status/);
  assert.match(support, /For Cursor, install the GrantTap Marketplace listing/);
  assert.doesNotMatch(support, /granttap (?:authorize|serve|monitor|hook|web|login)/);
  const privacy = await readFile(new URL("../app/privacy/page.tsx", import.meta.url), "utf8");
  assert.match(privacy, /APNs device token/);
  assert.doesNotMatch(privacy, /Enterprise|GrantTap Web/);
});

test("publishes transparent subscription pricing", async () => {
  const html = await (await render("https://granttap.com/pricing")).text();
  assert.match(html, /7-day free trial/i);
  // Every published tier, and the promise that agents are never metered.
  assert.match(html, /\$1\.99 per month for 1 computer/i);
  assert.match(html, /\$3\.99 for up to 5/i);
  assert.match(html, /\$5\.99 for up to 10/i);
  assert.match(html, /agents are never counted or charged for/i);
  assert.match(html, /cancel/i);
  assert.doesNotMatch(html, /\$2\.99|up to 3 (?:linked )?computers/i);
  const terms = await (await render("https://granttap.com/terms")).text();
  assert.match(terms, /auto-renewable subscription/i);
});

test("ships every homepage image", async () => {
  await Promise.all(["app-icon.png", "product/iphone-command-center.png", "product/iphone-chat.png", "product/iphone-mcp-usage.png", "product/apple-watch-inbox.png", "product/apple-watch-approval.png", "providers/claude.png", "providers/codex.png", "providers/cursor.png", "providers/grok.png"].map(path => access(new URL(`../public/${path}`, import.meta.url))));
});
