// @vitest-environment node
import { createHash } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import { expect, test } from "vitest";
import { SqliteD1 } from "../../sqlite";
import { AccountAuth } from "../../auth";
import { D1AccountStore } from "../../d1-store";
import { ManagedSubscriptions } from "../../subscriptions";
import { routeSubscriptionRetention, type RetentionBilling } from "../api";
import type { ManagedBilling } from "../../subscriptions/api";
const account = "12345678-1234-4123-8123-123456789012";
const token = Buffer.alloc(32, 4).toString("base64url");
async function setup() {
  const durable = new SqliteD1(":memory:");
  const db = durable as unknown as D1Database;
  const store = new D1AccountStore(db);
  await store.createAccount(account, { id: "key", accountId: account, publicKey: new Uint8Array([1]), counter: 0 });
  await store.saveSession(createHash("sha256").update(token).digest("hex"), account, Date.now() + 60_000);
  const retention: RetentionBilling = { keyId: "fixture", sign: () => "signature", unusedHistory: async () => true };
  const services: { db: D1Database; auth: AccountAuth; billing?: ManagedBilling } = {
    db, auth: new AccountAuth(store), billing: { signingKey: Buffer.alloc(32, 7), retention,
      receipts: { transaction: async () => { throw Error("unsigned"); }, notification: async () => null } } };
  const receipt = { originalTransactionId: "original", transactionId: "transaction", appAccountToken: account,
    bundleId: "com.ziborov.granttap", environment: "Production", type: "Auto-Renewable Subscription",
    productId: "com.ziborov.granttap.personal.solo.monthly", purchaseDate: Date.now() - 1_000,
    signedDate: Date.now(), expiresDate: Date.now() + 600_000 };
  const request = (body: unknown = { intent: "cancel" }, path = "cancellation-offer", authorization = token,
    method = "POST", origin?: string) => routeSubscriptionRetention(new Request(
      `https://granttap.com/api/account/subscriptions/${path}`, { method,
        headers: { authorization: `Bearer ${authorization}`, "content-type": "application/json", ...(origin ? { origin } : {}) },
        body: method === "GET" ? undefined : JSON.stringify(body) }), services);
  return { durable, db, services, request, receipt, retention };
}

test("only a signed-in production subscriber receives an offer; beta access alone does not qualify", async () => {
  const { request, db, receipt, retention } = await setup();
  expect(await (await request())!.json()).toEqual({ offer: null });
  await new ManagedSubscriptions(db).acceptVerified(account, receipt);
  const first = await (await request())!.json();
  expect(first.offer).toMatchObject({ productId: receipt.productId, keyId: "fixture", signature: "signature" });
  expect(await (await request())!.json()).toEqual(first);
  retention.unusedHistory = async () => false;
  expect(await (await request())!.json()).toEqual({ offer: null });
  retention.unusedHistory = async () => { throw Error("Apple unavailable"); };
  expect((await request())!.status).toBe(503);
});

test("offer and feedback routes enforce sessions, methods, same origin and bounded input", async () => {
  const { request, services } = await setup();
  expect((await request({}, "cancellation-offer", "wrong"))!.status).toBe(401);
  expect((await request({}, "cancellation-offer", token, "GET"))!.status).toBe(405);
  expect((await request({}, "cancellation-offer", token, "POST", "https://attacker.example"))!.status).toBe(403);
  expect((await request({}))!.status).toBe(400);
  expect((await request("x".repeat(20_000)))!.status).toBe(400);
  expect(await request({}, "unknown")).toBeNull();
  services.billing = undefined;
  expect((await request())!.status).toBe(503);
});

test("optional feedback is idempotent and is never a cancellation or an entitlement", async () => {
  const { request, db } = await setup();
  const body = { feedbackId: crypto.randomUUID(), reason: "price", comment: "Optional response" };
  for (let retry = 0; retry < 2; retry++) {
    expect(await (await request(body, "cancellation-feedback"))!.json()).toEqual({ saved: true });
  }
  expect(await new ManagedSubscriptions(db).entitlement(account)).toBeNull();
  expect((await request({ ...body, reason: "unknown" }, "cancellation-feedback"))!.status).toBe(400);
  for (let n = 0; n < 4; n++) await request({ ...body, feedbackId: crypto.randomUUID() }, "cancellation-feedback");
  expect((await request({ ...body, feedbackId: crypto.randomUUID() }, "cancellation-feedback"))!.status).toBe(429);
});

test("a missing offer signer leaves Apple cancellation available without issuing a discount", async () => {
  const { request, db, receipt, services } = await setup();
  await new ManagedSubscriptions(db).acceptVerified(account, receipt);
  services.billing!.retention = undefined;
  expect(await (await request())!.json()).toEqual({ offer: null });
});
