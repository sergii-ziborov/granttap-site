// @vitest-environment node
import { describe, expect, it } from "vitest";
import { accountFixture, browserKeys, computerPairing, cookieOf, openSealed, sealBundle } from "./fixture";

async function approvedWithKey(f: Awaited<ReturnType<typeof accountFixture>>, purpose = "sign-in", cookie = "") {
  const keys = browserKeys();
  const qr = await (await f.browser("qr-sign-in/requests", { publicKey: keys.publicKey, purpose }, "POST", cookie)).json();
  const pairing = await computerPairing(f.db, f.accountId);
  const bundle = JSON.stringify({ schema: "granttap.account-web-key.v1", accountId: f.accountId, createdAt: Date.now(), pairings: [pairing] });
  await f.native("qr-sign-in/inspect", { code: qr.code });
  const approval = await f.native("qr-sign-in/approve", { code: qr.code, shareKey: true, ...sealBundle(bundle, keys.publicKey) });
  expect(approval.status).toBe(200);
  const poll = await f.browser("qr-sign-in/poll", { secret: qr.secret }, "POST", cookie);
  return { keys, qr, pairing, bundle, poll, result: await poll.json() };
}

describe("the account key handed over by the phone", () => {
  it("reaches only the approving browser, which stores it once; any browser session can then read it", async () => {
    const f = await accountFixture();
    const { keys, pairing, bundle, poll, result } = await approvedWithKey(f);
    const cookie = cookieOf(poll);
    expect(result.keyTransfer.keyDigest).toMatch(/^[a-f0-9]{64}$/);
    const plaintext = openSealed(result.keyTransfer.sealedKey, keys.secretKey);
    expect(plaintext).toBe(bundle);
    const stored = await f.sqlite.sqlite.prepare("SELECT sealed_key FROM account_qr_requests").get() as { sealed_key: string | null };
    expect(stored.sealed_key).toBeNull();

    expect((await f.browser("web-key", { transferId: result.keyTransfer.id, bundle: bundle + " " }, "PUT", cookie)).status).toBe(400);
    expect((await f.browser("web-key", { transferId: result.keyTransfer.id, bundle }, "PUT", cookie)).status).toBe(404);
    const again = await approvedWithKey(f);
    const second = cookieOf(again.poll);
    const deposited = await f.browser("web-key", { transferId: again.result.keyTransfer.id, bundle: again.bundle }, "PUT", second);
    expect(deposited.status).toBe(200);
    const status = await deposited.json();
    expect(status).toMatchObject({ stored: true, storedFrom: "Chrome on macOS",
      computers: [{ computerId: again.pairing.machineId, name: "MacBook Pro" }] });
    const raw = JSON.stringify(f.sqlite.sqlite.prepare("SELECT * FROM account_web_keys").all());
    expect(raw).not.toContain(again.pairing.mySecretKey);
    expect(raw).not.toContain(pairing.mySecretKey);

    const material = await f.browser("web-key/material", {}, "POST", cookie);
    expect(await material.json()).toEqual({ stored: true, bundle: again.bundle });
    expect((await f.native("web-key/material", {})).status).toBe(403);
    expect(await (await f.native("web-key", undefined, "GET")).json()).toMatchObject({ stored: true });
    expect((await f.native("web-key", { transferId: again.result.keyTransfer.id, bundle: again.bundle }, "PUT")).status).toBe(403);
  });

  it("lets a signed-in browser ask for the key, and refuses another account's phone", async () => {
    const f = await accountFixture();
    const browserSession = (await f.auth.createSession(f.accountId, { kind: "browser", name: "Safari on macOS", signIn: "password", delegated: false })).token;
    const { result, bundle } = await approvedWithKey(f, "key", browserSession);
    expect(result).toMatchObject({ status: "approved", sessionExpiresAt: null });
    expect((await f.browser("web-key", { transferId: result.keyTransfer.id, bundle }, "PUT", browserSession)).status).toBe(200);
    expect((await f.browser("qr-sign-in/requests", { publicKey: browserKeys().publicKey, purpose: "key" })).status).toBe(401);

    const strangerId = crypto.randomUUID();
    await f.db.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").bind(strangerId, Date.now()).run();
    const stranger = (await f.auth.createSession(strangerId, { kind: "app", name: "iPhone", signIn: "passkey", delegated: false })).token;
    const keys = browserKeys();
    const asked = await (await f.browser("qr-sign-in/requests", { publicKey: keys.publicKey, purpose: "key" }, "POST", browserSession)).json();
    expect(await (await f.native("qr-sign-in/inspect", { code: asked.code }, "POST", stranger)).json())
      .toMatchObject({ reason: "different-account" });
    await f.native("qr-sign-in/inspect", { code: asked.code });
    expect(await (await f.native("qr-sign-in/approve", { code: asked.code, shareKey: false })).json()).toMatchObject({ reason: "invalid" });
  });

  it("removal revokes relay admission for the stored controllers", async () => {
    const f = await accountFixture();
    const { result, bundle, pairing, poll } = await approvedWithKey(f);
    await f.browser("web-key", { transferId: result.keyTransfer.id, bundle }, "PUT", cookieOf(poll));
    expect(await (await f.native("web-key", undefined, "DELETE")).json()).toEqual({ removed: true });
    expect(await (await f.native("web-key", undefined, "DELETE")).json()).toEqual({ removed: false });
    expect(await (await f.native("web-key", undefined, "GET")).json()).toEqual({ stored: false });
    const revoked = f.sqlite.sqlite.prepare("SELECT public_key FROM account_web_key_revocations").all() as Array<{ public_key: string }>;
    expect(revoked.map(row => row.public_key)).toEqual([pairing.myPublicKey]);
    expect((await f.browser("web-key/material", {}, "POST", cookieOf(poll))).status).toBe(404);
  });

  it("rejects malformed handoffs and works only with configured storage", async () => {
    const f = await accountFixture(null);
    const keys = browserKeys();
    const qr = await (await f.browser("qr-sign-in/requests", { publicKey: keys.publicKey })).json();
    await f.native("qr-sign-in/inspect", { code: qr.code });
    const sealed = sealBundle("{}", keys.publicKey);
    expect((await f.native("qr-sign-in/approve", { code: qr.code, shareKey: true, ...sealed })).status).toBe(503);
    expect((await f.native("qr-sign-in/approve", { code: qr.code, shareKey: true, sealedKey: { ...sealed.sealedKey, nonce: "x" }, keyDigest: sealed.keyDigest })).status).toBe(400);
    expect((await f.native("qr-sign-in/approve", { code: qr.code, shareKey: true, sealedKey: { ...sealed.sealedKey, box: "A".repeat(56_004) }, keyDigest: sealed.keyDigest })).status).toBe(413);
    expect((await f.native("qr-sign-in/approve", { code: qr.code, shareKey: "yes" })).status).toBe(400);
    expect((await f.browser("web-key/material", {}, "POST", f.phone)).status).toBe(503);
    expect((await f.browser("qr-sign-in/requests", { publicKey: keys.publicKey, purpose: "key" }, "POST", f.phone)).status).toBe(503);
  });
});
