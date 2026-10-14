// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";
import { SqliteD1 } from "./account-sqlite";
import { ManagedSubscriptions } from "../../worker/account/subscriptions";

const account = "12345678-1234-4123-8123-123456789012";
const computer = (id: number) => `33333333-3333-4333-8333-${String(id).padStart(12, "0")}`;
const other = "22345678-1234-4123-8123-123456789012";
function setup() {
  const db = new SqliteD1();
  for (const id of [account, other]) db.sqlite.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").run(id, 1);
  let now = 1_000;
  const service = new ManagedSubscriptions(db as unknown as D1Database, () => now);
  const transaction = (productId = "com.ziborov.granttap.personal.solo.monthly", extra = {}) => ({
    originalTransactionId: "original", transactionId: "renewal", appAccountToken: account,
    bundleId: "com.ziborov.granttap", environment: "Production", productId,
    type: "Auto-Renewable Subscription", purchaseDate: 100, signedDate: 900, expiresDate: 500_000, ...extra,
  });
  return { db, service, transaction, advance: (time: number) => { now = time; } };
}

describe("managed subscription admission", () => {
  it("uses Apple trial evidence, gives paid seats priority over beta, and does not reset on refresh", async () => {
    const { db, service, transaction, advance } = setup();
    db.sqlite.prepare("INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES(?,?)")
      .run(account, 10_000);
    const trial = transaction(undefined, { offerType: 1, offerDiscountType: "FREE_TRIAL" });
    await service.acceptVerified(account, trial);
    expect(await service.entitlement(account)).toMatchObject({ source: "subscription", limit: 2,
      isTrial: true, expiresAt: 500_000 });
    await service.acceptVerified(account, trial);
    expect((await service.entitlement(account))?.expiresAt).toBe(500_000);
    advance(500_001);
    expect(await service.entitlement(account)).toBeNull();
  });

  it.each([["solo", 2], ["", 5], ["fleet", 10], ["studio", 15]] as const)(
    "enforces the %s tier atomically and reconnects stable computers", async (tier, limit) => {
      const { service, transaction } = setup();
      const product = `com.ziborov.granttap.personal${tier ? `.${tier}` : ""}.monthly`;
      expect(await service.acceptVerified(account, transaction(product))).toBe(true);
      const seats = await Promise.all(Array.from({ length: limit + 4 }, (_, id) =>
        service.admit(account, computer(id))));
      expect(seats.filter(Boolean)).toHaveLength(limit);
      expect(await service.admit(account, computer(0))).not.toBeNull();
      expect(await service.admit(other, computer(0))).toBeNull();
    });

  it("rejects cross-account claims, unknown products, and replay after refund", async () => {
    const { service, transaction } = setup();
    expect(await service.acceptVerified(other, transaction())).toBe(false);
    expect(await service.acceptVerified(account, transaction("unknown"))).toBe(false);
    expect(await service.acceptVerified(account, transaction())).toBe(true);
    expect(await service.acceptVerified(account, transaction(undefined, { signedDate: 1_000, revocationDate: 950 }))).toBe(true);
    expect(await service.acceptVerified(account, transaction())).toBe(false);
    expect(await service.admit(account, computer(1))).toBeNull();
  });

  it("applies upgrades and downgrades without deleting computer identity or history", async () => {
    const { db, service, transaction, advance } = setup();
    await service.acceptVerified(account, transaction("com.ziborov.granttap.personal.monthly"));
    for (let id = 0; id < 5; id++) await service.admit(account, computer(id));
    await service.acceptVerified(account, transaction(undefined, { signedDate: 1_100, purchaseDate: 200 }));
    expect(await service.admit(account, computer(2))).toBeNull();
    expect(await service.admit(account, computer(0))).not.toBeNull();
    expect(db.sqlite.prepare("SELECT COUNT(*) AS count FROM managed_computers").get()?.count).toBe(5);
    await service.acceptVerified(account, transaction("com.ziborov.granttap.personal.studio.monthly", { signedDate: 1_200 }));
    expect(await service.admit(account, computer(5))).not.toBeNull();
    advance(500_001);
    expect(await service.admit(account, computer(0))).toBeNull();
  });

  it("handles replacement and beta grants separately from purchased seats", async () => {
    const { db, service, transaction, advance } = setup();
    const key = computer(1);
    expect(await service.admit(account, key)).toBeNull();
    db.sqlite.prepare("INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES(?,?)").run(account, 10_000);
    expect((await service.admit(account, key))?.source).toBe("beta");
    advance(10_000);
    expect(await service.admit(account, key)).toBeNull();
    await service.acceptVerified(account, transaction());
    expect(await service.release(account, key)).toBe(true);
    expect(await service.release(other, key)).toBe(false);
    expect((await service.admit(account, computer(2)))?.source).toBe("subscription");
    expect(await service.admit(account, "invalid")).toBeNull();
  });
});
