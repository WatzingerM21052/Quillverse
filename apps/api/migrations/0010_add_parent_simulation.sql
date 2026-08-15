-- Timeline Tree (§155): which simulation a fork branched from. `simulations`
-- was deliberately not recreated by 0009 (still a bare `id TEXT PRIMARY KEY`),
-- so a plain ADD COLUMN is correct here, no table recreate needed.
ALTER TABLE simulations ADD COLUMN parent_simulation_id TEXT REFERENCES simulations(id);
