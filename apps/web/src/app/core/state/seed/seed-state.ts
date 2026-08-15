import { SimulationState } from '../models/simulation-state.model';
import { Character } from '../models/character.model';
import { Relationship, RelationshipDimensions } from '../models/relationship.model';
import { Location } from '../models/location.model';
import { Farm } from '../models/farm.model';
import { FinanceTransaction } from '../models/finance.model';
import { WorldEvent, WorldStatus } from '../models/world-status.model';
import { SocialCalendarEntry } from '../models/social-calendar.model';

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
};

const farm: Location = {
  id: FARM_ID,
  name: 'Der Hale-Hof',
  type: 'farm',
  discovered: true,
  baseAsset: 'asset://location/player_farm/base',
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

export function createSeedState(): SimulationState {
  return {
    simulationId: 'sim_default',
    worldPackId: 'bridgerton',
    stateVersion: 1,
    currentWorldDate: '12. April 1813',
    currentSeason: 'spring',
    playerId: PLAYER_ID,
    characters: {
      [PLAYER_ID]: player,
      [MOTHER_ID]: mother,
      [SISTER_ID]: sister,
    },
    relationships: [playerToMother, playerToSister],
    locations: { [FARM_ID]: farm },
    memories: {},
    letters: {},
    canonEvents: {},
    openThreads: [],
    farm: playerFarm,
    financeLedger,
    worldStatus,
    worldEvents,
    socialAccessLevel: 1,
    socialCalendar,
  };
}
