// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { D1Database } from "@cloudflare/workers-types";
import { D1AccountStore } from "../../worker/account/d1-store";
import { SqliteD1 } from "./account-sqlite";

describe("GrantTap account D1 persistence", () => {
  it("consumes ceremonies once and preserves passkeys and sessions", async () => {
    const db = new SqliteD1();
    const store = new D1AccountStore(db as unknown as D1Database);
    await store.saveCeremony({ id: "flow", kind: "registration", challenge: "challenge",
      accountId: "account", expiresAt: 10 });
    expect(await store.consumeCeremony("flow")).toEqual({ id: "flow", kind: "registration",
      challenge: "challenge", accountId: "account", expiresAt: 10 });
    expect(await store.consumeCeremony("flow")).toBeNull();

    expect(await store.createAccount("account", { id: "credential", accountId: "account",
      publicKey: new Uint8Array([1, 2, 3]), counter: 0, transports: ["internal"] })).toBe(true);
    expect(await store.credential("credential")).toEqual({ id: "credential", accountId: "account",
      publicKey: new Uint8Array([1, 2, 3]), counter: 0, transports: ["internal"] });
    expect(await store.updateCounter("credential", 0, 2)).toBe(true);
    expect((await store.credential("credential"))?.counter).toBe(2);
    expect(await store.updateCounter("credential", 0, 2)).toBe(false);
    expect(await store.updateCounter("credential", 2, 1)).toBe(false);

    await store.saveSession("hash", "account", 20);
    expect(await store.session("hash")).toEqual({ accountId: "account", expiresAt: 20 });
    await store.removeSession("hash");
    expect(await store.session("hash")).toBeNull();

    expect(await store.createAccount("other", { id: "credential", accountId: "other",
      publicKey: new Uint8Array([4]), counter: 0 })).toBe(false);
    expect(db.sqlite.prepare("SELECT count(*) AS n FROM accounts").get()).toEqual({ n: 1 });
    await store.deleteAccount("account");
    expect(await store.credential("credential")).toBeNull();
  });
});
