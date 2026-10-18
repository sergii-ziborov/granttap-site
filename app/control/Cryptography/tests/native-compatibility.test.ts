// @vitest-environment node
import { expect, it } from "vitest";
import { ApprovalRequest } from "granttap-mcp/packages/protocol/schema";
import { openRelayMessage } from "granttap-mcp/packages/core/relay-inbound";
import { sealEnvelope } from "granttap-mcp/packages/core/relay-envelope";
import { browserKeyPair, openBrowserEnvelope, sealBrowserPayload, type BrowserPairing } from "..";

function peers() {
  const phone = browserKeyPair(), machine = browserKeyPair();
  const pairing: BrowserPairing = { machineId: "12345678-1234-4123-8123-123456789012",
    relayUrl: "wss://relay.granttap.com", room: "wire-contract", role: "phone", deviceName: "Browser",
    senderId: "browser", pushAuth: "fixture", myPublicKey: phone.publicKey,
    mySecretKey: phone.secretKey, peerPublicKey: machine.publicKey };
  return { pairing, machine: { ...pairing, role: "machine" as const, senderId: "machine",
    myPublicKey: machine.publicKey, mySecretKey: machine.secretKey, peerPublicKey: phone.publicKey } };
}

it("receives native approval requests and returns native-readable decisions for all four providers", async () => {
  const p = peers();
  for (const agent of ["claude", "codex", "cursor", "grok"] as const) {
    const request = ApprovalRequest.parse({ type: "approval.request", agent, kind: "permission",
      requestId: "fixture-" + agent, title: "Dedicated permission fixture", tool: "shell", createdAt: Date.now() });
    const incoming = JSON.parse(sealEnvelope(p.machine, request, "phone", { recipientRouting: true, ttlMs: 60_000 }));
    expect(await openBrowserEnvelope(p.pairing, incoming)).toEqual(request);
    const decision = { type: "approval.decision", requestId: request.requestId, decision: "allow", decidedAt: Date.now() };
    const response = await sealBrowserPayload(p.pairing, decision);
    expect(openRelayMessage(p.machine, response, new Map(), () => true)?.payload).toEqual(decision);
  }
});

it("sends a scoped message that the actual native protocol accepts and unwraps", async () => {
  const p = peers(), key = "A".repeat(43);
  const message = { type: "user.message", sessionId: "native-task", text: "Synthetic follow-up",
    messageId: "browser-message", createdAt: Date.now() };
  const response = await sealBrowserPayload(p.pairing, message, { sessionId: message.sessionId, sessionKey: key });
  expect(openRelayMessage(p.machine, response, new Map([[message.sessionId, key]]), () => true)?.payload).toEqual(message);
});
