#!/usr/bin/env node
/**
 * GrantTap connect on Hetzner. Browser talks only to this origin.
 * Pairing keys never arrive here.
 */
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PAGE = readFileSync(join(ROOT, "public", "connect.html"), "utf8");
const STORE_PATH = process.env.GRANTTAP_CONNECT_STORE ?? join(ROOT, "connect-store.json");
const PORT = Number(process.env.PORT ?? 3210);
const HOST = process.env.HOST ?? "0.0.0.0";
const REQUEST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TTL_MS = 15 * 60_000;
const store = loadStore();

function loadStore() {
  try {
    const parsed = JSON.parse(readFileSync(STORE_PATH, "utf8"));
    return new Map(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Map();
  }
}

function persistStore() {
  try {
    writeFileSync(STORE_PATH, JSON.stringify([...store.entries()]));
  } catch {
    // Memory still serves this process.
  }
}

function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function html(res, status, body) {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

function isLoopbackRedirect(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "http:"
      && (host === "127.0.0.1" || host === "localhost" || host === "::1")
      && /\/(callback|oauth|redirect)(\/|$)/.test(url.pathname);
  } catch {
    return false;
  }
}

function readRow(id) {
  const row = store.get(id);
  if (!row) return undefined;
  if (row.exp <= Date.now()) {
    store.delete(id);
    return undefined;
  }
  return row.value;
}

function writeRow(id, value) {
  store.set(id, { value, exp: Date.now() + TTL_MS });
  persistStore();
}

function sanitize(input, current) {
  if (!input || typeof input !== "object") return current;
  const raw = input;
  const next = {
    clientName: current?.clientName ?? "Coding app",
    computerName: current?.computerName,
    paired: current?.paired ?? false,
    phones: current?.phones ?? [],
    providers: current?.providers ?? [],
    relayStatus: current?.relayStatus,
    mesh: current?.mesh,
    decision: current?.decision,
    redirectUrl: current?.redirectUrl,
    error: current?.error,
  };
  if (typeof raw.clientName === "string") {
    next.clientName = raw.clientName.trim().slice(0, 80) || "Coding app";
  }
  if (typeof raw.computerName === "string") {
    next.computerName = raw.computerName.trim().slice(0, 80);
  }
  if (raw.relayStatus === "online" || raw.relayStatus === "offline" || raw.relayStatus === "unknown") {
    next.relayStatus = raw.relayStatus;
  }
  if (typeof raw.paired === "boolean") next.paired = raw.paired;
  if (Array.isArray(raw.phones)) {
    next.phones = raw.phones.slice(0, 4).flatMap((phone) => {
      if (!phone || typeof phone !== "object") return [];
      if (typeof phone.name !== "string") return [];
      return [{
        name: phone.name.trim().slice(0, 80) || "iPhone",
        status: phone.status === "seen" ? "seen" : "paired",
        lastSeenAt: typeof phone.lastSeenAt === "number" ? phone.lastSeenAt : null,
      }];
    });
  }
  if (Array.isArray(raw.providers)) {
    next.providers = raw.providers.slice(0, 8).flatMap((provider) => {
      if (!provider || typeof provider !== "object") return [];
      if (provider.id !== "codex" && provider.id !== "claude" && provider.id !== "cursor") return [];
      return [{
        id: provider.id,
        installed: provider.installed === true,
        ready: provider.ready === true,
      }];
    });
  }
  if (raw.mesh && typeof raw.mesh === "object") {
    const mesh = raw.mesh;
    const computers = Array.isArray(mesh.computers)
      ? mesh.computers.flatMap((name) => typeof name === "string" && name.trim() ? [name.trim().slice(0, 80)] : []).slice(0, 8)
      : [];
    next.mesh = {
      present: mesh.present === true,
      thisComputer: typeof mesh.thisComputer === "string" ? mesh.thisComputer.trim().slice(0, 80) : "",
      computers,
      openTasks: Number.isFinite(mesh.openTasks) ? Math.max(0, Math.min(999, Math.floor(mesh.openTasks))) : 0,
    };
  }
  if (raw.decision === "approve" || raw.decision === "deny") next.decision = raw.decision;
  if (typeof raw.error === "string") next.error = raw.error.slice(0, 300);
  return next;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

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

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] === "api" && parts[1] === "connect" && parts[2] === "requests") {
    const id = parts[3] ?? "";
    const action = parts[4];
    if (!REQUEST_ID.test(id)) {
      json(res, 400, { error: "Invalid connection request." });
      return;
    }
    if (req.method === "GET" && !action) {
      const row = readRow(id);
      if (!row) {
        json(res, 404, { error: "This connection request expired. Start again in your coding app." });
        return;
      }
      json(res, 200, row);
      return;
    }
    if (req.method === "PUT" && !action) {
      const incoming = sanitize(await readBody(req), readRow(id));
      if (!incoming) {
        json(res, 400, { error: "Invalid connection snapshot." });
        return;
      }
      writeRow(id, incoming);
      json(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST" && action === "decision") {
      const current = readRow(id);
      if (!current) {
        json(res, 404, { error: "This connection request expired. Start again in your coding app." });
        return;
      }
      const body = await readBody(req);
      if (body?.decision !== "approve" && body?.decision !== "deny") {
        json(res, 400, { error: "Choose Approve or Deny." });
        return;
      }
      if (typeof body?.phone === "string") {
        const name = body.phone.trim().slice(0, 80);
        const names = (current.phones ?? []).map((phone) => phone.name);
        if (name && (names.length === 0 || names.includes(name))) current.selectedPhone = name;
      }
      if (!current.decision) current.decision = body.decision;
      writeRow(id, current);
      json(res, 200, { ok: true, decision: current.decision });
      return;
    }
    if (req.method === "POST" && action === "redirect") {
      const current = readRow(id);
      if (!current) {
        json(res, 404, { error: "This connection request expired. Start again in your coding app." });
        return;
      }
      const body = await readBody(req);
      if (!body?.redirectUrl || !isLoopbackRedirect(body.redirectUrl)) {
        json(res, 400, { error: "Redirect is not a coding-app callback." });
        return;
      }
      current.redirectUrl = body.redirectUrl;
      writeRow(id, current);
      json(res, 200, { ok: true });
      return;
    }
    json(res, 405, { error: "Method not allowed." });
    return;
  }

  json(res, 404, { error: "Not found." });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`[granttap-web] listening on ${HOST}:${PORT}\n`);
});
