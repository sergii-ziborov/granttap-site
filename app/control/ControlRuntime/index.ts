import { BrowserKeyVault, type BrowserKeys } from "../BrowserKeys";
import { BrowserControlArchive } from "../ControlArchive";
import { BrowserControlOutbox, type DeliveryState, type OutgoingCommand } from "../ControlOutbox";
export type { DeliveryState } from "../ControlOutbox";
import { applyControlPayload, emptyComputer, type ComputerSnapshot } from "../ControlState";
import type { ApprovalRequest, Payload } from "../ControlProtocol";
import type { BrowserPairing } from "../Cryptography";
import { BrowserRelayConnection } from "../RelayConnection";
import { messageHistoryPosition, outgoingEchoes } from "./message-echo";

export type ControlView = { computers: Record<string, ComputerSnapshot>; connections: Record<string, string>;
  deliveries: Record<string, DeliveryState>; error?: string };
export class ControlRuntime {
  private connections = new Map<string, BrowserRelayConnection>();
  private outgoing: Record<string, OutgoingCommand> = {};
  private sending = new Map<string, Promise<void>>();
  private observers = new Set<() => void>();
  private pendingArchives = new Set<string>();
  private archiveTimer?: ReturnType<typeof setTimeout>;
  private disposed = false;
  private view: ControlView = { computers: {}, connections: {}, deliveries: {} };
  constructor(private readonly accountId: string, private readonly vault: BrowserKeyVault,
    private readonly archive = new BrowserControlArchive(), private readonly outbox = new BrowserControlOutbox()) {}
  snapshot = () => this.view;
  subscribe = (listener: () => void) => { this.observers.add(listener); return () => { this.observers.delete(listener); }; };

  async restore(keys: BrowserKeys, machines: ReadonlySet<string>) {
    const [computers, outgoing] = await Promise.all([this.archive.read(this.accountId), this.outbox.read(this.accountId)]);
    this.outgoing = Object.fromEntries(Object.entries(outgoing).filter(([, row]) => machines.has(row.machineId)));
    this.patch({ computers: Object.fromEntries(Object.entries(computers).filter(([id]) => machines.has(id))),
      deliveries: Object.fromEntries(Object.entries(this.outgoing).map(([id, row]) => [id, row.delivery])) });
    for (const machineId of machines) {
      const sessions = new Set(Object.values(this.outgoing).flatMap(row => row.machineId === machineId
        && row.payload.type === "user.message" && row.payload.sessionId ? [row.payload.sessionId] : []));
      for (const sessionId of sessions) await this.confirmMessageEchoes(machineId, sessionId);
    }
    if (this.disposed) return;
    for (const pairing of keys.pairings) if (machines.has(pairing.machineId)) this.connect(pairing, keys);
  }
  connect(pairing: BrowserPairing, keys: BrowserKeys) {
    if (this.disposed || this.connections.has(pairing.machineId)) return;
    const grants = Object.fromEntries(keys.grants.filter(item => item.room === pairing.room).map(item => [item.sessionId, item.key]));
    const connection = new BrowserRelayConnection(pairing, grants, {
      status: value => {
        this.patch({ connections: { ...this.view.connections, [pairing.machineId]: value } });
        if (value === "connected") this.flush(pairing.machineId);
      },
      payload: async payload => this.receive(pairing.machineId, payload),
      grant: async (sessionId, key) => { await this.vault.update(this.accountId, old => ({ ...old,
        grants: [...old.grants.filter(item => item.room !== pairing.room || item.sessionId !== sessionId),
          { room: pairing.room, sessionId, key }].slice(-4_096) })); },
    });
    this.connections.set(pairing.machineId, connection); connection.start();
  }

