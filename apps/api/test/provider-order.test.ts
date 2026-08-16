import { describe, expect, it } from 'vitest';
import { orderProviders } from '../src/providers/provider-order';

describe('orderProviders', () => {
  it('re-roots the list at the preferred provider, keeping the rest in their original order', () => {
    expect(orderProviders('anthropic', ['gemini', 'openai', 'anthropic'])).toEqual(['anthropic', 'gemini', 'openai']);
  });

  it('returns the original order unchanged when no preference is given', () => {
    expect(orderProviders(null, ['gemini', 'openai', 'anthropic'])).toEqual(['gemini', 'openai', 'anthropic']);
    expect(orderProviders(undefined, ['gemini', 'openai', 'anthropic'])).toEqual(['gemini', 'openai', 'anthropic']);
  });

  it('ignores an unrecognized preferred provider and falls back to the original order', () => {
    expect(orderProviders('unknown', ['gemini', 'openai', 'anthropic'])).toEqual(['gemini', 'openai', 'anthropic']);
  });
});
