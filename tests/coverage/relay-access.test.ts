// @vitest-environment node
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { D1Database } from "@cloudflare/workers-types";
import { afterEach, describe, expect, it } from "vitest";
import { SqliteD1 } from "./account-sqlite";
import { SqliteD1 as DurableSqliteD1 } from "../../worker/account/sqlite";
import { handleAccountApi } from "../../worker/account/api";
import { D1AccountStore } from "../../worker/account/d1-store";
import { AccountMachines } from "../../worker/account/machines";
import { ManagedSubscriptions } from "../../worker/account/subscriptions";
import type { AppleReceipts } from "../../worker/account/subscriptions/apple";
import { REVIEW_ACCESS_LEASE, reviewAccess } from "../../worker/account/review-access";

const DAY = 86400_000;
const owner = "11111111-1111-4111-8111-111111111111";
const tester = "22222222-2222-4222-8222-222222222222";
const review = "33333333-3333-4333-8333-333333333333";
const solo = "com.ziborov.granttap.personal.solo.monthly";
const key = Buffer.alloc(32, 3).toString("base64");

async function fixture() {
  const db = new SqliteD1();
  const d1 = db as unknown as D1Database;
  const store = new D1AccountStore(d1);
  const tokens: Record<string, string> = {};
  for (const [index, account] of [owner, tester, review].entries()) {
    await store.createAccount(account, { id: `${account}-key`, accountId: account, publicKey: new Uint8Array([1]), counter: 0 });
    tokens[account] = Buffer.alloc(32, index + 1).toString("base64url");
    await store.saveSession(createHash("sha256").update(tokens[account]).digest("hex"), account, Date.now() + 400 * DAY);
  }
  const sandboxCalls: string[] = [];
  const purchase = (account: string, environment: string, extra: Record<string, unknown> = {}) => ({
    originalTransactionId: `${environment}-${account}`, transactionId: `${environment}-${account}-${Date.now()}`,
    appAccountToken: account, bundleId: "com.ziborov.granttap", environment, productId: solo,
    type: "Auto-Renewable Subscription", purchaseDate: Date.now() - 1_000, signedDate: Date.now(),
    expiresDate: Date.now() + 7 * DAY, offerType: 1, offerDiscountType: "FREE_TRIAL", ...extra }) as never;
  const receipts: AppleReceipts = {
    transaction: async signed => {
      if (!signed.startsWith("production:")) throw Error("not a production signature");
      return purchase(signed.slice(11), "Production");
    },
    sandboxTransaction: async signed => {
      sandboxCalls.push(signed);
      if (!signed.startsWith("sandbox:")) throw Error("not a sandbox signature");
      return purchase(signed.slice(8), "Sandbox");
    },
    notification: async () => null,
  };
  const billing = { signingKey: Buffer.alloc(32, 7), receipts };
  const call = async (path: string, token: string, method = "GET", body?: unknown) => {
    const response = await handleAccountApi(new Request(`https://granttap.com/api/account/${path}`, {
      method, headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body) }), d1, billing);
    return { status: response!.status, body: await response!.json() };
  };
  const machines = new AccountMachines(d1);
  const computer = async (account: string) => (await machines.register(account, "Fixture"))!;
  const admit = (machineToken: string) => call("machine/admission", machineToken, "POST", { publicKey: key, room: "fixture-room" });
  const ticket = (value: string) => JSON.parse(Buffer.from(value.split(".")[0], "base64url").toString());
  return { db, d1, call, computer, admit, ticket, tokens, sandboxCalls, purchase };
}

afterEach(() => { delete process.env.GRANTTAP_REVIEW_ACCOUNTS; });

