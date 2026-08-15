-- The society/knowledge systems from simulation-master-prompt-v3.md that had
-- no home yet: Reputation (§56), Influence (§57), Favors (§58), Rumors
-- (§60-64), Secrets (§61), Scandals (§65), Obligations (§123), Causality Log
-- (§121). Character-scoped tables default to the player but allow any character.

CREATE TABLE reputation (
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  character_id TEXT NOT NULL,
  scope TEXT NOT NULL,
  standing TEXT NOT NULL,
  PRIMARY KEY (simulation_id, character_id, scope)
);

CREATE TABLE influence (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  character_id TEXT NOT NULL,
  source TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE INDEX idx_influence_simulation ON influence(simulation_id);

CREATE TABLE favors (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  person_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  description TEXT NOT NULL,
  publicly_known INTEGER NOT NULL DEFAULT 0,
  fulfilled INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_favors_simulation ON favors(simulation_id);

CREATE TABLE rumors (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  content TEXT NOT NULL,
  truth_status TEXT NOT NULL,
  reach TEXT NOT NULL,
  known_by_json TEXT NOT NULL DEFAULT '[]',
  origin_date TEXT NOT NULL
);

CREATE INDEX idx_rumors_simulation ON rumors(simulation_id);

-- GM-only by nature (§61): never rendered to the player outside GM Mode.
CREATE TABLE secrets (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  description TEXT NOT NULL,
  truth TEXT NOT NULL,
  known_by_json TEXT NOT NULL DEFAULT '[]',
  suspected_by_json TEXT NOT NULL DEFAULT '[]',
  player_knows INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_secrets_simulation ON secrets(simulation_id);

CREATE TABLE scandals (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  date TEXT NOT NULL,
  involved_json TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_scandals_simulation ON scandals(simulation_id);

-- Structured, unlike the free-text open_threads_json on simulations.
CREATE TABLE obligations (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  description TEXT NOT NULL,
  owed_to TEXT NOT NULL,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'open'
);

CREATE INDEX idx_obligations_simulation ON obligations(simulation_id);

CREATE TABLE causality_log (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  event TEXT NOT NULL,
  cause TEXT NOT NULL,
  direct_consequences_json TEXT NOT NULL DEFAULT '[]',
  secondary_consequences_json TEXT NOT NULL DEFAULT '[]',
  long_term_consequences_json TEXT NOT NULL DEFAULT '[]',
  date TEXT NOT NULL
);

CREATE INDEX idx_causality_log_simulation ON causality_log(simulation_id);

-- Seed data so the new systems aren't empty everywhere.
INSERT INTO reputation (simulation_id, character_id, scope, standing) VALUES
  ('sim_default', 'char_player_matthias', 'local', 'angesehen als verlässlicher, fleißiger Pächtersohn'),
  ('sim_default', 'char_player_matthias', 'regional', 'praktisch unbekannt'),
  ('sim_default', 'char_player_matthias', 'ton', 'unbekannt');

INSERT INTO obligations (id, simulation_id, description, owed_to, deadline, status) VALUES
  ('obl_1', 'sim_default', 'Die Pacht für das nächste Quartal begleichen', 'Grundherr', 'Ende Juni 1813', 'open');
