// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { expect, test } from "vitest";
import { handleConnectApi } from "../../worker/connect-api";
import { AccountAuth } from "../../worker/account/auth";
import { D1AccountStore } from "../../worker/account/d1-store";
import { SqliteD1 } from "./account-sqlite";

test("Mac passkey approves one MCP request only after a fresh verified assertion", async () => {
  const db = new SqliteD1();
  const store = new D1AccountStore(db as unknown as D1Database);
  await store.createAccount("owner", { id: "mac-passkey", accountId: "owner",
    publicKey: new Uint8Array([1]), counter: 0 });
  const auth = new AccountAuth(store, {
    register: async () => ({ verified: false }),
    authenticate: async () => ({ verified: true, newCounter: 1 }),
  });
  const id = "71111111-1111-4111-8111-111111111111";
  const url = `https://granttap.com/api/connect/requests/${id}`;
  const send = (body: unknown, origin = "https://granttap.com") =>
    handleConnectApi(new Request(`${url}/passkey`, { method: "POST",
      headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body),
    }), auth);
  await handleConnectApi(new Request(url, { method: "PUT", body: JSON.stringify({
    clientName: "Codex", passkeyCapable: true,
  }) }));
  await handleConnectApi(new Request(url, { method: "PUT", body: JSON.stringify({ decision: "passkey" }) }));
  expect((await (await handleConnectApi(new Request(url)))?.json() as { decision?: string }).decision).toBeUndefined();
  expect((await send({ ceremonyId: "bad", response: {} }))?.status).toBe(400);
  const options = await auth.authenticationOptions();
  const body = { ceremonyId: options.ceremonyId, response: { id: "mac-passkey" } };
  expect((await send(body, "https://other.invalid"))?.status).toBe(403);
  expect((await handleConnectApi(new Request(`${url}/decision`, { method: "POST",
    body: JSON.stringify({ decision: "passkey" }),
  }), auth))?.status).toBe(400);
  const approved = await send(body);
  expect(approved?.status).toBe(200);
  expect(approved?.headers.get("set-cookie")).toContain("HttpOnly");
  expect(await (await handleConnectApi(new Request(url)))?.json()).toMatchObject({ decision: "passkey" });
  expect((await send(body))?.status).toBe(409);
});

test("an older Mac helper cannot claim passkey approval it cannot complete", async () => {
  const id = "72222222-2222-4222-8222-222222222222";
  const url = `https://granttap.com/api/connect/requests/${id}`;
  await handleConnectApi(new Request(url, { method: "PUT",
    body: JSON.stringify({ clientName: "Older Codex" }),
  }));
  const auth = new AccountAuth(new D1AccountStore(new SqliteD1() as unknown as D1Database));
  const result = await handleConnectApi(new Request(`${url}/passkey`, { method: "POST",
    headers: { origin: "https://granttap.com", "content-type": "application/json" },
    body: JSON.stringify({ ceremonyId: id, response: { id: "fake" } }),
  }), auth);
  expect(result?.status).toBe(409);
  expect((await (await handleConnectApi(new Request(url)))?.json() as { decision?: string }).decision)
    .toBeUndefined();
});
