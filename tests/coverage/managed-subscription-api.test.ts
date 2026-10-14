// @vitest-environment node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { D1Database } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";
import { SqliteD1 } from "./account-sqlite";
import { AccountAuth } from "../../worker/account/auth";
import { D1AccountStore } from "../../worker/account/d1-store";
import { AccountMachines } from "../../worker/account/machines";
import { ManagedSubscriptions } from "../../worker/account/subscriptions";
import { routeManagedSubscriptions } from "../../worker/account/subscriptions/api";
import { appleReceipts, type AppleReceipts } from "../../worker/account/subscriptions/apple";
import { signManagedTicket } from "../../worker/account/subscriptions/tickets";

const account = "12345678-1234-4123-8123-123456789012";
const token = Buffer.alloc(32, 4).toString("base64url");
async function setup() {
  const db = new SqliteD1();
  const d1 = db as unknown as D1Database;
  const store = new D1AccountStore(d1);
  await store.createAccount(account, { id: "key", accountId: account, publicKey: new Uint8Array([1]), counter: 0 });
  await store.saveSession(createHash("sha256").update(token).digest("hex"), account, Date.now() + 60_000);
  const machines = new AccountMachines(d1);
  const machine = (await machines.register(account, "Fixture"))!;
  const receipt = { originalTransactionId: "original", transactionId: "transaction",
    appAccountToken: account, bundleId: "com.ziborov.granttap", environment: "Production",
    type: "Auto-Renewable Subscription", productId: "com.ziborov.granttap.personal.solo.monthly",
    purchaseDate: Date.now() - 1_000, signedDate: Date.now(), expiresDate: Date.now() + 600_000 };
  const services = { db: d1, auth: new AccountAuth(store), machines,
    billing: { signingKey: Buffer.alloc(32, 7), receipts: {
      transaction: async (signed: string) => { if (signed !== "verified-fixture") throw Error("invalid"); return receipt; },
      notification: async (signed: string) => signed === "none" ? null : receipt,
    } } };
  const request = (path: string, body?: unknown, authorization = token, method = "POST", origin?: string) =>
    routeManagedSubscriptions(new Request(`https://granttap.com/api/account/${path}`, {
      method, headers: { authorization: `Bearer ${authorization}`, "content-type": "application/json",
        ...(origin ? { origin } : {}) }, body: body === undefined ? undefined : JSON.stringify(body),
    }), services);
  return { db, services, request, machine, receipt };
}

describe("managed receipt HTTP boundary", () => {
  it("recovers a missed Apple refund notification before sharing account rights", async () => {
    const { request, services, receipt } = await setup();
    await new ManagedSubscriptions(services.db).acceptVerified(account, receipt);
    let lookups = 0;
    (services.billing.receipts as AppleReceipts).refresh = async original => {
      expect(original).toBe(receipt.originalTransactionId);
      lookups += 1;
      return [{ ...receipt, signedDate: receipt.signedDate + 1, revocationDate: Date.now() }];
    };
    expect(await (await request("subscriptions/entitlement", undefined, token, "GET"))?.json())
      .toEqual({ entitlement: null });
    expect(lookups).toBe(1);
  });

  it("shares the verified account subscription with a linked client without another purchase", async () => {
    const { request, services, receipt } = await setup();
    expect((await request("subscriptions/entitlement", undefined, "wrong", "GET"))?.status).toBe(401);
    expect(await (await request("subscriptions/entitlement", undefined, token, "GET"))?.json())
      .toEqual({ entitlement: null });
    await new ManagedSubscriptions(services.db).acceptVerified(account, receipt);
    const result = await (await request("subscriptions/entitlement", undefined, token, "GET"))?.json();
    expect(result.entitlement).toMatchObject({ source: "subscription", limit: 2,
      productId: receipt.productId, expiresAt: receipt.expiresDate });
    Object.assign(receipt, { revocationDate: Date.now() });
    receipt.signedDate += 1;
    await new ManagedSubscriptions(services.db).acceptVerified(account, receipt);
    expect(await (await request("subscriptions/entitlement", undefined, token, "GET"))?.json())
      .toEqual({ entitlement: null });
  });

  it("binds verified receipts, rejects invalid and cross-account data, and never trusts a client tier", async () => {
    const { request, receipt } = await setup();
    expect((await request("subscriptions/receipt", { signedTransaction: "verified-fixture", seats: 100 }))?.status).toBe(200);
    expect((await request("subscriptions/receipt", { signedTransaction: "invalid" }))?.status).toBe(400);
    expect((await request("subscriptions/receipt", {}))?.status).toBe(400);
    expect((await request("subscriptions/receipt", { signedTransaction: "verified-fixture" }, "wrong"))?.status).toBe(401);
    receipt.appAccountToken = "22345678-1234-4123-8123-123456789012";
    expect((await request("subscriptions/receipt", { signedTransaction: "verified-fixture" }))?.status).toBe(403);
  });

  it("chooses identity from the machine credential and signs a bounded lease for its room", async () => {
    const { request, receipt, services, machine } = await setup();
    const body = { publicKey: Buffer.alloc(32, 3).toString("base64"), room: "fixture-room", machineId: "ignored" };
    expect((await request("machine/admission", body, machine.machineToken))?.status).toBe(403);
    await new ManagedSubscriptions(services.db).acceptVerified(account, receipt);
    const result = await (await request("machine/admission", body, machine.machineToken))?.json();
    const claim = JSON.parse(Buffer.from(result.ticket.split(".")[0], "base64url").toString());
    expect(claim.computerId).toBe(machine.id);
    expect(claim.publicKey).toBe(body.publicKey);
    expect(claim.room).toBe(body.room);
    expect(claim.expiresAt).toBeLessThanOrEqual(Date.now() + 300_000);
    expect((await request("machine/admission", body, "wrong"))?.status).toBe(401);
    expect((await request("machine/admission", { ...body, room: "bad" }, machine.machineToken))?.status).toBe(400);
    expect((await request(`subscriptions/computers/${machine.id}`, undefined, token, "DELETE"))?.status).toBe(200);
    expect((await request(`subscriptions/computers/${machine.id}`, undefined, token, "DELETE"))?.status).toBe(404);
  });

  it("handles verified notifications, unavailable configuration, methods and origins", async () => {
    const { request, services } = await setup();
    expect((await request("subscriptions/notification", { signedPayload: "none" }, ""))?.status).toBe(200);
    expect((await request("subscriptions/notification", { signedPayload: "verified-fixture" }, ""))?.status).toBe(200);
    expect((await request("subscriptions/receipt", undefined, token, "GET"))?.status).toBe(405);
    expect((await request("subscriptions/receipt", {}, token, "POST", "https://attacker.example"))?.status).toBe(403);
    expect((await request("machine/admission"))?.status).toBe(400);
    expect(await request("unrelated")) .toBeNull();
    expect((await routeManagedSubscriptions(new Request("https://granttap.com/api/account/subscriptions/receipt"),
      { ...services, billing: undefined }))?.status).toBe(503);
    expect(() => signManagedTicket(Buffer.alloc(2), {} as never)).toThrow();
  });

  it("uses Apple's certificate verifier and refuses unsigned payloads", async () => {
    expect(() => appleReceipts([])).toThrow();
    const roots = [readFileSync(new URL("../../worker/account/subscriptions/AppleRootCA-G3.cer", import.meta.url))];
    const verifier = appleReceipts(roots);
    await expect(verifier.transaction("unsigned")).rejects.toThrow();
    await expect(verifier.notification("unsigned")).rejects.toThrow();
  });
});
