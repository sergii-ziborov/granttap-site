CREATE TABLE IF NOT EXISTS subscription_retention_grants (
  account_id TEXT PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  nonce TEXT NOT NULL,
  signed_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  signature TEXT,
  key_id TEXT,
  redeemed_at INTEGER,
  transaction_id TEXT
);
CREATE TABLE IF NOT EXISTS subscription_cancellation_feedback (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  feedback_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  encrypted_comment TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY(account_id,feedback_id)
);
CREATE INDEX IF NOT EXISTS subscription_feedback_expiry ON subscription_cancellation_feedback(created_at);
