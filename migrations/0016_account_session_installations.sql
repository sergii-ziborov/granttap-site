CREATE TABLE IF NOT EXISTS account_session_installations (
  session_hash TEXT PRIMARY KEY REFERENCES sessions(token_hash) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  installation_hash TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS account_session_installations_owner
  ON account_session_installations(account_id, installation_hash);
