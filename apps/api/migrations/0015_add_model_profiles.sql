-- §106 Continuity Guard / §160 Model Profiles (minimal slice — only the
-- "continuity" profile is ever read or written; shape is generic so
-- "fast"/"narrative" rows could be added later with no new migration).
CREATE TABLE model_profiles (
  user_id TEXT NOT NULL,
  profile TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_id TEXT,
  PRIMARY KEY (user_id, profile)
);
