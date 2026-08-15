-- Player Profile (ui-master-prompt-v1.md §69-72) — skills, wardrobe, inventory.
ALTER TABLE characters ADD COLUMN skills_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE characters ADD COLUMN wardrobe_json TEXT NOT NULL DEFAULT '[]';

CREATE TABLE inventory (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE INDEX idx_inventory_simulation ON inventory(simulation_id);
