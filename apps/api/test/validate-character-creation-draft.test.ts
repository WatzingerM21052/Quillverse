import { describe, expect, it } from 'vitest';
import { validateCharacterCreationDraft } from '../src/services/validate-character-creation-draft';

const APPEARANCE = {
  height: 'mittelgroß',
  build: 'schlank',
  face: 'freundlich',
  hair: 'braun',
  eyes: 'grün',
  voice: 'ruhig',
  posture: 'aufrecht',
  typicalExpression: 'neugierig',
  hands: 'schwielig',
  grooming: 'einfach',
  clothing: 'Arbeitskleidung',
  distinguishingFeatures: '—',
  generalPresence: 'bodenständig',
};

const VALID = JSON.stringify({
  schemaVersion: 1,
  player: {
    name: 'Eliza Marsh',
    appearance: APPEARANCE,
    personalityTraits: ['ruhig', 'stur'],
    skills: { Landwirtschaft: 'gut' },
    goals: { shortTerm: [], midTerm: [], longTerm: [], currentWorries: [] },
    backstory: 'Wuchs auf dem Hof ihrer Familie auf.',
  },
  family: [{ name: 'Robert Marsh', relation: 'Vater', age: '50', appearance: APPEARANCE, personalityTraits: ['streng'] }],
  farm: { landAcres: 15, annualRent: '£20 jährlich', livestock: '1 Kuh', supplies: 'knapp', workers: 'Familie' },
  openingSummary: 'Eliza lebt mit ihrem Vater auf einem kleinen Pachthof.',
});

describe('validateCharacterCreationDraft', () => {
  it('accepts a well-formed draft', () => {
    const result = validateCharacterCreationDraft(VALID);
    expect(result.ok).toBe(true);
  });

  it('accepts an empty family array (character starts alone)', () => {
    const body = JSON.parse(VALID);
    body.family = [];
    const result = validateCharacterCreationDraft(JSON.stringify(body));
    expect(result.ok).toBe(true);
  });

  it('rejects a player appearance missing a required field', () => {
    const body = JSON.parse(VALID);
    delete body.player.appearance.hands;
    const result = validateCharacterCreationDraft(JSON.stringify(body));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/appearance/);
  });

  it('rejects a family member missing relation', () => {
    const body = JSON.parse(VALID);
    delete body.family[0].relation;
    const result = validateCharacterCreationDraft(JSON.stringify(body));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/name.*relation/);
  });

  it('rejects a non-numeric farm.landAcres', () => {
    const body = JSON.parse(VALID);
    body.farm.landAcres = 'fifteen';
    const result = validateCharacterCreationDraft(JSON.stringify(body));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/landAcres/);
  });

  it('rejects a missing openingSummary', () => {
    const body = JSON.parse(VALID);
    delete body.openingSummary;
    const result = validateCharacterCreationDraft(JSON.stringify(body));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/openingSummary/);
  });

  it('rejects malformed JSON', () => {
    const result = validateCharacterCreationDraft('not json');
    expect(result.ok).toBe(false);
  });
});
