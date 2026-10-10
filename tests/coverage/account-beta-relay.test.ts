// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { AccountAuth } from "../../worker/account/auth";
import { AccountBetaRelay } from "../../worker/account/beta-relay";
import { D1AccountStore } from "../../worker/account/d1-store";
import { routeAccountApi } from "../../worker/account/api";
import { SqliteD1 } from "./account-sqlite";

describe("account beta relay grant", () => {
  it("returns only a live grant for the authenticated account", async () => {
    const db = new SqliteD1();
    const d1 = db as unknown as D1Database;
    const store = new D1AccountStore(d1);
    for (const account of ["owner", "other"]) {
      await store.createAccount(account, { id: `${account}-key`, accountId: account,
        publicKey: new Uint8Array([1]), counter: 0 });
    }
    const token = Buffer.alloc(32, 7).toString("base64url");
    await store.saveSession(createHash("sha256").update(token).digest("hex"),
      "owner", 100_000);
    const auth = new AccountAuth(store, undefined, () => 1_000);
    let now = 1_000;
    const grants = new AccountBetaRelay(d1, () => now);
    const endpoint = "https://granttap.com/api/account/beta-relay";
    const read = (authorization?: string) => routeAccountApi(new Request(endpoint, {
      headers: authorization ? { authorization: `Bearer ${authorization}` } : {},
    }), auth, undefined, grants);

    expect((await read())?.status).toBe(401);
    expect(await (await read(token))?.json()).toEqual({ expiresAt: null });
    await db.prepare("INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES(?,?)")
      .bind("other", 50_000).run();
    expect(await (await read(token))?.json()).toEqual({ expiresAt: null });
    await db.prepare("INSERT INTO account_beta_relay_grants(account_id,expires_at) VALUES(?,?)")
      .bind("owner", 50_000).run();
    expect(await (await read(token))?.json()).toEqual({ expiresAt: 50_000 });
    now = 50_000;
    expect(await (await read(token))?.json()).toEqual({ expiresAt: null });
    now = 1_000;
    await db.prepare("UPDATE account_beta_relay_grants SET revoked_at=? WHERE account_id=?")
      .bind(2_000, "owner").run();
    expect(await (await read(token))?.json()).toEqual({ expiresAt: null });
  });
});
