CREATE TABLE IF NOT EXISTS account_machine_endpoints (
  machine_id TEXT PRIMARY KEY REFERENCES account_machines(id) ON DELETE CASCADE,
  room TEXT NOT NULL CHECK(length(room) BETWEEN 8 AND 128),
  public_key TEXT NOT NULL CHECK(length(public_key)=44),
  updated_at INTEGER NOT NULL
);
