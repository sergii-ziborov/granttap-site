import { readFileSync, writeFileSync } from "node:fs";
export const REQUEST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export class ConnectRequests {
  constructor(path) {
    this.path = path;
    try { const values = JSON.parse(readFileSync(path, "utf8")); this.store = new Map(Array.isArray(values) ? values : []); }
    catch { this.store = new Map(); }
  }
  read(id) {
    const row = this.store.get(id);
    if (!row) return undefined;
    if (row.exp <= Date.now()) { this.store.delete(id); return undefined; }
    return row.value;
  }
  write(id, value) {
    this.store.set(id, { value, exp: Date.now() + 15 * 60_000 });
    try { writeFileSync(this.path, JSON.stringify([...this.store.entries()])); }
    catch { /* The existing connection flow remains available in memory. */ }
  }
}
export function isLoopbackRedirect(value) {
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

export function sanitize(input, current) {
  if (!input || typeof input !== "object") return current;
  const raw = input;
  const next = {
    clientName: current?.clientName ?? "Coding app",
    purpose: current?.purpose,
    computerName: current?.computerName,
    paired: current?.paired ?? false,
    passkeyCapable: current?.passkeyCapable ?? false,
    phones: current?.phones ?? [],
    providers: current?.providers ?? [],
    relayStatus: current?.relayStatus,
    mesh: current?.mesh,
    decision: current?.decision,
    redirectUrl: current?.redirectUrl,
    error: current?.error,
    requestSecret: current?.requestSecret,
    machineId: current?.machineId,
    machineToken: current?.machineToken,
    accountId: current?.accountId,
  };
  if (typeof raw.clientName === "string") {
    next.clientName = raw.clientName.trim().slice(0, 80) || "Coding app";
  }
  if (raw.purpose === "account-link") next.purpose = "account-link";
  if (typeof raw.computerName === "string") {
    next.computerName = raw.computerName.trim().slice(0, 80);
  }
  if (raw.relayStatus === "online" || raw.relayStatus === "offline" || raw.relayStatus === "unknown") {
    next.relayStatus = raw.relayStatus;
  }
  if (typeof raw.paired === "boolean") next.paired = raw.paired;
  if (typeof raw.passkeyCapable === "boolean") next.passkeyCapable = raw.passkeyCapable;
  if (typeof raw.machineId === "string" && REQUEST_ID.test(raw.machineId)) {
    next.machineId = raw.machineId;
  }
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

export function publicRow(row) {
  const visible = { ...row };
  for (const key of ["requestSecret", "machineToken", "machineId", "accountId"]) delete visible[key];
  return visible;
}

export function privateRow(row) {
  const privateFields = { ...row };
  delete privateFields.requestSecret;
  return privateFields;
}

