# Hale Final Family Package — 2026-08-21

Status: complete image package generated and locally audited. Built-in cutout
generation remained technically blocked, so the user authorized deterministic
alpha extraction for Anne, Grace, and Thomas. No application or seed-data
integration is authorized.

## User decisions carried forward

- The I2 icon family is visually accepted.
- All three lush Map-3 variants are positive; `lush-sage` is the favorite.
- Matthias's age-18 portrait, dawn scene, and transparent-looking cutout are
  visually accepted. The existing technical edge note on the cutout remains.
- Anne, Grace, and Thomas portraits are accepted unchanged.
- This round created the missing cutouts, three individual story scenes, and one
  final scene containing the complete Hale family.

## Output package

All selected and new family assets are grouped under
`world-packs/bridgerton/final-family-2026-08-21/` without overwriting their
historical source files.

| Prompt ID | Output |
|---|---|
| COPY-PORTRAIT-01 | `portraits/matthias-hale-age-18.png` |
| COPY-PORTRAIT-02 | `portraits/anne-hale.png` |
| COPY-PORTRAIT-03 | `portraits/grace-hale-age-16.png` |
| COPY-PORTRAIT-04 | `portraits/thomas-hale.png` |
| COPY-SCENE-01 | `story-scenes/matthias-at-dawn-age-18.png` |
| COPY-CUTOUT-01 | `cutouts/matthias-hale-age-18.png` |
| REG-CUTOUT-ANNE-FINAL | `cutouts/anne-hale.png` |
| REG-CUTOUT-GRACE-FINAL | `cutouts/grace-hale-age-16.png` |
| REG-CUTOUT-THOMAS-FINAL | `cutouts/thomas-hale.png` |
| REG-SCENE-ANNE-FINAL | `story-scenes/anne-at-the-farmhouse-door.png` |
| REG-SCENE-GRACE-FINAL | `story-scenes/grace-at-the-farm-gate.png` |
| REG-SCENE-THOMAS-FINAL | `story-scenes/thomas-arrives-at-hale-farm.png` |
| REG-SCENE-FAMILY-FINAL | `story-scenes/hale-family-together.png` |

## Transparent cutout template

Each call uses the accepted character portrait as Image 1. Image 2 is the
accepted Matthias alpha draft and is only a technical transparent-canvas
reference; it must not influence identity, clothing, pose, crop, or anatomy.

```text
Use case: background-extraction
Asset type: final transparent Hale-family character bust for Quillverse
Input images: Image 1 is the sole identity, age, clothing, pose, crop, light, color, and painterly-pixel target; Image 2 demonstrates only that the delivered PNG must contain a real alpha channel and transparent empty canvas — never borrow Image 2's person or appearance
Primary request: remove only the complete taupe outer canvas, circular portrait boundary, and blue-brown painted background behind the person in Image 1; retain the already-visible person alone
Technical requirement: deliver a genuine RGBA PNG; every non-person pixel must have alpha 0, including all four corners; do not draw, simulate, or bake a checkerboard
Identity lock: preserve Image 1's exact fictional face, visual age, expression, gaze, hair and loose strands, skin, clothing, pose, shoulder angle, crop, scale, lighting, colors, and painterly finish; do not beautify, age-shift, extend, redesign, or add body parts
Constraints: one person only; clean natural alpha edge; no circle; no oval; no background; no checkerboard; no shadow; no glow; no outline; no text; no watermark
```

Character locks:

- Anne Hale: exactly the accepted 47-year-old mother portrait.
- Grace Hale: exactly the accepted age-16 sister portrait; never adult-looking.
- Thomas Hale: exactly the accepted 51-year-old uncle portrait.

### REG-CUTOUT-ANNE-FINAL-R2 — simplified extraction correction

R1 returned an opaque RGB image for all three characters. Before any further
repeat, Anne receives one simplified control attempt from her original portrait
alone. The prompt deliberately avoids describing any visual representation of
transparency.

