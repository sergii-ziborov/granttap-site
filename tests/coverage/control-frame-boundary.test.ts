// @vitest-environment node
import { expect, it } from "vitest";
import { controlConnection, controllerFrame } from "../../worker/account/control-transport/frames";

it("accepts only canonical room-scoped ciphertext and bounded delivery acknowledgements", () => {
  const room = "a".repeat(32), frame = { v: 1, room, from: "phone", to: "machine", senderId: "fixture",
    nonce: "a".repeat(32), box: "b".repeat(24) };
  expect(controllerFrame(JSON.stringify(frame), room)).toBe(true);
  expect(controllerFrame(JSON.stringify({ type: "relay.ack", deliveryId: "fixture" }), room)).toBe(true);
  for (const invalid of ["not-json", "null", "[]", JSON.stringify({ ...frame, privateKey: "must-not-enter" }),
    JSON.stringify({ ...frame, from: "machine" }), JSON.stringify({ ...frame, to: "browser" }),
    JSON.stringify({ ...frame, nonce: "bad" }), JSON.stringify({ ...frame, box: "!".repeat(24) }),
    JSON.stringify({ type: "relay.ack", deliveryId: "" }), JSON.stringify({ type: "relay.ack", deliveryId: 7 }),
    JSON.stringify({ type: "relay.ack", deliveryId: "x".repeat(181) }),
    JSON.stringify({ type: "relay.ack", deliveryId: "fixture", other: true })]) {
    expect(controllerFrame(invalid, room)).toBe(false);
  }
});
it("rejects malformed identities before private keys or alternate relay addresses can be consumed", () => {
  const identity = { type: "control.connect", computerId: "12345678-1234-4123-8123-123456789012", room: "a".repeat(32),
    publicKey: Buffer.alloc(32, 2).toString("base64"), credential: "b".repeat(64) };
  expect(controlConnection(JSON.stringify(identity))).toMatchObject({ room: identity.room, computerId: identity.computerId });
  for (const invalid of ["x".repeat(2_049), "not-json", "null", JSON.stringify({ ...identity, publicKey: "bad" }),
    JSON.stringify({ ...identity, room: "foreign-room" }), JSON.stringify({ ...identity, credential: "bad" }),
    JSON.stringify({ ...identity, publicKey: null }),
    JSON.stringify({ ...identity, computerId: "not-an-account-computer" })]) {
    expect(controlConnection(invalid)).toBeNull();
  }
});
