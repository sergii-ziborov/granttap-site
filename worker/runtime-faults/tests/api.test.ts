// @vitest-environment node
import { expect, test } from "vitest";
import { SqliteD1 } from "../../../tests/coverage/account-sqlite";
import { handleRuntimeFaultsApi, RETENTION_MS, ROW_LIMIT } from "../index";

const now = 1_800_000_000_000;
const id = "11111111-1111-4111-8111-111111111111";
const report = { id, kind: "event-loop-stall", at: now - 1_000, stalledMs: 125_000, action: "restart",
  restartsInWindow: 1, version: "0.8.135", node: "22.13.1", platform: "darwin", arch: "arm64" };
const post = (body: unknown, type = "application/json") => new Request("https://granttap.com/api/runtime-faults", {
  method: "POST", headers: { "content-type": type }, body: JSON.stringify(body) });
const database = () => new SqliteD1();
const rows = (db: SqliteD1) => db.sqlite.prepare("SELECT * FROM runtime_faults ORDER BY received_at").all() as Array<Record<string, unknown>>;

test("a valid report is stored without anything that identifies the computer", async () => {
  const db = database();
  expect((await handleRuntimeFaultsApi(post(report), db as never, now))?.status).toBe(204);
  expect(rows(db)).toEqual([{ id, kind: "event-loop-stall", at: now - 1_000, stalled_ms: 125_000, action: "restart",
    restarts_in_window: 1, version: "0.8.135", node: "22.13.1", platform: "darwin", arch: "arm64", received_at: now }]);
});

test("sending a report again keeps one row", async () => {
  const db = database();
  await handleRuntimeFaultsApi(post(report), db as never, now);
  expect((await handleRuntimeFaultsApi(post(report), db as never, now + 5))?.status).toBe(204);
  expect(rows(db)).toHaveLength(1);
});

test("only this path and method are handled", async () => {
  const db = database();
  expect(await handleRuntimeFaultsApi(new Request("https://granttap.com/other"), db as never, now)).toBeNull();
  const read = await handleRuntimeFaultsApi(new Request("https://granttap.com/api/runtime-faults"), db as never, now);
  expect(read?.status).toBe(405);
  expect(read?.headers.get("allow")).toBe("POST");
});

test.each([
  ["an extra field", { ...report, computerName: "Mac" }],
  ["a missing field", { ...report, version: undefined }],
  ["an invalid id", { ...report, id: "nope" }],
  ["an unknown kind", { ...report, kind: "prompt" }],
  ["an unknown action", { ...report, action: "reboot" }],
  ["a time from the future", { ...report, at: now + 2 * 86_400_000 }],
  ["a negative duration", { ...report, stalledMs: -1 }],
  ["a duration too long", { ...report, stalledMs: 31 * 86_400_000 }],
  ["a fractional count", { ...report, restartsInWindow: 1.5 }],
  ["a count too high", { ...report, restartsInWindow: 101 }],
  ["a path in a text field", { ...report, version: "/Users/someone" }],
  ["text with spaces", { ...report, platform: "my computer" }],
  ["a non-string name", { ...report, arch: 64 }],
])("%s is refused", async (_name, body) => {
  const db = database();
  expect((await handleRuntimeFaultsApi(post(body), db as never, now))?.status).toBe(400);
  expect(rows(db)).toHaveLength(0);
});

test("a body that is not JSON is refused", async () => {
  expect((await handleRuntimeFaultsApi(post(report, "text/plain"), database() as never, now))?.status).toBe(400);
});

test("old reports leave, and the table cannot grow without limit", async () => {
  const db = database();
  const insert = db.sqlite.prepare(`INSERT INTO runtime_faults
    (id,kind,at,stalled_ms,action,restarts_in_window,version,node,platform,arch,received_at)
    VALUES (?,'event-loop-stall',1,1,'held',0,'1','1','darwin','arm64',?)`);
  insert.run("expired", now - RETENTION_MS - 1);
  db.sqlite.exec("BEGIN");
  for (let index = 0; index < ROW_LIMIT; index += 1) insert.run(`row-${index}`, now - RETENTION_MS + 1 + index);
  db.sqlite.exec("COMMIT");
  await handleRuntimeFaultsApi(post(report), db as never, now);
  const count = db.sqlite.prepare("SELECT COUNT(*) AS n FROM runtime_faults").get() as { n: number };
  expect(count.n).toBe(ROW_LIMIT);
  expect(db.sqlite.prepare("SELECT 1 FROM runtime_faults WHERE id='expired' OR id='row-0'").get()).toBeUndefined();
  expect(db.sqlite.prepare("SELECT 1 FROM runtime_faults WHERE id=?").get(id)).toBeDefined();
});
