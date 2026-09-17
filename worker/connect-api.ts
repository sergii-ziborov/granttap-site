/** Short-lived public Cursor/Codex consent. No pairing keys. No loopback. */

const REQUEST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TTL_MS = 15 * 60_000;
const memory = new Map<string, { body: string; exp: number }>();

export type ConnectSnapshot = {
  clientName: string;
  paired: boolean;
  phones: Array<{ name: string; status: string; lastSeenAt: number | null }>;
  providers: Array<{ id: string; installed: boolean; ready: boolean }>;
  mesh?: { present: boolean; thisComputer: string; computers: string[]; openTasks: number };
  decision?: "approve" | "deny";
  redirectUrl?: string;
  error?: string;
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function isRequestId(value: string): boolean {
  return REQUEST_ID.test(value);
}

function isLoopbackRedirect(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "http:"
      && (host === "127.0.0.1" || host === "localhost" || host === "::1")
      && /\/callback(\/|$)/.test(url.pathname);
  } catch {
    return false;
  }
}

function sanitizeSnapshot(input: unknown, current?: ConnectSnapshot): ConnectSnapshot | undefined {
  if (!input || typeof input !== "object") return current;
  const raw = input as Record<string, unknown>;
  const next: ConnectSnapshot = {
    clientName: current?.clientName ?? "Coding app",
    paired: current?.paired ?? false,
    phones: current?.phones ?? [],
    providers: current?.providers ?? [],
    mesh: current?.mesh,
    decision: current?.decision,
    redirectUrl: current?.redirectUrl,
    error: current?.error,
  };
  if (typeof raw.clientName === "string") {
    next.clientName = raw.clientName.trim().slice(0, 80) || "Coding app";
  }
  if (typeof raw.paired === "boolean") next.paired = raw.paired;
  if (Array.isArray(raw.phones)) {
    next.phones = raw.phones.slice(0, 4).flatMap((phone) => {
      if (!phone || typeof phone !== "object") return [];
      const row = phone as Record<string, unknown>;
      if (typeof row.name !== "string") return [];
      return [{
        name: row.name.trim().slice(0, 80) || "iPhone",
        status: row.status === "seen" ? "seen" : "paired",
        lastSeenAt: typeof row.lastSeenAt === "number" ? row.lastSeenAt : null,
      }];
    });
  }
  if (Array.isArray(raw.providers)) {
    next.providers = raw.providers.slice(0, 8).flatMap((provider) => {
      if (!provider || typeof provider !== "object") return [];
      const row = provider as Record<string, unknown>;
      if (row.id !== "codex" && row.id !== "claude" && row.id !== "cursor") return [];
      return [{
        id: row.id,
        installed: row.installed === true,
        ready: row.ready === true,
      }];
    });
  }
  if (raw.mesh && typeof raw.mesh === "object") {
    const mesh = raw.mesh as Record<string, unknown>;
    const computers = Array.isArray(mesh.computers)
      ? mesh.computers.flatMap((name) => typeof name === "string" && name.trim() ? [name.trim().slice(0, 80)] : []).slice(0, 8)
      : [];
    next.mesh = {
      present: mesh.present === true,
      thisComputer: typeof mesh.thisComputer === "string" ? mesh.thisComputer.trim().slice(0, 80) : "",
      computers,
      openTasks: Number.isFinite(mesh.openTasks) ? Math.max(0, Math.min(999, Math.floor(Number(mesh.openTasks)))) : 0,
    };
  }
  if (raw.decision === "approve" || raw.decision === "deny") next.decision = raw.decision;
  if (typeof raw.error === "string") next.error = raw.error.slice(0, 300);
  return next;
}

async function readRow(id: string): Promise<ConnectSnapshot | undefined> {
  const local = memory.get(id);
  if (local) {
    if (local.exp <= Date.now()) {
      memory.delete(id);
      return undefined;
    }
    return JSON.parse(local.body) as ConnectSnapshot;
  }
  try {
    const cache = await caches.open("granttap-connect");
    const hit = await cache.match(new Request(`https://granttap.com/__connect/${id}`));
    if (!hit) return undefined;
    return await hit.json() as ConnectSnapshot;
  } catch {
    return undefined;
  }
}

async function writeRow(id: string, row: ConnectSnapshot): Promise<void> {
  const body = JSON.stringify(row);
  memory.set(id, { body, exp: Date.now() + TTL_MS });
  try {
    const cache = await caches.open("granttap-connect");
    await cache.put(
      new Request(`https://granttap.com/__connect/${id}`),
      new Response(body, {
        headers: {
          "content-type": "application/json",
          "cache-control": `public, max-age=${Math.floor(TTL_MS / 1000)}`,
        },
      }),
    );
  } catch {
    // Vitest and local Node have no Cache API.
  }
}

export async function handleConnectApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] !== "api" || parts[1] !== "connect" || parts[2] !== "requests") return null;
  const id = parts[3] ?? "";
  if (!isRequestId(id)) return json(400, { error: "Invalid connection request." });
  const action = parts[4];

  if (request.method === "GET" && !action) {
    const row = await readRow(id);
    if (!row) return json(404, { error: "This connection request expired. Start again in your coding app." });
    return json(200, row);
  }

  if (request.method === "PUT" && !action) {
    const incoming = sanitizeSnapshot(await request.json().catch(() => null), await readRow(id));
    if (!incoming) return json(400, { error: "Invalid connection snapshot." });
    await writeRow(id, incoming);
    return json(200, { ok: true });
  }

  if (request.method === "POST" && action === "decision") {
    const current = await readRow(id);
    if (!current) return json(404, { error: "This connection request expired. Start again in your coding app." });
    const body = await request.json().catch(() => null) as { decision?: string } | null;
    if (body?.decision !== "approve" && body?.decision !== "deny") {
      return json(400, { error: "Choose Approve or Deny." });
    }
    if (!current.decision) current.decision = body.decision;
    await writeRow(id, current);
    return json(200, { ok: true, decision: current.decision });
  }

  if (request.method === "POST" && action === "redirect") {
    const current = await readRow(id);
    if (!current) return json(404, { error: "This connection request expired. Start again in your coding app." });
    const body = await request.json().catch(() => null) as { redirectUrl?: string } | null;
    if (!body?.redirectUrl || !isLoopbackRedirect(body.redirectUrl)) {
      return json(400, { error: "Redirect is not a coding-app callback." });
    }
    current.redirectUrl = body.redirectUrl;
    await writeRow(id, current);
    return json(200, { ok: true });
  }

  return json(405, { error: "Method not allowed." });
}
