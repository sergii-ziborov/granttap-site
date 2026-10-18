import { BrowserKeysStorage, type EncryptedKeys } from "../BrowserKeys";
import type { Payload } from "../ControlProtocol";

export type DeliveryState = { state: "sending" | "stored" | "accepted" | "failed"; error?: string; rejected?: boolean; supersededBy?: string };
export type OutgoingCommand = { id: string; machineId: string; payload: Payload; delivery: DeliveryState };

/** Persists immutable command intent before transmission, scoped to one signed-in account. */
export class BrowserControlOutbox {
  private pending: Promise<unknown> = Promise.resolve();
  constructor(private readonly storage = new BrowserKeysStorage("granttap-encrypted-control-outbox")) {}

  read(accountId: string): Promise<Record<string, OutgoingCommand>> {
    return this.ordered(async () => this.decode(accountId, await this.storage.read(accountId)));
  }
  put(accountId: string, command: OutgoingCommand): Promise<OutgoingCommand> {
    return this.change(accountId, rows => {
      const previous = rows[command.id];
      if (previous) {
        if (previous.machineId !== command.machineId || intent(previous.payload) !== intent(command.payload)) {
          throw Error("This delivery already has a different immutable intent. Reopen the Task before sending a new action.");
        }
        return previous;
      }
      if (Object.keys(rows).length >= 200) {
        for (const [id, row] of Object.entries(rows)) {
          if (row.delivery.state === "accepted") delete rows[id];
          if (Object.keys(rows).length < 150) break;
        }
      }
      if (Object.keys(rows).length >= 200) throw Error("The browser has too many pending commands. Wait for your computer to receive them.");
      rows[command.id] = command; return command;
    });
  }
  replaceRejected(accountId: string, oldId: string, nextId: string): Promise<OutgoingCommand> {
    return this.change(accountId, rows => {
      const old = rows[oldId];
      if (!old || old.payload.type !== "user.message" || !old.delivery.rejected || old.delivery.supersededBy) {
        throw Error("Only a rejected message can start a fresh attempt.");
      }
      if (rows[nextId] || Object.keys(rows).length >= 200) throw Error("The browser outbox is full.");
      const messageId = nextId.slice("user-message-".length);
      const next: OutgoingCommand = { id: nextId, machineId: old.machineId, payload: { ...old.payload,
        messageId, createdAt: Date.now() }, delivery: { state: "sending" } };
      old.delivery.supersededBy = nextId; rows[nextId] = next; return next;
    });
  }
  update(accountId: string, id: string, delivery: DeliveryState): Promise<DeliveryState | undefined> {
    return this.change(accountId, rows => {
      const row = rows[id];
      if (row && row.delivery.state !== "accepted"
        && !(row.delivery.rejected && ["sending", "stored"].includes(delivery.state))) row.delivery = delivery;
      return row?.delivery;
    });
  }
  forget(accountId: string): Promise<void> { return this.ordered(() => this.storage.remove(accountId)); }

  private change<T>(accountId: string, edit: (rows: Record<string, OutgoingCommand>) => T): Promise<T> {
    return this.ordered(async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const previous = await this.storage.read(accountId);
        const rows = await this.decode(accountId, previous), result = edit(rows);
        const bytes = new TextEncoder().encode(JSON.stringify(rows));
        if (bytes.length > 32_000_000) throw Error("This browser's encrypted outbox is full. Nothing new was sent.");
        const key = previous?.key ?? await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
        const nonce = crypto.getRandomValues(new Uint8Array(12));
        const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce,
          additionalData: this.scope(accountId) }, key, bytes);
        const revision = previous?.revision ?? 0;
        if (await this.storage.commit(accountId, { revision: revision + 1, key, nonce: nonce.buffer, cipher }, revision)) return result;
      }
      throw Error("The outbox changed in another tab. Retry this action.");
    });
  }
  private ordered<T>(action: () => Promise<T>): Promise<T> {
    const next = this.pending.then(action); this.pending = next.catch(() => undefined); return next;
  }
  private scope(accountId: string) { return new TextEncoder().encode("granttap.control-outbox.v1:" + accountId); }
  private async decode(accountId: string, record?: EncryptedKeys): Promise<Record<string, OutgoingCommand>> {
    if (!record) return {};
    if (record.key.extractable || record.key.algorithm.name !== "AES-GCM") throw Error("Invalid encrypted browser outbox.");
    const bytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: record.nonce,
      additionalData: this.scope(accountId) }, record.key, record.cipher);
    const rows = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!rows || typeof rows !== "object" || Array.isArray(rows) || Object.keys(rows).length > 200
      || Object.entries(rows).some(([id, row]) => !validCommand(id, row))) throw Error("Invalid encrypted browser outbox.");
    return rows;
  }
}

function intent(payload: Payload): string {
  return JSON.stringify(Object.fromEntries(Object.entries(payload)
    .filter(([key]) => key !== "createdAt" && key !== "decidedAt").sort(([a], [b]) => a.localeCompare(b))));
}
function validCommand(id: string, value: unknown): value is OutgoingCommand {
  if (!value || typeof value !== "object") return false;
  const row = value as OutgoingCommand;
  return row.id === id && typeof row.machineId === "string" && typeof row.payload?.type === "string"
    && ["sending", "stored", "accepted", "failed"].includes(row.delivery?.state);
}
