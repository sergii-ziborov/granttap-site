CREATE TABLE IF NOT EXISTS account_qr_requests (
  id TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL UNIQUE,
  secret_hash TEXT NOT NULL UNIQUE,
  browser_key TEXT NOT NULL CHECK(length(browser_key)=43),
  purpose TEXT NOT NULL CHECK(purpose IN ('sign-in','key')),
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  requester_session TEXT,
  browser_name TEXT NOT NULL,
  browser_os TEXT NOT NULL,
  network_hash TEXT,
  status TEXT NOT NULL CHECK(status IN ('waiting','scanned','approved','denied','used')),
  claimed_by TEXT,
  sealed_key TEXT,
  key_digest TEXT,
  session_hash TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  deposit_until INTEGER
);
CREATE INDEX IF NOT EXISTS account_qr_requests_expiry ON account_qr_requests(expires_at);

CREATE TABLE IF NOT EXISTS account_web_keys (
  account_id TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  encrypted_bundle TEXT NOT NULL,
  computers TEXT NOT NULL,
  stored_from TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS account_web_key_revocations (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,
  revoked_at INTEGER NOT NULL,
  PRIMARY KEY(account_id, public_key)
);
