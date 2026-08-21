# Gate 2C — Hale age correction

Date: 2026-08-21
Status: generation complete; every output requires visual review
Mode: built-in `image_gen`, one call per distinct image

The user locked the visual ages to Matthias **18** and Grace **16**. Grace's
existing `REG-CHAR-03` portrait already reads correctly and remains unchanged.
The original Matthias portrait and story scene are preserved as review history;
this pass creates new versioned replacements without overwriting either file.

This remains an image-only task. No seed data or application code is changed.

## Output matrix

| Prompt ID | Output |
|---|---|
| REG-CHAR-01-AGE18 | `world-packs/bridgerton/characters/refinement-2026-08-21/matthias-hale-age-18.png` |
| REG-SCENE-01-AGE18 | `world-packs/bridgerton/story-scenes/refinement-2026-08-21/matthias-at-dawn-age-18.png` |

## REG-CHAR-01-AGE18 — Matthias at exactly 18

Image 1 is the existing Matthias portrait. It is an identity, clothing,
lighting, crop, and painterly-style reference, not an age reference.

```text
Use case: identity-preserve
Asset type: corrected canonical head-and-shoulders portrait reference for an original fictional player character in a Regency living-world simulation
Input images: Image 1 is the previous Matthias Hale portrait; preserve his recognizable fictional identity, dark-blond hair, grey-green eyes, angular face shape, reserved gaze, tenant-farmer clothing, circular portrait layout, palette, painterly medium, camera height, and upper-left lighting, but correct the apparent age from weathered late twenties or older to exactly eighteen
Primary request: Matthias Hale at exactly age 18, a modest English tenant-farmer's son; youthful smooth facial structure with natural pores, faint sun exposure and a trace of field dust only; no forehead furrows, no crow's feet, no deep cheek lines, no heavy stubble, and no prematurely aged leathery skin; wiry and field-strong, serious and observant without looking hardened; dark-blond slightly unruly hair and clear grey-green eyes
Clothing: preserve the same historically plausible 1813 work shirt, muted waistcoat, and plain neckcloth in repaired natural fabrics
Scene/backdrop: preserve the same softly painted rural blue-grey and warm umber circular background with no objects
Style/medium: preserve the same elegant romantic Regency editorial illustration, soft cinematic realism, refined painterly finish, and natural fabric texture
Composition/framing: same square head-and-shoulders portrait, eye-level, shoulders fully visible, generous oval-mask safety
Lighting/mood: same warm natural key from upper left and cool soft fill; youthful responsibility, quiet intelligence, and restrained uncertainty
Constraints: one eighteen-year-old fictional male only; original identity; no actor or franchise-character likeness; age must read 18, not 25 or 30; no text; no logo; no hat; no jewelry; no weapon; no modern element; no watermark
Avoid: mature wrinkles, deep facial creases, heavy beard shadow, rugged middle-aged farmer, fashion-model glamour, childlike proportions, aristocratic costume, face redesign
```

## REG-SCENE-01-AGE18 — Corrected dawn scene

Image 1 is the generated age-18 Matthias portrait. Image 2 is the unchanged
canonical Hale farm location.

```text
Use case: identity-preserve
Asset type: corrected wide in-game story-scene artwork for the Hale-family Regency living-world simulation
Input images: Image 1 is the corrected exactly-eighteen-year-old Matthias Hale portrait and Image 2 is the canonical Hale farm; preserve Matthias's exact youthful identity, age-18 face, dark-blond hair, grey-green eyes, clothing class, and painterly finish, and preserve the farm's farmhouse, barn, muddy track, terrain, dawn palette, and spatial identity
Primary request: the same eighteen-year-old Matthias stands beside the muddy farm track at pale dawn, three-quarter figure seen from a respectful distance, holding a folded unopened letter loosely in one work-worn hand while looking toward the farmhouse; he carries responsibility but must still visibly read as a young man of exactly eighteen, with smooth youthful skin and no deep wrinkles
Scene/backdrop: the same Hale farm after light rain, soft mist over pasture, no other people
Style/medium: elegant romantic Regency story illustration, soft cinematic realism, refined painterly finish consistent with both references
Composition/framing: wide landscape; Matthias occupies the left third without blocking the farmhouse; right side and lower fifth remain calm and dark enough for dialogue UI; clear foreground-to-house visual path
Lighting/mood: pale gold dawn from upper left, cool wet-earth reflections, young responsibility and restrained possibility rather than melodrama
Constraints: one exactly-eighteen-year-old fictional male only; preserve corrected identity and farm design; historically plausible 1813 clothing; no readable writing on the folded letter; no text; no logo; no modern object; no actor likeness; no fantasy effect; no watermark
Avoid: mature wrinkles, older weathered face, heroic poster pose, romance-cover glamour, dramatic storm, oversized letter prop, close-up crop, busy UI-hostile foreground
```

## Output audit

Generation completed on 2026-08-21. Both new files were copied to their matrix
paths, opened locally, and visually inspected.

| Prompt ID | Dimensions | Result |
|---|---:|---|
| REG-CHAR-01-AGE18 | 1254x1254 | Same recognizable Matthias identity, clothing, circular crop, and painterly treatment; face now reads as a serious but clearly youthful 18-year-old without the previous deep weathering |
| REG-SCENE-01-AGE18 | 1536x1024 | Same Hale farm, letter beat, dawn mood, and UI-safe composition; Matthias consistently retains the corrected age-18 face |

Grace remains the existing 1254x1254 `REG-CHAR-03` portrait and is visually
locked to age 16. The superseded older-looking Matthias portrait and scene were
preserved, not deleted, under
`Experimentelles/world-packs/bridgerton/age-correction-2026-08-21/`.

No application or seed-data file was changed.
