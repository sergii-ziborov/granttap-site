// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";
import { AccountAuth } from "../../worker/account/auth";
import { D1AccountStore } from "../../worker/account/d1-store";
import { AccountMachines } from "../../worker/account/machines";
import { routeMachineApi } from "../../worker/account/machine-api";
import { routeAccountApi } from "../../worker/account/api";
import { SqliteD1 } from "./account-sqlite";

const base = "https://granttap.com/api/account/";
const phonePublicKey = Buffer.alloc(32, 1).toString("base64url");

describe("account machine HTTP boundary", () => {
  it("exposes bounded machine pages to a signed-in account", async () => {
    const db = new SqliteD1();
    const store = new D1AccountStore(db as unknown as D1Database);
    await store.createAccount("owner", { id: "key", accountId: "owner",
      publicKey: new Uint8Array([1]), counter: 0 });
    const token = Buffer.alloc(32, 2).toString("base64url");
    const digest = Buffer.from(await crypto.subtle.digest("SHA-256",
      new TextEncoder().encode(token))).toString("hex");
    await store.saveSession(digest, "owner", Date.now() + 60_000);
    const auth = new AccountAuth(store);
    const machines = new AccountMachines(db as unknown as D1Database, () => 1_000);
    await machines.register("owner", "First");
    await machines.register("owner", "Second");
    const request = (query: string) => routeMachineApi(new Request(base + `machines${query}`, {
      headers: { authorization: `Bearer ${token}` },
    }), auth, machines);
    const first = await (await request("?pageSize=1"))?.json() as {
      machines: { id: string }[]; nextCursor: string;
    };
    const second = await (await request(`?pageSize=1&cursor=${first.nextCursor}`))?.json() as {
      machines: { id: string }[]; nextCursor: string | null;
    };
    expect(first.machines).toHaveLength(1);
    expect(second.machines).toHaveLength(1);
    expect(first.machines[0].id).not.toBe(second.machines[0].id);
    expect(second.nextCursor).toBeNull();
    expect((await request("?pageSize=101"))?.status).toBe(400);
    expect((await request("?pageSize=1&cursor=bad"))?.status).toBe(400);
  });

  it("lists and revokes account machines and delivers a sealed offer once", async () => {
    const db = new SqliteD1();
    const store = new D1AccountStore(db as unknown as D1Database);
    await store.createAccount("owner", { id: "key", accountId: "owner", publicKey: new Uint8Array([1]), counter: 0 });
    const token = Buffer.alloc(32, 2).toString("base64url");
    await store.saveSession(Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token))).toString("hex"), "owner", Date.now() + 60_000);
    const auth = new AccountAuth(store);
    const machines = new AccountMachines(db as unknown as D1Database);
    expect((await routeAccountApi(new Request(base + "machines", {
      headers: { authorization: `Bearer ${token}` },
    }), auth, machines))?.status).toBe(200);
    expect((await routeAccountApi(new Request(base + "machines", { method: "DELETE",
      headers: { origin: "https://elsewhere.invalid", authorization: `Bearer ${token}` },
    }), auth, machines))?.status).toBe(403);
    const call = (path: string, method = "GET", body?: unknown, authorization = token, browser = false) =>
      routeMachineApi(new Request(base + path, { method, headers: {
        authorization: `Bearer ${authorization}`,
        ...(body ? { "content-type": "application/json" } : {}),
        ...(browser ? { origin: "https://granttap.com" } : {}),
      }, body: body ? JSON.stringify(body) : undefined }), auth, machines);

    expect((await call("machines", "POST", { name: "Mac" }, token, true))?.status).toBe(403);
    expect((await call("machines", "POST", { name: "" }))?.status).toBe(400);
    const created = await call("machines", "POST", { name: "Mac" });
    expect(created?.status).toBe(201);
    const machine = await created?.json() as { id: string; machineToken: string };
    expect(await (await call("machine/identity", "GET", undefined, machine.machineToken))?.json())
      .toEqual({ accountId: "owner", machineId: machine.id });
    expect((await call("machine/self", "PATCH", { name: "Serhii’s MacBook Pro" },
      machine.machineToken))?.status).toBe(200);
    expect(await (await call("machines"))?.json()).toMatchObject({
      machines: [{ id: machine.id, name: "Serhii’s MacBook Pro" }],
    });
    expect((await call("machine/self", "PATCH", { name: "Wrong" }, "bad"))?.status).toBe(401);
    expect((await call("machine/self", "PATCH", { name: "\n" },
      machine.machineToken))?.status).toBe(400);
    expect((await call("machine/identity", "GET", undefined, "bad"))?.status).toBe(401);
    const list = await call("machines");
    expect(await list?.json()).toMatchObject({
      machines: [{ id: machine.id, name: "Serhii’s MacBook Pro" }],
    });
    expect(JSON.stringify(await (await call("machines"))?.json())).not.toContain(machine.machineToken);
    expect((await call(`machines/${machine.id}/requests`, "POST", { phonePublicKey }, "bad"))?.status).toBe(401);
    expect((await call(`machines/${machine.id}/requests`, "POST", { phonePublicKey: "invalid" }))?.status).toBe(400);
    expect((await call("machine/requests", "GET", undefined, "bad"))?.status).toBe(401);
    const opened = await call(`machines/${machine.id}/requests`, "POST", { phonePublicKey });
    expect(opened?.status).toBe(201);
    const request = await opened?.json() as { id: string };
    expect((await call(`requests/${request.id}`))?.status).toBe(202);
    const pending = await call("machine/requests", "GET", undefined, machine.machineToken);
    expect(await pending?.json()).toMatchObject({ requests: [{ id: request.id, phonePublicKey }] });
    expect((await call(`machine/requests/${request.id}/offer`, "POST", {}, machine.machineToken))?.status).toBe(400);
    expect((await call(`machine/requests/${request.id}/offer`, "POST", { encryptedOffer: "sealed" }, machine.machineToken))?.status).toBe(200);
    expect((await call(`machine/requests/${request.id}/offer`, "POST", { encryptedOffer: "again" }, machine.machineToken))?.status).toBe(404);
    expect(await (await call(`requests/${request.id}`))?.json()).toEqual({ encryptedOffer: "sealed" });
    expect((await call(`requests/${request.id}`))?.status).toBe(404);
    expect((await call(`machines/${machine.id}`, "DELETE"))?.status).toBe(200);
    expect((await call("machine/requests", "GET", undefined, machine.machineToken))?.status).toBe(401);
    expect((await call("machine/identity", "GET", undefined, machine.machineToken))?.status).toBe(401);

    const replacement = await (await call("machines", "POST", { name: "Mac again" }))?.json() as
      { id: string; machineToken: string };
    expect((await call("machine/self", "DELETE", undefined, replacement.machineToken))?.status).toBe(200);
    expect((await call("machine/self", "DELETE", undefined, replacement.machineToken))?.status).toBe(401);
    expect((await call("machine/identity", "GET", undefined, replacement.machineToken))?.status).toBe(401);
  });
});
