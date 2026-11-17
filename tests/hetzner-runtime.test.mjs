import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { request as httpRequest } from "node:http";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";

async function freePort() {
  const server = createServer(); await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port; await new Promise(resolve => server.close(resolve)); return port;
}

test("the production site serves pages and exact download bytes without development dependencies", async t => {
  const built = spawnSync(process.execPath, ["scripts/build/server-runtime.mjs"], { encoding: "utf8" });
  assert.equal(built.status, 0, built.stderr);
  const root = mkdtempSync(join(tmpdir(), "granttap-production-runtime-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "hetzner"));
  cpSync(".runtime/site-start.mjs", join(root, "hetzner/site-start.mjs"));
  cpSync("dist/standalone/dist", join(root, "dist"), { recursive: true });
  cpSync("dist/standalone/node_modules", join(root, "node_modules"), { recursive: true });
  writeFileSync(join(root, "package.json"), '{"type":"module"}');
  const download = join(root, "dist/client/downloads/engine/0.0.0-fixture"); mkdirSync(download, { recursive: true });
  const bytes = Buffer.from([0, 1, 255, 11, 55, 0]); writeFileSync(join(download, "granttap-engine-darwin-arm64"), bytes);
  const port = await freePort();
  const child = spawn(process.execPath, [join(root, "hetzner/site-start.mjs")], {
    cwd: root, env: { ...process.env, PORT: String(port), HOST: "127.0.0.1" }, stdio: "pipe",
  });
  let errors = ""; child.stderr.on("data", data => { errors += data.toString(); });
  t.after(async () => {
    if (child.exitCode !== null) return;
    const stopped = new Promise(resolve => child.once("exit", resolve)); child.kill("SIGTERM"); await stopped;
  });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(base + "/pricing")).ok) { ready = true; break; } } catch {}
    if (child.exitCode !== null) break;
    await delay(100);
  }
  assert.equal(ready, true, errors);
  for (const path of ["/pricing?lang=ru", "/support", "/licenses", "/control"]) {
    const response = await fetch(base + path); assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type"), /text\/html/);
  }
  const association = await new Promise((resolve, reject) => {
    // Exactly what nginx forwards for Apple's HTTPS fetch: canonical host, forwarded HTTPS, no redirect.
    const call = httpRequest(`${base}/.well-known/apple-app-site-association`,
      { headers: { host: "granttap.com", "x-forwarded-proto": "https" } }, result => {
        const chunks = []; result.on("data", chunk => chunks.push(chunk));
        result.on("end", () => resolve({ status: result.statusCode, headers: result.headers, body: Buffer.concat(chunks).toString() }));
      });
    call.on("error", reject); call.end();
  });
  assert.equal(association.status, 200);
  assert.equal(association.headers["content-type"], "application/json");
  assert.equal(association.headers.location, undefined);
  assert.deepEqual(JSON.parse(association.body).webcredentials.apps, ["XMS5ZC28UJ.com.ziborov.granttap"]);
  const response = await fetch(base + "/downloads/engine/0.0.0-fixture/granttap-engine-darwin-arm64");
  assert.equal(response.status, 200); assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
  const manifest = JSON.parse(readFileSync(".runtime/proof.json", "utf8"));
  assert(manifest.externalImports.every(name => name.startsWith("node:")));
});
