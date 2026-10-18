// @vitest-environment node
import { expect, it } from "vitest";
import nacl from "tweetnacl";
import { base64, browserKeyPair, unbase64 } from "../../Cryptography";
import { openComputerOffer } from "..";

it("opens only the sealed offer for the requested account computer and validates its key pair", () => {
  const receiver = browserKeyPair(), sender = browserKeyPair(), phone = browserKeyPair(), machine = browserKeyPair();
  const pairing = { relayUrl: "wss://relay.granttap.com", room: "a".repeat(32), role: "phone", deviceName: "Fixture",
    senderId: "phone-fixture", myPublicKey: phone.publicKey, mySecretKey: phone.secretKey,
    peerPublicKey: machine.publicKey, pushAuth: "b".repeat(64) };
  const wrap = (changes = {}) => {
    const nonce = nacl.randomBytes(24);
    const plain = { schema: "granttap.account-offer.v1", requestId: "request", machineId: "machine",
      pairing: { ...pairing, ...changes } };
    return JSON.stringify({ senderPublicKey: sender.publicKey, nonce: base64(nonce),
      box: base64(nacl.box(new TextEncoder().encode(JSON.stringify(plain)), nonce,
        unbase64(receiver.publicKey), unbase64(sender.secretKey))) });
  };
  expect(openComputerOffer(wrap(), receiver.secretKey, "request", "machine")).toEqual({ ...pairing, machineId: "machine" });
  expect(() => openComputerOffer(wrap(), receiver.secretKey, "other", "machine")).toThrow();
  expect(() => openComputerOffer(wrap(), receiver.secretKey, "request", "other")).toThrow();
  expect(() => openComputerOffer(wrap({ relayUrl: "wss://evil.example" }), receiver.secretKey, "request", "machine")).toThrow();
  expect(() => openComputerOffer(wrap({ myPublicKey: machine.publicKey }), receiver.secretKey, "request", "machine")).toThrow();
  expect(() => openComputerOffer(wrap(), sender.secretKey, "request", "machine")).toThrow();
  expect(() => openComputerOffer("invalid", receiver.secretKey, "request", "machine")).toThrow();
});
