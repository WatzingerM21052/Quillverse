import type { CharacterCreationAnswers } from '../models/character-creation';

const STARTING_POSITION_RULES = `=== VERBINDLICHE AUSGANGSBEDINGUNGEN (simulation-master-prompt-v3.md §14-16) ===

§14 Ausgangsposition: Der Charakter beginnt als gewöhnlicher, armer, aber respektabler junger Bauer
beziehungsweise Angehöriger einer bäuerlichen Pächterfamilie. KEIN Adelstitel, KEINE heimliche
königliche oder adlige Abstammung, KEINE versteckten Millionen, KEINE gesellschaftliche
Sonderstellung — auch wenn die Spielerantworten etwas anderes andeuten. Weiche in diesem Fall
glaubwürdig auf eine bodenständige Variante aus, die dem Ausgangspunkt der Antwort möglichst nahekommt.

§15 Finanzieller Ausgangszustand: Die Familie ist arm und finanziell verwundbar, aber nicht völlig
mittellos — kleines, altes, aber ordentliches Pachthaus, gepachtetes Land, grundlegende Werkzeuge,
einige Tiere, einfache Möbel, notwendige Vorräte. Bargeld ist knapp.

§16 Geografische Ausgangslage: Der Hof liegt in einer ländlichen Gegend am äußeren Rand des Umlands
von London — nah genug für gelegentliche Fahrten, weit genug draußen für echtes Landleben.`;

const OUTPUT_CONTRACT = `=== OUTPUT FORMAT ===

Antworte mit GENAU EINEM JSON-Objekt, sonst nichts — keine Prosa davor oder danach, kein Markdown-Codefence.
Struktur exakt wie folgt:

{
  "schemaVersion": 1,
  "player": {
    "name": "<Vor- und Nachname>",
    "appearance": {
      "height": "...", "build": "...", "face": "...", "hair": "...", "eyes": "...", "voice": "...",
      "posture": "...", "typicalExpression": "...", "hands": "...", "grooming": "...", "clothing": "...",
      "distinguishingFeatures": "...", "generalPresence": "..."
    },
    "personalityTraits": ["...", "..."],
    "skills": { "Landwirtschaft": "<Niveau in Worten, z.B. 'sehr gut'>", "Reiten": "...", "Lesen": "...", "Schreiben": "...", "Etikette": "...", "Geschäftssinn": "..." },
    "goals": { "shortTerm": ["..."], "midTerm": ["..."], "longTerm": [], "currentWorries": ["..."] },
    "backstory": "<2-4 Sätze, wie die Person zu ihrer jetzigen Lage kam>"
  },
  "family": [
    { "name": "...", "relation": "<z.B. Mutter, jüngere Schwester>", "age": "...", "appearance": { "height": "...", "build": "...", "face": "...", "hair": "...", "eyes": "...", "voice": "...", "posture": "...", "typicalExpression": "...", "hands": "...", "grooming": "...", "clothing": "...", "distinguishingFeatures": "...", "generalPresence": "..." }, "personalityTraits": ["..."] }
  ],
  "farm": { "landAcres": <Zahl>, "annualRent": "<z.B. '£24 jährlich'>", "livestock": "...", "supplies": "...", "workers": "..." },
  "openingSummary": "<3-5 Sätze Zusammenfassung des Ausgangszustands, die dem Spieler zur Bestätigung gezeigt wird>"
}

Skills sind IMMER qualitative Niveaubeschreibungen in Worten (z.B. "sehr gut", "mittel", "keine Erfahrung"),
NIEMALS Zahlenwerte. personalityTraits ist eine kurze Liste einzelner Wörter/Kurzphrasen, keine Sätze.
Jedes appearance-Objekt braucht ALLE 13 genannten Felder, auch bei Familienmitgliedern.`;

/**
 * §131 ANFANGSINITIALISIERUNG — the AI conducts the interview: fills any
 * field the player left blank with a plausible default, consistent with
 * the fixed starting-position rules above (this section survived the
 * master-prompt slimming, #1, but a *fresh, minimal* prompt is used here
 * rather than the full 49K-char master prompt — draft generation doesn't
 * need the full GM ruleset, just the starting-position constraints and the
 * output contract).
 */
export function buildCharacterCreationPrompt(answers: CharacterCreationAnswers): string {
  const provided = [
    answers.characterName && `Name: ${answers.characterName}`,
    answers.age && `Alter: ${answers.age}`,
    answers.gender && `Geschlecht: ${answers.gender}`,
    answers.appearanceNotes && `Aussehen (Notizen des Spielers): ${answers.appearanceNotes}`,
    answers.personalityNotes && `Persönlichkeit: ${answers.personalityNotes}`,
    answers.strengthsWeaknesses && `Stärken/Schwächen: ${answers.strengthsWeaknesses}`,
    answers.education && `Bildung (Lesen/Schreiben): ${answers.education}`,
    answers.specialSkills && `Besondere Fähigkeiten: ${answers.specialSkills}`,
    answers.backstory && `Bisherige Lebensgeschichte: ${answers.backstory}`,
    answers.personalGoals && `Persönliche Ziele: ${answers.personalGoals}`,
    answers.family && `Familie: ${answers.family}`,
    answers.farmDetails && `Hof-Details: ${answers.farmDetails}`,
  ]
    .filter(Boolean)
    .join('\n');

  const tone = answers.tone
    ? [
        answers.tone.romanceIntensity && `Romantikintensität: ${answers.tone.romanceIntensity}`,
        answers.tone.socialIntrigueDepth && `Gesellschaftliche Intrigen: ${answers.tone.socialIntrigueDepth}`,
        answers.tone.farmEconomyDepth && `Hof-/Wirtschaftstiefe: ${answers.tone.farmEconomyDepth}`,
        answers.tone.historicalAccuracy && `Historische Genauigkeit: ${answers.tone.historicalAccuracy}`,
        answers.tone.narrativePace && `Erzähltempo: ${answers.tone.narrativePace}`,
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  return [
    STARTING_POSITION_RULES,
    `=== SPIELERANGABEN ===\n\n${provided || '(keine Angaben — schlage einen glaubwürdigen, in sich stimmigen Charakter vor)'}`,
    tone ? `=== GEWÜNSCHTER TON (nur zur Information, nicht Teil der Ausgabe) ===\n\n${tone}` : '',
    OUTPUT_CONTRACT,
  ]
    .filter(Boolean)
    .join('\n\n');
}
