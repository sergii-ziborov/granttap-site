// @vitest-environment node
import "fake-indexeddb/auto";
import { expect, it } from "vitest";
import { BrowserKeyVault } from "..";
import { BrowserKeysStorage } from "../storage";
import { browserKeyPair, type BrowserPairing } from "../../Cryptography";

const account = "12345678-1234-4123-8123-123456789012";
function pairing(machineId: string): BrowserPairing {
  const keys = browserKeyPair(), peer = browserKeyPair();
  return { machineId, relayUrl: "wss://relay.granttap.com", room: "fixture-room", role: "phone",
    deviceName: "Browser", senderId: "fixture", pushAuth: "fixture-credential",
    myPublicKey: keys.publicKey, mySecretKey: keys.secretKey, peerPublicKey: peer.publicKey };
}
const storage = () => new BrowserKeysStorage("vault-test-" + crypto.randomUUID());

it("restores browser keys after reopening without storing plaintext key material", async () => {
  const store = storage(), first = new BrowserKeyVault(store), fixture = pairing("first");
  await first.update(account, current => ({ ...current, pairings: [fixture] }));
  const saved = await store.read(account);
  expect(saved?.key.extractable).toBe(false);
  expect(new TextDecoder().decode(saved!.cipher)).not.toContain(fixture.mySecretKey);
  await expect(crypto.subtle.exportKey("raw", saved!.key)).rejects.toThrow();
  const reopened = new BrowserKeyVault(store);
  expect((await reopened.read(account)).pairings).toEqual([fixture]);
  await reopened.forget(account);
  expect((await first.read(account)).pairings).toEqual([]);
});

it("merges concurrent tab updates instead of replacing another computer's keys", async () => {
  const store = storage(), first = new BrowserKeyVault(store), second = new BrowserKeyVault(store);
  const left = pairing("left"), right = pairing("right");
  await Promise.all([first.update(account, value => ({ ...value, pairings: [...value.pairings, left] })),
    second.update(account, value => ({ ...value, pairings: [...value.pairings, right] }))]);
  expect((await first.read(account)).pairings.map(value => value.machineId).sort()).toEqual(["left", "right"]);
});

it("does not decrypt a copied vault under another account", async () => {
  const store = storage(), vault = new BrowserKeyVault(store);
  await vault.update(account, current => ({ ...current, pairings: [pairing("private")] }));
  await store.commit("another-account", (await store.read(account))!, 0);
  await expect(vault.read("another-account")).rejects.toThrow();
});
