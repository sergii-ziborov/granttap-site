// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { expect, test } from "vitest";
import { SqliteD1 } from "../../sqlite";
import { SubscriptionCancellationFeedback } from "../feedback";

const account = "12345678-1234-4123-8123-123456789012";
const key = Buffer.alloc(32, 7);
const id = (n: number) => `32345678-1234-4123-8123-${String(n).padStart(12, "0")}`;
function setup() {
  const durable = new SqliteD1(":memory:");
  durable.sqlite.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").run(account, 1);
  const db = durable as unknown as D1Database;
  return { durable, db, service: new SubscriptionCancellationFeedback(db, key, () => 1_000) };
}

test("optional feedback is encrypted at rest and remains readable after a server restart", async () => {
  const { durable, db, service } = setup();
  expect(await service.save(account, id(0), "price", "  Please add a smaller plan.  ")).toBe("saved");
  const stored = durable.sqlite.prepare("SELECT encrypted_comment FROM subscription_cancellation_feedback").get()!;
  expect(String(stored.encrypted_comment)).not.toContain("smaller plan");
  const reopened = new SubscriptionCancellationFeedback(db, key, () => 1_001);
  expect(await reopened.readForOperator()).toEqual([{ accountId: account, feedbackId: id(0),
    reason: "price", comment: "Please add a smaller plan.", createdAt: 1_000 }]);
  expect(await reopened.readForOperator((await reopened.readForOperator())[0])).toEqual([]);
});

test("a retried submission keeps the first feedback instead of creating duplicates", async () => {
  const { service } = setup();
  expect(await service.save(account, id(0), "not_using", "First response")).toBe("saved");
  expect(await service.save(account, id(0), "other", "Replacement")).toBe("saved");
  expect(await service.readForOperator()).toHaveLength(1);
  expect((await service.readForOperator())[0].comment).toBe("First response");
});

test("concurrent feedback submissions cannot exceed the account's daily limit", async () => {
  const { service } = setup();
  const results = await Promise.all(Array.from({ length: 6 }, (_, n) => service.save(account, id(n), "other", "")));
  expect(results.filter(x => x === "saved")).toHaveLength(5);
  expect(results.filter(x => x === "limited")).toHaveLength(1);
  expect(await service.readForOperator()).toHaveLength(5);
});

test("invalid input never creates support content", async () => {
  const { service } = setup();
  for (const [identity, reason, comment] of [[null, "other", ""], ["bad", "other", ""],
    [id(0), null, ""], [id(0), "unknown", ""], [id(0), "other", null],
    [id(0), "other", "x".repeat(2_001)]]) {
    expect(await service.save(account, identity, reason, comment)).toBe("invalid");
  }
  expect(await service.readForOperator()).toEqual([]);
  await expect(service.readForOperator({ createdAt: -1, accountId: "", feedbackId: "" })).rejects.toThrow("cursor");
});

test("the encryption key and account binding are required to read feedback", async () => {
  const { db, durable, service } = setup();
  expect(() => new SubscriptionCancellationFeedback(db, Buffer.alloc(2))).toThrow("encryption");
  await service.save(account, id(0), "technical_problem", "Scroll pauses.");
  await expect(new SubscriptionCancellationFeedback(db, Buffer.alloc(32, 8), () => 1_001).readForOperator()).rejects.toThrow();
  durable.sqlite.prepare("DELETE FROM accounts WHERE id=?").run(account);
  expect(await service.readForOperator()).toEqual([]);
});


test("feedback expires after 90 days and same-time rows remain reachable with a compound cursor", async () => {
  const { db, service, durable } = setup();
  await service.save(account, id(0), "other", "");
  await service.save(account, id(1), "price", "");
  const first = (await service.readForOperator())[0];
  expect((await service.readForOperator(first)).map(x => x.feedbackId)).toEqual([id(1)]);
  const expired = new SubscriptionCancellationFeedback(db, key, () => 1_000 + 90 * 86_400_000);
  expect(await expired.readForOperator()).toEqual([]);
  expect(durable.sqlite.prepare("SELECT COUNT(*) AS count FROM subscription_cancellation_feedback").get()!.count).toBe(0);
});

test("simultaneous retries of the same feedback stay successful and create a single record", async () => {
  const { service } = setup();
  const replies = await Promise.all(Array.from({ length: 10 }, () => service.save(account, id(8), "price", "")));
  expect(replies).toEqual(Array(10).fill("saved"));
  expect(await service.readForOperator()).toHaveLength(1);
});
