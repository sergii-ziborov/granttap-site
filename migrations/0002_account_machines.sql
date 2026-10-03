CREATE TABLE IF NOT EXISTS account_machines (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER,
  revoked_at INTEGER
);

CREATE TABLE IF NOT EXISTS recovery_requests (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  machine_id TEXT NOT NULL REFERENCES account_machines(id) ON DELETE CASCADE,
  phone_public_key TEXT NOT NULL,
  encrypted_offer TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS machine_account ON account_machines(account_id, revoked_at);
CREATE INDEX IF NOT EXISTS recovery_machine ON recovery_requests(machine_id, expires_at);