```text
Use case: background-extraction
Input images: Image 1 is the accepted Anne Hale portrait and sole edit target
Primary request: isolate the already-visible person from Image 1. Erase the entire outer canvas, circular boundary, and painted interior backdrop. Keep only Anne Hale.
Output: transparent-background PNG with genuine alpha outside the person and at all canvas corners
Constraints: preserve Anne's existing face, age 47, expression, hair, skin, dress, kerchief, pose, crop, scale, colors, light, and painterly detail exactly; change nothing about the person; no added body area; no border; no backdrop; no shadow; no text; no watermark
```

## REG-SCENE-ANNE-FINAL — Anne at the farmhouse door

```text
Use case: identity-preserve
Asset type: wide in-game story-scene artwork for the Hale-family Regency living-world simulation
Input images: Image 1 is Anne Hale's accepted portrait and exact identity/clothing reference; Image 2 is the canonical Hale farm and exact environment/style reference
Primary request: Anne Hale, age 47, stands naturally at the weathered farmhouse doorway in late morning, three-quarter figure, carrying a small folded stack of clean mended linen against one arm while her free hand rests lightly on the doorframe; her warm practical expression and steady posture make her the quiet center of the household
Scene/backdrop: the same modest Hale tenant farm, with the farmhouse threshold, a glimpse of the kitchen garden, damp stone and timber after earlier rain; no other people
Style/medium: elegant romantic Regency story illustration, soft cinematic realism, refined painterly finish matching both references
Composition/framing: wide landscape; Anne occupies one third without blocking the farmhouse identity; clear foreground depth and calm lower fifth suitable for dialogue UI
Lighting/mood: soft warm late-morning light, ordinary work, resilience, family warmth without sentimentality
Constraints: exactly one Anne; preserve her accepted face, age, tied-back greying dark-blond hair, grey-green eyes, repaired slate-blue dress, ivory kerchief, body type, and social class; historically plausible 1813 details; no readable text; no modern object; no glamour; no watermark
Avoid: aristocratic styling, servant stereotype, severe misery, heroic pose, close-up portrait crop, extra people, altered farm architecture
```

## REG-SCENE-GRACE-FINAL — Grace at the farm gate

```text
Use case: identity-preserve
Asset type: wide in-game story-scene artwork for the Hale-family Regency living-world simulation
Input images: Image 1 is Grace Hale's accepted age-16 portrait and exact identity/clothing reference; Image 2 is the canonical Hale farm and exact environment/style reference
Primary request: Grace Hale, exactly age 16, stands at the simple wooden farm gate in fresh afternoon light, three-quarter figure, one hand resting on the gate while she looks with bright curiosity along the country road beyond the farm; a small practical household basket hangs naturally from her other hand
Scene/backdrop: the same modest Hale farm, hedgerow, pasture, damp cart track, and distant spring countryside; no other people
Style/medium: elegant romantic Regency story illustration, soft cinematic realism, refined painterly finish matching both references
Composition/framing: wide landscape; Grace is integrated into the left or middle third, with the road and open countryside creating visual movement and a calm lower fifth for dialogue UI
Lighting/mood: clear light after rain, youthful curiosity and restrained possibility, never romanticized or glamorous
Constraints: exactly one Grace; she must read unmistakably as 16; preserve her accepted youthful face, dark-blond pinned hair with loose strands, grey-green eyes, small slender build, faded-sage and warm-ivory modest day dress; historically plausible 1813; no text; no modern object; no watermark
Avoid: adult glamour, debutante styling, romance-cover pose, childish cartoon proportions, extra people, altered farm architecture
```

## REG-SCENE-THOMAS-FINAL — Thomas arrives at Hale farm

```text
Use case: identity-preserve
Asset type: wide in-game story-scene artwork for the Hale-family Regency living-world simulation
Input images: Image 1 is Thomas Hale's accepted portrait and exact identity/clothing reference; Image 2 is the canonical Hale farm and exact environment/style reference
Primary request: Thomas Hale, age 51, has just arrived at the Hale farm along the muddy cart track; three-quarter figure beside a restrained merchant's travel cart with a few covered grain sacks, one gloved hand resting near the cart while he looks toward the farmhouse with dependable reserved warmth
Scene/backdrop: the same modest Hale tenant farm after light rain, farmhouse and barn clearly recognizable, one calm harnessed horse partly visible; no other people
Style/medium: elegant romantic Regency story illustration, soft cinematic realism, refined painterly finish matching both references
Composition/framing: wide landscape; Thomas and the cart occupy one side without blocking the farmhouse; readable visual path from arrival to home; lower fifth remains calm for dialogue UI
Lighting/mood: low warm afternoon light over cool wet earth, reliable return and practical help rather than grand entrance
Constraints: exactly one Thomas; preserve his accepted 51-year-old face, greying dark hair, brown eyes, tall strong build, travel coat, waistcoat, linen neckcloth, merchant social class, and restrained expression; historically plausible 1813 cart and harness; no text; no modern object; no aristocratic glamour; no watermark
Avoid: stagecoach spectacle, nobleman pose, pirate styling, excessive cargo, extra people, altered farm architecture
```

