import { mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

/** The same prepared-statement surface used by D1, backed by durable SQLite on Hetzner. */
export class SqliteD1 {
  readonly sqlite: DatabaseSync;

  constructor(path: string) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.sqlite = new DatabaseSync(path);
    this.sqlite.exec("PRAGMA foreign_keys=ON");
    this.sqlite.exec("PRAGMA busy_timeout=5000");
    this.sqlite.exec(readFileSync(new URL("../../migrations/0001_accounts.sql", import.meta.url), "utf8"));
    this.sqlite.exec(readFileSync(new URL("../../migrations/0002_account_machines.sql", import.meta.url), "utf8"));
    this.sqlite.exec(readFileSync(new URL("../../migrations/0003_account_beta_relay.sql", import.meta.url), "utf8"));
    this.sqlite.exec(readFileSync(new URL("../../migrations/0004_account_device_invites.sql", import.meta.url), "utf8"));
    this.sqlite.exec(readFileSync(new URL("../../migrations/0005_managed_subscriptions.sql", import.meta.url), "utf8"));
    this.sqlite.exec(readFileSync(new URL("../../migrations/0007_testflight_access.sql", import.meta.url), "utf8"));
    this.sqlite.exec(readFileSync(new URL("../../migrations/0008_account_machine_endpoints.sql", import.meta.url), "utf8"));
    this.sqlite.exec(readFileSync(new URL("../../migrations/0010_subscription_retention.sql", import.meta.url), "utf8"));
    const columns = this.sqlite.prepare("PRAGMA table_info(account_subscriptions)").all();
    if (!columns.some(column => column.name === "is_trial")) {
      this.sqlite.exec(readFileSync(new URL("../../migrations/0006_subscription_trial.sql", import.meta.url), "utf8"));
    }
  }

  prepare(sql: string) {
    const query = this.sqlite.prepare(sql);
    return { bind: (...values: unknown[]) => ({
      run: async () => ({ meta: { changes: query.run(...values as []).changes } }),
      first: async <T>() => (query.get(...values as []) ?? null) as T | null,
      all: async <T>() => ({ results: query.all(...values as []) as T[] }),
      execute: () => query.run(...values as []),
    }) };
  }

  async batch(statements: Array<{ execute(): unknown }>) {
    this.sqlite.exec("BEGIN");
    try {
      const result = statements.map((statement) => statement.execute());
      this.sqlite.exec("COMMIT");
      return result;
    } catch (error) {
      this.sqlite.exec("ROLLBACK");
      throw error;
    }
  }
}
