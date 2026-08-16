// Generates migrations/0002_seed_default_simulation.sql from the exact same
// data as apps/web/src/app/core/state/seed/seed-state.ts, so the backend's
// initial data matches the frontend's mock 1:1 (both derived from
// docs/spec/simulation-master-prompt-v3.md §131/§132).
//
// Run: node scripts/generate-seed.mjs > migrations/0002_seed_default_simulation.sql

function sql(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return sql(JSON.stringify(value));
}

function zeroDimensions() {
  return {
    acquaintance: 0,
    liking: 0,
    trust: 0,
    respect: 0,
    familiarity: 0,
    sharedHumor: 0,
    emotionalCloseness: 0,
    intellectualConnection: 0,
    physicalAttraction: 0,
    aestheticAttraction: 0,
    romanticCuriosity: 0,
    romanticInterest: 0,
    romanticFeelings: 0,
    romanticTension: 0,
    sexualTension: 0,
    desireForCloseness: 0,
    loyalty: 0,
    protectiveness: 0,
    socialAcceptance: 0,
    willingnessToMarry: 0,
    distrust: 0,
    insecurity: 0,
    hurt: 0,
    anger: 0,
    jealousy: 0,
    rivalry: 0,
    fear: 0,
    dependency: 0,
  };
}

const SIM_ID = 'sim_default';
const PLAYER_ID = 'char_player_matthias';
const MOTHER_ID = 'char_anne_hale';
const SISTER_ID = 'char_grace_hale';
const UNCLE_ID = 'char_thomas_hale';
const FARM_LOC_ID = 'loc_player_farm';

