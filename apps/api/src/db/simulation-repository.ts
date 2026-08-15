import type {
  CausalityLogEntry,
  CharacterResponse,
  FavorEntry,
  InfluenceEntry,
  InventoryItemResponse,
  LetterResponse,
  LocationResponse,
  MemoryResponse,
  ObligationEntry,
  RelationshipResponse,
  ReputationEntry,
  RumorEntry,
  ScandalEntry,
  SecretEntry,
  SimulationStateResponse,
  WhistledownIssueResponse,
} from '../models';

interface SimulationRow {
  id: string;
  world_pack_id: string;
  state_version: number;
  current_world_date: string;
  current_season: string;
  player_id: string;
  social_access_level: number;
  world_status_json: string;
  farm_json: string;
  open_threads_json: string;
}

interface CharacterRow {
  id: string;
  name: string;
  is_canon: number;
  is_player: number;
  location_id: string | null;
  appearance_json: string;
  visual_state_json: string;
  personality_json: string;
  goals_json: string;
  player_knowledge_json: string;
  gm_state_json: string;
  skills_json: string;
  wardrobe_json: string;
}

interface InventoryRow {
  id: string;
  owner_id: string;
  name: string;
  description: string;
}

interface WhistledownRow {
  id: string;
  issue_number: number;
  date: string;
  headline: string;
  body_json: string;
}

interface ReputationRow {
  character_id: string;
  scope: string;
  standing: string;
}

interface InfluenceRow {
  id: string;
  character_id: string;
  source: string;
  description: string;
}

interface FavorRow {
  id: string;
  person_id: string;
  direction: string;
  description: string;
  publicly_known: number;
  fulfilled: number;
}

interface RumorRow {
  id: string;
  content: string;
  truth_status: string;
  reach: string;
  known_by_json: string;
  origin_date: string;
}

interface SecretRow {
  id: string;
  description: string;
  truth: string;
  known_by_json: string;
  suspected_by_json: string;
  player_knows: number;
}

interface ScandalRow {
  id: string;
  description: string;
  severity: string;
  date: string;
  involved_json: string;
}

interface ObligationRow {
  id: string;
  description: string;
  owed_to: string;
  deadline: string | null;
  status: string;
}

interface CausalityLogRow {
  id: string;
  event: string;
  cause: string;
  direct_consequences_json: string;
  secondary_consequences_json: string;
  long_term_consequences_json: string;
  date: string;
}

interface RelationshipRow {
  from_id: string;
  to_id: string;
  type: string;
  dimensions_json: string;
  momentum: string;
  attention: string;
  last_contact: string | null;
  public_stance: string;
  private_stance: string;
  inner_thoughts_json: string;
  self_interpretation: string | null;
  denial: string | null;
  misconceptions_json: string;
  personal_boundaries_json: string;
}

interface LocationRow {
  id: string;
  name: string;
  type: string;
  discovered: number;
  base_asset: string;
  map_x: number;
  map_y: number;
  travel_json: string | null;
}

interface MemoryRow {
  id: string;
  entity_ids_json: string;
  world_date: string;
  type: string;
  importance: string;
  fact: string;
  interpretation_json: string;
  status: string;
  reach: string;
  fading: string;
  tags_json: string;
}

interface LetterRow {
  id: string;
  sender_id: string;
  recipient_id: string;
  date_written: string;
  date_sent: string | null;
  date_arrived: string | null;
  content: string;
  status: string;
  known_by_json: string;
}

interface WorldEventRow {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
}

interface FinanceTransactionRow {
  id: string;
  date: string;
  description: string;
  amount: number;
}

interface SocialCalendarRow {
  id: string;
  title: string;
  date: string;
  host: string;
  location: string;
  access: string;
}

interface ChapterRow {
  id: string;
  number: number;
  title: string;
  summary: string;
  start_date: string;
}

interface CanonEventRow {
  id: string;
  name: string;
  original_course: string;
  requirements_json: string;
  window_json: string;
  status: string;
  player_influence: string;
  current_likely_variant: string;
  consequences_json: string;
}

