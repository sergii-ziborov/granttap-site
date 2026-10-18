import { BrowserKeysStorage, type EncryptedKeys } from "../BrowserKeys";
import type { ComputerSnapshot } from "../ControlState";

/** Account-scoped encrypted cache for opening known Tasks while their computer is offline. */
export class BrowserControlArchive {
  private pending: Promise<unknown> = Promise.resolve();
  constructor(private readonly storage = new BrowserKeysStorage("granttap-encrypted-control-archive")) {}

  read(accountId: string): Promise<Record<string, ComputerSnapshot>> {
    return this.ordered(async () => this.decode(accountId, await this.storage.read(accountId)));
  }
  save(accountId: string, machineId: string, snapshot: ComputerSnapshot): Promise<void> {
    return this.ordered(async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const previous = await this.storage.read(accountId);
        const computers = await this.decode(accountId, previous);
        computers[machineId] = cachedSnapshot(snapshot);
        const bytes = new TextEncoder().encode(JSON.stringify(computers));
        if (bytes.length > 12_000_000) throw Error("This browser's encrypted history cache is full.");
        const key = previous?.key ?? await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
        const nonce = crypto.getRandomValues(new Uint8Array(12));
        const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce,
          additionalData: this.scope(accountId) }, key, bytes);
        const revision = previous?.revision ?? 0;
        if (await this.storage.commit(accountId, { revision: revision + 1, key, nonce: nonce.buffer, cipher }, revision)) return;
      }
      throw Error("History changed in another tab. Reopen this Task.");
    });
  }
  forget(accountId: string): Promise<void> { return this.ordered(() => this.storage.remove(accountId)); }

  private ordered<T>(action: () => Promise<T>): Promise<T> {
    const next = this.pending.then(action); this.pending = next.catch(() => undefined); return next;
  }
  private scope(accountId: string) { return new TextEncoder().encode("granttap.control-archive.v1:" + accountId); }
  private async decode(accountId: string, previous?: EncryptedKeys): Promise<Record<string, ComputerSnapshot>> {
    if (!previous) return {};
    if (previous.key.extractable || previous.key.algorithm.name !== "AES-GCM") throw Error("Invalid encrypted history cache.");
    const bytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: previous.nonce,
      additionalData: this.scope(accountId) }, previous.key, previous.cipher);
    const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length > 128) {
      throw Error("Invalid encrypted history cache.");
    }
    return value;
  }
}

function cachedSnapshot(snapshot: ComputerSnapshot): ComputerSnapshot {
  const transcript = Object.fromEntries(Object.entries(snapshot.transcript).slice(-12).map(([id, entries]) => [id,
    entries.slice(-50).map(entry => ({ id: entry.id, kind: entry.kind, createdAt: entry.createdAt,
      text: entry.text.slice(0, 8_000), toolName: entry.toolName }))]));
  return { ...snapshot, transcript };
}
