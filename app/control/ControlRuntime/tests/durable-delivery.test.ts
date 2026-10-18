// @vitest-environment node
import "fake-indexeddb/auto";
import { afterEach, expect, it, vi } from "vitest";
import { BrowserControlArchive } from "../../ControlArchive";
import { BrowserKeyVault } from "../../BrowserKeys";
import { ControlRuntime } from "..";
import type { BrowserPairing } from "../../Cryptography";
import type { Payload } from "../../ControlProtocol";

const network = vi.hoisted(() => ({ sent: [] as Array<{ id: string; payload: unknown }>, fail: false,
  afterSend: undefined as undefined | (() => Promise<void>),
  receivers: new Map<string, (payload: Payload) => Promise<void>>(),
  grants: new Map<string, (sessionId: string, key: string) => Promise<void>>() }));
vi.mock("../../RelayConnection", () => ({ BrowserRelayConnection: class {
  constructor(pairing: BrowserPairing, _grants: unknown, private events: {
    status: (state: string) => void; payload: (payload: Payload) => Promise<void>; grant: (id: string, key: string) => Promise<void> }) {
    network.receivers.set(pairing.machineId, events.payload); network.grants.set(pairing.machineId, events.grant);
  }
  start() { this.events.status("connected"); }
  stop() {}
  async submit(payload: unknown, id: string) {
    network.sent.push({ payload, id });
    await network.afterSend?.();
    if (network.fail) throw Error("Transport unavailable");
  }
} }));
afterEach(() => { network.afterSend = undefined; network.fail = false; });
const pairing = { machineId: "machine", room: "room" } as BrowserPairing;
const keys = { pairings: [pairing], grants: [] };
const payload: Payload = { type: "approval.decision", requestId: "request", sessionId: "task", decision: "allow",
  decidedBy: "GrantTap Web", decidedAt: 1 };

it("keeps a relay-saved decision locked after browser reload without changing its immutable intent", async () => {
  network.sent = []; network.fail = false;
  const accountId = crypto.randomUUID(), vault = new BrowserKeyVault();
  const first = new ControlRuntime(accountId, vault);
  await first.restore(keys, new Set(["machine"]));
  await first.submit("machine", payload, "approval-decision-request"); first.dispose();
  const reopened = new ControlRuntime(accountId, vault);
  await reopened.restore(keys, new Set(["machine"]));
  expect(reopened.snapshot().deliveries["approval-decision-request"]?.state).toBe("stored");
  await expect(reopened.submit("machine", { ...payload, decision: "deny" }, "approval-decision-request"))
    .rejects.toThrow(/already|different|immutable/i);
  expect(network.sent).toHaveLength(1);
  await reopened.forget();
  const forgotten = new ControlRuntime(accountId, vault); await forgotten.restore(keys, new Set(["machine"]));
  expect(forgotten.snapshot().deliveries).toEqual({}); forgotten.dispose();
});

it("restores a failed transport attempt and resends the original ID and payload on reconnect", async () => {
  network.sent = []; network.fail = true;
  const accountId = crypto.randomUUID(), vault = new BrowserKeyVault();
  const first = new ControlRuntime(accountId, vault); await first.restore(keys, new Set(["machine"]));
  await expect(first.submit("machine", payload, "approval-decision-request")).rejects.toThrow("Transport unavailable");
  expect(first.snapshot().deliveries["approval-decision-request"]?.state).toBe("failed"); first.dispose();
  network.fail = false;
  const reopened = new ControlRuntime(accountId, vault); await reopened.restore(keys, new Set(["machine"]));
  await vi.waitFor(() => expect(reopened.snapshot().deliveries["approval-decision-request"]?.state).toBe("stored"));
  expect(network.sent.map(item => item.id)).toEqual(["approval-decision-request", "approval-decision-request"]);
  expect(network.sent[0].payload).toEqual(network.sent[1].payload);
  const other = new ControlRuntime(crypto.randomUUID(), vault); await other.restore(keys, new Set(["machine"]));
  expect(other.snapshot().deliveries).toEqual({}); other.dispose(); await reopened.forget();
});


