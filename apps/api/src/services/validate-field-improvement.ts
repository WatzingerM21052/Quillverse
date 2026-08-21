export type FieldImprovementValidationOutcome = { ok: true; improvedText: string } | { ok: false; error: string };

/** Structural check before an improved field is shown to the player — same discipline as validateCharacterCreationDraft. */
export function validateFieldImprovement(raw: string): FieldImprovementValidationOutcome {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'That is not valid JSON.' };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: 'Expected a single JSON object.' };
  }
  const candidate = parsed as Record<string, unknown>;

  if (typeof candidate['improvedText'] !== 'string' || !candidate['improvedText'].trim()) {
    return { ok: false, error: 'Missing or empty "improvedText".' };
  }

  return { ok: true, improvedText: candidate['improvedText'] };
}
