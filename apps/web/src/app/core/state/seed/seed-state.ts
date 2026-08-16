import { SimulationState } from '../models/simulation-state.model';
import { Character } from '../models/character.model';
import { Relationship, RelationshipDimensions } from '../models/relationship.model';
import { Location } from '../models/location.model';
import { Farm } from '../models/farm.model';
import { FinanceTransaction } from '../models/finance.model';
import { WorldEvent, WorldStatus } from '../models/world-status.model';
import { SocialCalendarEntry } from '../models/social-calendar.model';
import { Letter } from '../models/letter.model';
import { Chapter } from '../models/chapter.model';
import { Memory } from '../models/memory.model';
import { InventoryItem } from '../models/inventory.model';
import { WhistledownIssue } from '../models/whistledown.model';
import {
  CausalityLogEntry,
  FavorEntry,
  InfluenceEntry,
  ObligationEntry,
  ReputationEntry,
  RumorEntry,
  ScandalEntry,
  SecretEntry,
} from '../models/society-systems.model';

/**
 * Default player setup per simulation-master-prompt-v3.md §132 (Default-Hof) —
 * used until real character creation (§131/§171) is wired up. This is the only
 * seed data in the app; every screen reads through SimulationStateStore, never
 * this file directly.
 */
function zeroDimensions(): RelationshipDimensions {
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

const PLAYER_ID = 'char_player_matthias';
const MOTHER_ID = 'char_anne_hale';
const SISTER_ID = 'char_grace_hale';
const FARM_ID = 'loc_player_farm';

const player: Character = {
  id: PLAYER_ID,
  name: 'Matthias Hale',
  isCanon: false,
  isPlayer: true,
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
  personality: {
    traits: ['zurückhaltend', 'beobachtend', 'trockener Humor', 'verlässlich', 'stur'],
  },
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
  locationId: FARM_ID,
  memoryIds: [],
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
};

const mother: Character = {
  id: MOTHER_ID,
  name: 'Anne Hale',
  isCanon: false,
  isPlayer: false,
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
  locationId: FARM_ID,
  memoryIds: [],
  skills: {},
  wardrobe: [],
};

const sister: Character = {
  id: SISTER_ID,
  name: 'Grace Hale',
  isCanon: false,
  isPlayer: false,
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
  locationId: FARM_ID,
  memoryIds: [],
  skills: {},
  wardrobe: [],
};

const UNCLE_ID = 'char_thomas_hale';

const uncle: Character = {
  id: UNCLE_ID,
  name: 'Thomas Hale',
  isCanon: false,
  isPlayer: false,
  appearance: {
    height: 'groß',
    build: 'kräftig',
    face: 'wettergegerbt, Bruder von Matthias' + "'" + ' verstorbenem Vater',
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
  locationId: null,
  memoryIds: [],
  skills: {},
  wardrobe: [],
};

const letters: Letter[] = [
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

const farm: Location = {
  id: FARM_ID,
  name: 'Der Hale-Hof',
  type: 'farm',
  discovered: true,
  baseAsset: 'asset://location/player_farm/base',
  mapPosition: { x: 22, y: 78 },
};

const villageMarket: Location = {
  id: 'loc_village_market',
  name: 'Dorfmarkt',
  type: 'market',
  discovered: true,
  baseAsset: 'asset://location/village_market/base',
  mapPosition: { x: 34, y: 62 },
  travel: {
    distance: 'knapp 2 Meilen',
    travelTime: 'etwa eine halbe Stunde zu Fuß',
    transport: 'zu Fuß oder mit dem Karren',
    cost: 'keine',
  },
};

const london: Location = {
  id: 'loc_london',
  name: 'London',
  type: 'city',
  discovered: true,
  baseAsset: 'asset://location/london/base',
  mapPosition: { x: 72, y: 30 },
  travel: {
    distance: 'etwa 12 Meilen',
    travelTime: 'zwei bis drei Stunden mit der Kutsche',
    transport: 'Postkutsche oder eigenes Gespann',
    cost: 'einige Shilling',
  },
};

/** Not discovered yet — demonstrates fog of knowledge (§41); the Map screen must not render it. */
const aubreyHall: Location = {
  id: 'loc_aubrey_hall',
  name: 'Aubrey Hall',
  type: 'estate',
  discovered: false,
  baseAsset: 'asset://location/aubrey_hall/base',
  mapPosition: { x: 82, y: 74 },
};

const playerToMother: Relationship = {
  from: PLAYER_ID,
  to: MOTHER_ID,
  type: 'family',
  dimensions: {
    ...zeroDimensions(),
    acquaintance: 100,
    liking: 85,
    trust: 90,
    respect: 85,
    familiarity: 95,
    loyalty: 95,
    protectiveness: 80,
  },
  momentum: 'stable',
  attention: 'high',
  lastContact: null,
  publicStance: 'respektvoller Sohn',
  privateStance: 'liebevoll, beschützend',
  innerThoughts: [],
  selfInterpretation: null,
  denial: null,
  misconceptions: [],
  personalBoundaries: [],
  memoryIds: [],
};

const playerToSister: Relationship = {
  from: PLAYER_ID,
  to: SISTER_ID,
  type: 'family',
  dimensions: {
    ...zeroDimensions(),
    acquaintance: 100,
    liking: 80,
    trust: 75,
    respect: 60,
    familiarity: 90,
    sharedHumor: 55,
    loyalty: 90,
    protectiveness: 85,
  },
  momentum: 'stable',
  attention: 'medium',
  lastContact: null,
  publicStance: 'beschützender großer Bruder',
  privateStance: 'liebevoll genervt',
  innerThoughts: [],
  selfInterpretation: null,
  denial: null,
  misconceptions: [],
  personalBoundaries: [],
  memoryIds: [],
};

const playerFarm: Farm = {
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

const financeLedger: FinanceTransaction[] = [
  { id: 'txn_1', date: '2. April 1813', description: 'Saatgut', amount: -3.5 },
  { id: 'txn_2', date: '5. April 1813', description: 'Marktverkauf — Eier', amount: 1.2 },
  { id: 'txn_3', date: '9. April 1813', description: 'Reparatur Zaun', amount: -0.8 },
  { id: 'txn_4', date: '11. April 1813', description: 'Pacht (Quartal)', amount: -6 },
];

const worldStatus: WorldStatus = {
  londonSeasonStatus: 'gerade erst begonnen',
  socialMood: 'neugierig, abwartend',
  region: 'ländliches Umland Londons',
  weather: 'leichter Nebel, mild',
};

const worldEvents: WorldEvent[] = [
  {
    id: 'event_1',
    category: 'social',
    title: 'Die Season hat begonnen',
    description: 'Die ersten Kutschen mit jungen Damen und ihren Müttern sind in Richtung London aufgebrochen.',
    date: '10. April 1813',
  },
  {
    id: 'event_2',
    category: 'local',
    title: 'Neuer Pächter am Nachbarhof',
    description: 'Die Braddocks haben den leerstehenden Hof im Westen übernommen.',
    date: '8. April 1813',
  },
  {
    id: 'event_3',
    category: 'economic',
    title: 'Getreidepreise ziehen an',
    description: 'Auf dem Wochenmarkt wird über steigende Preise für Weizen gesprochen.',
    date: '11. April 1813',
  },
];

const socialCalendar: SocialCalendarEntry[] = [
  {
    id: 'social_1',
    title: "Lady Danbury's Evening",
    date: '20. April 1813',
    host: 'Lady Danbury',
    location: 'Danbury House, London',
    access: 'not-invited',
  },
];

const chapters: Chapter[] = [
  {
    id: 'chapter_1',
    number: 1,
    title: 'A Quiet Spring',
    summary: 'Der Hof, die Familie und die ersten Nachrichten von der beginnenden London Season.',
    startDate: '1. April 1813',
  },
];

const memories: Memory[] = [
  {
    id: 'memory_1',
    entityIds: [PLAYER_ID, MOTHER_ID, SISTER_ID],
    worldDate: '1811',
    type: 'life-event',
    importance: 'major',
    fact: 'Matthias’ Vater starb nach kurzer Krankheit; seither trägt Matthias die Hauptverantwortung für den Hof.',
    interpretation: {},
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
    interpretation: {},
    status: 'fact',
    reach: 'household',
    fading: 'slow',
    tags: ['family', 'letter'],
  },
];

const inventory: InventoryItem[] = [
  {
    id: 'inv_pocket_watch',
    ownerId: PLAYER_ID,
    name: 'Taschenuhr des Vaters',
    description: 'Eine einfache, aber gut erhaltene Taschenuhr — eines der wenigen Dinge, die von seinem Vater geblieben sind.',
  },
  {
    id: 'inv_old_book',
    ownerId: PLAYER_ID,
    name: 'Altes Buch',
    description: 'Ein abgegriffenes Buch, an dem Matthias das Lesen geübt hat.',
  },
];

const whistledownIssues: WhistledownIssue[] = [
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

const reputation: ReputationEntry[] = [
  { characterId: PLAYER_ID, scope: 'local', standing: 'angesehen als verlässlicher, fleißiger Pächtersohn' },
  { characterId: PLAYER_ID, scope: 'regional', standing: 'praktisch unbekannt' },
  { characterId: PLAYER_ID, scope: 'ton', standing: 'unbekannt' },
];

const influence: InfluenceEntry[] = [];
const favors: FavorEntry[] = [];
const rumors: RumorEntry[] = [];
const secrets: SecretEntry[] = [];
const scandals: ScandalEntry[] = [];

const obligations: ObligationEntry[] = [
  { id: 'obl_1', description: 'Die Pacht für das nächste Quartal begleichen', owedTo: 'Grundherr', deadline: 'Ende Juni 1813', status: 'open' },
];

const causalityLog: CausalityLogEntry[] = [];

export function createSeedState(): SimulationState {
  return {
    simulationId: 'sim_default',
    label: 'The Farmer',
    worldPackId: 'bridgerton',
    stateVersion: 1,
    currentWorldDate: '12. April 1813',
    currentSeason: 'spring',
    playerId: PLAYER_ID,
    characters: {
      [PLAYER_ID]: player,
      [MOTHER_ID]: mother,
      [SISTER_ID]: sister,
      [UNCLE_ID]: uncle,
    },
    relationships: [playerToMother, playerToSister],
    locations: {
      [FARM_ID]: farm,
      [villageMarket.id]: villageMarket,
      [london.id]: london,
      [aubreyHall.id]: aubreyHall,
    },
    memories: Object.fromEntries(memories.map((memory) => [memory.id, memory])),
    letters: Object.fromEntries(letters.map((letter) => [letter.id, letter])),
    canonEvents: {},
    openThreads: [],
    farm: playerFarm,
    financeLedger,
    worldStatus,
    worldEvents,
    socialAccessLevel: 1,
    socialCalendar,
    chapters,
    inventory,
    whistledownIssues,
    reputation,
    influence,
    favors,
    rumors,
    secrets,
    scandals,
    obligations,
    causalityLog,
    playerNotes: [],
    favoriteQuotes: [],
    recap: null,
  };
}
