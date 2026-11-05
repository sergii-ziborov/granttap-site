CREATE TABLE IF NOT EXISTS account_password_credentials (
  account_id TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  login TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS account_password_attempts (
  bucket TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS account_password_attempts_expiry ON account_password_attempts(expires_at);
