#!/usr/bin/env node
/**
 * GrantTap connect on Hetzner. Browser talks only to this origin.
 * Private encryption keys stay on the controller device.
 */
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AccountAuth } from "../worker/account/auth.ts";
import { D1AccountStore } from "../worker/account/d1-store.ts";
import { handleAccountApi } from "../worker/account/api.ts";
import { SqliteD1 } from "../worker/account/sqlite.ts";
import { AccountMachines } from "../worker/account/machines.ts";
import { attachControlTransport } from "../worker/account/control-transport/index.ts";
import { ConnectRequests } from "./connect/requests.mjs";
import { json, html, webRequest, sendResponse } from "./connect/http.mjs";
import { routeConnectRequest } from "./connect/api.mjs";
import { configuredBilling } from "./billing.ts";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PAGE = readFileSync(join(ROOT, "public", "connect.html"), "utf8");
const STORE_PATH = process.env.GRANTTAP_CONNECT_STORE ?? join(ROOT, "connect-store.json");
const PORT = Number(process.env.PORT ?? 3210);
const HOST = process.env.HOST ?? "0.0.0.0";
const accountDb = new SqliteD1(process.env.GRANTTAP_ACCOUNT_DB ?? join(ROOT, "accounts.sqlite"));
const accountAuth = new AccountAuth(new D1AccountStore(accountDb));
const accountMachines = new AccountMachines(accountDb);
const managedBilling = configuredBilling(process.env);
function purgeExpiredAccountState() {
  accountDb.sqlite.prepare("DELETE FROM ceremonies WHERE expires_at<=?").run(Date.now());
  accountDb.sqlite.prepare("DELETE FROM sessions WHERE expires_at<=?").run(Date.now());
}
purgeExpiredAccountState();
setInterval(purgeExpiredAccountState, 10 * 60_000).unref();
const requests = new ConnectRequests(STORE_PATH);

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  if (req.method === "GET" && url.pathname === "/healthz") {
    json(res, 200, { ok: true, service: "granttap-web" });
    return;
  }
  if (req.method === "GET" && (url.pathname === "/connect" || url.pathname === "/connect/")) {
    html(res, 200, PAGE);
    return;
  }

  if (url.pathname.startsWith("/api/account/")) {
    try {
      const response = await handleAccountApi(await webRequest(req), accountDb, managedBilling);
      if (response) await sendResponse(res, response);
      else json(res, 404, { error: "Not found." });
    } catch (error) {
      const tooLarge = error instanceof Error && error.message === "Request too large";
      json(res, tooLarge ? 413 : 500, { error: tooLarge
        ? "Account request is too large." : "Account service unavailable." });
    }
    return;
  }

  if (url.pathname.startsWith("/api/connect/requests/")) {
    await routeConnectRequest(req, res, url, { records: requests, auth: accountAuth, machines: accountMachines });
    return;
  }

  json(res, 404, { error: "Not found." });
});

attachControlTransport(server, request => handleAccountApi(request, accountDb, managedBilling));

server.listen(PORT, HOST, () => {
  process.stdout.write(`[granttap-web] listening on ${HOST}:${PORT}\n`);
});