const characters = [
  {
    id: PLAYER_ID,
    name: 'Matthias Hale',
    isCanon: false,
    isPlayer: true,
    locationId: FARM_LOC_ID,
    appearance: {
      height: 'mittelgroß',
      build: 'drahtig-kräftig von der Feldarbeit',
      face: 'markant, wettergegerbt',
      hair: 'dunkelblond',
      eyes: 'graugrün',
      voice: 'ruhig, tief',
      posture: 'aufrecht, aber unauffällig',
      typicalExpression: 'zurückhaltend beobachtend',
      hands: 'schwielig, kräftig',
      grooming: 'einfach, aber gepflegt',
      clothing: 'schlichte Arbeitskleidung eines Pächtersohns',
      distinguishingFeatures: 'kleine Narbe am linken Handrücken',
      generalPresence: 'unaufdringlich, aber bemerkbar ruhig',
    },
    visualState: {
      characterId: PLAYER_ID,
      basePortrait: 'asset://character/matthias/base',
      currentOutfit: 'work_shirt',
      currentHairState: 'neutral',
      currentAge: '22',
      currentCondition: 'healthy',
      availableExpressions: ['neutral'],
    },
    personality: { traits: ['zurückhaltend', 'beobachtend', 'trockener Humor', 'verlässlich', 'stur'] },
    goals: {
      shortTerm: ['die Ernte sichern'],
      midTerm: ['der Familie ein sichereres Auskommen verschaffen'],
      longTerm: [],
      currentWorries: ['knappe Pacht'],
      currentObligations: [],
      currentPriorities: ['Hof', 'Familie'],
      plannedActions: [],
      currentlyImportantPeople: [MOTHER_ID, SISTER_ID],
    },
    playerKnowledge: [],
    gmState: {},
    skills: {
      Landwirtschaft: 'sehr gut',
      Reiten: 'gut',
      Lesen: 'mittel',
      Schreiben: 'mittel',
      Etikette: 'gering',
      Tanzen: 'keine Erfahrung',
      Geschäftssinn: 'mittel',
    },
    wardrobe: [
      { id: 'wardrobe_work_shirt', name: 'Arbeitshemd', note: 'für den Alltag geeignet, für gesellschaftliche Anlässe unpassend' },
      { id: 'wardrobe_sunday_coat', name: 'Sonntagsmantel', note: 'einfach, aber ordentlich — für die Kirche und kleinere Anlässe ausreichend' },
    ],
  },
  {
    id: MOTHER_ID,
    name: 'Anne Hale',
    isCanon: false,
    isPlayer: false,
    locationId: FARM_LOC_ID,
    appearance: {
      height: 'mittelgroß',
      build: 'schlank, von harter Arbeit gezeichnet',
      face: 'freundlich, müde Augen',
      hair: 'graumeliert, zurückgebunden',
      eyes: 'graugrün wie Matthias',
      voice: 'warm, bestimmt',
      posture: 'leicht gebeugt',
      typicalExpression: 'sorgenvoll-liebevoll',
      hands: 'rau von Hausarbeit',
      grooming: 'einfach, ordentlich',
      clothing: 'schlichtes Kleid, geflickt aber sauber',
      distinguishingFeatures: '—',
      generalPresence: 'das ruhige Zentrum des Haushalts',
    },
    visualState: {
      characterId: MOTHER_ID,
      basePortrait: 'asset://character/anne/base',
      currentOutfit: 'everyday_dress',
      currentHairState: 'neutral',
      currentAge: '47',
      currentCondition: 'healthy',
      availableExpressions: ['neutral'],
    },
    personality: { traits: ['fürsorglich', 'praktisch', 'zäh'] },
    goals: {
      shortTerm: ['den Haushalt durch den Winter bringen'],
      midTerm: [],
      longTerm: ['Grace gut verheiratet oder versorgt wissen'],
      currentWorries: ['Matthias arbeitet zu viel'],
      currentObligations: [],
      currentPriorities: ['Familie'],
      plannedActions: [],
      currentlyImportantPeople: [PLAYER_ID, SISTER_ID],
    },
    playerKnowledge: [],
    gmState: {},
  },
  {
    id: SISTER_ID,
    name: 'Grace Hale',
    isCanon: false,
    isPlayer: false,
    locationId: FARM_LOC_ID,
    appearance: {
      height: 'klein',
      build: 'schmal, noch jugendlich',
      face: 'lebhaft',
      hair: 'dunkelblond wie ihr Bruder',
      eyes: 'graugrün',
      voice: 'hell, schnell',
      posture: 'quirlig',
      typicalExpression: 'neugierig',
      hands: '—',
      grooming: 'einfach',
      clothing: 'einfaches Kleid',
      distinguishingFeatures: '—',
      generalPresence: 'bringt Leben ins Haus',
    },
    visualState: {
      characterId: SISTER_ID,
      basePortrait: 'asset://character/grace/base',
      currentOutfit: 'everyday_dress',
      currentHairState: 'neutral',
      currentAge: '16',
      currentCondition: 'healthy',
      availableExpressions: ['neutral'],
    },
    personality: { traits: ['neugierig', 'lebhaft', 'ungeduldig'] },
    goals: {
      shortTerm: ['mehr von der Welt jenseits des Hofes sehen'],
      midTerm: [],
      longTerm: [],
      currentWorries: [],
      currentObligations: ['Mutter im Haushalt helfen'],
      currentPriorities: [],
      plannedActions: [],
      currentlyImportantPeople: [PLAYER_ID, MOTHER_ID],
    },
    playerKnowledge: [],
    gmState: {},
  },
  {
    id: UNCLE_ID,
    name: 'Thomas Hale',
    isCanon: false,
    isPlayer: false,
    locationId: null,
    appearance: {
      height: 'groß',
      build: 'kräftig',
      face: "wettergegerbt, Bruder von Matthias' verstorbenem Vater",
      hair: 'ergraut',
      eyes: 'braun',
      voice: 'laut, herzlich',
      posture: 'aufrecht',
      typicalExpression: 'joviale Zurückhaltung',
      hands: 'schwielig',
      grooming: 'einfach',
      clothing: 'Händlerkleidung',
      distinguishingFeatures: '—',
      generalPresence: 'entfernt, aber verlässlich',
    },
    visualState: {
      characterId: UNCLE_ID,
      basePortrait: 'asset://character/thomas/base',
      currentOutfit: 'travel_coat',
      currentHairState: 'neutral',
      currentAge: '51',
      currentCondition: 'healthy',
      availableExpressions: ['neutral'],
    },
    personality: { traits: ['herzlich', 'geschäftstüchtig'] },
    goals: {
      shortTerm: [],
      midTerm: [],
      longTerm: [],
      currentWorries: [],
      currentObligations: [],
      currentPriorities: [],
      plannedActions: [],
      currentlyImportantPeople: [PLAYER_ID],
    },
    playerKnowledge: ['Bruder des verstorbenen Vaters', 'Kornhändler in Bristol'],
    gmState: {},
  },
];

