CREATE TABLE IF NOT EXISTS account_login_tokens (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  max_uses INTEGER NOT NULL CHECK(max_uses BETWEEN 1 AND 100),
  uses INTEGER NOT NULL DEFAULT 0,
  last_used_at INTEGER,
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS account_login_tokens_owner ON account_login_tokens(account_id, expires_at);
CREATE TABLE IF NOT EXISTS account_login_token_sessions (
  session_hash TEXT PRIMARY KEY REFERENCES sessions(token_hash) ON DELETE CASCADE,
  login_token_id TEXT REFERENCES account_login_tokens(id) ON DELETE SET NULL
);
