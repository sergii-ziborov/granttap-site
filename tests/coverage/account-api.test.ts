// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";
import { routeAccountApi } from "../../worker/account/api";
import { AccountAuth } from "../../worker/account/auth";
import { D1AccountStore } from "../../worker/account/d1-store";
import { SqliteD1 } from "./account-sqlite";

const base = "https://granttap.com/api/account/";
const post = (path: string, body?: unknown, origin?: string) => new Request(base + path, {
  method: "POST",
  headers: { "content-type": "application/json", ...(origin ? { origin } : {}) },
  body: body === undefined ? undefined : JSON.stringify(body),
});

describe("account HTTP boundary", () => {
  it("issues a session only after a verified one-use passkey ceremony", async () => {
    const db = new SqliteD1();
    let counter = 0;
    const auth = new AccountAuth(new D1AccountStore(db as unknown as D1Database), {
      register: async () => ({ verified: true, credential: {
        id: "credential", publicKey: new Uint8Array([1, 2]), counter: 0,
      } }),
      authenticate: async () => ({ verified: true, newCounter: ++counter }),
    });
    const optionsResponse = await routeAccountApi(post("registration/options", undefined, "https://granttap.com"), auth);
    expect(optionsResponse?.status).toBe(200);
    expect(optionsResponse?.headers.get("cache-control")).toBe("no-store");
    const options = await optionsResponse?.json() as { ceremonyId: string };
    const registration = await routeAccountApi(post("registration/verify", {
      ceremonyId: options.ceremonyId, response: { id: "credential" },
    }), auth);
    expect(registration?.status).toBe(200);
    expect(registration?.headers.get("set-cookie")).toContain("HttpOnly; Secure; SameSite=Strict");
    const account = await registration?.json() as { accountId: string; token: string };
    expect(account.accountId).toBeTruthy();
    const me = await routeAccountApi(new Request(base + "me", {
      headers: { authorization: `Bearer ${account.token}` },
    }), auth);
    expect(await me?.json()).toEqual({ accountId: account.accountId });

    const replay = await routeAccountApi(post("registration/verify", {
      ceremonyId: options.ceremonyId, response: { id: "credential" },
    }), auth);
    expect(replay?.status).toBe(401);
    const loginOptions = await (await routeAccountApi(post("authentication/options"), auth))?.json() as { ceremonyId: string };
    const login = await routeAccountApi(post("authentication/verify", {
      ceremonyId: loginOptions.ceremonyId, response: { id: "credential" },
    }), auth);
    expect(login?.status).toBe(200);
    const signedIn = await login?.json() as { accountId: string; token: string };
    expect(signedIn.accountId).toBe(account.accountId);

    const browserOptions = await (await routeAccountApi(post("authentication/options",
      undefined, "https://granttap.com"), auth))?.json() as { ceremonyId: string };
    const browserLogin = await routeAccountApi(post("authentication/verify", {
      ceremonyId: browserOptions.ceremonyId, response: { id: "credential" },
    }, "https://granttap.com"), auth);
    expect(browserLogin?.status).toBe(200);
    expect(browserLogin?.headers.get("set-cookie")).toContain("HttpOnly");
    expect(await browserLogin?.json()).toEqual({ accountId: account.accountId });

    const removed = await routeAccountApi(new Request(base + "me", {
      method: "DELETE", headers: { authorization: `Bearer ${signedIn.token}` },
    }), auth);
    expect(removed?.status).toBe(200);
    expect((await routeAccountApi(new Request(base + "me", {
      headers: { authorization: `Bearer ${account.token}` },
    }), auth))?.status).toBe(401);
  });

  it("rejects cross-origin requests, malformed responses and oversized bodies", async () => {
    const db = new SqliteD1();
    const auth = new AccountAuth(new D1AccountStore(db as unknown as D1Database));
    expect((await routeAccountApi(new Request("https://granttap.com/support"), auth))).toBeNull();
    expect((await routeAccountApi(post("registration/options", undefined, "https://evil.example"), auth))?.status).toBe(403);
    expect((await routeAccountApi(post("registration/verify", { ceremonyId: "bad", response: {} }), auth))?.status).toBe(400);
    expect((await routeAccountApi(post("registration/verify", { junk: "x".repeat(17_000) }), auth))?.status).toBe(400);
    expect((await routeAccountApi(new Request(base + "me"), auth))?.status).toBe(401);
    expect((await routeAccountApi(new Request(base + "me", { method: "DELETE" }), auth))?.status).toBe(401);
    expect((await routeAccountApi(post("logout"), auth))?.status).toBe(200);
    expect((await routeAccountApi(post("unknown"), auth))?.status).toBe(405);
  });
});