const relationships = [
  {
    from: PLAYER_ID,
    to: MOTHER_ID,
    type: 'Mutter',
    dimensions: { ...zeroDimensions(), acquaintance: 100, liking: 85, trust: 90, respect: 85, familiarity: 95, loyalty: 95, protectiveness: 80 },
    momentum: 'stable',
    attention: 'high',
    publicStance: 'respektvoller Sohn',
    privateStance: 'liebevoll, beschützend',
  },
  {
    from: PLAYER_ID,
    to: SISTER_ID,
    type: 'Schwester',
    dimensions: { ...zeroDimensions(), acquaintance: 100, liking: 80, trust: 75, respect: 60, familiarity: 90, sharedHumor: 55, loyalty: 90, protectiveness: 85 },
    momentum: 'stable',
    attention: 'medium',
    publicStance: 'beschützender großer Bruder',
    privateStance: 'liebevoll genervt',
  },
  {
    from: PLAYER_ID,
    to: UNCLE_ID,
    type: 'Onkel',
    dimensions: { ...zeroDimensions(), acquaintance: 70, liking: 65, trust: 60, respect: 65, familiarity: 40, loyalty: 55, protectiveness: 20 },
    momentum: 'slightly-positive',
    attention: 'low',
    lastContact: '9. April 1813',
    publicStance: 'dankbarer Neffe',
    privateStance: 'distanziert, aber respektvoll',
  },
];

const locations = [
  { id: FARM_LOC_ID, name: 'Der Hale-Hof', type: 'farm', discovered: true, baseAsset: 'asset://location/player_farm/base', x: 22, y: 78, travel: null },
  {
    id: 'loc_village_market',
    name: 'Dorfmarkt',
    type: 'market',
    discovered: true,
    baseAsset: 'asset://location/village_market/base',
    x: 34,
    y: 62,
    travel: { distance: 'knapp 2 Meilen', travelTime: 'etwa eine halbe Stunde zu Fuß', transport: 'zu Fuß oder mit dem Karren', cost: 'keine' },
  },
  {
    id: 'loc_london',
    name: 'London',
    type: 'city',
    discovered: true,
    baseAsset: 'asset://location/london/base',
    x: 72,
    y: 30,
    travel: { distance: 'etwa 12 Meilen', travelTime: 'zwei bis drei Stunden mit der Kutsche', transport: 'Postkutsche oder eigenes Gespann', cost: 'einige Shilling' },
  },
  { id: 'loc_aubrey_hall', name: 'Aubrey Hall', type: 'estate', discovered: false, baseAsset: 'asset://location/aubrey_hall/base', x: 82, y: 74, travel: null },
];

const memories = [
  {
    id: 'memory_1',
    entityIds: [PLAYER_ID, MOTHER_ID, SISTER_ID],
    worldDate: '1811',
    type: 'life-event',
    importance: 'major',
    fact: 'Matthias’ Vater starb nach kurzer Krankheit; seither trägt Matthias die Hauptverantwortung für den Hof.',
    status: 'fact',
    reach: 'household',
    fading: 'permanent',
    tags: ['family', 'loss'],
  },
  {
    id: 'memory_2',
    entityIds: [PLAYER_ID, UNCLE_ID],
    worldDate: '9. April 1813',
    type: 'letter',
    importance: 'important',
    fact: 'Onkel Thomas’ erster Brief seit langer Zeit traf ein — ein Zeichen, dass die Familie nicht vergessen ist.',
    status: 'fact',
    reach: 'household',
    fading: 'slow',
    tags: ['family', 'letter'],
  },
];

