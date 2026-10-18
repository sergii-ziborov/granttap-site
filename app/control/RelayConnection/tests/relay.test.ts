// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import nacl from "tweetnacl";
import { base64, unbase64, browserKeyPair, type BrowserPairing } from "../../Cryptography";
import { BrowserRelayConnection, type RelayEvents } from "..";
afterEach(() => vi.unstubAllGlobals());

class Socket {
  readyState = 0; sent: string[] = [];
  onopen?: () => void; onclose?: () => void; onerror?: () => void;
  onmessage?: (event: { data: string }) => void;
  open() { this.readyState = 1; this.onopen?.(); }
  frame(value: unknown) { this.onmessage?.({ data: JSON.stringify(value) }); }
  send(raw: string) { this.sent.push(raw); }
  close() { this.readyState = 3; this.onclose?.(); }
}
function fixture() {
  vi.stubGlobal("location", { origin: "https://granttap.com", protocol: "https:" });
  const phone = browserKeyPair(), machine = browserKeyPair(); const socket = new Socket();
  const pairing: BrowserPairing = { machineId: "fixture", relayUrl: "wss://relay.granttap.com", room: "a".repeat(32),
    role: "phone", senderId: "web", deviceName: "Fixture", myPublicKey: phone.publicKey,
    mySecretKey: phone.secretKey, peerPublicKey: machine.publicKey, pushAuth: "b".repeat(64) };
  const events = { payload: vi.fn(async () => {}), grant: vi.fn<RelayEvents["grant"]>(async () => {}), status: vi.fn() };
  const client = new BrowserRelayConnection(pairing, {}, events, () => socket as unknown as WebSocket);
  const message = { type: "user.message" as const, messageId: "message", sessionId: "task", text: "Synthetic fixture", createdAt: Date.now() };
  const incoming = (payload: unknown, deliveryId?: string) => {
    const nonce = nacl.randomBytes(24);
    return { v: 1, room: pairing.room, from: "machine", to: "phone", senderId: "synthetic-computer", deliveryId,
      nonce: base64(nonce), box: base64(nacl.box(new TextEncoder().encode(JSON.stringify(payload)), nonce,
        unbase64(pairing.myPublicKey), unbase64(machine.secretKey))) };
  };
  return { client, socket, events, message, incoming };
}

it("reports storage on the relay acknowledgement while the computer is offline", async () => {
  const f = fixture(); f.client.start(); f.socket.open();
  expect(JSON.parse(f.socket.sent[0]).type).toBe("control.connect");
  f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3));
  let stored = false;
  const pending = f.client.submit(f.message, "user-message-message").then(() => { stored = true; });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(4));
  expect(stored).toBe(false); expect(f.events.payload).not.toHaveBeenCalled();
  const envelope = JSON.parse(f.socket.sent[3]); expect(envelope.box).not.toContain("Synthetic");
  f.socket.frame({ type: "relay.stored", deliveryId: envelope.deliveryId });
  await pending; expect(stored).toBe(true); expect(f.events.payload).not.toHaveBeenCalled(); f.client.stop();
});

it("requires relay-durable delivery identifiers and never reports a dropped submission as stored", async () => {
  const f = fixture();
  await expect(f.client.submit(f.message, "arbitrary-id")).rejects.toThrow(/identifier/i);
  f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3));
  const pending = f.client.submit(f.message, "user-message-dropped");
  const result = expect(pending).rejects.toThrow(/could not store/i);
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(4));
  f.socket.frame({ type: "relay.dropped", deliveryId: "user-message-dropped", reason: "full" });
  await result; f.client.stop();
});

it("cancels an unconfirmed submission honestly when the browser connection closes", async () => {
  const f = fixture(); f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3));
  const pending = f.client.submit(f.message, "user-message-not-confirmed");
  const result = expect(pending).rejects.toThrow(/before relay confirmation/);
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(4));
  f.client.stop(); await result;
  await expect(f.client.submit(f.message, "user-message-late")).rejects.toThrow(/closed/);
});

it("retains a newly queued Task for the same offline window as a follow-up message", async () => {
  const f = fixture(); f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3));
  const createdAt = Date.now();
  const sending = f.client.submit({ type: "project.task.create", operationId: "offline-new-task", projectId: "mesh",
    cwd: "/synthetic", text: "Synthetic new Task", agent: "cursor", createdAt }, "user-message-offline-new-task");
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(4));
  const envelope = JSON.parse(f.socket.sent[3]);
  f.socket.frame({ type: "relay.stored", deliveryId: envelope.deliveryId }); await sending; f.client.stop();
  expect(envelope.expiresAt - createdAt).toBeGreaterThanOrEqual(29 * 86_400_000);
});