it("restores the text and attachment names of messages waiting on relay without exposing another computer's queue", async () => {
  network.sent = []; network.fail = false;
  const accountId = crypto.randomUUID(), vault = new BrowserKeyVault();
  const first = new ControlRuntime(accountId, vault); await first.restore(keys, new Set(["machine"]));
  await first.submit("machine", { type: "user.message", messageId: "message", sessionId: "task", agent: "cursor",
    text: "Synthetic pending message", createdAt: 7, attachments: [{ name: "synthetic.txt", mimeType: "text/plain", data: "Zml4dHVyZQ==" }] }, "user-message-message");
  first.dispose(); const reopened = new ControlRuntime(accountId, vault); await reopened.restore(keys, new Set(["machine"]));
  expect(reopened.outgoingMessages("machine", "task")).toMatchObject([{ payload: { text: "Synthetic pending message",
    attachments: [{ name: "synthetic.txt" }] }, delivery: { state: "stored" } }]);
  expect(reopened.outgoingMessages("other", "task")).toEqual([]);
  expect(reopened.outgoingMessages("machine", "other")).toEqual([]);
  await reopened.forget();
});


it("accepts a receipt only from the exact computer and never retries a provider rejection automatically", async () => {
  network.sent = []; network.fail = false; network.receivers.clear();
  const accountId = crypto.randomUUID(), vault = new BrowserKeyVault(), both = new Set(["machine", "other"]);
  const pairs = { pairings: [pairing, { ...pairing, machineId: "other" }], grants: [] };
  const first = new ControlRuntime(accountId, vault); await first.restore(pairs, both);
  const message: Payload = { type: "user.message", messageId: "refused", sessionId: "task", text: "Synthetic", createdAt: 1 };
  await first.submit("machine", message, "user-message-refused");
  await network.receivers.get("other")!({ type: "delivery.receipt", messageId: "refused", sessionId: "task", status: "accepted", receivedAt: 2 });
  expect(first.snapshot().deliveries["user-message-refused"]?.state).toBe("stored");
  await network.receivers.get("machine")!({ type: "delivery.receipt", messageId: "refused", sessionId: "task", status: "rejected", error: "Provider needs attention", receivedAt: 2 });
  expect(first.snapshot().deliveries["user-message-refused"]).toMatchObject({ state: "failed", rejected: true }); first.dispose();
  const reopened = new ControlRuntime(accountId, vault); await reopened.restore(pairs, both);
  expect(reopened.snapshot().deliveries["user-message-refused"]).toMatchObject({ state: "failed", rejected: true });
  await expect(reopened.submit("machine", message, "user-message-refused")).rejects.toThrow("Provider needs attention");
  expect(network.sent).toHaveLength(1); await reopened.forget();
});

it("starts a fresh rejected-message attempt only on explicit Retry and keeps a single queued message after reload", async () => {
  network.sent = []; network.fail = false; network.receivers.clear();
  const accountId = crypto.randomUUID(), vault = new BrowserKeyVault();
  const runtime = new ControlRuntime(accountId, vault); await runtime.restore(keys, new Set(["machine"]));
  await runtime.submit("machine", { type: "user.message", messageId: "rejected", sessionId: "task", text: "Synthetic retry", createdAt: 1 }, "user-message-rejected");
  await network.receivers.get("machine")!({ type: "delivery.receipt", messageId: "rejected", sessionId: "task", status: "rejected", receivedAt: 2 });
  await runtime.retryMessage("user-message-rejected");
  expect(network.sent).toHaveLength(2); expect(network.sent[1].id).not.toBe(network.sent[0].id);
  expect(network.sent[1].payload).toMatchObject({ text: "Synthetic retry", sessionId: "task" });
  const visible = runtime.outgoingMessages("machine", "task"); expect(visible).toHaveLength(1);
  expect(visible[0].id).toBe(network.sent[1].id); runtime.dispose();
  const reopened = new ControlRuntime(accountId, vault); await reopened.restore(keys, new Set(["machine"]));
  expect(reopened.outgoingMessages("machine", "task")).toHaveLength(1);
  expect(network.sent).toHaveLength(2); await reopened.forget();
});


