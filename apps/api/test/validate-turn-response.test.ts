import { describe, expect, it } from 'vitest';
import { validateManualTurnResponse } from '../src/services/validate-turn-response';

const VALID = JSON.stringify({
  schemaVersion: 1,
  scene: { worldDate: '12. April 1813', narration: ['Ein ruhiger Morgen.'] },
  statePatch: {},
});

describe('validateManualTurnResponse', () => {
  it('accepts a minimal well-formed response', () => {
    const result = validateManualTurnResponse(VALID);
    expect(result.ok).toBe(true);
  });

  it('rejects text that is not valid JSON at all', () => {
    const result = validateManualTurnResponse('Sure, here is the scene: the sun rises.');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/not valid JSON/i);
  });

  it('rejects a JSON array — arrays pass the object/null check in JS, but still fail downstream on missing fields', () => {
    const result = validateManualTurnResponse('[1,2,3]');
    expect(result.ok).toBe(false);
  });

  it('rejects a bare JSON null', () => {
    const result = validateManualTurnResponse('null');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/single JSON object/i);
  });

  it('rejects a missing schemaVersion', () => {
    const body = JSON.parse(VALID);
    delete body.schemaVersion;
    const result = validateManualTurnResponse(JSON.stringify(body));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/schemaVersion/);
  });

  it('rejects a missing scene', () => {
    const body = JSON.parse(VALID);
    delete body.scene;
    const result = validateManualTurnResponse(JSON.stringify(body));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/scene/);
  });

  it('rejects a scene missing narration', () => {
    const body = JSON.parse(VALID);
    delete body.scene.narration;
    const result = validateManualTurnResponse(JSON.stringify(body));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/worldDate.*narration/);
  });

  it('rejects a missing statePatch', () => {
    const body = JSON.parse(VALID);
    delete body.statePatch;
    const result = validateManualTurnResponse(JSON.stringify(body));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/statePatch/);
  });

  it('accepts an empty statePatch — the "nothing changed" case', () => {
    const result = validateManualTurnResponse(VALID);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.response.statePatch).toEqual({});
  });
});
