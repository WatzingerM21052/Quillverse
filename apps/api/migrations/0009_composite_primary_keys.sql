-- Bug found while testing Branching Timelines (§154-155): every entity table
-- used a bare `id TEXT PRIMARY KEY`, which is globally unique across ALL
-- simulations. A fork needs to copy a snapshot's rows into a NEW
-- simulation_id while keeping the exact same entity ids (so internal
-- references stay consistent) — that collided immediately. Recreates every
-- affected table with PRIMARY KEY (id, simulation_id).
--
-- Not touched: relationships/reputation (already composite), turns/savepoints/
-- ai_calls (never copied into a fork, ids stay globally fresh), ai_provider_credentials
-- (user-scoped, unrelated).

PRAGMA foreign_keys=OFF;

CREATE TABLE characters_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  name TEXT NOT NULL,
  is_canon INTEGER NOT NULL DEFAULT 0,
  is_player INTEGER NOT NULL DEFAULT 0,
  location_id TEXT,
  appearance_json TEXT NOT NULL,
  visual_state_json TEXT NOT NULL,
  personality_json TEXT NOT NULL,
  goals_json TEXT NOT NULL,
  player_knowledge_json TEXT NOT NULL DEFAULT '[]',
  gm_state_json TEXT NOT NULL DEFAULT '{}',
  skills_json TEXT NOT NULL DEFAULT '{}',
  wardrobe_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO characters_new SELECT * FROM characters;
DROP TABLE characters;
ALTER TABLE characters_new RENAME TO characters;
CREATE INDEX idx_characters_simulation ON characters(simulation_id);

CREATE TABLE locations_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  discovered INTEGER NOT NULL DEFAULT 0,
  base_asset TEXT NOT NULL,
  map_x REAL NOT NULL,
  map_y REAL NOT NULL,
  travel_json TEXT,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO locations_new SELECT * FROM locations;
DROP TABLE locations;
ALTER TABLE locations_new RENAME TO locations;
CREATE INDEX idx_locations_simulation ON locations(simulation_id);

CREATE TABLE memories_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  entity_ids_json TEXT NOT NULL DEFAULT '[]',
  world_date TEXT NOT NULL,
  type TEXT NOT NULL,
  importance TEXT NOT NULL,
  fact TEXT NOT NULL,
  interpretation_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,
  reach TEXT NOT NULL,
  fading TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO memories_new SELECT * FROM memories;
DROP TABLE memories;
ALTER TABLE memories_new RENAME TO memories;
CREATE INDEX idx_memories_simulation ON memories(simulation_id);

CREATE TABLE letters_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  date_written TEXT NOT NULL,
  date_sent TEXT,
  date_arrived TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  known_by_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO letters_new SELECT * FROM letters;
DROP TABLE letters;
ALTER TABLE letters_new RENAME TO letters;
CREATE INDEX idx_letters_simulation ON letters(simulation_id);

CREATE TABLE canon_events_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  name TEXT NOT NULL,
  original_course TEXT NOT NULL,
  requirements_json TEXT NOT NULL DEFAULT '[]',
  window_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,
  player_influence TEXT NOT NULL,
  current_likely_variant TEXT NOT NULL,
  consequences_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO canon_events_new SELECT * FROM canon_events;
DROP TABLE canon_events;
ALTER TABLE canon_events_new RENAME TO canon_events;
CREATE INDEX idx_canon_events_simulation ON canon_events(simulation_id);

CREATE TABLE finance_transactions_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO finance_transactions_new SELECT * FROM finance_transactions;
DROP TABLE finance_transactions;
ALTER TABLE finance_transactions_new RENAME TO finance_transactions;
CREATE INDEX idx_finance_transactions_simulation ON finance_transactions(simulation_id);

CREATE TABLE world_events_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO world_events_new SELECT * FROM world_events;
DROP TABLE world_events;
ALTER TABLE world_events_new RENAME TO world_events;
CREATE INDEX idx_world_events_simulation ON world_events(simulation_id);

CREATE TABLE social_calendar_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  host TEXT NOT NULL,
  location TEXT NOT NULL,
  access TEXT NOT NULL,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO social_calendar_new SELECT * FROM social_calendar;