const letters = [
  {
    id: 'letter_1',
    senderId: UNCLE_ID,
    recipientId: PLAYER_ID,
    dateWritten: '3. April 1813',
    dateSent: '3. April 1813',
    dateArrived: '9. April 1813',
    content:
      'Mein lieber Matthias,\n\nich hoffe, dieser Brief findet Euch und Eure Mutter bei guter Gesundheit. Die Geschäfte hier in Bristol laufen gut, und ich habe an Deinen Vater gedacht, als der Weizenpreis diese Woche wieder anzog...',
    status: 'delivered',
    knownBy: [PLAYER_ID, UNCLE_ID],
  },
];

const chapters = [
  {
    id: 'chapter_1',
    number: 1,
    title: 'A Quiet Spring',
    summary: 'Der Hof, die Familie und die ersten Nachrichten von der beginnenden London Season.',
    startDate: '1. April 1813',
  },
];

const financeLedger = [
  { id: 'txn_1', date: '2. April 1813', description: 'Saatgut', amount: -3.5 },
  { id: 'txn_2', date: '5. April 1813', description: 'Marktverkauf — Eier', amount: 1.2 },
  { id: 'txn_3', date: '9. April 1813', description: 'Reparatur Zaun', amount: -0.8 },
  { id: 'txn_4', date: '11. April 1813', description: 'Pacht (Quartal)', amount: -6 },
];

const worldEvents = [
  { id: 'event_1', category: 'social', title: 'Die Season hat begonnen', description: 'Die ersten Kutschen mit jungen Damen und ihren Müttern sind in Richtung London aufgebrochen.', date: '10. April 1813' },
  { id: 'event_2', category: 'local', title: 'Neuer Pächter am Nachbarhof', description: 'Die Braddocks haben den leerstehenden Hof im Westen übernommen.', date: '8. April 1813' },
  { id: 'event_3', category: 'economic', title: 'Getreidepreise ziehen an', description: 'Auf dem Wochenmarkt wird über steigende Preise für Weizen gesprochen.', date: '11. April 1813' },
];

const reputation = [
  { characterId: PLAYER_ID, scope: 'local', standing: 'angesehen als verlässlicher, fleißiger Pächtersohn' },
  { characterId: PLAYER_ID, scope: 'regional', standing: 'praktisch unbekannt' },
  { characterId: PLAYER_ID, scope: 'ton', standing: 'unbekannt' },
];

const obligations = [
  { id: 'obl_1', description: 'Die Pacht für das nächste Quartal begleichen', owedTo: 'Grundherr', deadline: 'Ende Juni 1813', status: 'open' },
];

const whistledownIssues = [
  {
    id: 'whistledown_1',
    issueNumber: 1,
    date: '10. April 1813',
    headline: 'Die Saison ist eröffnet',
    body: [
      'Dieser Autorin ist zu Ohren gekommen, dass die ersten Kutschen bereits Richtung London aufgebrochen sind — beladen mit hoffnungsvollen jungen Damen und ihren nicht minder hoffnungsvollen Müttern.',
      'Wer in dieser Saison die Herzen — und, seien wir ehrlich, liebe Leserschaft, die Vermögen — erobern wird, bleibt abzuwarten. Diese Autorin wird, wie stets, ein wachsames Auge behalten.',
    ],
  },
];

const socialCalendar = [
  { id: 'social_1', title: "Lady Danbury's Evening", date: '20. April 1813', host: 'Lady Danbury', location: 'Danbury House, London', access: 'not-invited' },
];

