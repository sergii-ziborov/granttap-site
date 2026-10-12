CREATE TABLE IF NOT EXISTS account_subscriptions (
  original_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  seat_limit INTEGER NOT NULL CHECK(seat_limit IN (2,5,10,15)),
  purchase_date INTEGER NOT NULL,
  signed_date INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS subscription_account ON account_subscriptions(account_id,purchase_date DESC,signed_date DESC);
CREATE TABLE IF NOT EXISTS managed_computers (
  position INTEGER PRIMARY KEY AUTOINCREMENT,
  computer_id TEXT NOT NULL UNIQUE,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX IF NOT EXISTS managed_computer_account ON managed_computers(account_id,revoked_at,position);
