CREATE TABLE IF NOT EXISTS account_testflight_transactions (
  app_transaction_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