const farm = {
  id: 'farm_hale',
  ownerId: PLAYER_ID,
  stats: {
    landAcres: 18,
    annualRent: '£24 jährlich',
    livestock: '1 Kuh, 1 Zugpferd, 8 Hühner',
    supplies: 'für den Winter knapp bemessen',
    workers: 'Familie + gelegentliche Tagelöhner zur Ernte',
  },
  calendar: [
    { season: 'spring', task: 'Aussaat' },
    { season: 'summer', task: 'Heuernte' },
    { season: 'autumn', task: 'Getreideernte' },
    { season: 'winter', task: 'Instandhaltung' },
  ],
  buildings: [
    { id: 'house', name: 'Wohnhaus', condition: 'worn' },
    { id: 'barn', name: 'Scheune', condition: 'worn' },
    { id: 'stable', name: 'Stall', condition: 'sound' },
    { id: 'fields', name: 'Felder', condition: 'sound' },
    { id: 'pasture', name: 'Weiden', condition: 'sound' },
    { id: 'garden', name: 'Garten', condition: 'worn' },
    { id: 'storage', name: 'Lager', condition: 'worn' },
    { id: 'drive', name: 'Zufahrt', condition: 'worn' },
  ],
};

const worldStatus = {
  londonSeasonStatus: 'gerade erst begonnen',
  socialMood: 'neugierig, abwartend',
  region: 'ländliches Umland Londons',
  weather: 'leichter Nebel, mild',
};

const lines = [];
lines.push('-- Generated by scripts/generate-seed.mjs — do not hand-edit, regenerate instead.');
lines.push('-- Mirrors apps/web/src/app/core/state/seed/seed-state.ts exactly.');
lines.push('');

lines.push(`INSERT INTO simulations (id, world_pack_id, state_version, current_world_date, current_season, player_id, social_access_level, world_status_json, farm_json, finance_ledger_json, open_threads_json) VALUES (
  ${sql(SIM_ID)}, ${sql('bridgerton')}, 1, ${sql('12. April 1813')}, ${sql('spring')}, ${sql(PLAYER_ID)}, 1,
  ${sqlJson(worldStatus)}, ${sqlJson(farm)}, ${sqlJson(financeLedger)}, ${sqlJson([])}
);`);
lines.push('');

for (const c of characters) {
  lines.push(`INSERT INTO characters (id, simulation_id, name, is_canon, is_player, location_id, appearance_json, visual_state_json, personality_json, goals_json, player_knowledge_json, gm_state_json, skills_json, wardrobe_json) VALUES (
  ${sql(c.id)}, ${sql(SIM_ID)}, ${sql(c.name)}, ${sql(c.isCanon)}, ${sql(c.isPlayer)}, ${sql(c.locationId)},
  ${sqlJson(c.appearance)}, ${sqlJson(c.visualState)}, ${sqlJson(c.personality)}, ${sqlJson(c.goals)},
  ${sqlJson(c.playerKnowledge)}, ${sqlJson(c.gmState)}, ${sqlJson(c.skills ?? {})}, ${sqlJson(c.wardrobe ?? [])}
);`);
}
lines.push('');

const inventory = [
  { id: 'inv_pocket_watch', ownerId: PLAYER_ID, name: "Taschenuhr des Vaters", description: 'Eine einfache, aber gut erhaltene Taschenuhr — eines der wenigen Dinge, die von seinem Vater geblieben sind.' },
  { id: 'inv_old_book', ownerId: PLAYER_ID, name: 'Altes Buch', description: 'Ein abgegriffenes Buch, an dem Matthias das Lesen geübt hat.' },
];

for (const item of inventory) {
  lines.push(`INSERT INTO inventory (id, simulation_id, owner_id, name, description) VALUES (
  ${sql(item.id)}, ${sql(SIM_ID)}, ${sql(item.ownerId)}, ${sql(item.name)}, ${sql(item.description)}
);`);
}
lines.push('');

for (const issue of whistledownIssues) {
  lines.push(`INSERT INTO whistledown_issues (id, simulation_id, issue_number, date, headline, body_json) VALUES (
  ${sql(issue.id)}, ${sql(SIM_ID)}, ${sql(issue.issueNumber)}, ${sql(issue.date)}, ${sql(issue.headline)}, ${sqlJson(issue.body)}
);`);
}
lines.push('');

for (const entry of reputation) {
  lines.push(`INSERT INTO reputation (simulation_id, character_id, scope, standing) VALUES (
  ${sql(SIM_ID)}, ${sql(entry.characterId)}, ${sql(entry.scope)}, ${sql(entry.standing)}
);`);
}
lines.push('');

