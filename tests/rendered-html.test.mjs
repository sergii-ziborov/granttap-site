import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(html, /Live only while open/);
  assert.match(html, /Per-chat controls/);
  assert.match(
    html,
    /<meta(?=[^>]*property="og:image")(?=[^>]*content="https:\/\/granttap\.com\/og\.png")[^>]*>/i,
  );
  assert.doesNotMatch(html, /Nodvox|Your site is taking shape/);
  assert.doesNotMatch(html, /\/Users\/|\.vinext\/fonts\//);
});

test("ships the real product imagery used by the page", async () => {
  await Promise.all(
    [
      "public/app-icon.png",
      "public/og.png",
      "public/product/phone-sessions.png",
      "public/product/phone-activity.png",
      "public/product/watch-approval.png",
      "public/product/watch-activity.png",
    ].map((path) => access(new URL(`../${path}`, import.meta.url))),
  );
});