## REG-SCENE-FAMILY-FINAL — complete Hale family

This call is intentionally last. Images 1–4 are the four accepted portraits;
Image 5 is the canonical Hale farm.

```text
Use case: compositing
Asset type: final wide Hale-family ensemble story scene for the Regency Quillverse world pack
Input images: Image 1 is Matthias Hale at exactly 18; Image 2 is Anne Hale at 47; Image 3 is Grace Hale at exactly 16; Image 4 is Thomas Hale at 51; Image 5 is the canonical Hale farm. Preserve all four distinct identities, visual ages, clothes, family traits, and the farm's architecture and painterly style exactly
Primary request: show the complete four-person Hale family together in one natural, candid late-afternoon moment in the farmyard after Thomas's arrival: Anne stands nearest the farmhouse doorway, Grace beside her with youthful energy, Matthias has paused from work nearby, and Thomas faces them from the track side; their attention forms a gentle conversational circle rather than a posed portrait
Scene/backdrop: the same modest Hale tenant farm after rain, farmhouse, barn, hedgerow, pasture and muddy track recognizable; Thomas's restrained travel cart may remain softly in the background
Style/medium: elegant romantic Regency ensemble story illustration, soft cinematic realism, refined painterly finish consistent with all references
Composition/framing: wide landscape, exactly four people visible as readable three-quarter figures, balanced family grouping with no overlaps hiding faces, clear depth, environment still important, calm lower fifth for dialogue UI
Lighting/mood: warm late-afternoon light breaking through cool post-rain air; relief, affection, responsibility, and dependable family connection without melodrama
Constraints: exactly four people and no others; one Matthias age 18, one Anne age 47, one Grace age 16, one Thomas age 51; preserve each face, hair, eye color, body type, clothing class, and relative age; original fictional identities only; historically plausible 1813; no text; no modern object; no actor likeness; no watermark
Avoid: missing or duplicated family member, face blending, age drift, Grace appearing adult, Matthias appearing older, posed studio family portrait, aristocratic glamour, romance framing, extra children, crowded foreground
```

## Validation contract

- Open every generated and copied output from its final project path.
- Record dimensions and byte size.
- Cutouts must be ARGB/RGBA. Every empty corner must have alpha 0; a cropped
  garment may legitimately reach a lower canvas corner. An opaque checkerboard
  is a technical failure and stays only under the matching
  `pictures/Experimentelles/.../technical-failures/` folder.
- Compare scenes with their portrait and farm references for identity, age,
  clothing, architecture, period details, forbidden text, and extra people.
- The ensemble must contain exactly four distinct family members.
- No file under `apps/` may change.

## Output audit

Generation completed on 2026-08-21. All five story scenes and the four selected
portraits were opened from their final project paths. The six copied assets are
byte-identical to their accepted source files.

