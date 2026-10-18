export type EncryptedKeys = { revision: number; key: CryptoKey; nonce: ArrayBuffer; cipher: ArrayBuffer };

/** An account record and its wrapping key commit together, with optimistic concurrency. */
export class BrowserKeysStorage {
  private database?: Promise<IDBDatabase>;
  constructor(private readonly name = "granttap-private-browser-keys") {}

  async read(accountId: string): Promise<EncryptedKeys | undefined> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db.transaction("keys", "readonly").objectStore("keys").get(accountId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("Browser key storage is unavailable"));
    });
  }

  async commit(accountId: string, value: EncryptedKeys, expectedRevision: number): Promise<boolean> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("keys", "readwrite"), store = transaction.objectStore("keys");
      const current = store.get(accountId);
      let conflict = false;
      current.onsuccess = () => {
        if ((current.result?.revision ?? 0) !== expectedRevision) {
          conflict = true; transaction.abort(); return;
        }
        store.put(value, accountId);
      };
      transaction.oncomplete = () => resolve(true);
      transaction.onabort = () => conflict ? resolve(false) : reject(new Error("Browser keys were not saved"));
      transaction.onerror = () => reject(new Error("Browser keys were not saved"));
    });
  }

  async remove(accountId: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("keys", "readwrite");
      transaction.objectStore("keys").delete(accountId);
      transaction.oncomplete = () => resolve();
      transaction.onabort = transaction.onerror = () => reject(new Error("Browser keys were not removed"));
    });
  }

  private open(): Promise<IDBDatabase> {
    this.database ??= new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore("keys");
      request.onsuccess = () => resolve(request.result);
      request.onerror = request.onblocked = () => reject(new Error("Browser key storage is unavailable"));
    });
    return this.database;
  }
}
