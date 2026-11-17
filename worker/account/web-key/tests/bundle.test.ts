// @vitest-environment node
import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { handleAccountApi } from "../../api";
import type { ManagedBilling } from "../../subscriptions/api";
import { accountFixture, computerPairing } from "../../qr-sign-in/tests/fixture";
import { parseWebKeyBundle, recipientKeyId } from "../bundle";
import { AccountWebKeys } from "../store";

it("accepts only the exact bundle shape with consistent controller keys", async () => {
  const f = await accountFixture();
  const pairing = await computerPairing(f.db, f.accountId);
  const make = (change: (value: Record<string, unknown>) => void = () => {}) => {
    const value: Record<string, unknown> = { schema: "granttap.account-web-key.v1", accountId: f.accountId, createdAt: 1, pairings: [{ ...pairing }] };
    change(value);
    return JSON.stringify(value);
  };
  const pair = (patch: Record<string, unknown>) => (value: Record<string, unknown>) => { value.pairings = [{ ...pairing, ...patch }]; };
  expect(parseWebKeyBundle(make(), f.accountId)?.pairings[0].machineId).toBe(pairing.machineId);
  for (const bad of [
    make(value => { value.schema = "other"; }), make(value => { value.extra = 1; }), make(value => { value.pairings = []; }),
    make(value => { value.pairings = [pairing, pairing]; }), make(value => { value.createdAt = -1; }),
    make(pair({ relayUrl: "wss://evil.example/ws" })), make(pair({ relayUrl: "ws://relay.granttap.com" })),
    make(pair({ relayUrl: "wss://relay.granttap.com/ws?x=1" })), make(pair({ relayUrl: "not a url" })),
    make(pair({ role: "machine" })), make(pair({ pushAuth: "nope" })), make(pair({ room: "ROOM" })),
    make(pair({ myPublicKey: pairing.peerPublicKey })), make(pair({ senderId: "" })), make(pair({ extra: true })),
    make(pair({ machineId: "nope" })), make(pair({ deviceName: "x".repeat(181) })), "[]", "{", "null",
    make(value => { value.pairings = [null]; }), "x".repeat(40_001),
  ]) expect(parseWebKeyBundle(bad, f.accountId)).toBeNull();
  expect(parseWebKeyBundle(make(), randomUUID())).toBeNull();
});

it("stores only computers of the account, encrypted, and revokes a replaced key's controllers", async () => {
  const f = await accountFixture();
  const keys = new AccountWebKeys(f.db, new Uint8Array(32).fill(4));
  const first = await computerPairing(f.db, f.accountId);
  const text = JSON.stringify({ schema: "granttap.account-web-key.v1", accountId: f.accountId, createdAt: 1, pairings: [first] });
  expect(await keys.save(f.accountId, text, parseWebKeyBundle(text, f.accountId)!, "Safari on macOS")).toBe(true);
  expect(await keys.material(f.accountId)).toBe(text);
  expect(await new AccountWebKeys(f.db).material(f.accountId)).toBeNull();
  expect(await new AccountWebKeys(f.db, new Uint8Array(8)).save(f.accountId, text, parseWebKeyBundle(text, f.accountId)!, "x")).toBe(false);
  const status = await keys.status(f.accountId);
  expect(status).toMatchObject({ stored: true, computers: [{ computerId: first.machineId, recipientKeyId: recipientKeyId(first.myPublicKey) }] });

  const second = await computerPairing(f.db, f.accountId, "Mac mini");
  const next = JSON.stringify({ schema: "granttap.account-web-key.v1", accountId: f.accountId, createdAt: 2, pairings: [second] });
  await keys.save(f.accountId, next, parseWebKeyBundle(next, f.accountId)!, "Chrome on macOS");
  expect(await keys.revoked(f.accountId, first.myPublicKey)).toBe(true);
  expect(await keys.revoked(f.accountId, second.myPublicKey)).toBe(false);

  const foreign = { ...await computerPairing(f.db, f.accountId), machineId: randomUUID() };
  const stray = JSON.stringify({ schema: "granttap.account-web-key.v1", accountId: f.accountId, createdAt: 3, pairings: [foreign] });
  expect(await keys.save(f.accountId, stray, parseWebKeyBundle(stray, f.accountId)!, "x")).toBe(false);
});

it("refuses relay admission for a controller whose key left the account", async () => {
  const f = await accountFixture();
  const pairing = await computerPairing(f.db, f.accountId);
  await f.db.prepare("INSERT INTO account_machine_endpoints(machine_id,room,public_key,updated_at) VALUES(?,?,?,?)")
    .bind(pairing.machineId, pairing.room, pairing.peerPublicKey, Date.now()).run();
  await f.db.prepare("INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES(?,?)").bind(f.accountId, Date.now() + 60_000).run();
  const billing: ManagedBilling = { signingKey: Buffer.alloc(32, 7), receipts: {
    transaction: async () => { throw Error("No client-selected receipt"); }, notification: async () => null } };
  const admit = async (publicKey: string) => (await handleAccountApi(new Request("https://granttap.com/api/account/control/admission", {
    method: "POST", headers: { authorization: "Bearer " + f.phone, "content-type": "application/json" },
    body: JSON.stringify({ computerId: pairing.machineId, room: pairing.room, publicKey }) }), f.db, billing))!;
  expect((await admit(pairing.myPublicKey)).status).toBe(200);
  await f.db.prepare("INSERT INTO account_web_key_revocations(account_id,public_key,revoked_at) VALUES(?,?,?)")
    .bind(f.accountId, pairing.myPublicKey, Date.now()).run();
  const refused = await admit(pairing.myPublicKey);
  expect(refused.status).toBe(403);
  expect((await refused.json()).error).toContain("removed from the account");
});
