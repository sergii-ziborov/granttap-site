import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

export class SqliteD1 {
  readonly sqlite = new DatabaseSync(":memory:");

  constructor() {
    this.sqlite.exec(readFileSync(new URL("../../migrations/0001_accounts.sql", import.meta.url), "utf8"));
  }

  prepare(sql: string) {
    const query = this.sqlite.prepare(sql);
    return { bind: (...values: unknown[]) => ({
      run: async () => ({ meta: { changes: query.run(...values as []).changes } }),
      first: async <T>() => (query.get(...values as []) ?? null) as T | null,
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