  async submit(machineId: string, payload: Payload, deliveryId: string) {
    if (this.disposed) throw Error("This browser control session is closed.");
    const row = await this.outbox.put(this.accountId, { id: deliveryId, machineId, payload, delivery: { state: "sending" },
      historyAfter: this.historyPosition(machineId, payload) });
    this.outgoing[deliveryId] = row; this.presentDelivery(deliveryId, row.delivery);
    if (["stored", "accepted"].includes(row.delivery.state)) return;
    if (row.delivery.rejected) throw Error(row.delivery.error || "The computer rejected this command. Send a new action to retry.");
    return this.transmit(row);
  }
  private transmit(row: OutgoingCommand): Promise<void> {
    const previous = this.sending.get(row.id); if (previous) return previous;
    const sending = (async () => {
      await this.delivery(row.id, { state: "sending" });
      try {
        const connection = this.connections.get(row.machineId);
        if (!connection || this.disposed) throw Error("Connect this browser to the Task's computer first.");
        await connection.submit(row.payload, row.id);
        if (this.view.deliveries[row.id]?.state === "sending") await this.delivery(row.id, { state: "stored" });
      } catch (error) {
        if (this.view.deliveries[row.id]?.state === "accepted") return;
        const message = error instanceof Error ? error.message : "Relay submission failed.";
        if (this.view.deliveries[row.id]?.state === "sending") await this.delivery(row.id, { state: "failed", error: message });
        throw Error(message);
      }
    })();
    this.sending.set(row.id, sending);
    void sending.finally(() => this.sending.delete(row.id)).catch(() => {}); return sending;
  }
  private flush(machineId: string) {
    for (const row of Object.values(this.outgoing)) {
      if (row.machineId === machineId && ["sending", "failed"].includes(row.delivery.state) && !row.delivery.rejected) {
        void this.transmit(row).catch(() => {});
      }
    }
  }
  async decision(machineId: string, request: ApprovalRequest, decision: "allow" | "deny", note?: string) {
    const existing = this.approvalCommand(machineId, request.requestId, request.sessionId);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(
      JSON.stringify([machineId, request.sessionId ?? null, request.requestId])));
    const id = existing?.id ?? "approval-decision-" + Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    await this.submit(machineId, { type: "approval.decision", requestId: request.requestId,
      sessionId: request.sessionId, decision, note, decidedBy: "GrantTap Web", decidedAt: Date.now() },
    id);
  }
  approvalDelivery(machineId: string, request: ApprovalRequest) {
    return this.approvalCommand(machineId, request.requestId, request.sessionId)?.delivery;
  }
  private approvalCommand(machineId: string, requestId: string, sessionId?: string | null) {
    const matches = Object.values(this.outgoing).filter(row => row.machineId === machineId
      && row.payload.type === "approval.decision" && row.payload.requestId === requestId
      && (!sessionId || row.payload.sessionId === sessionId));
    return matches.length === 1 ? matches[0] : undefined;
  }
  queuedTasks() {
    return Object.values(this.outgoing).filter(row => row.payload.type === "project.task.create" && row.delivery.state !== "accepted");
  }
  outgoingMessages(machineId: string, sessionId: string) {
    return Object.values(this.outgoing).filter(row => row.machineId === machineId
      && row.payload.type === "user.message" && row.payload.sessionId === sessionId
      && !row.delivery.echoedBy && !row.delivery.supersededBy);
  }
  async retryMessage(deliveryId: string) {
    if (this.disposed) throw Error("This browser control session is closed.");
    const old = this.outgoing[deliveryId];
    if (!old || old.payload.type !== "user.message" || old.delivery.state !== "failed" || old.delivery.supersededBy) {
      throw Error("This message is not available for retry.");
    }
    if (!old.delivery.rejected) return this.submit(old.machineId, old.payload, old.id);
    const next = await this.outbox.replaceRejected(this.accountId, old.id, "user-message-" + crypto.randomUUID(),
      this.historyPosition(old.machineId, old.payload));
    old.delivery = { ...old.delivery, supersededBy: next.id }; this.outgoing[next.id] = next;
    this.presentDelivery(old.id, old.delivery); this.presentDelivery(next.id, next.delivery); return this.transmit(next);
  }
  command(machineId: string, payload: Payload, scope?: string) {
    if (this.view.connections[machineId] !== "connected") throw Error("Relay is reconnecting. Retry when connected.");
    return this.connections.get(machineId)!.send(payload, scope);
  }
  async forget() { this.dispose(); await this.vault.forget(this.accountId); await this.archive.forget(this.accountId); await this.outbox.forget(this.accountId); }
  dispose() {
    this.disposed = true; clearTimeout(this.archiveTimer);
    for (const connection of this.connections.values()) connection.stop(); this.connections.clear();
  }

  private async receive(machineId: string, payload: Payload) {
    if (this.disposed) return;
    const previous = this.view.computers[machineId] ?? emptyComputer();
    const next = applyControlPayload(previous, payload);
    if (next !== previous) {
      this.patch({ computers: { ...this.view.computers, [machineId]: next } });
      this.pendingArchives.add(machineId);
      this.archiveTimer ??= setTimeout(() => { this.archiveTimer = undefined; void this.persist(); }, 500);
    }
    if (payload.type === "delivery.receipt") await this.delivery("user-message-" + payload.messageId,
      { state: payload.status === "accepted" ? "accepted" : "failed", error: payload.error, rejected: payload.status !== "accepted" }, machineId, payload.sessionId);
    if (payload.type === "session.activity" || payload.type === "delivery.receipt" && payload.status === "accepted") {
      if (payload.sessionId) await this.confirmMessageEchoes(machineId, payload.sessionId);
    }
    if (payload.type === "approval.resolved") {
      const row = this.approvalCommand(machineId, payload.requestId, payload.sessionId);
      if (row) await this.delivery(row.id, { state: payload.status === "applied" ? "accepted" : "failed",
        error: payload.status === "applied" ? undefined : payload.status, rejected: payload.status !== "applied" }, machineId, payload.sessionId);
    }
  }
  private historyPosition(machineId: string, payload: Payload) {
    const entries = payload.type === "user.message" && payload.sessionId
      ? this.view.computers[machineId]?.transcript[payload.sessionId] ?? [] : [];
    return messageHistoryPosition(payload, entries);
  }
  private async confirmMessageEchoes(machineId: string, sessionId: string) {
    const rows = Object.values(this.outgoing).filter(row => row.machineId === machineId
      && row.payload.type === "user.message" && row.payload.sessionId === sessionId);
    const entries = this.view.computers[machineId]?.transcript[sessionId] ?? [];
    for (const [id, entryId] of outgoingEchoes(rows, entries)) {
      const saved = await this.outbox.confirmEcho(this.accountId, id, entryId);
      if (saved) { this.outgoing[id].delivery = saved; this.presentDelivery(id, saved); }
    }
  }
  private async persist() {
    const machines = [...this.pendingArchives]; this.pendingArchives.clear();
    for (const id of machines) {
      if (this.disposed) return;
      try { await this.archive.save(this.accountId, id, this.view.computers[id]); }
      catch { this.patch({ error: "The encrypted browser history cache could not be saved. Relay submissions are unaffected." }); }
    }
  }
  private async delivery(id: string, value: DeliveryState, machineId?: string, sessionId?: string | null) {
    const row = this.outgoing[id];
    if (!row || machineId && row.machineId !== machineId || row.delivery.state === "accepted" || row.delivery.rejected && value.state === "stored") return;
    if (sessionId && "sessionId" in row.payload && row.payload.sessionId && row.payload.sessionId !== sessionId) return;
    const saved = await this.outbox.update(this.accountId, id, value);
    if (saved) { row.delivery = saved; this.presentDelivery(id, saved); }
  }
  private presentDelivery(id: string, value: DeliveryState) {
    this.patch({ deliveries: Object.fromEntries(Object.entries({ ...this.view.deliveries, [id]: value }).slice(-200)) });
  }
  private patch(value: Partial<ControlView>) {
    this.view = { ...this.view, ...value }; this.observers.forEach(observer => observer());
  }
}
