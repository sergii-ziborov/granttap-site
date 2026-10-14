ALTER TABLE account_subscriptions ADD COLUMN is_trial INTEGER NOT NULL DEFAULT 0 CHECK(is_trial IN (0,1));
