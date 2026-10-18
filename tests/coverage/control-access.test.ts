// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { D1Database } from "@cloudflare/workers-types";
import { SqliteD1 } from "./account-sqlite";
import { AccountAuth } from "../../worker/account/auth";
import { D1AccountStore } from "../../worker/account/d1-store";
import { handleAccountApi } from "../../worker/account/api";
import type { ManagedBilling } from "../../worker/account/subscriptions/api";
import { ManagedSubscriptions } from "../../worker/account/subscriptions";
import { AccountMachines } from "../../worker/account/machines";

const account = "12345678-1234-4123-8123-123456789012";
async function fixture() {
  const db = new SqliteD1();
  const d1 = db as unknown as D1Database;
  const store = new D1AccountStore(d1);
  await store.createAccount(account, { id: "control-passkey", accountId: account,
    publicKey: new Uint8Array([1]), counter: 0 });
  const session = await new AccountAuth(store).createSession(account);
  const machines = new AccountMachines(d1);
  const machine = (await machines.register(account, "Control fixture"))!;
  const billing: ManagedBilling = { signingKey: Buffer.alloc(32, 7), receipts: {
    transaction: async () => { throw Error("No client-selected receipt"); }, notification: async () => null,
  } };
  const request = (options: { token?: string; origin?: string; method?: string;
    billing?: ManagedBilling | null; query?: string; path?: string; body?: unknown } = {}) => handleAccountApi(new Request(
      `https://granttap.com/api/account/${options.path ?? "control/access"}${options.query ?? ""}`, {
        method: options.method ?? "GET", headers: {
          authorization: `Bearer ${options.token ?? session.token}`,
          "content-type": "application/json",
          ...(options.origin ? { origin: options.origin } : {}),
        },
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      }), d1, options.billing === null ? undefined : options.billing ?? billing);
  const grant = () => db.sqlite.prepare(`INSERT INTO account_beta_relay_grants(account_id,expires_at)
    VALUES(?,?)`).run(account, Date.now() + 60_000);
  return { db, d1, request, grant, billing, machines, machine };
}

describe("account-bound web control access", () => {
  it("issues controller leases only for the account's published computer route", async () => {
    const f = await fixture(); f.grant();
    const room = "controller-fixture", machineKey = Buffer.alloc(32, 4).toString("base64");
    expect((await f.request({ path: "machine/admission", method: "POST", token: f.machine.machineToken,
      body: { room, publicKey: machineKey } }))?.status).toBe(200);
    const body = { room, computerId: f.machine.id, publicKey: Buffer.alloc(32, 9).toString("base64") };
    const request = (change = {}, extra = {}) => f.request({ path: "control/admission", method: "POST",
      body: { ...body, ...change }, ...extra });
    expect((await request({}, { token: "invalid" }))?.status).toBe(401);
    const response = await request();
    expect(response?.status).toBe(200);
    const result = await response?.json();
    const ticket = JSON.parse(Buffer.from(result.ticket.split(".")[0], "base64url").toString());
    expect(ticket).toMatchObject({ version: 2, role: "phone", accountId: account,
      computerId: f.machine.id, publicKey: body.publicKey, room });
    expect(ticket.expiresAt).toBeLessThanOrEqual(Date.now() + 300_000);
    expect((await request({ publicKey: Buffer.alloc(32, 8).toString("base64") }))?.status).toBe(200);
    expect(await new ManagedSubscriptions(f.d1).selectedComputerCount(account)).toBe(1);
    expect((await request({ room: "another-room" }))?.status).toBe(403);
    expect((await request({ computerId: "22345678-1234-4123-8123-123456789012" }))?.status).toBe(403);
    expect((await request({ mySecretKey: "must-never-be-sent" }))?.status).toBe(400);
    expect((await request({ publicKey: "invalid" }))?.status).toBe(400);
    await f.machines.revoke(account, f.machine.id);
    expect((await request())?.status).toBe(403);
    f.db.sqlite.close();
  });

  it("requires authentication and a current server-confirmed entitlement", async () => {
    const f = await fixture();
    expect((await f.request({ token: "invalid" }))?.status).toBe(401);
    expect((await f.request({ query: "?plan=fleet&accountId=other&testflight=true" }))?.status).toBe(403);
    f.grant();
    const response = await f.request();
    expect(response?.status).toBe(200);
    expect(await response?.json()).toMatchObject({ accountId: account,
      access: { source: "beta", computerLimit: 100 } });
    f.db.sqlite.prepare("UPDATE account_beta_relay_grants SET revoked_at=? WHERE account_id=?")
      .run(Date.now(), account);
    expect((await f.request())?.status).toBe(403);
    f.db.sqlite.close();
  });

  it("does not trust cross-origin requests, missing verification or expired grants", async () => {
    const f = await fixture(); f.grant();
    expect((await f.request({ origin: "https://attacker.example" }))?.status).toBe(403);
    expect((await f.request({ billing: null }))?.status).toBe(503);
    expect((await f.request({ method: "POST" }))?.status).toBe(405);
    f.db.sqlite.prepare("UPDATE account_beta_relay_grants SET expires_at=? WHERE account_id=?")
      .run(Date.now() - 1, account);
    expect((await f.request())?.status).toBe(403);
    f.db.sqlite.close();
  });

  it("reconciles a paid subscription and refuses access when its issuer cannot confirm it", async () => {
    const f = await fixture();
    const now = Date.now();
    await new ManagedSubscriptions(f.d1).acceptVerified(account, {
      originalTransactionId: "control-original", transactionId: "control-transaction",
      appAccountToken: account, bundleId: "com.ziborov.granttap", environment: "Production",
      type: "Auto-Renewable Subscription", productId: "com.ziborov.granttap.personal.solo.monthly",
      purchaseDate: now - 1_000, signedDate: now, expiresDate: now + 600_000,
    });
    const result = await (await f.request({ origin: "https://granttap.com" }))?.json();
    expect(result.access).toMatchObject({ source: "subscription", computerLimit: 2 });
    expect(result.access.expiresAt).toBeLessThanOrEqual(Date.now() + 300_000);
    f.billing.receipts.refresh = async () => { throw Error("Issuer unavailable"); };
    expect((await f.request())?.status).toBe(503);
    f.db.sqlite.close();
  });
});
