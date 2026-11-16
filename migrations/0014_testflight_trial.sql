ALTER TABLE account_beta_relay_grants ADD COLUMN trial_started_at INTEGER;
UPDATE account_beta_relay_grants SET trial_started_at=CAST(strftime('%s','now') AS INTEGER)*1000;
