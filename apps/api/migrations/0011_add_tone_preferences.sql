-- Character Creator (§131, §174 Simulation Settings): player-requested tone
-- preferences (romance/intrigue/economy depth, historical accuracy, pace),
-- threaded into every future turn's context so they actually affect
-- generation, not just captured at creation and forgotten. Plain ALTER
-- TABLE -- `simulations` was deliberately not recreated by 0009, still a
-- bare `id TEXT PRIMARY KEY`.
ALTER TABLE simulations ADD COLUMN tone_preferences_json TEXT NOT NULL DEFAULT '{}';
