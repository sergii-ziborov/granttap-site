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
-- A TestFlight build no longer reaches the relay without a subscription: the grants its app
-- transactions created go with them. Grants an operator issued without one stay.
DELETE FROM account_beta_relay_grants WHERE account_id IN (SELECT account_id FROM account_testflight_transactions);
DELETE FROM account_testflight_transactions;
