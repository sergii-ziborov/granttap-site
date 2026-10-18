// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import nacl from "tweetnacl";
import { base64, browserKeyPair, unbase64 } from "../../Cryptography";
import { connectAccountComputer } from "..";
afterEach(() => vi.useRealTimers());

function fixture(mode: "success" | "refused" | "revoked" | "malformed" | "invalid-offer" | "wait" = "success") {
  const sender = browserKeyPair(), phone = browserKeyPair(), machine = browserKeyPair();
  let receiver = "", polls = 0;
  const pairing = { relayUrl: "wss://relay.granttap.com", room: "a".repeat(32), role: "phone", deviceName: "Synthetic",
    senderId: "browser", myPublicKey: phone.publicKey, mySecretKey: phone.secretKey,
    peerPublicKey: machine.publicKey, pushAuth: "b".repeat(64) };
  const request = vi.fn(async (path: string | URL | Request, init?: RequestInit) => {
    if (init?.method === "POST") {
      receiver = JSON.parse(String(init.body)).phonePublicKey;
      return Response.json(mode === "malformed" ? { id: "request", expiresAt: 0 }
        : { id: "request", expiresAt: Date.now() + 30_000 }, { status: mode === "refused" ? 403 : 200 });
    }
    expect(String(path)).toBe("/api/account/requests/request"); polls++;
    if (mode === "revoked") return Response.json({}, { status: 410 });
    if (mode === "wait" || polls === 1) return Response.json({}, { status: 202 });
    if (mode === "invalid-offer") return Response.json({ encryptedOffer: 7 });
    const nonce = nacl.randomBytes(24), body = { schema: "granttap.account-offer.v1", requestId: "request", machineId: "machine", pairing };
    return Response.json({ encryptedOffer: JSON.stringify({ senderPublicKey: sender.publicKey, nonce: base64(nonce),
      box: base64(nacl.box(new TextEncoder().encode(JSON.stringify(body)), nonce, unbase64(receiver), unbase64(sender.secretKey))) }) });
  });
  return { request, pairing };
}

it("receives and decrypts the exact computer offer after a pending response using only an ephemeral public key", async () => {
  vi.useFakeTimers(); const f = fixture();
  const connected = connectAccountComputer("machine", new AbortController().signal, f.request);
  await vi.advanceTimersByTimeAsync(1_501);
  const result = await connected;
  expect(result.machineId).toBe("machine"); expect(result.room === f.pairing.room).toBe(true);
  expect(result.mySecretKey === f.pairing.mySecretKey).toBe(true);
  const body = JSON.parse(String(f.request.mock.calls[0][1]?.body));
  expect(Object.keys(body)).toEqual(["phonePublicKey"]);
});
it("reports refused, expired and invalid offer states without saving a pairing", async () => {
  for (const [mode, message] of [["refused", /could not accept/], ["malformed", /Invalid connection/],
    ["revoked", /expired or was revoked/]] as const) {
    await expect(connectAccountComputer("machine", new AbortController().signal, fixture(mode).request)).rejects.toThrow(message);
  }
  vi.useFakeTimers(); const failure = expect(connectAccountComputer("machine", new AbortController().signal,
    fixture("invalid-offer").request)).rejects.toThrow("Invalid encrypted connection offer.");
  await vi.advanceTimersByTimeAsync(1_501); await failure;
});
it("cancels waiting immediately and reports a computer that never completes its offer", async () => {
  vi.useFakeTimers(); const controller = new AbortController();
  const canceled = expect(connectAccountComputer("machine", controller.signal, fixture("wait").request)).rejects.toThrow(/cancelled/);
  await vi.advanceTimersByTimeAsync(1); controller.abort(); await canceled;
  const expired = expect(connectAccountComputer("machine", new AbortController().signal, fixture("wait").request)).rejects.toThrow(/offline/);
  await vi.advanceTimersByTimeAsync(30_001); await expired;
});
