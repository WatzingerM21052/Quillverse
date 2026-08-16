-- §190-197: Recap needs a real-time "last visited" marker (§193 is explicitly
-- about the player's real absence, not in-game time); Player Notes (§194) and
-- Favorite Quotes (§196) are small player-authored lists that must survive a
-- ZIP export/import (§A36) same as everything else, so they live in D1 as
-- plain JSON columns rather than localStorage. Bookmarks (§195) reuse the
-- existing memories table (tags_json contains "bookmark") -- no new column.
ALTER TABLE simulations ADD COLUMN last_visited_at TEXT;
ALTER TABLE simulations ADD COLUMN player_notes_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE simulations ADD COLUMN favorite_quotes_json TEXT NOT NULL DEFAULT '[]';
