import { describe, expect, it } from 'vitest';
import { validateFieldImprovement } from '../src/services/validate-field-improvement';

describe('validateFieldImprovement', () => {
  it('accepts a well-formed response', () => {
    const result = validateFieldImprovement(JSON.stringify({ improvedText: 'Ein hochgewachsener junger Mann mit ruhigen Augen.' }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.improvedText).toBe('Ein hochgewachsener junger Mann mit ruhigen Augen.');
  });

  it('rejects malformed JSON', () => {
    const result = validateFieldImprovement('not json');
    expect(result.ok).toBe(false);
  });

  it('rejects a JSON object missing improvedText', () => {
    const result = validateFieldImprovement(JSON.stringify({ text: 'falscher Schlüssel' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/improvedText/);
  });

  it('rejects an empty improvedText', () => {
    const result = validateFieldImprovement(JSON.stringify({ improvedText: '   ' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/improvedText/);
  });

  it('rejects a JSON array instead of an object', () => {
    const result = validateFieldImprovement(JSON.stringify(['not', 'an', 'object']));
    expect(result.ok).toBe(false);
  });
});
