// @vitest-environment node
import { randomBytes } from "node:crypto";
import { describe, expect, it } from "vitest";
import { tokenHash } from "../../auth";
import { AccountMachineEndpoints } from "../../control-access";
import { AccountMachines } from "../../machines";
import { accountFixture } from "../../qr-sign-in/tests/fixture";

type Listed = { devices: Array<Record<string, unknown>> };

describe("account devices", () => {
  it("lists sessions and computers for the phone and the web, with the asking device first", async () => {
    const f = await accountFixture();
    const browser = (await f.auth.createSession(f.accountId, { kind: "browser", name: "Firefox on Windows", signIn: "password", delegated: false })).token;
    const machine = (await new AccountMachines(f.db).register(f.accountId, "MacBook Pro"))!;
    await new AccountMachineEndpoints(f.db).publish({ accountId: f.accountId, machineId: machine.id },
      "room-fixture-1", Buffer.alloc(32, 3).toString("base64"));
    // Pin activity so the order does not depend on how fast the rows were written.
    await f.db.prepare("UPDATE account_session_details SET created_at=?,last_seen_at=? WHERE session_hash=?")
      .bind(Date.now() - 600_000, Date.now() - 600_000, tokenHash(browser)).run();
    const listed = await (await f.native("devices", undefined, "GET")).json() as Listed;
    expect(listed.devices.map(device => device.type)).toEqual(["session", "computer", "session"]);
    expect(listed.devices[0]).toMatchObject({ current: true, kind: "app", signIn: "passkey", delegated: false });
    expect(listed.devices[1]).toMatchObject({ id: machine.id, kind: "computer", name: "MacBook Pro", expiresAt: null });
    expect(listed.devices[1].encryptionKeyId).toMatch(/^[a-f0-9]{64}$/);
    expect(listed.devices[2]).toMatchObject({ name: "Firefox on Windows", current: false });

    expect(await (await f.native("devices/current", { name: "Serhii's iPhone", kind: "iphone" }, "PATCH")).json()).toEqual({ updated: true, replaced: 0 });
    expect((await f.native("devices/current", { name: "", kind: "iphone" }, "PATCH")).status).toBe(400);
    expect((await f.native("devices/current", { name: "Phone", kind: "watch" }, "PATCH")).status).toBe(400);
    expect((await f.browser("devices/current", { name: "Mine", kind: "mac" }, "PATCH", browser)).status).toBe(403);
    const renamed = await (await f.native("devices", undefined, "GET")).json() as Listed;
    expect(renamed.devices[0]).toMatchObject({ kind: "iphone", name: "Serhii's iPhone" });

    const browserId = renamed.devices.find(device => device.name === "Firefox on Windows")!.id;
    expect(await (await f.native(`devices/sessions/${browserId}`, undefined, "DELETE")).json()).toEqual({ revoked: true });
    expect(await f.auth.accountForToken(browser)).toBeNull();
    expect((await f.native(`devices/sessions/${browserId}`, undefined, "DELETE")).status).toBe(404);
    expect(await (await f.native(`devices/computers/${machine.id}`, undefined, "DELETE")).json()).toEqual({ revoked: true });
    expect(await new AccountMachines(f.db).owner(machine.id)).toBeNull();
    expect((await f.native("devices/sessions/not-a-uuid", undefined, "DELETE")).status).toBe(405);
  });

  it("gives older sessions an identity, describes the current browser and signs itself out", async () => {
    const f = await accountFixture();
    const legacy = randomBytes(32).toString("base64url");
    const expiresAt = Date.now() + 86_400_000;
    await f.db.prepare("INSERT INTO sessions(token_hash,account_id,expires_at) VALUES(?,?,?)")
      .bind(tokenHash(legacy), f.accountId, expiresAt).run();
    const listed = await (await f.native("devices", undefined, "GET")).json() as Listed;
    const old = listed.devices.find(device => !device.current)!;
    expect(old).toMatchObject({ kind: "unknown", name: "Signed-in device", signIn: null, older: true,
      createdAt: expiresAt - 30 * 86_400_000, lastSeenAt: null });
    expect(old.id).toMatch(/^[0-9a-f-]{36}$/);
    const asBrowser = await (await f.browser("devices", undefined, "GET", legacy)).json() as Listed;
    expect(asBrowser.devices[0]).toMatchObject({ current: true, kind: "browser", name: "Chrome on macOS" });
    const self = await f.browser(`devices/sessions/${old.id}`, undefined, "DELETE", legacy);
    expect(self.headers.get("set-cookie")).toContain("Max-Age=0");
    expect((await f.browser("devices", undefined, "GET", legacy)).status).toBe(401);
    expect((await f.call("devices", { method: "DELETE", headers: { origin: "https://evil.example" } })).status).toBe(403);
    expect((await f.native("devices", undefined, "PUT")).status).toBe(405);
  });

  it("prunes what has been quiet for the chosen days but never the asking device", async () => {
    const f = await accountFixture();
    const old = Date.now() - 40 * 86_400_000;
    const quiet = (await f.auth.createSession(f.accountId, { kind: "browser", name: "Old laptop", signIn: "qr", delegated: true })).token;
    await f.db.prepare("UPDATE account_session_details SET created_at=?,last_seen_at=? WHERE session_hash=?").bind(old, old, tokenHash(quiet)).run();
    const fresh = (await f.auth.createSession(f.accountId, { kind: "browser", name: "Today", signIn: "password", delegated: false })).token;
    const stale = (await new AccountMachines(f.db).register(f.accountId, "Old Mac"))!;
    await f.db.prepare("UPDATE account_machines SET created_at=? WHERE id=?").bind(old, stale.id).run();
    await f.db.prepare("UPDATE account_session_details SET last_seen_at=? WHERE session_hash=?").bind(old, tokenHash(f.phone)).run();
    expect((await f.native("devices/prune", { inactiveDays: 3 })).status).toBe(400);
    const pruned = await (await f.native("devices/prune", { inactiveDays: 30 })).json() as { removed: Array<Record<string, unknown>> };
    expect(pruned.removed.map(item => item.name).sort()).toEqual(["Old Mac", "Old laptop"]);
    expect(await f.auth.accountForToken(fresh)).toBe(f.accountId);
    expect(await f.auth.accountForToken(f.phone)).toBe(f.accountId);
  });

  it("summarises sign-in methods and the asking session", async () => {
    const f = await accountFixture();
    await f.db.prepare("INSERT INTO account_password_credentials(account_id,login,password_hash,updated_at) VALUES(?,?,?,?)")
      .bind(f.accountId, "owner", "fixture", Date.now()).run();
    const summary = await (await f.native("summary", undefined, "GET")).json();
    expect(summary).toMatchObject({ accountId: f.accountId, session: { signIn: "passkey", delegated: false },
      methods: { passkeys: 0, password: "owner", signInTokens: 0 } });
    expect((await f.native("summary", undefined, "GET", "y".repeat(43))).status).toBe(401);
  });
});
