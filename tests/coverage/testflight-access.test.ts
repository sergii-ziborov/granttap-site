// @vitest-environment node
import { createHash } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";
import { SqliteD1 } from "./account-sqlite";
import { AccountAuth } from "../../worker/account/auth";
import { D1AccountStore } from "../../worker/account/d1-store";
import { AccountMachines } from "../../worker/account/machines";
import { ManagedSubscriptions } from "../../worker/account/subscriptions";
import { routeManagedSubscriptions } from "../../worker/account/subscriptions/api";
import type { AppleReceipts } from "../../worker/account/subscriptions/apple";

async function fixture() {
  const db = new SqliteD1();
  const d1 = db as unknown as D1Database;
  const store = new D1AccountStore(d1);
  const tokens = [Buffer.alloc(32, 1).toString("base64url"), Buffer.alloc(32, 2).toString("base64url")];
  for (const [index, id] of ["owner", "other"].entries()) {
    await store.createAccount(id, { id: `${id}-key`, accountId: id, publicKey: new Uint8Array([1]), counter: 0 });
    await store.saveSession(createHash("sha256").update(tokens[index]).digest("hex"), id, Date.now() + 60_000);
  }
  const receipt = { receiptType: "Sandbox", bundleId: "com.ziborov.granttap", appAppleId: 6809739366,
    applicationVersion: "201", appTransactionId: "12345", receiptCreationDate: Date.now() };
  const receipts: AppleReceipts & { appTransaction: (signed: string) => Promise<typeof receipt> } = {
    transaction: async () => { throw Error("not a subscription"); }, notification: async () => null,
    appTransaction: async signed => { if (signed !== "signed-app") throw Error("invalid signature"); return receipt; },
  };
  const services = { db: d1, auth: new AccountAuth(store), machines: new AccountMachines(d1),
    billing: { signingKey: Buffer.alloc(32, 7), receipts } };
  const send = (body: unknown = { signedAppTransaction: "signed-app" }, token = tokens[0], method = "POST",
    origin?: string) => routeManagedSubscriptions(new Request(
      "https://granttap.com/api/account/subscriptions/testflight", { method,
        headers: { "content-type": "application/json", authorization: `Bearer ${token}`, ...(origin ? { origin } : {}) },
        body: method === "GET" ? undefined : JSON.stringify(body) }), services);
  return { db, d1, receipt, receipts, send, tokens };
}

describe("TestFlight managed access without a subscription", () => {
  it("stores verified beta access durably for this account and admits an offline computer later", async () => {
    const { d1, receipt, send } = await fixture();
    const response = await send();
    expect(response?.status).toBe(200);
    const data = await response?.json();
    expect(data).toEqual({ expiresAt: receipt.receiptCreationDate + 90 * 86400_000 });
    const reopened = new ManagedSubscriptions(d1);
    expect(await reopened.entitlement("owner")).toMatchObject({ source: "beta", limit: 100 });
    expect(await reopened.entitlement("other")).toBeNull();
    expect(await reopened.admit("owner", "33333333-3333-4333-8333-123456789012")).not.toBeNull();
  });

  it("requires authentication, the intended HTTP method and a signed bounded app receipt", async () => {
    const { send } = await fixture();
    expect((await send(undefined, "wrong"))?.status).toBe(401);
    expect((await send(undefined, undefined, "GET"))?.status).toBe(405);
    expect((await send(undefined, undefined, "POST", "https://other.example"))?.status).toBe(403);
    for (const signedAppTransaction of [null, "", "x".repeat(15001), "invalid"]) {
      expect((await send({ signedAppTransaction }))?.status).toBe(400);
    }
  });

  it.each([
    { receiptType: "Production" }, { bundleId: "other.app" }, { appAppleId: 1 },
    { applicationVersion: "" }, { appTransactionId: "" }, { receiptCreationDate: NaN },
    { receiptCreationDate: Date.now() + 120_000 }, { receiptCreationDate: Date.now() - 91 * 86400_000 },
  ])("never turns invalid or production app evidence into beta rights: %j", async invalid => {
    const { send, receipt, d1 } = await fixture();
    Object.assign(receipt, invalid);
    expect((await send())?.status).toBe(400);
    expect(await new ManagedSubscriptions(d1).entitlement("owner")).toBeNull();
  });

  it("prevents receipt replay between accounts and preserves explicit revocation", async () => {
    const { send, tokens, db, d1 } = await fixture();
    expect((await send())?.status).toBe(200);
    expect((await send(undefined, tokens[1]))?.status).toBe(403);
    db.sqlite.prepare("UPDATE account_beta_relay_grants SET revoked_at=1 WHERE account_id='owner'").run();
    expect((await send())?.status).toBe(403);
    expect(await new ManagedSubscriptions(d1).entitlement("owner")).toBeNull();
  });
});
