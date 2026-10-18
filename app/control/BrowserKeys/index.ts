import type { BrowserPairing } from "../Cryptography";
import { BrowserKeysStorage, type EncryptedKeys } from "./storage";
export { BrowserKeysStorage, type EncryptedKeys } from "./storage";

export type BrowserKeys = { pairings: BrowserPairing[];
  grants: Array<{ room: string; sessionId: string; key: string }> };
export class BrowserKeyVault {
  private pending: Promise<unknown> = Promise.resolve();
  constructor(private readonly storage = new BrowserKeysStorage()) {}
  read(accountId: string): Promise<BrowserKeys> {
    return this.ordered(async () => this.decode(accountId, await this.storage.read(accountId)));
  }
  update(accountId: string, edit: (keys: BrowserKeys) => BrowserKeys): Promise<BrowserKeys> {
    return this.ordered(async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const previous = await this.storage.read(accountId);
        const keys = edit(await this.decode(accountId, previous));
        if (keys.pairings.length > 128 || keys.grants.length > 4_096) throw new Error("Browser key capacity reached");
        const bytes = new TextEncoder().encode(JSON.stringify({ version: 1, keys }));
        if (bytes.length > 2_000_000) throw new Error("Browser keys exceed their storage limit");
        const key = previous?.key ?? await crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
        const nonce = crypto.getRandomValues(new Uint8Array(12));
        const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce,
          additionalData: this.scope(accountId) }, key, bytes);
        const revision = previous?.revision ?? 0;
        if (await this.storage.commit(accountId, { revision: revision + 1, key,
          nonce: nonce.buffer, cipher }, revision)) return keys;
      }
      throw new Error("Browser keys changed in another tab. Retry the connection.");
    });
  }
  forget(accountId: string): Promise<void> {
    return this.ordered(() => this.storage.remove(accountId));
  }

  private ordered<T>(action: () => Promise<T>): Promise<T> {
    const result = this.pending.then(action);
    this.pending = result.catch(() => undefined);
    return result;
  }

  private scope(accountId: string): Uint8Array<ArrayBuffer> {
    return new TextEncoder().encode("granttap.browser-keys.v1:" + accountId);
  }

  private async decode(accountId: string, record?: EncryptedKeys): Promise<BrowserKeys> {
    if (!record) return { pairings: [], grants: [] };
    if (!Number.isSafeInteger(record.revision) || record.revision < 1 || record.key.extractable
      || record.key.algorithm.name !== "AES-GCM") throw new Error("Browser key storage is invalid");
    const bytes = await crypto.subtle.decrypt({ name: "AES-GCM", iv: record.nonce,
      additionalData: this.scope(accountId) }, record.key, record.cipher);
    const value = JSON.parse(new TextDecoder().decode(bytes)) as { version?: number; keys?: BrowserKeys };
    if (value.version !== 1 || !Array.isArray(value.keys?.pairings) || !Array.isArray(value.keys?.grants)) {
      throw new Error("Browser key storage is invalid");
    }
    return value.keys;
  }
}