/** Assembles the full SimulationState from D1 rows — see docs/spec/ui-master-prompt-v1.md §86. */
export async function getSimulationState(db: D1Database, simulationId: string): Promise<SimulationStateResponse | null> {
  const simulation = await db
    .prepare('SELECT * FROM simulations WHERE id = ?')
    .bind(simulationId)
    .first<SimulationRow>();

  if (!simulation) return null;

  const [
    characters,
    relationships,
    locations,
    memories,
    letters,
    worldEvents,
    socialCalendar,
    chapters,
    canonEvents,
    financeTransactions,
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
  ] = await Promise.all([
      db.prepare('SELECT * FROM characters WHERE simulation_id = ?').bind(simulationId).all<CharacterRow>(),
      db.prepare('SELECT * FROM relationships WHERE simulation_id = ?').bind(simulationId).all<RelationshipRow>(),
      db.prepare('SELECT * FROM locations WHERE simulation_id = ?').bind(simulationId).all<LocationRow>(),
      db.prepare('SELECT * FROM memories WHERE simulation_id = ?').bind(simulationId).all<MemoryRow>(),
      db.prepare('SELECT * FROM letters WHERE simulation_id = ?').bind(simulationId).all<LetterRow>(),
      db
        .prepare('SELECT id, category, title, description, date FROM world_events WHERE simulation_id = ?')
        .bind(simulationId)
        .all<WorldEventRow>(),
      db
        .prepare('SELECT id, title, date, host, location, access FROM social_calendar WHERE simulation_id = ?')
        .bind(simulationId)
        .all<SocialCalendarRow>(),
      db
        .prepare('SELECT id, number, title, summary, start_date FROM chapters WHERE simulation_id = ?')
        .bind(simulationId)
        .all<ChapterRow>(),
      db.prepare('SELECT * FROM canon_events WHERE simulation_id = ?').bind(simulationId).all<CanonEventRow>(),
      db
        .prepare('SELECT id, date, description, amount FROM finance_transactions WHERE simulation_id = ?')
        .bind(simulationId)
        .all<FinanceTransactionRow>(),
      db
        .prepare('SELECT id, owner_id, name, description FROM inventory WHERE simulation_id = ?')
        .bind(simulationId)
        .all<InventoryRow>(),
      db
        .prepare('SELECT id, issue_number, date, headline, body_json FROM whistledown_issues WHERE simulation_id = ? ORDER BY issue_number DESC')
        .bind(simulationId)
        .all<WhistledownRow>(),
      db.prepare('SELECT character_id, scope, standing FROM reputation WHERE simulation_id = ?').bind(simulationId).all<ReputationRow>(),
      db.prepare('SELECT id, character_id, source, description FROM influence WHERE simulation_id = ?').bind(simulationId).all<InfluenceRow>(),
      db
        .prepare('SELECT id, person_id, direction, description, publicly_known, fulfilled FROM favors WHERE simulation_id = ?')
        .bind(simulationId)
        .all<FavorRow>(),
      db
        .prepare('SELECT id, content, truth_status, reach, known_by_json, origin_date FROM rumors WHERE simulation_id = ?')
        .bind(simulationId)
        .all<RumorRow>(),
      db
        .prepare('SELECT id, description, truth, known_by_json, suspected_by_json, player_knows FROM secrets WHERE simulation_id = ?')
        .bind(simulationId)
        .all<SecretRow>(),
      db
        .prepare('SELECT id, description, severity, date, involved_json FROM scandals WHERE simulation_id = ?')
        .bind(simulationId)
        .all<ScandalRow>(),
      db
        .prepare('SELECT id, description, owed_to, deadline, status FROM obligations WHERE simulation_id = ?')
        .bind(simulationId)
        .all<ObligationRow>(),
      db
        .prepare(
          'SELECT id, event, cause, direct_consequences_json, secondary_consequences_json, long_term_consequences_json, date FROM causality_log WHERE simulation_id = ?',
        )
        .bind(simulationId)
        .all<CausalityLogRow>(),
    ]);

  const characterMap: Record<string, CharacterResponse> = {};
  for (const row of characters.results) {
    characterMap[row.id] = {
      id: row.id,
      name: row.name,
      isCanon: row.is_canon === 1,
      isPlayer: row.is_player === 1,
      locationId: row.location_id,
      appearance: JSON.parse(row.appearance_json),
      visualState: JSON.parse(row.visual_state_json),
      personality: JSON.parse(row.personality_json),
      goals: JSON.parse(row.goals_json),
      playerKnowledge: JSON.parse(row.player_knowledge_json),
      gmState: JSON.parse(row.gm_state_json),
      skills: JSON.parse(row.skills_json),
      wardrobe: JSON.parse(row.wardrobe_json),
    };
  }

  const relationshipList: RelationshipResponse[] = relationships.results.map((row) => ({
    from: row.from_id,
    to: row.to_id,
    type: row.type,
    dimensions: JSON.parse(row.dimensions_json),
    momentum: row.momentum,
    attention: row.attention,
    lastContact: row.last_contact,
    publicStance: row.public_stance,
    privateStance: row.private_stance,
    innerThoughts: JSON.parse(row.inner_thoughts_json),
    selfInterpretation: row.self_interpretation,
    denial: row.denial,
    misconceptions: JSON.parse(row.misconceptions_json),
    personalBoundaries: JSON.parse(row.personal_boundaries_json),
  }));

  const locationMap: Record<string, LocationResponse> = {};
  for (const row of locations.results) {
    locationMap[row.id] = {
      id: row.id,
      name: row.name,
      type: row.type,
      discovered: row.discovered === 1,
      baseAsset: row.base_asset,
      mapPosition: { x: row.map_x, y: row.map_y },
      travel: row.travel_json ? JSON.parse(row.travel_json) : null,
    };
  }

  const memoryMap: Record<string, MemoryResponse> = {};
  for (const row of memories.results) {
    memoryMap[row.id] = {
      id: row.id,
      entityIds: JSON.parse(row.entity_ids_json),
      worldDate: row.world_date,
      type: row.type,
      importance: row.importance,
      fact: row.fact,
      interpretation: JSON.parse(row.interpretation_json),
      status: row.status,
      reach: row.reach,
      fading: row.fading,
      tags: JSON.parse(row.tags_json),
    };
  }

  const letterMap: Record<string, LetterResponse> = {};
  for (const row of letters.results) {
    letterMap[row.id] = {
      id: row.id,
      senderId: row.sender_id,
      recipientId: row.recipient_id,
      dateWritten: row.date_written,
      dateSent: row.date_sent,
      dateArrived: row.date_arrived,
      content: row.content,
      status: row.status,
      knownBy: JSON.parse(row.known_by_json),
    };
  }

  const canonEventMap: Record<string, unknown> = {};
  for (const row of canonEvents.results) {
    canonEventMap[row.id] = {
      id: row.id,
      name: row.name,
      originalCourse: row.original_course,
      requirements: JSON.parse(row.requirements_json),
      window: JSON.parse(row.window_json),
      status: row.status,
      playerInfluence: row.player_influence,
      currentLikelyVariant: row.current_likely_variant,
      consequences: JSON.parse(row.consequences_json),
    };
  }

  const worldEventList = worldEvents.results;
  const socialCalendarList = socialCalendar.results;
  const chapterList = chapters.results.map((row) => ({
    id: row.id,
    number: row.number,
    title: row.title,
    summary: row.summary,
    startDate: row.start_date,
  }));

  return {
    simulationId: simulation.id,
    worldPackId: simulation.world_pack_id,
    stateVersion: simulation.state_version,
    currentWorldDate: simulation.current_world_date,
    currentSeason: simulation.current_season,
    playerId: simulation.player_id,
    socialAccessLevel: simulation.social_access_level,
    characters: characterMap,
    relationships: relationshipList,
    locations: locationMap,
    memories: memoryMap,
    letters: letterMap,
    canonEvents: canonEventMap,
    openThreads: JSON.parse(simulation.open_threads_json),
    farm: JSON.parse(simulation.farm_json),
    worldStatus: JSON.parse(simulation.world_status_json),
    worldEvents: worldEventList,
    socialCalendar: socialCalendarList,
    chapters: chapterList,
    financeLedger: financeTransactions.results,
    inventory: inventory.results.map(
      (row): InventoryItemResponse => ({ id: row.id, ownerId: row.owner_id, name: row.name, description: row.description }),
    ),
    whistledownIssues: whistledownIssues.results.map(
      (row): WhistledownIssueResponse => ({
        id: row.id,
        issueNumber: row.issue_number,
        date: row.date,
        headline: row.headline,
        body: JSON.parse(row.body_json),
      }),
    ),
    reputation: reputation.results.map(
      (row): ReputationEntry => ({ characterId: row.character_id, scope: row.scope, standing: row.standing }),
    ),
    influence: influence.results.map(
      (row): InfluenceEntry => ({ id: row.id, characterId: row.character_id, source: row.source, description: row.description }),
    ),
    favors: favors.results.map(
      (row): FavorEntry => ({
        id: row.id,
        personId: row.person_id,
        direction: row.direction as FavorEntry['direction'],
        description: row.description,
        publiclyKnown: row.publicly_known === 1,
        fulfilled: row.fulfilled === 1,
      }),
    ),
    rumors: rumors.results.map(
      (row): RumorEntry => ({
        id: row.id,
        content: row.content,
        truthStatus: row.truth_status as RumorEntry['truthStatus'],
        reach: row.reach,
        knownBy: JSON.parse(row.known_by_json),
        originDate: row.origin_date,
      }),
    ),
    secrets: secrets.results.map(
      (row): SecretEntry => ({
        id: row.id,
        description: row.description,
        truth: row.truth,
        knownBy: JSON.parse(row.known_by_json),
        suspectedBy: JSON.parse(row.suspected_by_json),
        playerKnows: row.player_knows === 1,
      }),
    ),
    scandals: scandals.results.map(
      (row): ScandalEntry => ({
        id: row.id,
        description: row.description,
        severity: row.severity,
        date: row.date,
        involved: JSON.parse(row.involved_json),
      }),
    ),
    obligations: obligations.results.map(
      (row): ObligationEntry => ({ id: row.id, description: row.description, owedTo: row.owed_to, deadline: row.deadline, status: row.status }),
    ),
    causalityLog: causalityLog.results.map(
      (row): CausalityLogEntry => ({
        id: row.id,
        event: row.event,
        cause: row.cause,
        directConsequences: JSON.parse(row.direct_consequences_json),
        secondaryConsequences: JSON.parse(row.secondary_consequences_json),
        longTermConsequences: JSON.parse(row.long_term_consequences_json),
        date: row.date,
      }),
    ),
  };
}
