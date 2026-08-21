import type { CharacterCreationAnswers, ImprovableField } from '../models/character-creation';

const FIELD_LABELS: Record<ImprovableField, string> = {
  appearanceNotes: 'Aussehen',
  personalityNotes: 'Persönlichkeit, Humor',
  strengthsWeaknesses: 'Stärken & Schwächen',
  backstory: 'Bisherige Lebensgeschichte',
  personalGoals: 'Persönliche Ziele',
  family: 'Familie (Eltern, Geschwister, Verhältnis, Haushalt)',
  farmDetails: 'Hof (Größe, Besitz/Pacht, Tiere, Schulden, Einkommen)',
};

const MODE_INSTRUCTIONS: Record<'polish' | 'expand', string> = {
  polish:
    'Verbessere ausschließlich Grammatik, Rechtschreibung und Stil. Inhalt und ungefähre Länge müssen ' +
    'nahe am Original bleiben — erfinde keine neuen Details.',
  expand:
    'Formuliere die Notiz zu 2-3 fließenden, atmosphärischen Sätzen im Regency-Ton aus. Du darfst ' +
    'plausible, zum bisherigen Kontext passende Details ergänzen, ohne den Kern der Notiz zu ändern.',
};

/** Labels for the other Character Creator answers, shown to the model as context only (not part of its output). */
const OTHER_ANSWER_LABELS: Partial<Record<keyof CharacterCreationAnswers, string>> = {
  characterName: 'Name',
  age: 'Alter',
  gender: 'Geschlecht',
  appearanceNotes: 'Aussehen',
  personalityNotes: 'Persönlichkeit',
  strengthsWeaknesses: 'Stärken/Schwächen',
  education: 'Bildung',
  specialSkills: 'Besondere Fähigkeiten',
  backstory: 'Lebensgeschichte',
  personalGoals: 'Persönliche Ziele',
  family: 'Familie',
  farmDetails: 'Hof-Details',
};

const OUTPUT_CONTRACT = `=== OUTPUT FORMAT ===

Antworte mit GENAU EINEM JSON-Objekt, sonst nichts — keine Prosa davor oder danach, kein Markdown-Codefence.
Struktur exakt wie folgt:

{ "improvedText": "<der verbesserte Text für dieses eine Feld>" }`;

/**
 * Field-improvement prompt for the Character Creator's per-field "Verbessern" action. Reuses the same
 * Regency starting-position framing as buildCharacterCreationPrompt so improved text stays consistent
 * with the fixed starting conditions, but only asks the model to touch one field.
 */
export function buildFieldImprovementPrompt(
  field: ImprovableField,
  value: string,
  mode: 'polish' | 'expand',
  answers: CharacterCreationAnswers,
): string {
  const otherAnswers = (Object.keys(OTHER_ANSWER_LABELS) as (keyof CharacterCreationAnswers)[])
    .filter((key) => key !== field && answers[key])
    .map((key) => `${OTHER_ANSWER_LABELS[key]}: ${answers[key]}`)
    .join('\n');

  return [
    `=== AUFGABE ===\n\nDu verbesserst NUR das Feld "${FIELD_LABELS[field]}" eines Regency-Charakter-Entwurfs ` +
      `(kein Adel, arme aber respektable Pächterfamilie am Rand von London). ${MODE_INSTRUCTIONS[mode]}`,
    `=== AKTUELLER TEXT DES FELDS "${FIELD_LABELS[field]}" ===\n\n${value}`,
    otherAnswers
      ? `=== ÜBRIGE ANGABEN DES SPIELERS (nur zum Kontext, nicht Teil der Ausgabe) ===\n\n${otherAnswers}`
      : '',
    OUTPUT_CONTRACT,
  ]
    .filter(Boolean)
    .join('\n\n');
}
