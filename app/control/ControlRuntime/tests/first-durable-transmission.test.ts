// @vitest-environment node
import "fake-indexeddb/auto";
import { expect, it, vi } from "vitest";
import { ControlRuntime } from "..";
import { BrowserKeysStorage, BrowserKeyVault, type EncryptedKeys } from "../../BrowserKeys";
import { BrowserControlArchive } from "../../ControlArchive";
import { BrowserControlOutbox } from "../../ControlOutbox";
import type { BrowserPairing } from "../../Cryptography";
import type { Payload } from "../../ControlProtocol";

const network = vi.hoisted(() => ({ sent: [] as Array<{ id: string; payload: Payload }> }));
vi.mock("../../RelayConnection", () => ({ BrowserRelayConnection: class {
  constructor(_pairing: BrowserPairing, _grants: unknown, private events: { status: (value: string) => void }) {}
  start() { this.events.status("connected"); }
  stop() {}
  async submit(payload: Payload, id: string) { network.sent.push({ payload, id }); }
} }));

class DelayedSecondCommit extends BrowserKeysStorage {
  private commits = 0;
  private releaseCommit!: () => void;
  private reportHeld!: () => void;
  readonly held = new Promise<void>(resolve => { this.reportHeld = resolve; });
  private permission = new Promise<void>(resolve => { this.releaseCommit = resolve; });
  release() { this.releaseCommit(); }
  override async commit(accountId: string, value: EncryptedKeys, revision: number) {
    if (++this.commits === 2) { this.reportHeld(); await this.permission; }
    return super.commit(accountId, value, revision);
  }
}

it("transmits the durable original intent before a second disk write while keeping relay confirmation pending until durable", async () => {
  network.sent = [];
  const accountId = crypto.randomUUID(), name = "first-transmission-" + accountId;
  const storage = new DelayedSecondCommit(name), outbox = new BrowserControlOutbox(storage);
  const restored = new BrowserControlOutbox(new BrowserKeysStorage(name));
  const runtime = new ControlRuntime(accountId, new BrowserKeyVault(), new BrowserControlArchive(), outbox);
  await runtime.restore({ pairings: [{ machineId: "machine", room: "fixture" } as BrowserPairing], grants: [] }, new Set(["machine"]));
  const payload: Payload = { type: "user.message", messageId: "durable-first", sessionId: "task",
    text: "Synthetic durable intent", agent: "codex", createdAt: 1 };
  const sending = runtime.submit("machine", payload, "user-message-durable-first");
  try {
    await storage.held;
    expect(network.sent).toEqual([{ id: "user-message-durable-first", payload }]);
    expect((await restored.read(accountId))["user-message-durable-first"]).toMatchObject({ payload, delivery: { state: "sending" } });
    expect(runtime.snapshot().deliveries["user-message-durable-first"]?.state).toBe("sending");
  } finally {
    storage.release();
    await sending;
    runtime.dispose();
  }
  expect((await restored.read(accountId))["user-message-durable-first"]).toMatchObject({ payload, delivery: { state: "stored" } });
  expect(network.sent).toHaveLength(1);
  await restored.forget(accountId);
});