it("persists native key grants before acknowledging and decrypts session-scoped activity", async () => {
  const f = fixture(); f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3));
  const key = nacl.randomBytes(32);
  f.socket.frame(f.incoming({ type: "session.key.grant", sessionId: "task", key: base64(key), createdAt: 1 }, "grant"));
  await vi.waitFor(() => expect(f.socket.sent.map(raw => JSON.parse(raw)).some(frame => frame.type === "relay.ack" && frame.deliveryId === "grant")).toBe(true));
  expect(f.events.grant.mock.calls[0][0]).toBe("task"); expect(f.events.grant.mock.calls[0][1] === base64(key)).toBe(true);
  const nonce = nacl.randomBytes(24), event = { type: "agent.event", kind: "response", text: "Synthetic encrypted activity", sessionId: "task", agent: "cursor", createdAt: 1 };
  f.socket.frame(f.incoming({ type: "session.sealed", sessionId: "task", nonce: base64(nonce), createdAt: 1,
    box: base64(nacl.secretbox(new TextEncoder().encode(JSON.stringify(event)), nonce, key)) }, "activity"));
  await vi.waitFor(() => expect(f.events.payload).toHaveBeenCalledWith(event));
  await f.client.send({ type: "session.control", sessionId: "task", action: "pause", createdAt: 2 }, "task");
  await expect(f.client.send({ type: "session.control", sessionId: "missing", action: "pause", createdAt: 2 }, "missing")).rejects.toThrow(/encryption key/);
  f.client.stop();
});
it("never acknowledges a key grant whose durable storage failed, or an invalid payload", async () => {
  const f = fixture(); f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3));
  f.socket.frame(f.incoming({ type: "not-a-native-message" }, "invalid"));
  f.socket.frame({ v: 1, room: "foreign" });
  f.events.grant.mockRejectedValueOnce(Error("Synthetic storage failure"));
  f.socket.frame(f.incoming({ type: "session.key.grant", sessionId: "task", key: base64(nacl.randomBytes(32)), createdAt: 1 }, "not-saved"));
  await vi.waitFor(() => expect(f.socket.readyState).toBe(3));
  expect(f.socket.sent.some(raw => JSON.parse(raw).type === "relay.ack")).toBe(false); f.client.stop();
});
it("does not silently accept a live-only command before relay connection or after it closes", async () => {
  const f = fixture(), refresh = { type: "sessions.refresh" as const, createdAt: 1 };
  await expect(f.client.send(refresh)).rejects.toThrow(/reconnect|connected/i);
  f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3));
  f.client.stop(); await expect(f.client.send(refresh)).rejects.toThrow(/reconnect|closed/i);
});
it("does not mistake an unrelated relay acknowledgement for storage, and preserves the original encrypted submission on reconnect", async () => {
  const f = fixture(); f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3));
  let stored = false; const pending = f.client.submit(f.message, "user-message-reconnect").then(() => { stored = true; });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(4)); const raw = f.socket.sent[3];
  f.socket.frame({ type: "relay.stored", deliveryId: "user-message-other" });
  await new Promise(resolve => setTimeout(resolve, 0)); expect(stored).toBe(false);
  await expect(f.client.submit(f.message, "user-message-reconnect")).rejects.toThrow(/already waiting/);
  f.socket.close(); f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent.filter(value => value === raw)).toHaveLength(2));
  f.socket.frame({ type: "relay.stored", deliveryId: "user-message-reconnect" }); await pending;
  expect(stored).toBe(true); f.client.stop();
});
it("reports a missing relay acknowledgement as unconfirmed storage instead of successful delivery", async () => {
  const f = fixture(); f.client.start(); f.socket.open(); f.socket.frame({ type: "control.ready" });
  await vi.waitFor(() => expect(f.socket.sent).toHaveLength(3)); vi.useFakeTimers();
  try {
    const sending = f.client.submit(f.message, "user-message-timeout");
    const failed = expect(sending).rejects.toThrow(/not confirmed storage/);
    await vi.waitFor(() => expect(f.socket.sent).toHaveLength(4));
    await vi.advanceTimersByTimeAsync(12_001); await failed;
  } finally { f.client.stop(); vi.useRealTimers(); }
});
