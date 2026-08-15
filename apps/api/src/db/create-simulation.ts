import type { SimulationSummary } from '../models';
import type { CharacterCreationDraft } from '../models/character-creation';
import { getSimulationState } from './simulation-repository';

const DIMENSION_KEYS = [
  'acquaintance', 'liking', 'trust', 'respect', 'familiarity', 'sharedHumor',
  'emotionalCloseness', 'intellectualConnection', 'physicalAttraction', 'aestheticAttraction',
  'romanticCuriosity', 'romanticInterest', 'romanticFeelings', 'romanticTension', 'sexualTension',
  'desireForCloseness', 'loyalty', 'protectiveness', 'socialAcceptance', 'willingnessToMarry',
  'distrust', 'insecurity', 'hurt', 'anger', 'jealousy', 'rivalry', 'fear', 'dependency',
];

/** Warm-but-unestablished family baseline — a fresh start, not a lived-in history like the seed's Anne/Grace values. */
function familyBaselineDimensions(): Record<string, number> {
  const dims = Object.fromEntries(DIMENSION_KEYS.map((key) => [key, 0]));
  return { ...dims, acquaintance: 100, liking: 70, trust: 70, respect: 65, familiarity: 80, loyalty: 75, protectiveness: 60 };
}

// §16 Geografische Ausgangslage — same rural-London-adjacent world-pack
// geography for every new character; these are Bridgerton world-pack facts,
// not player-customizable, so every new simulation gets the identical
// location set (same ids are safe to reuse: composite PK is (id, simulation_id)).
const WORLD_PACK_LOCATIONS = [
  { id: 'loc_player_farm', name: 'Der Hof', type: 'farm', discovered: 1, baseAsset: 'asset://location/player_farm/base', x: 22, y: 78, travel: null },
  {
    id: 'loc_village_market',
    name: 'Dorfmarkt',
    type: 'market',
    discovered: 1,
    baseAsset: 'asset://location/village_market/base',
    x: 34,
    y: 62,
    travel: { distance: 'knapp 2 Meilen', travelTime: 'etwa eine halbe Stunde zu Fuß', transport: 'zu Fuß oder mit dem Karren', cost: 'keine' },
  },
  {
    id: 'loc_london',
    name: 'London',
    type: 'city',
    discovered: 1,
    baseAsset: 'asset://location/london/base',
    x: 72,
    y: 30,
    travel: { distance: 'etwa 12 Meilen', travelTime: 'zwei bis drei Stunden mit der Kutsche', transport: 'Postkutsche oder eigenes Gespann', cost: 'einige Shilling' },
  },
  { id: 'loc_aubrey_hall', name: 'Aubrey Hall', type: 'estate', discovered: 0, baseAsset: 'asset://location/aubrey_hall/base', x: 82, y: 74, travel: null },
] as const;

export interface ToneReferences {
  romanceIntensity?: string;
  socialIntrigueDepth?: string;
  farmEconomyDepth?: string;
  historicalAccuracy?: string;
  narrativePace?: string;
}

const EMPTY_GOALS_JSON = JSON.stringify({
  shortTerm: [],
  midTerm: [],
  longTerm: [],
  currentWorries: [],
  currentObligations: [],
  currentPriorities: [],
  plannedActions: [],
  currentlyImportantPeople: [],
});

/**
 * §170-176 Character Creator — builds a brand-new simulation from scratch
 * (parent_simulation_id null, unlike forkSavepoint which always has a
 * source snapshot to copy). World-pack content (locations, starting date)
 * stays fixed Bridgerton defaults; only the player, family, and farm come
 * from the AI-assisted creation draft.
 */
