import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, createSign, generateKeyPairSync, randomBytes } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { encodeCBOR } from "@levischuck/tiny-cbor";

const credentialId = randomBytes(32);
const credentialName = credentialId.toString("base64url");
const key = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const publicJwk = key.publicKey.export({ format: "jwk" });
const rpHash = createHash("sha256").update("granttap.com").digest();

function clientData(type, challenge) {
  return Buffer.from(JSON.stringify({ type, challenge, origin: "https://granttap.com",
    crossOrigin: false })).toString("base64url");
}

function authenticatorData(counter, flags) {
  const count = Buffer.alloc(4);
  count.writeUInt32BE(counter);
  return Buffer.concat([rpHash, Buffer.from([flags]), count]);
}

function registration(challenge) {
  const cose = encodeCBOR(new Map([
    [1, 2], [3, -7], [-1, 1],
    [-2, Buffer.from(publicJwk.x, "base64url")],
    [-3, Buffer.from(publicJwk.y, "base64url")],
  ]));
  const length = Buffer.alloc(2);
  length.writeUInt16BE(credentialId.length);
  const authData = Buffer.concat([authenticatorData(0, 0x45), Buffer.alloc(16),
    length, credentialId, Buffer.from(cose)]);
  return { id: credentialName, rawId: credentialName, type: "public-key",
    response: { clientDataJSON: clientData("webauthn.create", challenge),
      attestationObject: Buffer.from(encodeCBOR(new Map([
        ["fmt", "none"], ["attStmt", new Map()], ["authData", authData],
      ]))).toString("base64url"), transports: ["internal"] },
    clientExtensionResults: {} };
}

function assertion(challenge) {
  const authData = authenticatorData(1, 0x05);
  const client = clientData("webauthn.get", challenge);
  const signer = createSign("SHA256");
  signer.update(Buffer.concat([authData,
    createHash("sha256").update(Buffer.from(client, "base64url")).digest()]));
  return { id: credentialName, rawId: credentialName, type: "public-key",
    response: { clientDataJSON: client, authenticatorData: authData.toString("base64url"),
      signature: signer.sign(key.privateKey).toString("base64url"), userHandle: null },
    clientExtensionResults: {} };
}

async function freePort() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

test("live Hetzner connect service exposes account ceremonies but cannot forge passkey consent", async t => {
  const directory = await mkdtemp(join(tmpdir(), "granttap-passkey-service-"));
  const port = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ["--import", "tsx", "hetzner/server.mjs"], {
    cwd: new URL("../", import.meta.url).pathname,
    env: { ...process.env, PORT: String(port), HOST: "127.0.0.1",
      GRANTTAP_ACCOUNT_DB: join(directory, "accounts.sqlite"),
      GRANTTAP_CONNECT_STORE: join(directory, "connect.json") },
    stdio: "ignore",
  });
  t.after(async () => { child.kill(); await rm(directory, { recursive: true, force: true }); });
  for (let attempt = 0; attempt < 200; attempt++) {
    if (child.exitCode !== null) throw new Error("Hetzner server exited before startup");
    try { if ((await fetch(`${origin}/healthz`)).ok) break; } catch { /* starting */ }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.equal((await fetch(`${origin}/healthz`)).status, 200);

  const options = await fetch(`${origin}/api/account/authentication/options`, {
    method: "POST", headers: { origin: "https://granttap.com", "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(options.status, 200);
  assert.equal(typeof (await options.json()).options.challenge, "string");
  assert.equal((await fetch(`${origin}/api/account/authentication/options`, {
    method: "POST", headers: { origin: "https://attacker.example" },
  })).status, 403);

  const requestId = "a1111111-1111-4111-8111-111111111111";
  const url = `${origin}/api/connect/requests/${requestId}`;
  const requestSecret = randomBytes(32).toString("base64url");
  assert.equal((await fetch(url, { method: "PUT", headers: { "content-type": "application/json",
      authorization: `Bearer ${requestSecret}` },
    body: JSON.stringify({ clientName: "Codex", computerName: "Test Mac", passkeyCapable: true,
      purpose: "account-link",
      decision: "passkey" }) })).status, 200);
  const snapshot = await (await fetch(url)).json();
  assert.equal(snapshot.decision, undefined);
  assert.equal(snapshot.passkeyCapable, true);
  assert.equal(snapshot.purpose, "account-link");
  assert.equal((await fetch(`${url}/decision`, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ decision: "passkey" }) })).status, 400);
  assert.equal((await fetch(`${url}/passkey`, { method: "POST",
    headers: { origin: "https://attacker.example", "content-type": "application/json" },
    body: JSON.stringify({ ceremonyId: requestId, response: { id: "fake" } }) })).status, 403);
  assert.equal((await fetch(`${url}/passkey`, { method: "POST",
    headers: { origin: "https://granttap.com", "content-type": "application/json" },
    body: JSON.stringify({ ceremonyId: requestId, response: { id: "fake" } }) })).status, 401);
  assert.equal((await (await fetch(url)).json()).decision, undefined);

  const oldRequest = `${origin}/api/connect/requests/b2222222-2222-4222-8222-222222222222`;
  await fetch(oldRequest, { method: "PUT", headers: { "content-type": "application/json" },
    body: JSON.stringify({ clientName: "Older Codex" }) });
  assert.equal((await fetch(`${oldRequest}/passkey`, { method: "POST",
    headers: { origin: "https://granttap.com", "content-type": "application/json" },
    body: JSON.stringify({ ceremonyId: requestId, response: { id: "fake" } }) })).status, 409);

  const jsonPost = async (path, body) => fetch(`${origin}${path}`, {
    method: "POST", headers: { origin: "https://granttap.com", "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const create = await (await jsonPost("/api/account/registration/options", {})).json();
  const account = await jsonPost("/api/account/registration/verify", {
    ceremonyId: create.ceremonyId, response: registration(create.options.challenge),
  });
  assert.equal(account.status, 200);
  const login = await (await jsonPost("/api/account/authentication/options", {})).json();
  const approval = await jsonPost(`/api/connect/requests/${requestId}/passkey`, {
    ceremonyId: login.ceremonyId, response: assertion(login.options.challenge),
  });
  assert.equal(approval.status, 200);
  assert.match(approval.headers.get("set-cookie") ?? "", /HttpOnly/);
  assert.equal((await (await fetch(url)).json()).decision, "passkey");
  assert.equal((await (await fetch(url)).json()).machineToken, undefined);
  const privateRow = await (await fetch(url, {
    headers: { authorization: `Bearer ${requestSecret}` },
  })).json();
  assert.match(privateRow.machineToken ?? "", /^[A-Za-z0-9_-]{43}$/);
  assert.match(privateRow.machineId ?? "", /^[0-9a-f-]{36}$/);
  assert.equal((await jsonPost(`/api/connect/requests/${requestId}/redirect`, {
    redirectUrl: "https://granttap.com/account",
  })).status, 200);
  assert.equal((await jsonPost(`/api/connect/requests/${requestId}/redirect`, {
    redirectUrl: "https://elsewhere.example/account",
  })).status, 400);
  assert.equal((await fetch(`${origin}/api/account/machine/requests`, {
    headers: { authorization: `Bearer ${privateRow.machineToken}` },
  })).status, 200);
});
