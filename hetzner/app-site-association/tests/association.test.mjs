import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import test from "node:test";
import { APP_SITE_ASSOCIATION_PATH, installAppSiteAssociation } from "../index.mjs";

const appIds = ["XMS5ZC28UJ.com.ziborov.granttap"];

test("the association file is direct JSON for every GrantTap app with the webcredentials entitlement", async t => {
  const server = createServer((_request, response) => { response.writeHead(404, { "content-type": "text/html" }); response.end("<h1>Not found</h1>"); });
  installAppSiteAssociation(server);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;

  for (const suffix of ["", "?probe=1"]) {
    const response = await fetch(base + APP_SITE_ASSOCIATION_PATH + suffix, { redirect: "manual" });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "application/json");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    const body = await response.json();
    assert.deepEqual(body.webcredentials.apps, appIds);
  }
  const head = await fetch(base + APP_SITE_ASSOCIATION_PATH, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);
  assert.equal((await fetch(base + APP_SITE_ASSOCIATION_PATH, { method: "POST" })).status, 405);
  assert.equal((await fetch(base + "/.well-known/apple-app-site-association.json")).status, 404);
  assert.equal(await (await fetch(base + "/pricing")).text(), "<h1>Not found</h1>");
});

test("the shared file stays byte-compatible with the Worker entry", () => {
  const shared = JSON.parse(readFileSync(new URL("../../../worker/site-policy/apple-app-site-association.json", import.meta.url), "utf8"));
  assert.deepEqual(shared, { webcredentials: { apps: appIds } });
});
