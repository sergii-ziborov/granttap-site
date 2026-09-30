import { describe, expect, it } from "vitest";
import { AccountAuth, type AccountStore, type Ceremony, type StoredCredential } from "../../worker/account/auth";

class MemoryStore implements AccountStore {
  ceremonies = new Map<string, Ceremony>();
  credentials = new Map<string, StoredCredential>();
  sessions = new Map<string, { accountId: string; expiresAt: number }>();
  accounts = new Set<string>();

  async saveCeremony(row: Ceremony) { this.ceremonies.set(row.id, row); }
  async consumeCeremony(id: string) {
    const row = this.ceremonies.get(id) ?? null;
    this.ceremonies.delete(id);
    return row;
  }
  async createAccount(accountId: string, credential: StoredCredential) {
    if (this.credentials.has(credential.id)) return false;
    this.accounts.add(accountId);
    this.credentials.set(credential.id, credential);
    return true;
  }
  async credential(id: string) { return this.credentials.get(id) ?? null; }
  async updateCounter(id: string, previous: number, counter: number) {
    const current = this.credentials.get(id);
    if (!current || current.counter !== previous || (counter !== 0 && counter <= current.counter)) return false;
    this.credentials.set(id, { ...current, counter });
    return true;
  }
  async saveSession(hash: string, accountId: string, expiresAt: number) {
    this.sessions.set(hash, { accountId, expiresAt });
  }
  async session(hash: string) { return this.sessions.get(hash) ?? null; }
  async removeSession(hash: string) { this.sessions.delete(hash); }
  async deleteAccount(accountId: string) {
    this.accounts.delete(accountId);
    for (const [key, value] of this.credentials) if (value.accountId === accountId) this.credentials.delete(key);
    for (const [key, value] of this.sessions) if (value.accountId === accountId) this.sessions.delete(key);
  }
}

describe("GrantTap account passkey ceremonies", () => {
  it("registers, authenticates and deletes a passkey account with one-use challenges", async () => {
    const store = new MemoryStore();
    const auth = new AccountAuth(store, {
      register: async () => ({ verified: true, credential: { id: "credential-a", publicKey: new Uint8Array([1, 2]), counter: 0 } }),
      authenticate: async () => ({ verified: true, newCounter: 1 }),
    }, () => 1_000);

    const registration = await auth.registrationOptions();
    expect(registration.options.rp.id).toBe("granttap.com");
    expect(registration.options.authenticatorSelection?.residentKey).toBe("required");
    const created = await auth.completeRegistration(registration.ceremonyId, { id: "credential-a" });
    expect(created?.accountId).toBeTruthy();
    expect(await auth.completeRegistration(registration.ceremonyId, { id: "credential-a" })).toBeNull();

    const login = await auth.authenticationOptions();
    const signedIn = await auth.completeAuthentication(login.ceremonyId, { id: "credential-a" });
    expect(signedIn?.accountId).toBe(created?.accountId);
    expect(store.credentials.get("credential-a")?.counter).toBe(1);
    expect(await auth.completeAuthentication(login.ceremonyId, { id: "credential-a" })).toBeNull();
    expect(await auth.accountForToken(signedIn!.token)).toBe(created?.accountId);

    await auth.deleteAccount(signedIn!.token);
    expect(await auth.accountForToken(signedIn!.token)).toBeNull();
    expect(store.credentials.size).toBe(0);
  });

  it("rejects expired challenges, unknown credentials and failed signatures", async () => {
    let now = 1_000;
    const store = new MemoryStore();
    const auth = new AccountAuth(store, {
      register: async () => ({ verified: false }),
      authenticate: async () => ({ verified: false }),
    }, () => now);
    const expired = await auth.registrationOptions();
    now += 5 * 60_000;
    expect(await auth.completeRegistration(expired.ceremonyId, { id: "x" })).toBeNull();
    const fresh = await auth.registrationOptions();
    expect(await auth.completeRegistration(fresh.ceremonyId, { id: "x" })).toBeNull();
    const login = await auth.authenticationOptions();
    expect(await auth.completeAuthentication(login.ceremonyId, { id: "unknown" })).toBeNull();
    expect(await auth.accountForToken("invalid")).toBeNull();
  });

  it("rejects a reused authenticator counter even with a fresh challenge", async () => {
    const store = new MemoryStore();
    const auth = new AccountAuth(store, {
      register: async () => ({ verified: true, credential: {
        id: "credential", publicKey: new Uint8Array([1]), counter: 0,
      } }),
      authenticate: async () => ({ verified: true, newCounter: 1 }),
    });
    const registration = await auth.registrationOptions();
    await auth.completeRegistration(registration.ceremonyId, { id: "credential" });
    const first = await auth.authenticationOptions();
    expect(await auth.completeAuthentication(first.ceremonyId, { id: "credential" })).not.toBeNull();
    const repeated = await auth.authenticationOptions();
    expect(await auth.completeAuthentication(repeated.ceremonyId, { id: "credential" })).toBeNull();
  });
});
