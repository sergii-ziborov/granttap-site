// @vitest-environment node
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { D1Database } from "@cloudflare/workers-types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SqliteD1 } from "./account-sqlite";
import { SqliteD1 as DurableSqliteD1 } from "../../worker/account/sqlite";
import { handleAccountApi } from "../../worker/account/api";
import { D1AccountStore } from "../../worker/account/d1-store";
import { AccountMachines } from "../../worker/account/machines";
import { ManagedSubscriptions } from "../../worker/account/subscriptions";
import type { AppleReceipts } from "../../worker/account/subscriptions/apple";
import { TRIAL_LENGTH, trialPolicy } from "../../worker/account/testflight/trial";

const DAY = 86400_000;
const T0 = Date.UTC(2026, 10, 16, 12);
const owner = "11111111-1111-4111-8111-111111111111";
const second = "22222222-2222-4222-8222-222222222222";
const review = "33333333-3333-4333-8333-333333333333";
const deviceA = "AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA";
const solo = "com.ziborov.granttap.personal.solo.monthly";
const key = Buffer.alloc(32, 3).toString("base64");

async function fixture() {
  const db = new SqliteD1();
  const d1 = db as unknown as D1Database;
  const store = new D1AccountStore(d1);
  const tokens: Record<string, string> = {};
  let sessionByte = 1;
  const signIn = async (account: string) => {
    const token = Buffer.alloc(32, sessionByte++).toString("base64url");
    await store.saveSession(createHash("sha256").update(token).digest("hex"), account, T0 + 400 * DAY);
    tokens[account] = token;
    return token;
  };
  const create = async (account: string) => {
    await store.createAccount(account, { id: `${account}-key`, accountId: account, publicKey: new Uint8Array([1]), counter: 0 });
    return signIn(account);
  };
  for (const account of [owner, second, review]) await create(account);
  const sandboxCalls: string[] = [];
  const receipts: AppleReceipts = {
    // "app:<appTransactionId>" stands for an Apple-signed sandbox AppTransaction issued now.
    appTransaction: async signed => {
      if (!signed.startsWith("app:")) throw Error("invalid signature");
      return { receiptType: "Sandbox", bundleId: "com.ziborov.granttap", appAppleId: 6809739366,
        applicationVersion: "293", appTransactionId: signed.slice(4), receiptCreationDate: Date.now() } as never;
    },
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
  const purchase = (account: string, environment: string) => ({
    originalTransactionId: `${environment}-${account}`, transactionId: `${environment}-${account}-${Date.now()}`,
    appAccountToken: account, bundleId: "com.ziborov.granttap", environment, productId: solo,
    type: "Auto-Renewable Subscription", purchaseDate: Date.now() - 1_000, signedDate: Date.now(),
    expiresDate: Date.now() + 30 * DAY }) as never;
  const billing = { signingKey: Buffer.alloc(32, 7), receipts };
  const call = async (path: string, token: string, method = "GET", body?: unknown) => {
    const response = await handleAccountApi(new Request(`https://granttap.com/api/account/${path}`, {
      method, headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body) }), d1, billing);
    return { status: response!.status, body: await response!.json() };
  };
  const testflight = (account: string, appTransactionId: string, extra: Record<string, unknown> = {}) =>
    call("subscriptions/testflight", tokens[account], "POST", { signedAppTransaction: `app:${appTransactionId}`, ...extra });
  const machines = new AccountMachines(d1);
  const computer = async (account: string) => (await machines.register(account, "Fixture"))!;
  const admit = (machineToken: string) => call("machine/admission", machineToken, "POST", { publicKey: key, room: "fixture-room" });
  const ticket = (value: string) => JSON.parse(Buffer.from(value.split(".")[0], "base64url").toString());
  return { db, d1, call, testflight, computer, admit, ticket, signIn, create, tokens, sandboxCalls };
}

const at = (time: number) => vi.setSystemTime(time);

