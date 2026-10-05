// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";
import { AccountMachines } from "../../worker/account/machines";
import { D1AccountStore } from "../../worker/account/d1-store";
import { SqliteD1 } from "./account-sqlite";

const phoneKey = Buffer.alloc(32, 9).toString("base64url");

describe("account machine access", () => {
  it("registers, queues an encrypted recovery, claims it once, and revokes access", async () => {
    const db = new SqliteD1();
    const store = new D1AccountStore(db as unknown as D1Database);
    await store.createAccount("owner", { id: "passkey", accountId: "owner",
      publicKey: new Uint8Array([1]), counter: 0 });
    const now = 1_000;
    const machines = new AccountMachines(db as unknown as D1Database, () => now);
    const linked = await machines.register("owner", "MacBook");
    expect(linked?.machineToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(await machines.list("owner")).toMatchObject([{ id: linked?.id, name: "MacBook" }]);

    const request = await machines.open("owner", linked!.id, phoneKey);
    expect(request?.id).toBeTruthy();
    expect(await machines.status("owner", request!.id)).toBe("pending");
    expect(await machines.pending(linked!.machineToken)).toMatchObject([
      { id: request?.id, phonePublicKey: phoneKey },
    ]);
    expect(await machines.complete(linked!.machineToken, request!.id, "sealed-offer")).toBe(true);
    expect(await machines.status("owner", request!.id)).toBe("ready");
    expect(await machines.claim("owner", request!.id)).toBe("sealed-offer");
    expect(await machines.claim("owner", request!.id)).toBeNull();
    expect(await machines.status("owner", request!.id)).toBeNull();

    const second = await machines.open("owner", linked!.id, phoneKey);
    expect(second).not.toBeNull();
    expect(await machines.revoke("owner", linked!.id)).toBe(true);
    expect(await machines.pending(linked!.machineToken)).toBeNull();
    expect(await machines.claim("owner", second!.id)).toBeNull();
    expect(await machines.status("owner", second!.id)).toBeNull();
  });

  it("keeps account and machine scopes, expiry, and queue limits", async () => {
    const db = new SqliteD1();
    const store = new D1AccountStore(db as unknown as D1Database);
    for (const accountId of ["owner", "other"]) {
      await store.createAccount(accountId, { id: accountId, accountId,
        publicKey: new Uint8Array([1]), counter: 0 });
    }
    let now = 5_000;
    const machines = new AccountMachines(db as unknown as D1Database, () => now);
    const linked = await machines.register("owner", "Mac");
    expect(await machines.open("other", linked!.id, phoneKey)).toBeNull();
    expect(await machines.open("owner", linked!.id, "bad-key")).toBeNull();
    const opened = await machines.open("owner", linked!.id, phoneKey);
    expect(opened).not.toBeNull();
    expect(await machines.claim("other", opened!.id)).toBeNull();
    expect(await machines.status("other", opened!.id)).toBeNull();
    expect(await machines.complete("wrong-token", opened!.id, "sealed")).toBe(false);
    expect(await machines.open("owner", linked!.id, phoneKey)).not.toBeNull();
    expect(await machines.open("owner", linked!.id, phoneKey)).not.toBeNull();
    expect(await machines.open("owner", linked!.id, phoneKey)).toBeNull();
    now += 6 * 60_000;
    expect(await machines.pending(linked!.machineToken)).toEqual([]);
    expect(await machines.complete(linked!.machineToken, opened!.id, "sealed")).toBe(false);
    expect(await machines.claim("owner", opened!.id)).toBeNull();
  });

  it("keeps more than sixteen computers and removes their credentials when an account is deleted", async () => {
    const db = new SqliteD1();
    const store = new D1AccountStore(db as unknown as D1Database);
    await store.createAccount("owner", { id: "key", accountId: "owner",
      publicKey: new Uint8Array([1]), counter: 0 });
    const machines = new AccountMachines(db as unknown as D1Database);
    const linked = await Promise.all(Array.from({ length: 20 }, (_, index) =>
      machines.register("owner", `Mac ${index}`)));
    expect(linked.every(Boolean)).toBe(true);
    expect((await machines.list("owner")).length).toBe(20);
    const request = await machines.open("owner", linked[0]!.id, phoneKey);
    expect(request).not.toBeNull();
    await store.deleteAccount("owner");
    expect(await machines.pending(linked[0]!.machineToken)).toBeNull();
    expect(await machines.status("owner", request!.id)).toBeNull();
  });

  it("pages a large account without missing machines that share a timestamp", async () => {
    const db = new SqliteD1();
    const store = new D1AccountStore(db as unknown as D1Database);
    await store.createAccount("owner", { id: "key", accountId: "owner",
      publicKey: new Uint8Array([1]), counter: 0 });
    const machines = new AccountMachines(db as unknown as D1Database, () => 1_000);
    const registered = await Promise.all(Array.from({ length: 205 }, (_, index) =>
      machines.register("owner", `Mac ${index}`)));
    expect(registered.every(Boolean)).toBe(true);
    const first = await machines.listPage("owner", undefined, 100);
    if (!first?.nextCursor) throw new Error("First page did not continue.");
    const second = await machines.listPage("owner", first.nextCursor, 100);
    if (!second?.nextCursor) throw new Error("Second page did not continue.");
    const third = await machines.listPage("owner", second.nextCursor, 100);
    if (!third) throw new Error("Final page was unavailable.");
    expect([first.machines.length, second.machines.length, third.machines.length])
      .toEqual([100, 100, 5]);
    expect(third.nextCursor).toBeNull();
    const ids = [...first.machines, ...second.machines, ...third.machines].map(row => row.id);
    expect(new Set(ids).size).toBe(205);
    expect(await machines.listPage("owner", "bad cursor", 100)).toBeNull();
  });
});
