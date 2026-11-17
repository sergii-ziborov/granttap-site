// @vitest-environment node
import { describe, expect, it } from "vitest";
import { accountFixture, browserKeys, cookieOf } from "./fixture";

async function open(f: Awaited<ReturnType<typeof accountFixture>>, body: Record<string, unknown> = {}, cookie = "") {
  const keys = browserKeys();
  const created = await f.browser("qr-sign-in/requests", { publicKey: keys.publicKey, ...body }, "POST", cookie);
  expect(created.status).toBe(201);
  return { ...keys, ...await created.json() as { code: string; secret: string; expiresAt: number; purpose: string } };
}

describe("QR sign-in approved on a phone", () => {
  it("signs a browser in with a delegated HttpOnly session and never twice", async () => {
    const f = await accountFixture();
    const qr = await open(f);
    expect(qr.code).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(qr.purpose).toBe("sign-in");
    expect(await (await f.browser("qr-sign-in/poll", { secret: qr.secret })).json()).toMatchObject({ status: "waiting" });

    const inspected = await f.native("qr-sign-in/inspect", { code: qr.code });
    expect(inspected.status).toBe(200);
    const { request } = await inspected.json() as { request: Record<string, unknown> };
    expect(request).toMatchObject({ purpose: "sign-in", sameNetwork: true, accountKeyStored: false,
      browser: { name: "Chrome", os: "macOS", label: "Chrome on macOS" } });
    expect((await f.native("qr-sign-in/inspect", { code: qr.code })).status).toBe(200);
    expect(await (await f.browser("qr-sign-in/poll", { secret: qr.secret })).json()).toMatchObject({ status: "scanned" });

    const approved = await f.native("qr-sign-in/approve", { code: qr.code, shareKey: false });
    expect(await approved.json()).toMatchObject({ approved: true });
    const poll = await f.browser("qr-sign-in/poll", { secret: qr.secret });
    const result = await poll.json() as Record<string, unknown>;
    expect(result).toMatchObject({ status: "approved", accountId: f.accountId, keyTransfer: null });
    expect(result.token).toBeUndefined();
    expect(poll.headers.get("set-cookie")).toContain("HttpOnly; Secure; SameSite=Strict");
    const cookie = cookieOf(poll);
    expect(await f.auth.accountForToken(cookie)).toBe(f.accountId);
    expect(await f.auth.canManageCredentials(cookie)).toBe(false);

    expect((await f.browser("qr-sign-in/poll", { secret: qr.secret })).status).toBe(410);
    expect(await (await f.native("qr-sign-in/approve", { code: qr.code, shareKey: false })).json()).toMatchObject({ reason: "used" });
    const removal = await f.browser("me", undefined, "DELETE", cookie);
    expect(removal.status).toBe(403);
    const devices = await (await f.browser("devices", undefined, "GET", cookie)).json() as { devices: Array<Record<string, unknown>> };
    expect(devices.devices[0]).toMatchObject({ current: true, kind: "browser", signIn: "qr", delegated: true, name: "Chrome on macOS" });
  });

  it("lets the phone decline, and refuses another device, other accounts and weaker sessions", async () => {
    const f = await accountFixture();
    const qr = await open(f);
    expect((await f.native("qr-sign-in/approve", { code: qr.code, shareKey: false })).status).toBe(409);
    expect((await f.native("qr-sign-in/deny", { code: qr.code })).status).toBe(409);
    await f.native("qr-sign-in/inspect", { code: qr.code }, "POST", f.phone, "198.51.100.1");
    const other = (await f.auth.createSession(f.accountId, { kind: "app", name: "iPad", signIn: "password", delegated: false })).token;
    expect(await (await f.native("qr-sign-in/inspect", { code: qr.code }, "POST", other)).json()).toMatchObject({ reason: "opened-elsewhere" });
    expect(await (await f.native("qr-sign-in/deny", { code: qr.code })).json()).toEqual({ denied: true });
    expect(await (await f.browser("qr-sign-in/poll", { secret: qr.secret })).json()).toMatchObject({ status: "denied" });
    expect(await (await f.native("qr-sign-in/inspect", { code: qr.code })).json()).toMatchObject({ reason: "denied" });

    const delegated = (await f.auth.createSession(f.accountId, { kind: "browser", name: "Chrome", signIn: "qr", delegated: true })).token;
    const second = await open(f);
    expect(await (await f.native("qr-sign-in/inspect", { code: second.code }, "POST", delegated)).json())
      .toMatchObject({ reason: "full-session-required" });
    expect(await (await f.native("qr-sign-in/inspect", { code: second.code }, "POST", "x".repeat(43))).json())
      .toMatchObject({ reason: "sign-in-required" });
    expect(await (await f.browser("qr-sign-in/inspect", { code: second.code })).json()).toMatchObject({ reason: "browser-not-allowed" });
    expect(await (await f.native("qr-sign-in/inspect", { code: "short" })).json()).toMatchObject({ reason: "invalid" });
    expect(await (await f.native("qr-sign-in/inspect", { code: "A".repeat(43) })).json()).toMatchObject({ reason: "expired" });
    const network = await (await f.native("qr-sign-in/inspect", { code: second.code }, "POST", f.phone, "198.51.100.9")).json();
    expect(network.request.sameNetwork).toBe(false);
  });

  it("expires codes, rejects cross-site browsers, query secrets and bad input, and limits creation", async () => {
    const f = await accountFixture();
    const qr = await open(f);
    await f.db.prepare("UPDATE account_qr_requests SET expires_at=?").bind(Date.now() - 1).run();
    expect(await (await f.browser("qr-sign-in/poll", { secret: qr.secret })).json()).toMatchObject({ status: "expired" });
    expect(await (await f.native("qr-sign-in/inspect", { code: qr.code })).json()).toMatchObject({ reason: "expired" });
    const crossSite = await f.call("qr-sign-in/requests", { method: "POST", headers: { origin: "https://evil.example",
      "sec-fetch-site": "cross-site", "content-type": "application/json" }, body: JSON.stringify({ publicKey: browserKeys().publicKey }) });
    expect(crossSite.status).toBe(403);
    expect((await f.browser("qr-sign-in/requests?code=1", { publicKey: browserKeys().publicKey })).status).toBe(400);
    expect((await f.browser("qr-sign-in/requests", { publicKey: "nope" })).status).toBe(400);
    expect((await f.browser("qr-sign-in/requests", { publicKey: browserKeys().publicKey, purpose: "other" })).status).toBe(400);
    expect((await f.browser("qr-sign-in/poll", { secret: 4 })).status).toBe(400);
    expect((await f.browser("qr-sign-in/unknown", {})).status).toBe(404);
    expect((await f.browser("qr-sign-in/poll", undefined, "GET")).status).toBe(405);
    for (let count = 1; count < 30; count++) await f.browser("qr-sign-in/requests", { publicKey: browserKeys().publicKey });
    const limited = await f.browser("qr-sign-in/requests", { publicKey: browserKeys().publicKey });
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe("900");
    expect((await f.browser("qr-sign-in/requests", { publicKey: browserKeys().publicKey }, "POST", "", "192.0.2.4")).status).toBe(201);
  });
});
