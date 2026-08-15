-- Mirrors apps/web/src/app/core/state/models/*.ts exactly. One row per
-- simulation for 1:1 nested objects (farm, world status); child tables for
-- everything that repeats (characters, relationships, memories, ...).

CREATE TABLE simulations (
  id TEXT PRIMARY KEY,
  world_pack_id TEXT NOT NULL,
  state_version INTEGER NOT NULL DEFAULT 1,
  current_world_date TEXT NOT NULL,
  current_season TEXT NOT NULL,
  player_id TEXT NOT NULL,
  social_access_level INTEGER NOT NULL DEFAULT 0,
  world_status_json TEXT NOT NULL,
  farm_json TEXT NOT NULL,
  finance_ledger_json TEXT NOT NULL DEFAULT '[]',
  open_threads_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE characters (
  id TEXT PRIMARY KEY,
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
  gm_state_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_characters_simulation ON characters(simulation_id);

CREATE TABLE relationships (
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  from_id TEXT NOT NULL,
  to_id TEXT NOT NULL,
  type TEXT NOT NULL,
  dimensions_json TEXT NOT NULL,
  momentum TEXT NOT NULL,
  attention TEXT NOT NULL,
  last_contact TEXT,
  public_stance TEXT NOT NULL,
  private_stance TEXT NOT NULL,
  inner_thoughts_json TEXT NOT NULL DEFAULT '[]',
  self_interpretation TEXT,
  denial TEXT,
  misconceptions_json TEXT NOT NULL DEFAULT '[]',
  personal_boundaries_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (simulation_id, from_id, to_id)
);

CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  discovered INTEGER NOT NULL DEFAULT 0,
  base_asset TEXT NOT NULL,
  map_x REAL NOT NULL,
  map_y REAL NOT NULL,
  travel_json TEXT
);

CREATE INDEX idx_locations_simulation ON locations(simulation_id);

CREATE TABLE memories (
  id TEXT PRIMARY KEY,
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
  tags_json TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_memories_simulation ON memories(simulation_id);

CREATE TABLE letters (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  sender_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  date_written TEXT NOT NULL,
  date_sent TEXT,
  date_arrived TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL,
  known_by_json TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_letters_simulation ON letters(simulation_id);

CREATE TABLE canon_events (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  name TEXT NOT NULL,
  original_course TEXT NOT NULL,
  requirements_json TEXT NOT NULL DEFAULT '[]',
  window_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,
  player_influence TEXT NOT NULL,
  current_likely_variant TEXT NOT NULL,
  consequences_json TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_canon_events_simulation ON canon_events(simulation_id);

CREATE TABLE finance_transactions (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL
);

CREATE INDEX idx_finance_transactions_simulation ON finance_transactions(simulation_id);

CREATE TABLE world_events (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL
);

CREATE INDEX idx_world_events_simulation ON world_events(simulation_id);

CREATE TABLE social_calendar (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  host TEXT NOT NULL,
  location TEXT NOT NULL,
  access TEXT NOT NULL
);

CREATE INDEX idx_social_calendar_simulation ON social_calendar(simulation_id);

CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  start_date TEXT NOT NULL
);

CREATE INDEX idx_chapters_simulation ON chapters(simulation_id);

-- Event Sourcing (ui-master-prompt-v1.md §87-93): one immutable row per turn.
CREATE TABLE turns (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  turn_number INTEGER NOT NULL,
  state_version_before INTEGER NOT NULL,
  state_version_after INTEGER NOT NULL,
  world_time_before TEXT NOT NULL,
  world_time_after TEXT NOT NULL,
  player_input TEXT NOT NULL,
  provider TEXT,
  model TEXT,
  scene_output_json TEXT,
  state_patch_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_turns_simulation ON turns(simulation_id, turn_number);

-- BYOK credential store (addendum-v1.2-byok.md B9-B19). Single-owner install
-- (B23): user_id is a fixed constant until real accounts exist.
CREATE TABLE ai_provider_credentials (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  encrypted_api_key TEXT NOT NULL,
  encryption_iv TEXT NOT NULL,
  encryption_version INTEGER NOT NULL DEFAULT 1,
  key_hint TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_verified_at TEXT,
  status TEXT NOT NULL DEFAULT 'connected',
  UNIQUE (user_id, provider)
);

-- Usage/audit log (B45-B46). Never stores keys, only call metadata.
CREATE TABLE ai_calls (
  id TEXT PRIMARY KEY,
  simulation_id TEXT,
  provider TEXT NOT NULL,
  model TEXT,
  turn INTEGER,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  duration_ms INTEGER,
  success INTEGER NOT NULL,
  error_type TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER
);

CREATE INDEX idx_ai_calls_simulation ON ai_calls(simulation_id);
