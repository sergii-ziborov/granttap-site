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
import { handleRuntimeFaultsApi } from "../worker/runtime-faults/index.ts";
import { SqliteD1 } from "../worker/account/sqlite.ts";
import { AccountMachines } from "../worker/account/machines.ts";
import { attachControlTransport } from "../worker/account/control-transport/index.ts";
import { ConnectRequests } from "./connect/requests.mjs";
import { json, html, webRequest, sendResponse } from "./connect/http.mjs";
import { routeConnectRequest } from "./connect/api.mjs";
import { configuredBilling } from "./billing.ts";
import { startAuthorityCapacity } from './capacity/index.mjs';
import { accountClientAccess } from './client-access.mjs';
import { reviewAccess } from '../worker/account/review-access.ts';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PAGE = readFileSync(join(ROOT, "public", "connect.html"), "utf8");
const STORE_PATH = process.env.GRANTTAP_CONNECT_STORE ?? join(ROOT, "connect-store.json");
const PORT = Number(process.env.PORT ?? 3210);
const HOST = process.env.HOST ?? "0.0.0.0";
reviewAccess(process.env); // A malformed App Review account list stops startup instead of being ignored.
const accountDb = new SqliteD1(process.env.GRANTTAP_ACCOUNT_DB ?? join(ROOT, "accounts.sqlite"), new URL("../migrations/", import.meta.url));
const capacity = startAuthorityCapacity(accountDb, process.env, () => controlTransport.capacity());
const accountAuth = new AccountAuth(new D1AccountStore(accountDb));
const accountMachines = new AccountMachines(accountDb);
const managedBilling = configuredBilling(process.env);
// Encrypts account-held web keys at rest. Production derives it from the admission key.
const storageSecret = process.env.GRANTTAP_ACCOUNT_STORAGE_KEY_PATH
  ? readFileSync(process.env.GRANTTAP_ACCOUNT_STORAGE_KEY_PATH) : managedBilling?.signingKey;
if (storageSecret && storageSecret.length < 32) throw new Error("Account storage key must be at least 32 bytes.");
const clientAccess = accountClientAccess({ db: accountDb, auth: accountAuth, machines: accountMachines, observe: account => capacity?.accountSeen(account) });
function purgeExpiredAccountState() {
  accountDb.sqlite.prepare("DELETE FROM ceremonies WHERE expires_at<=?").run(Date.now());
  accountDb.sqlite.prepare("DELETE FROM sessions WHERE expires_at<=?").run(Date.now());
  accountDb.sqlite.prepare("DELETE FROM account_qr_requests WHERE expires_at<=? AND (deposit_until IS NULL OR deposit_until<=?)")
    .run(Date.now(), Date.now());
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
  try { if (clientAccess && !(await clientAccess.http(req, res))) return; }
  catch { json(res, 503, { error: "Account service unavailable." }); return; }
  if (req.method === "GET" && (url.pathname === "/connect" || url.pathname === "/connect/")) {
    html(res, 200, PAGE);
    return;
  }

  if (url.pathname.startsWith("/api/account/")) {
    try {
      // A sealed or deposited chat key may exceed the usual account body limit.
      const large = url.pathname === "/api/account/qr-sign-in/approve" || url.pathname === "/api/account/web-key";
      const response = await handleAccountApi(await webRequest(req, large ? 65_536 : 16_384), accountDb, managedBilling, storageSecret);
      if (response) await sendResponse(res, response);
      else json(res, 404, { error: "Not found." });
    } catch (error) {
      const tooLarge = error instanceof Error && error.message === "Request too large";
      json(res, tooLarge ? 413 : 500, { error: tooLarge
        ? "Account request is too large." : "Account service unavailable." });
    }
    return;
  }

  if (url.pathname === "/api/runtime-faults") {
    try {
      await sendResponse(res, await handleRuntimeFaultsApi(await webRequest(req), accountDb));
    } catch (error) {
      const tooLarge = error instanceof Error && error.message === "Request too large";
      json(res, tooLarge ? 413 : 500, { error: tooLarge ? "Report is too large." : "Report service unavailable." });
    }
    return;
  }

  if (url.pathname.startsWith("/api/connect/requests/")) {
    await routeConnectRequest(req, res, url, { records: requests, auth: accountAuth, machines: accountMachines });
    return;
  }

  json(res, 404, { error: "Not found." });
});

const controlTransport = attachControlTransport(server, request => handleAccountApi(request, accountDb, managedBilling, storageSecret), {
  admitClient: clientAccess ? request => clientAccess.socket(request) : undefined,
});

server.once('close', () => capacity?.close());
server.listen(PORT, HOST, () => {
  process.stdout.write(`[granttap-web] listening on ${HOST}:${PORT}\n`);
});

let stopping = false;
for (const signal of ['SIGTERM','SIGINT']) process.once(signal, () => {
  if (stopping) return; stopping = true;
  const force = setTimeout(() => process.exit(1), 5000); force.unref();
  void (async () => {
    await controlTransport.shutdown(); await clientAccess?.close();
    await new Promise(resolve => server.close(resolve)); capacity?.close();
    clearTimeout(force); process.exit(0);
  })().catch(() => process.exit(1));
});