for (const obligation of obligations) {
  lines.push(`INSERT INTO obligations (id, simulation_id, description, owed_to, deadline, status) VALUES (
  ${sql(obligation.id)}, ${sql(SIM_ID)}, ${sql(obligation.description)}, ${sql(obligation.owedTo)}, ${sql(obligation.deadline)}, ${sql(obligation.status)}
);`);
}
lines.push('');

for (const r of relationships) {
  lines.push(`INSERT INTO relationships (simulation_id, from_id, to_id, type, dimensions_json, momentum, attention, public_stance, private_stance) VALUES (
  ${sql(SIM_ID)}, ${sql(r.from)}, ${sql(r.to)}, ${sql(r.type)}, ${sqlJson(r.dimensions)}, ${sql(r.momentum)}, ${sql(r.attention)}, ${sql(r.publicStance)}, ${sql(r.privateStance)}
);`);
}
lines.push('');

for (const l of locations) {
  lines.push(`INSERT INTO locations (id, simulation_id, name, type, discovered, base_asset, map_x, map_y, travel_json) VALUES (
  ${sql(l.id)}, ${sql(SIM_ID)}, ${sql(l.name)}, ${sql(l.type)}, ${sql(l.discovered)}, ${sql(l.baseAsset)}, ${sql(l.x)}, ${sql(l.y)}, ${l.travel ? sqlJson(l.travel) : 'NULL'}
);`);
}
lines.push('');

for (const m of memories) {
  lines.push(`INSERT INTO memories (id, simulation_id, entity_ids_json, world_date, type, importance, fact, interpretation_json, status, reach, fading, tags_json) VALUES (
  ${sql(m.id)}, ${sql(SIM_ID)}, ${sqlJson(m.entityIds)}, ${sql(m.worldDate)}, ${sql(m.type)}, ${sql(m.importance)}, ${sql(m.fact)}, ${sqlJson({})}, ${sql(m.status)}, ${sql(m.reach)}, ${sql(m.fading)}, ${sqlJson(m.tags)}
);`);
}
lines.push('');

for (const l of letters) {
  lines.push(`INSERT INTO letters (id, simulation_id, sender_id, recipient_id, date_written, date_sent, date_arrived, content, status, known_by_json) VALUES (
  ${sql(l.id)}, ${sql(SIM_ID)}, ${sql(l.senderId)}, ${sql(l.recipientId)}, ${sql(l.dateWritten)}, ${sql(l.dateSent)}, ${sql(l.dateArrived)}, ${sql(l.content)}, ${sql(l.status)}, ${sqlJson(l.knownBy)}
);`);
}
lines.push('');

for (const c of chapters) {
  lines.push(`INSERT INTO chapters (id, simulation_id, number, title, summary, start_date) VALUES (
  ${sql(c.id)}, ${sql(SIM_ID)}, ${sql(c.number)}, ${sql(c.title)}, ${sql(c.summary)}, ${sql(c.startDate)}
);`);
}
lines.push('');

for (const t of financeLedger) {
  lines.push(`INSERT INTO finance_transactions (id, simulation_id, date, description, amount) VALUES (
  ${sql(t.id)}, ${sql(SIM_ID)}, ${sql(t.date)}, ${sql(t.description)}, ${sql(t.amount)}
);`);
}
lines.push('');

for (const e of worldEvents) {
  lines.push(`INSERT INTO world_events (id, simulation_id, category, title, description, date) VALUES (
  ${sql(e.id)}, ${sql(SIM_ID)}, ${sql(e.category)}, ${sql(e.title)}, ${sql(e.description)}, ${sql(e.date)}
);`);
}
lines.push('');

for (const s of socialCalendar) {
  lines.push(`INSERT INTO social_calendar (id, simulation_id, title, date, host, location, access) VALUES (
  ${sql(s.id)}, ${sql(SIM_ID)}, ${sql(s.title)}, ${sql(s.date)}, ${sql(s.host)}, ${sql(s.location)}, ${sql(s.access)}
);`);
}

console.log(lines.join('\n'));
