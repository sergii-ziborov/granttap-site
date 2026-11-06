// @vitest-environment node
import { randomUUID } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import { expect, it } from "vitest";
import { handleAccountApi } from "../../api";
import { AccountAuth } from "../../auth";
import { D1AccountStore } from "../../d1-store";
import { AccountLoginTokens } from "../../login-tokens";
import { SqliteD1 } from "../../../../tests/coverage/account-sqlite";

async function fixture() {
  const db = new SqliteD1();
  const database = db as unknown as D1Database;
  const accountId = randomUUID();
  await db.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").bind(accountId, Date.now()).run();
  const auth = new AccountAuth(new D1AccountStore(database));
  const tokens = new AccountLoginTokens(database);
  const issued = (await tokens.issue(accountId, { name: "Browser fixture", expiresInSeconds: 900, maxUses: 1 }))!;
  const request = (headers: Record<string, string> = {}, secret = issued.secret, method = "POST") =>
    new Request("https://granttap.com/api/account/browser-token/redeem", { method,
      headers: { origin: "https://granttap.com", "sec-fetch-site": "same-origin", "content-type": "application/json", ...headers },
      ...(method === "POST" ? { body: JSON.stringify({ secret }) } : {}) });
  const call = async (req: Request) => (await handleAccountApi(req, database))!;
  return { db, accountId, auth, tokens, issued, request, call };
}

it("exchanges an explicit key for a cookie without exposing a bearer or extending its authority", async () => {
  const f = await fixture();
  const response = await f.call(f.request());
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ accountId: f.accountId, expiresAt: f.issued.token.expiresAt });
  expect(response.headers.get("cache-control")).toBe("no-store");
  const cookie = response.headers.get("set-cookie")!;
  expect(cookie).toContain("HttpOnly; Secure; SameSite=Strict");
  const session = cookie.match(/granttap_session=([^;]+)/)![1];
  expect(await f.auth.accountForToken(session)).toBe(f.accountId);
  expect(await f.auth.canManageCredentials(session)).toBe(false);
  expect((await f.call(f.request())).status).toBe(410);
  await f.tokens.revoke(f.accountId, f.issued.token.id);
  expect(await f.auth.accountForToken(session)).toBeNull();
});

it("rejects cross-site, missing browser context and malformed requests without consuming the key", async () => {
  const f = await fixture();
  const rejectedHeaders: Array<Record<string, string>> = [{ origin: "https://evil.example" },
    { "sec-fetch-site": "cross-site" }, { "sec-fetch-site": "same-site" }, { origin: "" }];
  for (const headers of rejectedHeaders) {
    expect((await f.call(f.request(headers))).status).toBe(403);
  }
  expect((await f.call(f.request({}, "bad"))).status).toBe(400);
  expect((await f.call(f.request({}, f.issued.secret, "GET"))).status).toBe(405);
  expect((await f.call(f.request())).status).toBe(200);
});