DROP TABLE social_calendar;
ALTER TABLE social_calendar_new RENAME TO social_calendar;
CREATE INDEX idx_social_calendar_simulation ON social_calendar(simulation_id);

CREATE TABLE chapters_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  start_date TEXT NOT NULL,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO chapters_new SELECT * FROM chapters;
DROP TABLE chapters;
ALTER TABLE chapters_new RENAME TO chapters;
CREATE INDEX idx_chapters_simulation ON chapters(simulation_id);

CREATE TABLE inventory_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO inventory_new SELECT * FROM inventory;
DROP TABLE inventory;
ALTER TABLE inventory_new RENAME TO inventory;
CREATE INDEX idx_inventory_simulation ON inventory(simulation_id);

CREATE TABLE whistledown_issues_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  issue_number INTEGER NOT NULL,
  date TEXT NOT NULL,
  headline TEXT NOT NULL,
  body_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO whistledown_issues_new SELECT * FROM whistledown_issues;
DROP TABLE whistledown_issues;
ALTER TABLE whistledown_issues_new RENAME TO whistledown_issues;
CREATE INDEX idx_whistledown_simulation ON whistledown_issues(simulation_id, issue_number);

CREATE TABLE influence_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  character_id TEXT NOT NULL,
  source TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO influence_new SELECT * FROM influence;
DROP TABLE influence;
ALTER TABLE influence_new RENAME TO influence;
CREATE INDEX idx_influence_simulation ON influence(simulation_id);

CREATE TABLE favors_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  person_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  description TEXT NOT NULL,
  publicly_known INTEGER NOT NULL DEFAULT 0,
  fulfilled INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO favors_new SELECT * FROM favors;
DROP TABLE favors;
ALTER TABLE favors_new RENAME TO favors;
CREATE INDEX idx_favors_simulation ON favors(simulation_id);

CREATE TABLE rumors_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  content TEXT NOT NULL,
  truth_status TEXT NOT NULL,
  reach TEXT NOT NULL,
  known_by_json TEXT NOT NULL DEFAULT '[]',
  origin_date TEXT NOT NULL,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO rumors_new SELECT * FROM rumors;
DROP TABLE rumors;
ALTER TABLE rumors_new RENAME TO rumors;
CREATE INDEX idx_rumors_simulation ON rumors(simulation_id);

CREATE TABLE secrets_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  description TEXT NOT NULL,
  truth TEXT NOT NULL,
  known_by_json TEXT NOT NULL DEFAULT '[]',
  suspected_by_json TEXT NOT NULL DEFAULT '[]',
  player_knows INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO secrets_new SELECT * FROM secrets;
DROP TABLE secrets;
ALTER TABLE secrets_new RENAME TO secrets;
CREATE INDEX idx_secrets_simulation ON secrets(simulation_id);

CREATE TABLE scandals_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  date TEXT NOT NULL,
  involved_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO scandals_new SELECT * FROM scandals;
DROP TABLE scandals;
ALTER TABLE scandals_new RENAME TO scandals;
CREATE INDEX idx_scandals_simulation ON scandals(simulation_id);

CREATE TABLE obligations_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  description TEXT NOT NULL,
  owed_to TEXT NOT NULL,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO obligations_new SELECT * FROM obligations;
DROP TABLE obligations;
ALTER TABLE obligations_new RENAME TO obligations;
CREATE INDEX idx_obligations_simulation ON obligations(simulation_id);

CREATE TABLE causality_log_new (
  id TEXT NOT NULL,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  event TEXT NOT NULL,
  cause TEXT NOT NULL,
  direct_consequences_json TEXT NOT NULL DEFAULT '[]',
  secondary_consequences_json TEXT NOT NULL DEFAULT '[]',
  long_term_consequences_json TEXT NOT NULL DEFAULT '[]',
  date TEXT NOT NULL,
  PRIMARY KEY (id, simulation_id)
);
INSERT INTO causality_log_new SELECT * FROM causality_log;
DROP TABLE causality_log;
ALTER TABLE causality_log_new RENAME TO causality_log;
CREATE INDEX idx_causality_log_simulation ON causality_log(simulation_id);

PRAGMA foreign_keys=ON;
