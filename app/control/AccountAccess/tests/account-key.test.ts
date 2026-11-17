import { describe, expect, it, vi } from "vitest";
import nacl from "tweetnacl";
import { accountKeyPairings } from "../account-key";

const key = () => Buffer.from(nacl.box.keyPair().publicKey).toString("base64");
function pairing(machineId: string) {
  const pair = nacl.box.keyPair();
  return { machineId, relayUrl: "wss://relay.granttap.com", room: "a".repeat(32), role: "phone", deviceName: "GrantTap Web",
    senderId: "web", myPublicKey: Buffer.from(pair.publicKey).toString("base64"),
    mySecretKey: Buffer.from(pair.secretKey).toString("base64"), peerPublicKey: key(), pushAuth: "b".repeat(64) };
}
const answer = (bundle: unknown, status = 200) => vi.fn(async () => Response.json(
  { stored: true, bundle: typeof bundle === "string" ? bundle : JSON.stringify(bundle) }, { status })) as unknown as typeof fetch;

describe("the account-held key in GrantTap Web", () => {
  it("keeps only valid controller identities for the fixed relay", async () => {
    const good = pairing("one"), bad = { ...pairing("two"), relayUrl: "wss://evil.example/ws" };
    const mismatched = { ...pairing("three"), myPublicKey: key() };
    const request = answer({ schema: "granttap.account-web-key.v1", pairings: [good, bad, mismatched, null] });
    const result = await accountKeyPairings(new AbortController().signal, request);
    expect(result.map(item => item.machineId)).toEqual(["one"]);
    expect(request).toHaveBeenCalledWith("/api/account/web-key/material", expect.objectContaining({ method: "POST", credentials: "same-origin" }));
  });

  it("treats a missing, foreign or unreadable key as no key", async () => {
    const signal = new AbortController().signal;
    expect(await accountKeyPairings(signal, answer({}, 404))).toEqual([]);
    expect(await accountKeyPairings(signal, answer({ schema: "other", pairings: [pairing("x")] }))).toEqual([]);
    expect(await accountKeyPairings(signal, answer("{"))).toEqual([]);
    expect(await accountKeyPairings(signal, vi.fn(async () => { throw Error("offline"); }) as unknown as typeof fetch)).toEqual([]);
  });
});
