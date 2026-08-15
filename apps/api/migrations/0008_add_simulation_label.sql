-- Branching Timelines (§154-155) need a human name to tell timelines apart
-- in a "Save Selection" list (§124 Timeline Identity).
ALTER TABLE simulations ADD COLUMN label TEXT NOT NULL DEFAULT 'Timeline';

UPDATE simulations SET label = 'The Farmer' WHERE id = 'sim_default';
