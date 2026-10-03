import { SqliteD1 as DurableSqliteD1 } from "../../worker/account/sqlite";

export class SqliteD1 extends DurableSqliteD1 {
  constructor() { super(":memory:"); }
}
