// @vitest-environment node
import type { D1Database } from "@cloudflare/workers-types";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createHash, randomUUID } from "node:crypto";
import { handleAccountApi } from "../../api";
import { AccountAuth } from "../../auth";
import { D1AccountStore } from "../../d1-store";
import { SqliteD1 } from "../../../../tests/coverage/account-sqlite";
import { AccountLoginTokens } from "..";

const root = "https://granttap.com/api/account/";
type Issued = { secret: string; link: string; token: { id: string; name: string; expiresAt: number; uses: number } };
function request(path: string, method = "GET", token?: string, body?: unknown) {
  return new Request(root + path, { method, headers: {
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    ...(body !== undefined ? { "content-type": "application/json" } : {}),
  }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
}
async function fixture() {
  const db = new SqliteD1();
  const database = db as unknown as D1Database;
  const auth = new AccountAuth(new D1AccountStore(database));
  async function owner() {
    const id = randomUUID();
    await db.prepare("INSERT INTO accounts(id,created_at) VALUES(?,?)").bind(id, Date.now()).run();
    return auth.createSession(id);
  }
  const user = await owner();
  const call = async (req: Request) => (await handleAccountApi(req, database))!;
  const issue = async (options = {}) => {
    const response = await call(request("login-tokens", "POST", user.token, {
      name: "Second device", expiresInSeconds: 900, maxUses: 1, ...options,
    }));
    expect(response.status).toBe(201);
    return response.json() as Promise<Issued>;
  };
  return { db, auth, user, owner, call, issue };
}

afterEach(() => vi.restoreAllMocks());

describe("account sign-in tokens", () => {
  it("stores hashes, reveals a secret once, and redeems to an independent durable session", async () => {
    const f = await fixture();
    const issued = await f.issue();
    expect(issued.secret).toMatch(/^gt_login_[A-Za-z0-9_-]{43}$/);
    const link = new URL(issued.link);
    expect(link.origin + link.pathname).toBe("https://granttap.com/sign-in");
    expect(link.search).toBe("");
    expect(new URLSearchParams(link.hash.slice(1)).get("token")).toBe(issued.secret);
    const rows = f.db.sqlite.prepare("SELECT * FROM account_login_tokens").all();
    expect(JSON.stringify(rows)).not.toContain(issued.secret);
    expect(rows[0].token_hash).toBe(createHash("sha256").update(issued.secret).digest("hex"));
    const listed = await (await f.call(request("login-tokens", "GET", f.user.token))).json();
    expect(JSON.stringify(listed)).not.toContain(issued.secret);
    expect(listed.tokens[0].id).toBe(issued.token.id);
    const claimed = await f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }));
    expect(claimed.status).toBe(200);
    expect(claimed.headers.get("cache-control")).toBe("no-store");
    const session = await claimed.json();
    expect(session.accountId).toBe(f.user.accountId);
    expect(session.token).not.toBe(f.user.token);
    expect(await f.auth.accountForToken(session.token)).toBe(f.user.accountId);
    const restarted = new AccountAuth(new D1AccountStore(f.db as unknown as D1Database));
    expect(await restarted.accountForToken(session.token)).toBe(f.user.accountId);
    expect((await f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }))).status).toBe(410);
  });

  it("enforces a bounded use count atomically and revokes derived sessions without affecting the owner", async () => {
    const f = await fixture();
    const issued = await f.issue({ maxUses: 2 });
    const attempts = await Promise.all(Array.from({ length: 4 }, () =>
      f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }))));
    expect(attempts.filter(r => r.status === 200)).toHaveLength(2);
    expect(attempts.filter(r => r.status === 410)).toHaveLength(2);
    const sessions = await Promise.all(attempts.filter(r => r.status === 200).map(r => r.json()));
    const other = await f.owner();
    expect((await f.call(request("login-tokens/" + issued.token.id, "DELETE", other.token))).status).toBe(404);
    expect((await f.call(request("login-tokens/" + issued.token.id, "DELETE", f.user.token))).status).toBe(200);
    for (const session of sessions) expect(await f.auth.accountForToken(session.token)).toBeNull();
    expect(await f.auth.accountForToken(f.user.token)).toBe(f.user.accountId);
    expect((await f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }))).status).toBe(410);
  });

  it("expires derived access and cannot turn a token login into another lasting credential", async () => {
    const now = vi.spyOn(Date, "now").mockReturnValue(1_800_000_000_000);
    const f = await fixture();
    const issued = await f.issue({ maxUses: 2 });
    const session = await (await f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }))).json();
    expect((await f.call(request("login-tokens", "POST", session.token, {
      name: "Chained", expiresInSeconds: 900, maxUses: 1,
    }))).status).toBe(403);
    expect((await f.call(request("device-invites", "POST", session.token, {}))).status).toBe(403);
    now.mockReturnValue(1_800_000_900_001);
    expect(await f.auth.accountForToken(session.token)).toBeNull();
    expect((await f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }))).status).toBe(410);
    expect(await f.auth.accountForToken(f.user.token)).toBe(f.user.accountId);
  });

  it("rejects anonymous, browser, malformed and excessive issuance and isolates accounts", async () => {
    const f = await fixture();
    expect((await f.call(request("login-tokens", "POST", undefined, {}))).status).toBe(401);
    for (const body of [{ name: "", expiresInSeconds: 900, maxUses: 1 },
      { name: "Control\nname", expiresInSeconds: 900, maxUses: 1 },
      { name: "Valid", expiresInSeconds: 2_592_001, maxUses: 1 },
      { name: "Valid", expiresInSeconds: 899, maxUses: 1 },
      { name: "Valid", expiresInSeconds: 900, maxUses: 101 },
      { name: "Valid", expiresInSeconds: 900, maxUses: 1.5 }]) {
      expect((await f.call(request("login-tokens", "POST", f.user.token, body))).status).toBe(400);
    }
    const browser = request("login-tokens", "POST", f.user.token, {});
    browser.headers.set("origin", "https://granttap.com");
    expect((await f.call(browser)).status).toBe(403);
    expect((await f.call(request("login-tokens/redeem", "POST", undefined, { secret: "bad" }))).status).toBe(400);
    for (let i = 0; i < 5; i++) await f.issue();
    expect((await f.call(request("login-tokens", "POST", f.user.token, {
      name: "Sixth", expiresInSeconds: 900, maxUses: 1,
    }))).status).toBe(429);
    const other = await f.owner();
    expect((await (await f.call(request("login-tokens", "GET", other.token))).json()).tokens).toEqual([]);
  });

  it("cannot mint a lasting machine credential with temporary account access", async () => {
    const f = await fixture();
    const issued = await f.issue();
    const session = await (await f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }))).json();
    expect((await f.call(request("machines", "POST", session.token, { name: "Temporary client" }))).status).toBe(403);
    expect((await f.call(request("machines", "GET", session.token))).status).toBe(200);
  });

  it("retains limited origin when the grant is removed and cascades on account deletion", async () => {
    const f = await fixture();
    const issued = await f.issue({ maxUses: 2 });
    const session = await (await f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }))).json();
    expect(session.loginTokenId).toBe(issued.token.id);
    expect(session.expiresAt).toBe(issued.token.expiresAt);
    await f.db.prepare("DELETE FROM account_login_tokens WHERE id=?").bind(issued.token.id).run();
    expect(await f.auth.accountForToken(session.token)).toBeNull();
    expect(await f.auth.canManageCredentials(session.token)).toBe(false);
    expect(await f.auth.canManageCredentials("malformed")).toBe(false);
    expect(await f.auth.canManageCredentials("x".repeat(43))).toBe(false);
    await f.auth.deleteAccount(f.user.token);
    expect(f.db.sqlite.prepare("SELECT COUNT(*) AS n FROM account_login_token_sessions").get()?.n).toBe(0);
  });

  it("cleans up an unissued session after association failure or concurrent revocation", async () => {
    const f = await fixture();
    const issued = await f.issue({ maxUses: 3 });
    const create = f.auth.createSession.bind(f.auth);
    vi.spyOn(f.auth, "createSession").mockImplementation(async account => {
      const session = await create(account);
      await new AccountLoginTokens(f.db as unknown as D1Database).revoke(account, issued.token.id);
      return session;
    });
    const tokens = new AccountLoginTokens(f.db as unknown as D1Database);
    expect(await tokens.redeem(issued.secret, f.auth)).toBeNull();
    expect(await tokens.redeem("bad", f.auth)).toBeNull();
    expect(f.db.sqlite.prepare("SELECT COUNT(*) AS n FROM sessions").get()?.n).toBe(1);
    vi.restoreAllMocks();
    const second = await f.issue();
    const prepare = f.db.prepare.bind(f.db);
    vi.spyOn(f.db, "prepare").mockImplementation(sql => {
      if (sql.startsWith("INSERT INTO account_login_token_sessions")) throw Error("Unavailable");
      return prepare(sql);
    });
    expect(await tokens.redeem(second.secret, f.auth)).toBeNull();
    expect(f.db.sqlite.prepare("SELECT COUNT(*) AS n FROM sessions").get()?.n).toBe(1);
  });

  it("does not consume a token through browser traffic or unsupported methods", async () => {
    const f = await fixture();
    const issued = await f.issue();
    const browser = request("login-tokens/redeem", "POST", undefined, { secret: issued.secret });
    browser.headers.set("sec-fetch-site", "same-origin");
    expect((await f.call(browser)).status).toBe(403);
    expect((await f.call(request("login-tokens/redeem", "GET", f.user.token))).status).toBe(405);
    expect((await f.call(request("login-tokens/bad", "DELETE", f.user.token))).status).toBe(405);
    expect((await f.call(request("login-tokens/redeem", "POST", undefined, { secret: issued.secret }))).status).toBe(200);
  });
});
