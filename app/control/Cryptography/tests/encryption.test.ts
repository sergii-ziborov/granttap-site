// @vitest-environment node
import { expect, it } from "vitest";
import nacl from "tweetnacl";
import { base64, unbase64, browserKeyPair, openBrowserEnvelope, recipientId,
  sealBrowserPayload, type BrowserPairing } from "..";

const controller = browserKeyPair(), machine = browserKeyPair();
const pairing: BrowserPairing = { ...{ myPublicKey: controller.publicKey, mySecretKey: controller.secretKey },
  peerPublicKey: machine.publicKey, machineId: "12345678-1234-4123-8123-123456789012",
  relayUrl: "wss://relay.granttap.com", room: "browser-fixture", role: "phone",
  senderId: "browser", deviceName: "Browser", pushAuth: "fixture" };
const body = { type: "user.message", sessionId: "task", messageId: "message", text: "Private fixture", createdAt: 1 };

it("uses the native NaCl wire format without putting task text into the relay envelope", async () => {
  const envelope = await sealBrowserPayload(pairing, body, { deliveryId: "durable-message" });
  const native = nacl.box.open(unbase64(envelope.box), unbase64(envelope.nonce),
    unbase64(controller.publicKey), unbase64(machine.secretKey));
  expect(JSON.parse(new TextDecoder().decode(native!))).toEqual(body);
  expect(JSON.stringify(envelope)).not.toContain(body.text);
  expect(envelope.recipientKeyId).toBe(await recipientId(machine.publicKey));
  expect(envelope.deliveryId).toBe("durable-message");
  expect(envelope.expiresAt).toBeGreaterThan(Date.now());
});

function incoming(payload: unknown) {
  const nonce = nacl.randomBytes(24);
  return { v: 1, room: pairing.room, from: "machine", to: "phone", senderId: "computer",
    nonce: base64(nonce), box: base64(nacl.box(new TextEncoder().encode(JSON.stringify(payload)),
      nonce, unbase64(controller.publicKey), unbase64(machine.secretKey))) };
}

it("authenticates computer payloads and rejects stale, foreign-room, wrong-role and altered ciphertext", async () => {
  const envelope = incoming(body);
  expect(await openBrowserEnvelope(pairing, envelope)).toEqual(body);
  for (const altered of [{ ...envelope, room: "another-room" }, { ...envelope, from: "phone" },
    { ...envelope, to: "machine" }, { ...envelope, expiresAt: Date.now() - 1 },
    { ...envelope, recipientKeyId: "0".repeat(64) }, { ...envelope, box: "invalid" }, null]) {
    expect(await openBrowserEnvelope(pairing, altered)).toBeNull();
  }
});

it("keeps transferred session encryption inside its exact task scope", async () => {
  const key = nacl.randomBytes(32), nonce = nacl.randomBytes(24);
  const wrapper = { type: "session.sealed", sessionId: "task", createdAt: Date.now(), nonce: base64(nonce),
    box: base64(nacl.secretbox(new TextEncoder().encode(JSON.stringify(body)), nonce, key)) };
  const encodedKey = base64(key).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  expect(await openBrowserEnvelope(pairing, incoming(wrapper), { task: encodedKey })).toEqual(body);
  expect(await openBrowserEnvelope(pairing, incoming(wrapper))).toBeNull();
  expect(await openBrowserEnvelope(pairing, incoming({ ...wrapper, sessionId: "foreign" }),
    { foreign: encodedKey })).toBeNull();
  await expect(sealBrowserPayload(pairing, body, { sessionId: "foreign", sessionKey: encodedKey }))
    .rejects.toThrow(/scope/);
});
