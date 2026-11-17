CREATE TABLE IF NOT EXISTS account_session_details (
  session_hash TEXT PRIMARY KEY REFERENCES sessions(token_hash) ON DELETE CASCADE,
  id TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  sign_in TEXT,
  delegated INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER,
  last_seen_at INTEGER
);
