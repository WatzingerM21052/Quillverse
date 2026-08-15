-- Named full-state snapshots (ui-master-prompt-v1.md §94-96, §153-155).
CREATE TABLE savepoints (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  label TEXT NOT NULL,
  state_version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_savepoints_simulation ON savepoints(simulation_id, created_at);
