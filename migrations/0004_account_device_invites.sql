CREATE TABLE IF NOT EXISTS account_device_invites (
  code_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS account_device_invites_expiry ON account_device_invites(expires_at);
