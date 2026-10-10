// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { describe, expect, it } from "vitest";
import { AccountAuth } from "../../worker/account/auth";
import { D1AccountStore } from "../../worker/account/d1-store";
import { AccountDeviceInvites } from "../../worker/account/device-invites";
import { routeAccountApi } from "../../worker/account/api";
import { SqliteD1 } from "./account-sqlite";

const base = "https://granttap.com/api/account/";
function post(path: string, token?: string, body?: unknown) {
  return new Request(base + path, { method: "POST", headers: {
    "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}),
  }, body: JSON.stringify(body ?? {}) });
}

describe("one-use account device QR", () => {
  it("redeems into an independent session for the same account, once only", async () => {
    const db = new SqliteD1();
    const auth = new AccountAuth(new D1AccountStore(db as unknown as D1Database), {
      register: async () => ({ verified: true, credential: {
        id: "owner-passkey", publicKey: new Uint8Array([1]), counter: 0,
      } }), authenticate: async () => ({ verified: false }),
    });
    const invites = new AccountDeviceInvites(db as unknown as D1Database);
    const options = await auth.registrationOptions();
    const owner = await auth.completeRegistration(options.ceremonyId, { id: "owner-passkey" });
    expect(owner).not.toBeNull();
    const issue = await routeAccountApi(post("device-invites", owner!.token), auth,
      undefined, undefined, invites);
    expect(issue?.status).toBe(200);
    const code = (await issue?.json() as { code: string }).code;
    expect(code).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const browserClaim = post("device-invites/redeem", undefined, { code });
    browserClaim.headers.set("origin", "https://granttap.com");
    expect((await routeAccountApi(browserClaim, auth,
      undefined, undefined, invites))?.status).toBe(403);
    const claim = await routeAccountApi(post("device-invites/redeem", undefined, { code }), auth,
      undefined, undefined, invites);
    expect(claim?.status).toBe(200);
    const device = await claim?.json() as { accountId: string; token: string };
    expect(device.accountId).toBe(owner!.accountId);
    expect(device.token).not.toBe(owner!.token);
    expect(await auth.accountForToken(device.token)).toBe(owner!.accountId);
    expect((await routeAccountApi(post("device-invites/redeem", undefined, { code }), auth,
      undefined, undefined, invites))?.status).toBe(410);
    expect((await routeAccountApi(post("device-invites"), auth,
      undefined, undefined, invites))?.status).toBe(401);
    const browserIssue = post("device-invites", owner!.token);
    browserIssue.headers.set("origin", "https://granttap.com");
    expect((await routeAccountApi(browserIssue, auth,
      undefined, undefined, invites))?.status).toBe(403);
    expect((await routeAccountApi(post("device-invites/redeem", undefined, { code: "bad" }), auth,
      undefined, undefined, invites))?.status).toBe(400);
    const after = await routeAccountApi(post("device-invites", owner!.token), auth,
      undefined, undefined, invites);
    const pending = (await after?.json() as { code: string }).code;
    await auth.deleteAccount(owner!.token);
    expect((await routeAccountApi(post("device-invites/redeem", undefined, { code: pending }), auth,
      undefined, undefined, invites))?.status).toBe(410);
  });

  it("expires codes and bounds outstanding full-account invitations", async () => {
    const db = new SqliteD1();
    const accountId = "00000000-0000-4000-8000-000000000001";
    await db.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)")
      .bind(accountId, 0).run();
    let now = 1_000;
    const invites = new AccountDeviceInvites(db as unknown as D1Database, () => now);
    const codes: string[] = [];
    for (let i = 0; i < 5; i++) codes.push((await invites.issue(accountId))!.code);
    expect(await invites.issue(accountId)).toBeNull();
    now += 5 * 60_000;
    expect(await invites.consume(codes[0])).toBeNull();
    expect(await invites.issue(accountId)).not.toBeNull();
  });
});
