import { mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

/** The same prepared-statement surface used by D1, backed by durable SQLite on Hetzner. */
export class SqliteD1 {
  readonly sqlite: DatabaseSync;

  constructor(path: string, migrationsRoot = new URL("../../migrations/", import.meta.url)) {
    if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
    this.sqlite = new DatabaseSync(path);
    this.sqlite.exec("PRAGMA foreign_keys=ON");
    this.sqlite.exec("PRAGMA busy_timeout=5000");
    this.sqlite.exec(readFileSync(new URL("0001_accounts.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0002_account_machines.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0003_account_beta_relay.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0004_account_device_invites.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0005_managed_subscriptions.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0007_testflight_access.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0008_account_machine_endpoints.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0010_subscription_retention.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0011_account_login_tokens.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0012_runtime_faults.sql", migrationsRoot), "utf8"));
    this.sqlite.exec(readFileSync(new URL("0013_account_passwords.sql", migrationsRoot), "utf8"));
    const columns = this.sqlite.prepare("PRAGMA table_info(account_subscriptions)").all();
    if (!columns.some(column => column.name === "is_trial")) {
      this.sqlite.exec(readFileSync(new URL("0006_subscription_trial.sql", migrationsRoot), "utf8"));
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
