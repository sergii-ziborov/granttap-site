import type { D1Database } from "@cloudflare/workers-types";
import { boundedJSON, json, UUID } from "../account/http";

const KINDS = new Set(["event-loop-stall", "event-loop-recovered"]);
const ACTIONS = new Set(["restart", "held", "none"]);
const FIELDS = ["action", "arch", "at", "id", "kind", "node", "platform", "restartsInWindow", "stalledMs", "version"];
const NAME = /^[0-9A-Za-z][0-9A-Za-z.+_-]{0,39}$/;
const MAX_STALL_MS = 30 * 86_400_000;
const CLOCK_SKEW_MS = 86_400_000;
export const RETENTION_MS = 90 * 86_400_000;
export const ROW_LIMIT = 10_000;

type FaultDatabase = Pick<D1Database, "prepare">;
type RuntimeFault = { id: string; kind: string; at: number; stalledMs: number; action: string;
  restartsInWindow: number; version: string; node: string; platform: string; arch: string };

const whole = (value: unknown, maximum: number): value is number =>
  Number.isSafeInteger(value) && (value as number) >= 0 && (value as number) <= maximum;
const named = (value: unknown): value is string => typeof value === "string" && NAME.test(value);

/** Anything beyond the agreed fields is refused, so a report cannot start carrying more. */
function parseFault(value: Record<string, unknown>, now: number): RuntimeFault | null {
  if (Object.keys(value).sort().join() !== FIELDS.join()) return null;
  const { id, kind, at, stalledMs, action, restartsInWindow, version, node, platform, arch } = value;
  if (typeof id !== "string" || !UUID.test(id) || typeof kind !== "string" || !KINDS.has(kind)
    || typeof action !== "string" || !ACTIONS.has(action) || !whole(at, now + CLOCK_SKEW_MS)
    || !whole(stalledMs, MAX_STALL_MS) || !whole(restartsInWindow, 100)
    || !named(version) || !named(node) || !named(platform) || !named(arch)) return null;
  return { id, kind, at, stalledMs, action, restartsInWindow, version, node, platform, arch };
}

/** Anonymous fault reports from the MCP watchdog. No account, address or computer is stored. */
export async function handleRuntimeFaultsApi(request: Request, db: FaultDatabase, now = Date.now()): Promise<Response | null> {
  if (new URL(request.url).pathname !== "/api/runtime-faults") return null;
  if (request.method !== "POST") return json(405, { error: "Method not allowed." }, { allow: "POST" });
  const body = await boundedJSON(request);
  const fault = body && parseFault(body, now);
  if (!fault) return json(400, { error: "Invalid fault report." });
  await db.prepare(`INSERT OR IGNORE INTO runtime_faults
    (id,kind,at,stalled_ms,action,restarts_in_window,version,node,platform,arch,received_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(fault.id, fault.kind, fault.at, fault.stalledMs, fault.action,
    fault.restartsInWindow, fault.version, fault.node, fault.platform, fault.arch, now).run();
  await db.prepare(`DELETE FROM runtime_faults WHERE received_at < ? OR id IN
    (SELECT id FROM runtime_faults ORDER BY received_at DESC, id LIMIT -1 OFFSET ?)`)
    .bind(now - RETENTION_MS, ROW_LIMIT).run();
  return new Response(null, { status: 204 });
}