describe("TestFlight seven-day trial", () => {
  beforeEach(() => { vi.useFakeTimers({ toFake: ["Date"] }); at(T0); delete process.env.GRANTTAP_TRIAL_EXEMPT_ACCOUNTS; });
  afterEach(() => { vi.useRealTimers(); delete process.env.GRANTTAP_TRIAL_EXEMPT_ACCOUNTS; });

  it("starts the trial on the first grant, keeps it for seven days and refuses access afterwards", async () => {
    const f = await fixture();
    expect((await f.call("beta-relay", f.tokens[owner])).body).toEqual({ expiresAt: null, trial: null });
    const trial = { startedAt: T0, endsAt: T0 + TRIAL_LENGTH, active: true, exempt: false };
    expect(await f.testflight(owner, "apple-owner")).toEqual({ status: 200,
      body: { expiresAt: T0 + TRIAL_LENGTH, trial } });
    const mac = await f.computer(owner);
    at(T0 + 6 * DAY);
    expect((await f.call("beta-relay", f.tokens[owner])).body).toEqual({ expiresAt: T0 + TRIAL_LENGTH, trial });
    const entitled = await f.call("subscriptions/entitlement", f.tokens[owner]);
    expect(entitled.body).toMatchObject({ entitlement: { source: "beta", limit: 100, expiresAt: T0 + TRIAL_LENGTH },
      trial, subscription: { active: false, environment: null } });
    const admitted = await f.admit(mac.machineToken);
    expect(admitted.status).toBe(200);
    expect(f.ticket(admitted.body.ticket)).toMatchObject({ source: "beta", computerId: mac.id });
    expect(await f.testflight(owner, "apple-owner")).toMatchObject({ status: 200, body: { expiresAt: T0 + TRIAL_LENGTH } });

    at(T0 + TRIAL_LENGTH);
    const ended = { ...trial, active: false };
    expect(await f.testflight(owner, "apple-owner")).toEqual({ status: 403, body: {
      error: "The TestFlight trial has ended. A subscription is required.", code: "trial_ended", trial: ended } });
    expect((await f.call("beta-relay", f.tokens[owner])).body).toEqual({ expiresAt: null, trial: ended });
    expect((await f.call("subscriptions/entitlement", f.tokens[owner])).body)
      .toMatchObject({ entitlement: null, trial: ended, subscription: { active: false } });
    expect((await f.admit(mac.machineToken)).status).toBe(403);
    expect((await f.call("control/access", f.tokens[owner])).status).toBe(403);
    expect(await new ManagedSubscriptions(f.d1).entitlement(owner)).toBeNull();
  });

  it("rechecks the stored trial start when admitting a computer", async () => {
    const f = await fixture();
    await f.testflight(owner, "apple-owner");
    const ledger = new ManagedSubscriptions(f.d1);
    expect(await ledger.admit(owner, "44444444-4444-4444-8444-444444444444")).not.toBeNull();
    f.db.sqlite.prepare("UPDATE account_beta_relay_grants SET trial_started_at=? WHERE account_id=?")
      .run(T0 - TRIAL_LENGTH, owner);
    expect(await ledger.admit(owner, "44444444-4444-4444-8444-444444444444")).toBeNull();
  });

  it("never restarts the trial after a reinstall, a new sign-in, a new device id or another Apple Account", async () => {
    const f = await fixture();
    await f.testflight(owner, "apple-owner", { deviceId: deviceA });
    at(T0 + 3 * DAY);
    await f.signIn(owner);
    const reinstalled = await f.testflight(owner, "apple-owner", { deviceId: "BBBBBBBB-BBBB-4BBB-8BBB-BBBBBBBBBBBB" });
    expect(reinstalled.body.trial).toMatchObject({ startedAt: T0, endsAt: T0 + TRIAL_LENGTH });
    const otherApple = await f.testflight(owner, "apple-owner-second-id");
    expect(otherApple.body.trial.startedAt).toBe(T0);
    at(T0 + 8 * DAY);
    await f.signIn(owner);
    for (const apple of ["apple-owner", "apple-owner-second-id", "apple-owner-third-id"]) {
      expect((await f.testflight(owner, apple)).body).toMatchObject({ code: "trial_ended", trial: { startedAt: T0 } });
    }
  });

  it("carries the trial start to a new account on the same Apple Account or device", async () => {
    const f = await fixture();
    await f.testflight(owner, "apple-owner", { deviceId: deviceA });
    at(T0 + 2 * DAY);
    expect(await f.testflight(second, "apple-owner")).toMatchObject({ status: 403,
      body: { code: "evidence_bound_elsewhere" } });
    expect((await f.call("me", f.tokens[owner], "DELETE")).status).toBe(200);
    const sameApple = await f.testflight(second, "apple-owner");
    expect(sameApple).toMatchObject({ status: 200, body: { expiresAt: T0 + TRIAL_LENGTH, trial: { startedAt: T0 } } });

    const third = "44444444-4444-4444-8444-444444444444";
    await f.create(third);
    const sameDevice = await f.testflight(third, "apple-third", { deviceId: deviceA.toLowerCase() });
    expect(sameDevice.body.trial.startedAt).toBe(T0);
    const fourth = "55555555-5555-4555-8555-555555555555";
    await f.create(fourth);
    expect((await f.testflight(fourth, "apple-fourth")).body.trial.startedAt).toBe(T0 + 2 * DAY);
    const stored = f.db.sqlite.prepare("SELECT subject FROM testflight_trial_evidence").all().map(row => String(row.subject));
    expect(stored.join()).not.toMatch(/apple-owner|aaaaaaaa/i);
    expect(stored.every(subject => /^(apple|device):[0-9a-f]{64}$/.test(subject))).toBe(true);
  });

  it("keeps an allowlisted review account without a trial limit", async () => {
    process.env.GRANTTAP_TRIAL_EXEMPT_ACCOUNTS = `${review.toUpperCase()}, 66666666-6666-4666-8666-666666666666`;
    const f = await fixture();
    expect(await f.testflight(review, "apple-reviewer", { deviceId: deviceA })).toEqual({ status: 200,
      body: { expiresAt: T0 + 90 * DAY, trial: { startedAt: T0, endsAt: null, active: true, exempt: true } } });
    const computer = await f.computer(review);
    at(T0 + 30 * DAY);
    expect((await f.call("beta-relay", f.tokens[review])).body).toMatchObject({ expiresAt: T0 + 90 * DAY,
      trial: { exempt: true, active: true } });
    expect((await f.admit(computer.machineToken)).status).toBe(200);
    expect((await f.call("control/access", f.tokens[review])).status).toBe(200);
    expect(await f.testflight(review, "apple-reviewer")).toMatchObject({ status: 200, body: { expiresAt: T0 + 120 * DAY } });
    expect(f.db.sqlite.prepare("SELECT COUNT(*) AS count FROM testflight_trial_evidence").get()?.count).toBe(0);
    // Review sign-ins do not use up the trial of an ordinary account on the same device.
    expect((await f.testflight(owner, "apple-owner", { deviceId: deviceA })).body.trial.startedAt).toBe(T0 + 30 * DAY);

    f.db.sqlite.prepare("UPDATE account_beta_relay_grants SET revoked_at=? WHERE account_id=?").run(T0, review);
    expect(await f.testflight(review, "apple-reviewer")).toMatchObject({ status: 403, body: { code: "revoked" } });
    f.db.sqlite.prepare("UPDATE account_beta_relay_grants SET revoked_at=NULL WHERE account_id=?").run(review);
    process.env.GRANTTAP_TRIAL_EXEMPT_ACCOUNTS = "";
    expect(await f.testflight(review, "apple-reviewer")).toMatchObject({ status: 403,
      body: { code: "trial_ended", trial: { startedAt: T0, exempt: false } } });
  });

  it("reads the allowlist only from server configuration and refuses malformed entries", () => {
    expect(trialPolicy({}).exempt(review)).toBe(false);
    expect(trialPolicy({ GRANTTAP_TRIAL_EXEMPT_ACCOUNTS: `\n${review}\n` }).exempt(review)).toBe(true);
    expect(() => trialPolicy({ GRANTTAP_TRIAL_EXEMPT_ACCOUNTS: "review-account" })).toThrow(/account UUIDs/);
  });

  it("leaves production subscriptions untouched and records sandbox purchases apart", async () => {
    const f = await fixture();
    await f.testflight(owner, "apple-owner");
    const mac = await f.computer(owner);
    at(T0 + 8 * DAY);
    expect((await f.admit(mac.machineToken)).status).toBe(403);

    const production = await f.call("subscriptions/receipt", f.tokens[owner], "POST", { signedTransaction: `production:${owner}` });
    expect(production.body).toMatchObject({ accepted: true, entitlement: { source: "subscription", environment: "production", limit: 2 } });
    expect(f.sandboxCalls).toEqual([]);
    const paid = await f.admit(mac.machineToken);
    expect(f.ticket(paid.body.ticket).source).toBe("subscription");
    expect((await f.call("subscriptions/entitlement", f.tokens[owner])).body).toMatchObject({
      entitlement: { source: "subscription", environment: "production" },
      trial: { active: false }, subscription: { active: true, environment: "production", productId: solo } });

    const sandbox = await f.call("subscriptions/receipt", f.tokens[second], "POST", { signedTransaction: `sandbox:${second}` });
    expect(sandbox.body).toMatchObject({ accepted: true, entitlement: { source: "subscription", environment: "sandbox", limit: 2 } });
    expect(f.db.sqlite.prepare("SELECT COUNT(*) AS count FROM account_subscriptions WHERE account_id=?").get(second)?.count).toBe(0);
    expect(await new ManagedSubscriptions(f.d1).originalTransaction(second)).toBeNull();
    const tester = await f.computer(second);
    const testing = await f.admit(tester.machineToken);
    expect(testing.body.source).toBe("beta");
    expect(f.ticket(testing.body.ticket).source).toBe("beta");
    expect((await f.call("subscriptions/entitlement", f.tokens[second])).body.subscription)
      .toMatchObject({ active: true, environment: "sandbox" });
    expect((await f.call("subscriptions/receipt", f.tokens[owner], "POST", { signedTransaction: `sandbox:${second}` })).status).toBe(403);
    expect((await f.call("subscriptions/receipt", f.tokens[owner], "POST", { signedTransaction: "forged" })).status).toBe(400);
    expect(await new ManagedSubscriptions(f.d1).acceptSandbox(second, { environment: "Production" } as never)).toBe(false);
    at(T0 + 40 * DAY);
    expect((await f.admit(tester.machineToken)).status).toBe(403);
  });

  it("accepts the older request shape and rejects a malformed device id", async () => {
    const f = await fixture();
    expect((await f.testflight(owner, "apple-owner", { deviceId: null })).status).toBe(200);
    expect(await f.testflight(second, "apple-second", { deviceId: "not-a-uuid" })).toMatchObject({ status: 400,
      body: { code: "invalid_device_id" } });
    expect(await f.testflight(second, "apple-second", { deviceId: 7 })).toMatchObject({ status: 400 });
    expect((await f.call("subscriptions/testflight", f.tokens[second], "POST", {})).body).toMatchObject({ code: "invalid_request" });
    expect((await f.call("subscriptions/testflight", f.tokens[second], "POST", { signedAppTransaction: "forged" })).body)
      .toMatchObject({ code: "unverified_evidence" });
    expect((await f.testflight(second, "apple-second")).status).toBe(200);
  });
});

