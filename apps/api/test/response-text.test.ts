import { describe, expect, it } from 'vitest';
import { stripToJsonObject } from '../src/providers/response-text';

describe('stripToJsonObject', () => {
  it('passes clean JSON through unchanged', () => {
    const input = '{"schemaVersion":1,"scene":{}}';
    expect(stripToJsonObject(input)).toBe(input);
  });

  it('strips a ```json fenced block', () => {
    const input = '```json\n{"schemaVersion":1}\n```';
    expect(stripToJsonObject(input)).toBe('{"schemaVersion":1}');
  });

  it('strips a bare ``` fenced block with no language tag', () => {
    const input = '```\n{"schemaVersion":1}\n```';
    expect(stripToJsonObject(input)).toBe('{"schemaVersion":1}');
  });

  it('strips leading and trailing prose around the JSON object', () => {
    const input = 'Here is the response:\n{"schemaVersion":1}\nLet me know if you need anything else!';
    expect(stripToJsonObject(input)).toBe('{"schemaVersion":1}');
  });

  it('handles nested braces inside the JSON correctly', () => {
    const input = 'Sure!\n{"scene":{"nested":{"deep":true}}}\nDone.';
    expect(stripToJsonObject(input)).toBe('{"scene":{"nested":{"deep":true}}}');
  });

  it('returns the trimmed input when no braces are found at all', () => {
    const input = '  not json at all  ';
    expect(stripToJsonObject(input)).toBe('not json at all');
  });
});