it("restores an encrypted conversation cache and keeps session grants scoped to the publishing computer's room", async () => {
  const accountId = crypto.randomUUID(), vault = new BrowserKeyVault(), first = new ControlRuntime(accountId, vault);
  await vault.update(accountId, () => keys); await first.restore(keys, new Set(["machine"]));
  await network.grants.get("machine")!("task", "c3ludGhldGljLWdyYW50");
  expect((await vault.read(accountId)).grants.map(grant => ({ room: grant.room, sessionId: grant.sessionId })))
    .toEqual([{ room: "room", sessionId: "task" }]);
  await network.receivers.get("machine")!({ type: "sessions.status", machine: "Synthetic computer", generatedAt: 1,
    sessions: [{ sessionId: "task", title: "Synthetic cached Task", agent: "cursor", state: "idle", startedAt: 1,
      lastActivityAt: 1, tokensSession: 0, tokensLastTurn: 0 }] });
  await vi.waitFor(async () => expect((await new BrowserControlArchive().read(accountId)).machine?.sessions[0].title).toBe("Synthetic cached Task"));
  first.dispose(); const reopened = new ControlRuntime(accountId, vault); await reopened.restore(keys, new Set(["machine"]));
  expect(reopened.snapshot().computers.machine.sessions[0].title).toBe("Synthetic cached Task"); await reopened.forget();
});
it("shows cache storage failure while allowing independent relay submissions, and closes submission after forgetting", async () => {
  class UnavailableArchive extends BrowserControlArchive { async save() { throw Error("Synthetic cache failure"); } }
  const accountId = crypto.randomUUID(), runtime = new ControlRuntime(accountId, new BrowserKeyVault(), new UnavailableArchive());
  await runtime.restore(keys, new Set(["machine"]));
  await network.receivers.get("machine")!({ type: "sessions.status", machine: "Synthetic", generatedAt: 1, sessions: [] });
  await vi.waitFor(() => expect(runtime.snapshot().error).toMatch(/history cache could not be saved/));
  await runtime.submit("machine", payload, "approval-decision-cache-independent");
  expect(runtime.snapshot().deliveries["approval-decision-cache-independent"].state).toBe("stored");
  await runtime.forget(); await expect(runtime.submit("machine", payload, "approval-decision-closed")).rejects.toThrow(/closed/);
  await expect(runtime.retryMessage("user-message-closed")).rejects.toThrow(/closed/);
});
it("keeps equal provider request IDs on different computers independent through confirmation and reload", async () => {
  network.sent = []; network.fail = false; network.receivers.clear();
  const accountId = crypto.randomUUID(), vault = new BrowserKeyVault(), machines = new Set(["machine", "other"]);
  const both = { pairings: [pairing, { ...pairing, machineId: "other" }], grants: [] };
  const runtime = new ControlRuntime(accountId, vault); await runtime.restore(both, machines);
  const request = { type: "approval.request" as const, requestId: "provider-request", sessionId: "task", agent: "cursor",
    kind: "permission" as const, risk: "medium" as const, tool: "shell", title: "Synthetic permission", createdAt: 1 };
  await runtime.decision("machine", request, "allow");
  await runtime.decision("other", request, "deny");
  expect(network.sent).toHaveLength(2); expect(network.sent[0].id).not.toBe(network.sent[1].id);
  await network.receivers.get("machine")!({ type: "approval.resolved", requestId: request.requestId, sessionId: "task", status: "applied", resolvedAt: 2 });
  expect(runtime.snapshot().deliveries[network.sent[0].id].state).toBe("accepted");
  expect(runtime.snapshot().deliveries[network.sent[1].id].state).toBe("stored"); runtime.dispose();
  const restored = new ControlRuntime(accountId, vault); await restored.restore(both, machines);
  await restored.decision("other", request, "deny"); expect(network.sent).toHaveLength(2);
  await expect(restored.decision("other", request, "allow")).rejects.toThrow(/immutable/); await restored.forget();
});
it("treats an authenticated computer receipt as success when a relay storage acknowledgement is lost", async () => {
  network.sent = []; network.fail = true;
  const accountId = crypto.randomUUID(), vault = new BrowserKeyVault(), runtime = new ControlRuntime(accountId, vault);
  await runtime.restore(keys, new Set(["machine"]));
  network.afterSend = async () => network.receivers.get("machine")!({ type: "delivery.receipt", sessionId: "task",
    messageId: "ack-lost", status: "accepted", receivedAt: 2 });
  const message: Payload = { type: "user.message", sessionId: "task", messageId: "ack-lost", text: "Synthetic message", createdAt: 1 };
  await expect(runtime.submit("machine", message, "user-message-ack-lost")).resolves.toBeUndefined();
  expect(runtime.snapshot().deliveries["user-message-ack-lost"].state).toBe("accepted");
  expect(runtime.outgoingMessages("machine", "task")).toMatchObject([{ payload: { text: "Synthetic message" }, delivery: { state: "accepted" } }]);
  await network.receivers.get("machine")!({ type: "session.activity", sessionId: "task", agent: "cursor", state: "idle",
    entries: [{ id: "native-user", kind: "user", text: "Synthetic message", createdAt: 3 }], generatedAt: 4 });
  expect(runtime.outgoingMessages("machine", "task")).toEqual([]);
  runtime.dispose(); const reopened = new ControlRuntime(accountId, vault); await reopened.restore(keys, new Set(["machine"]));
  expect(reopened.outgoingMessages("machine", "task")).toEqual([]); await reopened.forget();
});
it("does not accept a receipt for another Task, and keeps unconfirmed new Tasks visible until the computer accepts them", async () => {
  network.sent = []; const accountId = crypto.randomUUID(), runtime = new ControlRuntime(accountId, new BrowserKeyVault());
  await runtime.restore(keys, new Set(["machine"]));
  await runtime.submit("machine", { type: "user.message", messageId: "scoped", sessionId: "task", text: "Synthetic", createdAt: 1 }, "user-message-scoped");
  await network.receivers.get("machine")!({ type: "delivery.receipt", sessionId: "other", messageId: "scoped", status: "accepted", receivedAt: 2 });
  expect(runtime.snapshot().deliveries["user-message-scoped"].state).toBe("stored");
  await runtime.submit("machine", { type: "project.task.create", operationId: "new-task-id", projectId: "mesh", cwd: "/synthetic", text: "Synthetic new Task", createdAt: 1 }, "user-message-new-task-id");
  expect(runtime.queuedTasks()).toHaveLength(1);
  await network.receivers.get("machine")!({ type: "delivery.receipt", messageId: "new-task-id", sessionId: "created-task", status: "accepted", receivedAt: 2 });
  expect(runtime.queuedTasks()).toEqual([]); await runtime.forget();
});
it("coalesces two transport retries into one send and retains a failed message until an explicit retry succeeds", async () => {
  network.sent = []; network.fail = false; let release: () => void = () => {};
  network.afterSend = () => new Promise<void>(resolve => { release = resolve; });
  const runtime = new ControlRuntime(crypto.randomUUID(), new BrowserKeyVault()); await runtime.restore(keys, new Set(["machine"]));
  const message: Payload = { type: "user.message", messageId: "concurrent", sessionId: "task", text: "Synthetic", createdAt: 1 };
  const first = runtime.submit("machine", message, "user-message-concurrent");
  await vi.waitFor(() => expect(network.sent).toHaveLength(1));
  const second = runtime.submit("machine", message, "user-message-concurrent");
  await new Promise(resolve => setTimeout(resolve, 20)); release(); await Promise.all([first, second]);
  expect(network.sent).toHaveLength(1); network.afterSend = undefined; network.fail = true;
  await expect(runtime.submit("machine", { ...message, messageId: "transport" }, "user-message-transport")).rejects.toThrow(/Transport/);
  network.fail = false; await runtime.retryMessage("user-message-transport");
  expect(runtime.snapshot().deliveries["user-message-transport"].state).toBe("stored");
  expect(network.sent.slice(-2).map(row => row.id)).toEqual(["user-message-transport", "user-message-transport"]);
  await expect(runtime.retryMessage("user-message-transport")).rejects.toThrow(/not available/); await runtime.forget();
});
it("restores only authorized computer data and refuses live commands while disconnected", async () => {
  network.sent = []; const accountId = crypto.randomUUID(), vault = new BrowserKeyVault();
  const first = new ControlRuntime(accountId, vault); await first.restore(keys, new Set(["machine"]));
  await first.submit("machine", payload, "approval-decision-authorized"); first.dispose();
  const restricted = new ControlRuntime(accountId, vault); await restricted.restore(keys, new Set());
  expect(restricted.snapshot().deliveries).toEqual({});
  expect(() => restricted.command("machine", { type: "sessions.refresh", createdAt: 1 })).toThrow(/reconnecting/);
  await expect(restricted.submit("machine", { type: "user.message", messageId: "no-route", text: "Synthetic", createdAt: 1 }, "user-message-no-route"))
    .rejects.toThrow(/Connect this browser/);
  expect(restricted.snapshot().deliveries["user-message-no-route"].state).toBe("failed");
  const before = first.snapshot(); await network.receivers.get("machine")!({ type: "sessions.status", machine: "Late", sessions: [], generatedAt: 2 });
  expect(first.snapshot()).toBe(before); await restricted.forget();
});
it("retains a computer-expired approval as a rejected decision rather than reporting it as applied", async () => {
  network.sent = []; const runtime = new ControlRuntime(crypto.randomUUID(), new BrowserKeyVault());
  await runtime.restore(keys, new Set(["machine"]));
  const request = { type: "approval.request" as const, requestId: "expired", sessionId: "task", agent: "cursor",
    kind: "permission" as const, risk: "low" as const, tool: "shell", title: "Synthetic expired question", createdAt: 1 };
  await runtime.decision("machine", request, "allow"); const id = network.sent[0].id;
  await network.receivers.get("machine")!({ type: "approval.resolved", requestId: "unrelated", status: "applied", resolvedAt: 2 });
  expect(runtime.approvalDelivery("machine", request)?.state).toBe("stored");
  await network.receivers.get("machine")!({ type: "approval.resolved", requestId: "expired", sessionId: "task", status: "expired", resolvedAt: 3 });
  expect(runtime.snapshot().deliveries[id]).toMatchObject({ state: "failed", rejected: true, error: "expired" });
  await expect(runtime.decision("machine", request, "allow")).rejects.toThrow("expired");
  expect(network.sent).toHaveLength(1); await runtime.forget();
});

