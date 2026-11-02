CREATE TABLE IF NOT EXISTS runtime_faults (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  at INTEGER NOT NULL,
  stalled_ms INTEGER NOT NULL,
  action TEXT NOT NULL,
  restarts_in_window INTEGER NOT NULL,
  version TEXT NOT NULL,
  node TEXT NOT NULL,
  platform TEXT NOT NULL,
  arch TEXT NOT NULL,
  received_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS runtime_faults_received ON runtime_faults(received_at);
