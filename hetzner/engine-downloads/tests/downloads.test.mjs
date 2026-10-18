import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, truncateSync, writeFileSync } from "node:fs";
import { createServer, request as httpRequest } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { installEngineDownloads } from "../index.mjs";

test("versioned Engine downloads preserve exact bytes, HEAD and the site's other routes", async t => {
  const root = mkdtempSync(join(tmpdir(), "granttap-engine-http-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const dir = join(root, "0.0.0-fixture"); mkdirSync(dir);
  const bytes = Buffer.from([0, 255, 11, 10, 1]);
  writeFileSync(join(dir, "granttap-engine-darwin-arm64"), bytes);
  writeFileSync(join(dir, "manifest.json"), '{"version":"0.0.0-fixture"}');
  writeFileSync(join(dir, "LICENSE.txt"), "Dedicated license fixture");
  const server = createServer((_req, res) => res.end("site handler"));
  installEngineDownloads(server, root);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const path = "/downloads/engine/0.0.0-fixture/granttap-engine-darwin-arm64";
  let response = await fetch(base + path);
  assert.equal(response.status, 200); assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("cache-control"), /immutable/);
  response = await fetch(base + path, { method: "HEAD" });
  assert.equal(response.status, 200); assert.equal(response.headers.get("content-length"), String(bytes.length));
  assert.equal((await response.arrayBuffer()).byteLength, 0);
  assert.equal(await (await fetch(base + "/pricing?lang=ru")).text(), "site handler");
  response = await fetch(base + "/downloads/engine/0.0.0-fixture/manifest.json");
  assert.equal(response.headers.get("content-type"), "application/json");
  assert.equal((await response.json()).version, "0.0.0-fixture");
  response = await fetch(base + "/downloads/engine/0.0.0-fixture/LICENSE.txt");
  assert.equal(await response.text(), "Dedicated license fixture");
  assert.equal((await fetch(base + path, { method: "POST" })).status, 405);
  for (const bad of ["../LICENSE.txt", "%2e%2e/LICENSE.txt", "0.0.0-fixture/../../LICENSE.txt",
    "0.0.0-fixture", "0.0.0-fixture/not-a-release", "0.0.0-fixture/granttap-engine-linux-x64"]) {
    const result = await new Promise((resolve, reject) => {
      const req = httpRequest(base, { path: "/downloads/engine/" + bad }, res => { res.resume(); resolve(res.statusCode); });
      req.on("error", reject); req.end();
    });
    assert.equal(result, 404, bad);
  }
  const foreign = join(root, "foreign"); writeFileSync(foreign, "must never leave the server");
  symlinkSync(foreign, join(dir, "THIRD_PARTY_LICENSES.txt"));
  assert.equal((await fetch(base + "/downloads/engine/0.0.0-fixture/THIRD_PARTY_LICENSES.txt")).status, 404);
  symlinkSync(dir, join(root, "0.0.1"));
  assert.equal((await fetch(base + "/downloads/engine/0.0.1/LICENSE.txt")).status, 404);
  const large = join(dir, "granttap-engine-linux-arm64"); writeFileSync(large, ""); truncateSync(large, 41 * 1024 * 1024);
  assert.equal((await fetch(base + "/downloads/engine/0.0.0-fixture/granttap-engine-linux-arm64")).status, 404);
});
