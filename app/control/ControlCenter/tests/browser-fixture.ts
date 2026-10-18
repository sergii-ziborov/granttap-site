import { vi } from "vitest";
import { webcrypto } from "node:crypto";
import { BrowserKeyVault } from "../../BrowserKeys";
import { browserKeyPair, type BrowserPairing } from "../../Cryptography";
import { Payload } from "../../ControlProtocol";
import type { RelayEvents } from "../../RelayConnection";

let received: Payload[] = [], sockets: FixtureRelayConnection[] = [];
/** UI contract fixture. Actual NaCl/native interoperability is tested separately. */
export class FixtureRelayConnection {
  constructor(_pairing: BrowserPairing, _grants: Record<string, string>, private events: RelayEvents) { sockets.push(this); }
  start() {
    queueMicrotask(() => { this.events.status("connected");
      void this.payload({ type: "sessions.status", machine: "Fixture computer", generatedAt: Date.now(),
        sessions: [{ sessionId: "task", projectId: "mesh", title: "Synthetic web Task", agent: "codex", state: "working",
          startedAt: 1, lastActivityAt: Date.now(), tokensSession: 1200, tokensLastTurn: 20 }] });
      void this.payload(meshFixture()); });
  }
  payload(value: unknown) { return this.events.payload(Payload.parse(value)); }
  async submit(value: Payload) { received.push(Payload.parse(value)); }
  async send(value: Payload) {
    const payload = Payload.parse(value); received.push(payload);
    if (payload.type === "session.subscribe" && payload.active) {
      await this.events.grant(payload.sessionId, "A".repeat(43) + "=");
      await this.payload({ type: "session.activity", sessionId: payload.sessionId, agent: "codex", state: "working",
        entries: Array.from({ length: 5_000 }, (_, i) => ({ id: "line-" + i, kind: i % 2 ? "message" : "user",
          text: "Synthetic history " + i, createdAt: Date.now() - (5_000 - i) * 1000 })), generatedAt: Date.now() });
    }
  }
  stop() { this.events.status("closed"); }
}
export async function browserFixture(mode: "ready" | "signin" | "subscription" = "ready") {
  vi.stubGlobal("crypto", webcrypto); received = []; sockets = [];
  const accountId = crypto.randomUUID(), machineId = crypto.randomUUID();
  const phone = browserKeyPair(), machine = browserKeyPair();
  const pairing: BrowserPairing = { machineId, room: "a".repeat(32), relayUrl: "wss://relay.granttap.com", role: "phone",
    deviceName: "Fixture computer", senderId: "browser", myPublicKey: phone.publicKey, mySecretKey: phone.secretKey,
    peerPublicKey: machine.publicKey, pushAuth: "b".repeat(64) };
  vi.stubGlobal("fetch", vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes("control/access")) return Response.json(mode === "ready" ? { accountId, access: { source: "beta", expiresAt: Date.now() + 300_000 } }
      : { error: "Access required" }, { status: mode === "signin" ? 401 : mode === "subscription" ? 403 : 200 });
    if (url.includes("machines?")) return Response.json({ machines: [{ id: machineId, name: "Fixture computer" }] });
    throw Error("Unexpected fixture request");
  }));
  await new BrowserKeyVault().update(accountId, old => ({ ...old, pairings: [pairing] }));
  return { accountId, machineId, received, sockets };
}

function meshFixture() {
  return { type: "mesh.snapshot", sessionId: "mesh", projectId: "mesh", publisherEndpointId: "endpoint",
    project: { projectId: "mesh", name: "Fixture Mesh", canonicalRepositoryId: "fixture/repository", repositoryRoot: "/fixture", createdAt: 1 },
    tasks: [], executions: [], claims: [], dependencies: [], events: [], generatedAt: Date.now(),
    modelCatalog: [{ endpointId: "endpoint", observedAt: Date.now(), models: [{ endpointId: "endpoint", provider: "codex", source: "advertised",
      observedAt: Date.now(), modelId: "fixture-model", label: "Fixture Model", supportedEfforts: ["low", "medium", "high", "xhigh", "max", "ultra"] }] }],
    repositoryGraphs: [{ projectId: "mesh", repositoryId: "fixture/repository", revision: "fixture", weavatrixVersion: "fixture",
      analysisStatus: "COMPLETE", nodes: [{ id: "n", kind: "component", label: "Fixture component" }], relations: [], totalNodes: 1, totalRelations: 0, truncated: false }] };
}
