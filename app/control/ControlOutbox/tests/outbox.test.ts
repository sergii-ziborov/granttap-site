// @vitest-environment node
import "fake-indexeddb/auto";
import { expect, it } from "vitest";
import { BrowserKeysStorage } from "../../BrowserKeys";
import { BrowserControlOutbox, type OutgoingCommand } from "..";
const command = (id: string): OutgoingCommand => ({ id, machineId: "computer", delivery: { state: "sending" },
  payload: { type: "user.message", messageId: id, sessionId: "task", text: "Synthetic outbox message", createdAt: 1 } });

it("keeps immutable intent across concurrent tabs and isolates account ciphertext", async () => {
  const name = "synthetic-outbox-" + crypto.randomUUID(), storage = new BrowserKeysStorage(name);
  const a = new BrowserControlOutbox(storage), b = new BrowserControlOutbox(new BrowserKeysStorage(name));
  const results = await Promise.allSettled([a.put("account", command("one")),
    b.put("account", { ...command("one"), machineId: "other" })]);
  expect(results.filter(result => result.status === "fulfilled")).toHaveLength(1);
  expect(Object.keys(await a.read("account"))).toEqual(["one"]);
  expect(await a.read("another-account")).toEqual({});
  const record = await storage.read("account");
  expect(record?.key.extractable).toBe(false);
  expect(new TextDecoder().decode(record!.cipher)).not.toContain("Synthetic outbox message");
  await storage.commit("copied-account", record!, 0);
  await expect(a.read("copied-account")).rejects.toThrow();
  await a.forget("account"); expect(await b.read("account")).toEqual({});
});
it("preserves the original timestamp on transport retry and makes accepted delivery monotonic", async () => {
  const outbox = new BrowserControlOutbox(), account = crypto.randomUUID();
  const first = command("one"); await outbox.put(account, first);
  if (first.payload.type !== "user.message") throw Error("Invalid synthetic command");
  const retry = await outbox.put(account, { ...first, payload: { ...first.payload, createdAt: 500 } });
  expect(retry.payload).toMatchObject({ createdAt: 1 });
  await outbox.update(account, "one", { state: "accepted" });
  await outbox.update(account, "one", { state: "failed", error: "Late transport error" });
  expect((await outbox.read(account)).one.delivery.state).toBe("accepted");
  expect(await outbox.update(account, "missing", { state: "stored" })).toBeUndefined(); await outbox.forget(account);
});
it("replaces only an explicitly rejected user message and keeps the retired attempt after reopening", async () => {
  const outbox = new BrowserControlOutbox(), account = crypto.randomUUID();
  await expect(outbox.replaceRejected(account, "missing", "user-message-new")).rejects.toThrow(/Only a rejected/);
  await outbox.put(account, command("one"));
  await expect(outbox.replaceRejected(account, "one", "user-message-new")).rejects.toThrow(/Only a rejected/);
  await outbox.update(account, "one", { state: "failed", rejected: true, error: "Synthetic refusal" });
  await outbox.update(account, "one", { state: "stored" });
  expect((await outbox.read(account)).one.delivery).toMatchObject({ state: "failed", rejected: true });
  const next = await outbox.replaceRejected(account, "one", "user-message-new"); expect(next.payload).toMatchObject({ messageId: "new" });
  await expect(outbox.replaceRejected(account, "one", "user-message-again")).rejects.toThrow(/Only a rejected/);
  expect((await new BrowserControlOutbox().read(account)).one.delivery.supersededBy).toBe("user-message-new"); await outbox.forget(account);
});
it("never evicts pending commands to make space and can prune completed commands", async () => {
  const outbox = new BrowserControlOutbox(), account = crypto.randomUUID();
  for (let i = 0; i < 200; i++) await outbox.put(account, command(String(i)));
  await expect(outbox.put(account, command("overflow"))).rejects.toThrow(/too many pending/);
  expect(Object.keys(await outbox.read(account))).toHaveLength(200);
  for (let i = 0; i < 60; i++) await outbox.update(account, String(i), { state: "accepted" });
  await outbox.put(account, command("new")); const saved = await outbox.read(account);
  expect(saved.new.payload).toMatchObject({ messageId: "new" }); expect(saved["199"]).toBeTruthy(); await outbox.forget(account);
});
