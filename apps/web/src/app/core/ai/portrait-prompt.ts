import { Character } from '../state/models/character.model';

/**
 * §164 Art Style Consistency — every portrait prompt is steered by the world
 * pack's visualStyleBible, plus the character's own AppearanceProfile so
 * different characters actually look different.
 */
export function buildPortraitPrompt(character: Character, visualStyleBible: string): string {
  const { appearance, visualState } = character;
  return [
    visualStyleBible,
    `Portrait of ${character.name}: ${appearance.height}, ${appearance.build}. ${appearance.face}, ${appearance.hair} hair, ${appearance.eyes} eyes.`,
    `Typical expression: ${appearance.typicalExpression}. ${appearance.generalPresence}.`,
    `Wearing: ${appearance.clothing} (currently: ${visualState.currentOutfit}).`,
    appearance.distinguishingFeatures && appearance.distinguishingFeatures !== '—'
      ? `Distinguishing feature: ${appearance.distinguishingFeatures}.`
      : '',
  ]
    .filter(Boolean)
    .join(' ');
}
