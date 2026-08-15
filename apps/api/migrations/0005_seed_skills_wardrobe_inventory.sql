-- Backfills skills/wardrobe for the character rows seeded in 0002, and adds
-- the player's starting inventory. Kept separate from 0002 since that
-- migration already ran against remote before skills/wardrobe/inventory existed.

UPDATE characters
SET skills_json = '{"Landwirtschaft":"sehr gut","Reiten":"gut","Lesen":"mittel","Schreiben":"mittel","Etikette":"gering","Tanzen":"keine Erfahrung","Geschäftssinn":"mittel"}',
    wardrobe_json = '[{"id":"wardrobe_work_shirt","name":"Arbeitshemd","note":"für den Alltag geeignet, für gesellschaftliche Anlässe unpassend"},{"id":"wardrobe_sunday_coat","name":"Sonntagsmantel","note":"einfach, aber ordentlich — für die Kirche und kleinere Anlässe ausreichend"}]'
WHERE id = 'char_player_matthias';

INSERT INTO inventory (id, simulation_id, owner_id, name, description) VALUES
  ('inv_pocket_watch', 'sim_default', 'char_player_matthias', 'Taschenuhr des Vaters', 'Eine einfache, aber gut erhaltene Taschenuhr — eines der wenigen Dinge, die von seinem Vater geblieben sind.'),
  ('inv_old_book', 'sim_default', 'char_player_matthias', 'Altes Buch', 'Ein abgegriffenes Buch, an dem Matthias das Lesen geübt hat.');