it("keeps native history arriving before its receipt separate from acceptance and ignores another computer's echo", async () => {
  const runtime = new ControlRuntime(crypto.randomUUID(), new BrowserKeyVault());
  await runtime.restore({ pairings: [pairing, { ...pairing, machineId: "other" }], grants: [] }, new Set(["machine", "other"]));
  const history: Payload = { type: "session.activity", sessionId: "task", agent: "cursor", state: "idle", generatedAt: 2,
    entries: [{ id: "native", kind: "user", text: "Synthetic echo", createdAt: 2 }] };
  await runtime.submit("machine", { type: "user.message", messageId: "echo", sessionId: "task", text: "Synthetic echo", createdAt: 1 }, "user-message-echo");
  await network.receivers.get("other")!(history);
  expect(runtime.outgoingMessages("machine", "task")).toHaveLength(1);
  await network.receivers.get("machine")!(history);
  expect(runtime.snapshot().deliveries["user-message-echo"].state).toBe("stored");
  await network.receivers.get("machine")!({ type: "delivery.receipt", sessionId: "task", messageId: "echo", status: "accepted", receivedAt: 3 });
  expect(runtime.outgoingMessages("machine", "task")).toEqual([]); await runtime.forget();
});

it("a rejected-message retry captures a fresh native position and cannot reuse the first attempt's echo", async () => {
  network.sent = []; const runtime = new ControlRuntime(crypto.randomUUID(), new BrowserKeyVault());
  await runtime.restore(keys, new Set(["machine"]));
  const entry = { id: "old-native", kind: "user" as const, text: "Synthetic repeat", createdAt: 2 };
  await runtime.submit("machine", { type: "user.message", messageId: "old", sessionId: "task", text: entry.text, createdAt: 1 }, "user-message-old");
  await network.receivers.get("machine")!({ type: "session.activity", sessionId: "task", agent: "cursor", state: "idle", entries: [entry], generatedAt: 3 });
  await network.receivers.get("machine")!({ type: "delivery.receipt", messageId: "old", sessionId: "task", status: "rejected", receivedAt: 4 });
  await runtime.retryMessage("user-message-old");
  const sent = network.sent.at(-1)!; const message = sent.payload as { messageId: string };
  await network.receivers.get("machine")!({ type: "delivery.receipt", messageId: message.messageId, sessionId: "task", status: "accepted", receivedAt: 5 });
  expect(runtime.outgoingMessages("machine", "task")).toHaveLength(1);
  await network.receivers.get("machine")!({ type: "session.activity", sessionId: "task", agent: "cursor", state: "idle",
    entries: [entry, { ...entry, id: "new-native", createdAt: 6 }], generatedAt: 7 });
  expect(runtime.outgoingMessages("machine", "task")).toEqual([]); await runtime.forget();
});