describe("relay access needs a subscription in every build", () => {
  it("gives a TestFlight build nothing without a purchase, and says so to builds that still ask", async () => {
    const f = await fixture();
    const refused = await f.call("subscriptions/testflight", f.tokens[tester], "POST", { signedAppTransaction: "app:123" });
    expect(refused).toMatchObject({ status: 410, body: { code: "subscription_required" } });
    expect(await f.call("beta-relay", f.tokens[tester])).toMatchObject({ status: 200, body: { expiresAt: null, exempt: false } });
    const mac = await f.computer(tester);
    expect((await f.admit(mac.machineToken)).status).toBe(403);
    expect(await new ManagedSubscriptions(f.d1).entitlement(tester)).toBeNull();
  });

  it("admits a sandbox subscription exactly like a production one, and keeps it apart", async () => {
    const f = await fixture();
    const production = await f.call("subscriptions/receipt", f.tokens[owner], "POST", { signedTransaction: `production:${owner}` });
    expect(production.body).toMatchObject({ accepted: true, entitlement: { source: "subscription", environment: "production", limit: 2 } });
    expect(f.sandboxCalls).toEqual([]);

    const sandbox = await f.call("subscriptions/receipt", f.tokens[tester], "POST", { signedTransaction: `sandbox:${tester}` });
    expect(sandbox.body).toMatchObject({ accepted: true,
      entitlement: { source: "subscription", environment: "sandbox", limit: 2, isTrial: true } });
    for (const [account, environment] of [[owner, "production"], [tester, "sandbox"]]) {
      const mac = await f.computer(account);
      const admitted = await f.admit(mac.machineToken);
      expect(admitted.status, environment).toBe(200);
      expect(admitted.body.source).toBe("subscription");
      expect(f.ticket(admitted.body.ticket)).toMatchObject({ source: "subscription", accountId: account });
      expect((await f.call("subscriptions/entitlement", f.tokens[account])).body.entitlement)
        .toMatchObject({ source: "subscription", environment, productId: solo, isTrial: true });
    }
    expect(f.db.sqlite.prepare("SELECT COUNT(*) AS count FROM account_subscriptions WHERE account_id=?").get(tester)?.count).toBe(0);
    expect(await new ManagedSubscriptions(f.d1).originalTransaction(tester)).toBeNull();
  });

  it("prefers a production plan, refuses another account's or a forged purchase, and stops when the sandbox plan ends", async () => {
    const f = await fixture();
    expect((await f.call("subscriptions/receipt", f.tokens[owner], "POST", { signedTransaction: `sandbox:${tester}` })).status).toBe(403);
    expect((await f.call("subscriptions/receipt", f.tokens[owner], "POST", { signedTransaction: "forged" })).status).toBe(400);
    const ledger = new ManagedSubscriptions(f.d1);
    expect(await ledger.acceptSandbox(tester, f.purchase(tester, "Production"))).toBe(false);
    expect(await ledger.acceptVerified(tester, f.purchase(tester, "Sandbox"))).toBe(false);
    expect(await ledger.acceptSandbox(owner, f.purchase(owner, "Sandbox", { expiresDate: Date.now() + DAY }))).toBe(true);
    expect(await ledger.acceptVerified(owner, f.purchase(owner, "Production"))).toBe(true);
    expect(await ledger.entitlement(owner)).toMatchObject({ environment: "production" });

    expect(await ledger.acceptSandbox(tester, f.purchase(tester, "Sandbox", { expiresDate: Date.now() + 60_000 }))).toBe(true);
    const mac = await f.computer(tester);
    expect((await f.admit(mac.machineToken)).status).toBe(200);
    const later = new ManagedSubscriptions(f.d1, () => Date.now() + 120_000);
    expect(await later.entitlement(tester)).toBeNull();
    expect(await later.admit(tester, mac.id)).toBeNull();
  });

  it("lets the App Review account in without a purchase, and only that account", async () => {
    process.env.GRANTTAP_REVIEW_ACCOUNTS = `${review.toUpperCase()}, 66666666-6666-4666-8666-666666666666`;
    const f = await fixture();
    const state = await f.call("beta-relay", f.tokens[review]);
    expect(state.body.exempt).toBe(true);
    expect(state.body.expiresAt).toBeGreaterThan(Date.now() + REVIEW_ACCESS_LEASE - 60_000);
    const mac = await f.computer(review);
    const admitted = await f.admit(mac.machineToken);
    expect(admitted.status).toBe(200);
    expect(f.ticket(admitted.body.ticket).source).toBe("beta");
    expect((await f.call("subscriptions/entitlement", f.tokens[review])).body.entitlement).toMatchObject({ source: "beta", review: true });
    expect((await f.call("beta-relay", f.tokens[tester])).body).toEqual({ expiresAt: null, exempt: false });
    process.env.GRANTTAP_REVIEW_ACCOUNTS = "";
    expect((await f.admit(mac.machineToken)).status).toBe(403);
  });

  it("reads the App Review list only from server configuration and refuses malformed entries", () => {
    expect(reviewAccess({ GRANTTAP_REVIEW_ACCOUNTS: `\n${review}\n` }).includes(review)).toBe(true);
    expect(reviewAccess({}).includes(review)).toBe(false);
    expect(() => reviewAccess({ GRANTTAP_REVIEW_ACCOUNTS: "review-account" })).toThrow(/account UUIDs/);
  });
});

describe("sandbox subscription migration", () => {
  it("removes the relay grants TestFlight app transactions created and keeps an operator's", () => {
    const directory = mkdtempSync(join(tmpdir(), "granttap-relay-access-"));
    const path = join(directory, "accounts.sqlite");
    try {
      const before = new DurableSqliteD1(path);
      before.sqlite.exec(`INSERT INTO accounts(id,created_at) VALUES('${owner}',1),('${tester}',1);
        INSERT INTO account_testflight_transactions(app_transaction_id,account_id,expires_at) VALUES('apple-owner','${owner}',${Date.now() + DAY});
        INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES('${owner}',${Date.now() + DAY}),('${tester}',${Date.now() + DAY});`);
      before.sqlite.close();
      const after = new DurableSqliteD1(path);
      const grants = after.sqlite.prepare("SELECT account_id FROM account_beta_relay_grants").all().map(row => row.account_id);
      expect(grants).toEqual([tester]);
      expect(after.sqlite.prepare("SELECT COUNT(*) AS count FROM account_testflight_transactions").get()?.count).toBe(0);
      expect(after.sqlite.prepare("PRAGMA table_info(account_sandbox_subscriptions)").all().length).toBeGreaterThan(0);
      after.sqlite.close();
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});
