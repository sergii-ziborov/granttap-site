// @vitest-environment node
import { randomBytes, randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { tokenHash } from "../../auth";
import { AccountMachines } from "../../machines";
import { accountFixture } from "../../qr-sign-in/tests/fixture";

type Listed = { devices: Array<Record<string, unknown>> };
const DAY = 86_400_000;
const passkey = { kind: "app", name: "GrantTap app", signIn: "passkey", delegated: false } as const;

async function legacySession(f: Awaited<ReturnType<typeof accountFixture>>, expiresInDays = 14) {
  const token = randomBytes(32).toString("base64url"), expiresAt = Date.now() + expiresInDays * DAY;
  await f.db.prepare("INSERT INTO sessions(token_hash,account_id,expires_at) VALUES(?,?,?)")
    .bind(tokenHash(token), f.accountId, expiresAt).run();
  return { token, expiresAt };
}

describe("account sessions after sign-out and sign-in", () => {
  it("signing out of the app ends its session on the server, so it leaves the list at once", async () => {
    const f = await accountFixture();
    const before = (await f.auth.createSession(f.accountId, passkey)).token;
    expect(await (await f.native("logout", undefined, "POST", before)).json()).toEqual({ ok: true });
    expect((await f.native("devices", undefined, "GET", before)).status).toBe(401);
    const listed = await (await f.native("devices", undefined, "GET")).json() as Listed;
    expect(listed.devices.map(device => device.current)).toEqual([true]);
  });

  it("a new sign-in from the same installation replaces its earlier session; another device never does", async () => {
    const f = await accountFixture();
    const install = randomUUID();
    const describeAs = (token: string, installationId: unknown = install, kind = "iphone") =>
      f.native("devices/current", { name: "Serhii's iPhone", kind, installationId }, "PATCH", token);
    expect(await (await describeAs(f.phone)).json()).toEqual({ updated: true, replaced: 0 });
    // Signed out while offline: the server never heard, then the same app signed in again.
    const again = (await f.auth.createSession(f.accountId, passkey)).token;
    expect(await (await describeAs(again)).json()).toEqual({ updated: true, replaced: 1 });
    expect(await f.auth.accountForToken(f.phone)).toBeNull();
    expect(await (await describeAs(again)).json()).toEqual({ updated: true, replaced: 0 });

    const ipad = (await f.auth.createSession(f.accountId, passkey)).token;
    expect(await (await describeAs(ipad, randomUUID(), "ipad")).json()).toEqual({ updated: true, replaced: 0 });
    const browser = (await f.auth.createSession(f.accountId, { kind: "browser", name: "Safari on macOS", signIn: "qr", delegated: true })).token;
    const listed = await (await f.native("devices", undefined, "GET", again)).json() as Listed;
    expect(listed.devices[0]).toMatchObject({ kind: "iphone", current: true });
    expect(listed.devices.map(device => device.kind).sort()).toEqual(["browser", "ipad", "iphone"]);
    expect(await f.auth.accountForToken(browser)).toBe(f.accountId);

    // A late request from an earlier session of the same installation cannot push the newer one out.
    const newest = (await f.auth.createSession(f.accountId, passkey)).token;
    await f.db.prepare("UPDATE sessions SET expires_at=expires_at+1000 WHERE token_hash=?").bind(tokenHash(newest)).run();
    const late = (await f.auth.createSession(f.accountId, passkey)).token;
    expect(await (await describeAs(newest)).json()).toEqual({ updated: true, replaced: 1 });
    expect(await (await describeAs(late)).json()).toEqual({ updated: true, replaced: 1 });
    expect(await f.auth.accountForToken(newest)).toBe(f.accountId);
    expect(await f.auth.accountForToken(late)).toBeNull();

    expect((await describeAs(newest, "not-an-installation")).status).toBe(400);
    expect((await describeAs(newest, 42)).status).toBe(400);
  });

  it("an older sign-in says what is known: when it began, how it signed in if recorded, and what used it", async () => {
    const f = await accountFixture();
    const silent = await legacySession(f);
    const native = await legacySession(f, 20), web = await legacySession(f, 25);
    const linked = await legacySession(f, 10);
    await f.db.prepare("INSERT INTO account_login_tokens(id,account_id,token_hash,name,created_at,expires_at,max_uses) VALUES(?,?,?,?,?,?,?)")
      .bind(randomUUID(), f.accountId, "f".repeat(64), "Old link", Date.now() - 20 * DAY, Date.now() + 5 * DAY, 3).run();
    await f.db.prepare("INSERT INTO account_login_token_sessions(session_hash,login_token_id) SELECT ?,id FROM account_login_tokens")
      .bind(tokenHash(linked.token)).run();
    // An older app build and an open browser tab keep using theirs.
    expect((await f.native("me", undefined, "GET", native.token)).status).toBe(200);
    expect((await f.browser("me", undefined, "GET", web.token)).status).toBe(200);

    const listed = await (await f.native("devices", undefined, "GET")).json() as Listed;
    const by = (expiresAt: number) => listed.devices.find(device => device.expiresAt === expiresAt)!;
    expect(listed.devices.find(device => device.current)).toMatchObject({ older: false, signIn: "passkey" });
    expect(by(silent.expiresAt)).toMatchObject({ kind: "unknown", signIn: null, older: true,
      createdAt: silent.expiresAt - 30 * DAY, lastSeenAt: null });
    expect(by(native.expiresAt)).toMatchObject({ kind: "app", name: "GrantTap app", older: true, signIn: null });
    expect(by(native.expiresAt).lastSeenAt).toBeGreaterThan(Date.now() - 60_000);
    expect(by(web.expiresAt)).toMatchObject({ kind: "browser", name: "Chrome on macOS", older: true });
    expect(listed.devices.find(device => device.signIn === "token")).toMatchObject({ older: true, delegated: true,
      createdAt: linked.expiresAt - 30 * DAY });
  });

  it("removes every older sign-in at once, but never the asking device, a described session or a computer", async () => {
    const f = await accountFixture();
    await legacySession(f);
    await legacySession(f, 3);
    const asking = await legacySession(f, 29);
    const described = (await f.auth.createSession(f.accountId, { kind: "browser", name: "Firefox on Windows", signIn: "password", delegated: false })).token;
    const mac = (await new AccountMachines(f.db).register(f.accountId, "MacBook Pro"))!;
    expect((await f.native("devices/prune", { older: false })).status).toBe(400);
    expect((await f.native("devices/prune", { older: true, inactiveDays: 30 })).status).toBe(400);
    const pruned = await (await f.native("devices/prune", { older: true }, "POST", asking.token)).json() as { removed: Array<Record<string, unknown>> };
    expect(pruned.removed.map(item => [item.type, item.name])).toEqual([["session", "Signed-in device"], ["session", "Signed-in device"]]);
    expect(await f.auth.accountForToken(asking.token)).toBe(f.accountId);
    expect(await f.auth.accountForToken(described)).toBe(f.accountId);
    expect(await f.auth.accountForToken(f.phone)).toBe(f.accountId);
    expect(await new AccountMachines(f.db).owner(mac.id)).not.toBeNull();
  });
});