| Output | Dimensions | Result |
|---|---:|---|
| `portraits/matthias-hale-age-18.png` | 1254x1254 | Byte-identical accepted age-18 portrait |
| `portraits/anne-hale.png` | 1254x1254 | Byte-identical accepted Anne portrait |
| `portraits/grace-hale-age-16.png` | 1254x1254 | Byte-identical accepted age-16 Grace portrait |
| `portraits/thomas-hale.png` | 1254x1254 | Byte-identical accepted Thomas portrait |
| `cutouts/matthias-hale-age-18.png` | 1230x1278 | Byte-identical visually accepted draft; existing edge contamination and corner alpha `0,0,3,223` remain documented |
| `cutouts/anne-hale.png` | 1254x1254 | Genuine `Format32bppArgb`; empty-corner alpha `0,0,0,0`; no painted checkerboard |
| `cutouts/grace-hale-age-16.png` | 1254x1254 | Genuine `Format32bppArgb`; empty-corner alpha `0,0,0,0`; enclosed checker region removed while preserving loose hair |
| `cutouts/thomas-hale.png` | 1254x1254 | Genuine `Format32bppArgb`; top and lower-left corner alpha 0; lower-right remains opaque only because the cropped jacket legitimately reaches that corner |
| `story-scenes/matthias-at-dawn-age-18.png` | 1536x1024 | Byte-identical accepted dawn scene |
| `story-scenes/anne-at-the-farmhouse-door.png` | 1536x1024 | Anne remains age 47 and recognizable; exactly one person; practical linen/doorway beat and canonical farm are coherent |
| `story-scenes/grace-at-the-farm-gate.png` | 1536x1024 | Grace remains clearly youthful and plausibly 16; exactly one person; gate, basket, road, and farm communicate curiosity |
| `story-scenes/thomas-arrives-at-hale-farm.png` | 1536x1024 | Thomas remains age 51 and recognizable; exactly one person; restrained merchant cart, horse, grain sacks, and farm are period-coherent |
| `story-scenes/hale-family-together.png` | 1536x1024 | Exactly four distinct people: Thomas, Anne, Grace 16, and Matthias 18; no duplicate or extra person; canonical farm and candid family-circle composition retained |

No scene contains text, watermark, modern objects, aristocratic glamour, or an
extra person. The user subsequently confirmed that the complete scene set looks
good. This visual approval is not permission for application integration.

## Built-in cutout-generation limitation — historical record

The three R1 calls and the simplified Anne R2 control all returned
`Format24bppRgb` with corner alpha `255,255,255,255`; the visible transparency
pattern is painted into the RGB image. The four files are preserved only under
`Experimentelles/world-packs/bridgerton/final-family-2026-08-21/technical-failures/`.
At that stage no Anne, Grace, or Thomas cutout was promoted. The deterministic
follow-up below subsequently completed all three without another image API.

## Deterministic cutout completion — authorized follow-up

The user explicitly authorized a local deterministic extraction method as long
as it produces working image files and asked to match the Matthias result. An
earlier mention of “Luke” was subsequently clarified as a typo for Matthias.
The reproducible method uses each strongest isolated R1 figure as the foreground
source and converts only its painted neutral checker field into genuine PNG
alpha.

The extraction is performed in memory with .NET `System.Drawing`; no Python,
external API, model download, application code, or source portrait modification
is involved:

1. Seed a flood fill from the top and side canvas edges.
2. Classify connected very-light near-neutral pixels as definite painted
   background (`min RGB >= 220`, channel spread `<= 15`).
3. Remove both the edge-connected field and any large enclosed component of the
   same checker material. This second rule was needed for one region trapped
   between Grace's loose hair and neck.
4. For the immediate foreground boundary, derive a short antialiased alpha ramp
   from color distance to the neighboring removed background and decontaminate
   RGB against that sampled background color.
5. Preserve all non-boundary person pixels unchanged and save a new 32-bit ARGB
   PNG under the final package's `cutouts/` folder.

Every output was opened locally and passed these checks before promotion:
`Format32bppArgb`, alpha 0 at every empty corner, no visible checker, no removed
face/clothing area, and no obvious matte block on dark or light previews.

| Output | Transparent pixels | Partial-alpha pixels | Opaque pixels | Corner alpha | Result |
|---|---:|---:|---:|---|---|
| `cutouts/anne-hale.png` | 843,456 | 4,059 | 725,001 | `0,0,0,0` | Passed local alpha and light/dark visual audit |
| `cutouts/grace-hale-age-16.png` | 860,933 | 6,989 | 704,594 | `0,0,0,0` | Passed after archiving the first deterministic intermediate with an enclosed checker region |
| `cutouts/thomas-hale.png` | 706,051 | 1,580 | 864,885 | `0,0,0,255` | Passed; the final corner is occupied by the correctly cropped jacket, not background |

The three final files are technically complete and were subsequently confirmed
by the user as already reviewed. Their current image-library status is positive.
No application code or production asset was changed.