export async function createSimulationFromDraft(
  db: D1Database,
  draft: CharacterCreationDraft,
  label: string,
  tonePreferences: ToneReferences,
): Promise<SimulationSummary | null> {
  const simulationId = crypto.randomUUID();
  const playerId = crypto.randomUUID();
  const farmId = crypto.randomUUID();
  const currentWorldDate = '12. April 1813';

  const statements: D1PreparedStatement[] = [];

  const farmJson = JSON.stringify({
    id: farmId,
    ownerId: playerId,
    stats: {
      landAcres: draft.farm.landAcres,
      annualRent: draft.farm.annualRent,
      livestock: draft.farm.livestock,
      supplies: draft.farm.supplies,
      workers: draft.farm.workers,
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
    ],
  });

  const worldStatusJson = JSON.stringify({
    londonSeasonStatus: 'gerade erst begonnen',
    socialMood: 'neugierig, abwartend',
    region: 'ländliches Umland Londons',
    weather: 'leichter Nebel, mild',
  });

  statements.push(
    db
      .prepare(
        `INSERT INTO simulations (id, label, world_pack_id, state_version, current_world_date, current_season, player_id, social_access_level, world_status_json, farm_json, finance_ledger_json, open_threads_json, parent_simulation_id, tone_preferences_json)
         VALUES (?, ?, 'bridgerton', 1, ?, 'spring', ?, 1, ?, ?, '[]', '[]', NULL, ?)`,
      )
      .bind(simulationId, label, currentWorldDate, playerId, worldStatusJson, farmJson, JSON.stringify(tonePreferences)),
  );

  statements.push(
    db
      .prepare(
        `INSERT INTO characters (id, simulation_id, name, is_canon, is_player, location_id, appearance_json, visual_state_json, personality_json, goals_json, player_knowledge_json, gm_state_json, skills_json, wardrobe_json)
         VALUES (?, ?, ?, 0, 1, 'loc_player_farm', ?, ?, ?, ?, '[]', '{}', ?, '[]')`,
      )
      .bind(
        playerId,
        simulationId,
        draft.player.name,
        JSON.stringify(draft.player.appearance),
        JSON.stringify({
          characterId: playerId,
          basePortrait: 'asset://character/player/base',
          currentOutfit: 'work_shirt',
          currentHairState: 'neutral',
          currentAge: '22',
          currentCondition: 'healthy',
          availableExpressions: ['neutral'],
        }),
        JSON.stringify({ traits: draft.player.personalityTraits }),
        JSON.stringify({
          shortTerm: draft.player.goals.shortTerm,
          midTerm: draft.player.goals.midTerm,
          longTerm: draft.player.goals.longTerm,
          currentWorries: draft.player.goals.currentWorries,
          currentObligations: [],
          currentPriorities: ['Hof', 'Familie'],
          plannedActions: [],
          currentlyImportantPeople: [],
        }),
        JSON.stringify(draft.player.skills),
      ),
  );

  const familyIds: string[] = [];
  for (const member of draft.family) {
    const memberId = crypto.randomUUID();
    familyIds.push(memberId);
    statements.push(
      db
        .prepare(
          `INSERT INTO characters (id, simulation_id, name, is_canon, is_player, location_id, appearance_json, visual_state_json, personality_json, goals_json, player_knowledge_json, gm_state_json, skills_json, wardrobe_json)
           VALUES (?, ?, ?, 0, 0, 'loc_player_farm', ?, ?, ?, ?, '[]', '{}', '{}', '[]')`,
        )
        .bind(
          memberId,
          simulationId,
          member.name,
          JSON.stringify(member.appearance),
          JSON.stringify({
            characterId: memberId,
            basePortrait: 'asset://character/family/base',
            currentOutfit: 'everyday_dress',
            currentHairState: 'neutral',
            currentAge: member.age,
            currentCondition: 'healthy',
            availableExpressions: ['neutral'],
          }),
          JSON.stringify({ traits: member.personalityTraits }),
          EMPTY_GOALS_JSON,
        ),
    );

    statements.push(
      db
        .prepare(
          `INSERT INTO relationships (simulation_id, from_id, to_id, type, dimensions_json, momentum, attention, public_stance, private_stance)
           VALUES (?, ?, ?, 'family', ?, 'stable', 'medium', ?, ?)`,
        )
        .bind(simulationId, playerId, memberId, JSON.stringify(familyBaselineDimensions()), member.relation, member.relation),
    );
  }

  for (const location of WORLD_PACK_LOCATIONS) {
    statements.push(
      db
        .prepare(
          `INSERT INTO locations (id, simulation_id, name, type, discovered, base_asset, map_x, map_y, travel_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(location.id, simulationId, location.name, location.type, location.discovered, location.baseAsset, location.x, location.y, location.travel ? JSON.stringify(location.travel) : null),
    );
  }

  statements.push(
    db
      .prepare(`INSERT INTO reputation (simulation_id, character_id, scope, standing) VALUES (?, ?, 'local', 'praktisch unbekannt')`)
      .bind(simulationId, playerId),
  );

  await db.batch(statements);

  const state = await getSimulationState(db, simulationId);
  if (!state) return null;

  return {
    id: simulationId,
    label,
    worldPackId: 'bridgerton',
    currentWorldDate,
    stateVersion: 1,
    playerName: draft.player.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parentSimulationId: null,
  };
}
