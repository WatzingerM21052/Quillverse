-- Lady Whistledown (ui-master-prompt-v1.md §55-58) — a real society newspaper,
-- not a generic event feed. A farmer nobody knows yet gets no mention (§58/§66).
CREATE TABLE whistledown_issues (
  id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulations(id),
  issue_number INTEGER NOT NULL,
  date TEXT NOT NULL,
  headline TEXT NOT NULL,
  body_json TEXT NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_whistledown_simulation ON whistledown_issues(simulation_id, issue_number);

INSERT INTO whistledown_issues (id, simulation_id, issue_number, date, headline, body_json) VALUES (
  'whistledown_1',
  'sim_default',
  1,
  '10. April 1813',
  'Die Saison ist eröffnet',
  '["Dieser Autorin ist zu Ohren gekommen, dass die ersten Kutschen bereits Richtung London aufgebrochen sind — beladen mit hoffnungsvollen jungen Damen und ihren nicht minder hoffnungsvollen Müttern.","Wer in dieser Saison die Herzen — und, seien wir ehrlich, liebe Leserschaft, die Vermögen — erobern wird, bleibt abzuwarten. Diese Autorin wird, wie stets, ein wachsames Auge behalten."]'
);