describe("trial migration", () => {
  it("starts the trial of grants that predate it and of grants inserted without a start", () => {
    const directory = mkdtempSync(join(tmpdir(), "granttap-trial-"));
    const path = join(directory, "accounts.sqlite");
    try {
      const legacy = new DurableSqliteD1(path);
      legacy.sqlite.exec(`DROP TRIGGER account_beta_relay_trial_start;
        ALTER TABLE account_beta_relay_grants DROP COLUMN trial_started_at;
        INSERT INTO accounts(id,created_at) VALUES('${owner}',1),('${second}',1);
        INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES('${owner}',${Date.now() + 80 * DAY});`);
      legacy.sqlite.close();
      const before = Date.now();
      const migrated = new DurableSqliteD1(path);
      const started = Number(migrated.sqlite.prepare("SELECT trial_started_at FROM account_beta_relay_grants WHERE account_id=?").get(owner)?.trial_started_at);
      expect(started).toBeGreaterThanOrEqual(Math.floor(before / 1000) * 1000);
      expect(started).toBeLessThanOrEqual(Date.now());
      migrated.sqlite.prepare("INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES(?,?)").run(second, 1);
      expect(migrated.sqlite.prepare("SELECT trial_started_at FROM account_beta_relay_grants WHERE account_id=?").get(second)?.trial_started_at)
        .toBeGreaterThan(0);
      migrated.sqlite.close();
      const reopened = new DurableSqliteD1(path);
      expect(Number(reopened.sqlite.prepare("SELECT trial_started_at FROM account_beta_relay_grants WHERE account_id=?").get(owner)?.trial_started_at)).toBe(started);
      reopened.sqlite.close();
    } finally { rmSync(directory, { recursive: true, force: true }); }
  });
});
