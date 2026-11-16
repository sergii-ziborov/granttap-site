CREATE TRIGGER IF NOT EXISTS account_beta_relay_trial_start
AFTER INSERT ON account_beta_relay_grants WHEN NEW.trial_started_at IS NULL
BEGIN
  UPDATE account_beta_relay_grants SET trial_started_at=CAST(strftime('%s','now') AS INTEGER)*1000
  WHERE account_id=NEW.account_id;
END;
CREATE TABLE IF NOT EXISTS testflight_trial_evidence (
  subject TEXT PRIMARY KEY CHECK(length(subject) BETWEEN 8 AND 80),
  started_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS account_sandbox_subscriptions (
  original_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  seat_limit INTEGER NOT NULL CHECK(seat_limit IN (2,5,10,15)),
  purchase_date INTEGER NOT NULL,
  signed_date INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0,
  is_trial INTEGER NOT NULL DEFAULT 0 CHECK(is_trial IN (0,1))
);
CREATE INDEX IF NOT EXISTS sandbox_subscription_account ON account_sandbox_subscriptions(account_id,purchase_date DESC,signed_date DESC);
